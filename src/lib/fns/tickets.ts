import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import type {
  Attachment,
  Comment,
  StatusTransition,
  Ticket,
  TicketCategory,
  TicketPriority,
  TicketStatus,
  WorkItem,
} from "@/lib/types";
import { computeScore, slaHoursForTicketPriority } from "@/lib/scoring";
import { canEscalate, canTransitionTicket, TICKET_TRANSITIONS } from "@/lib/workflow";
import {
  deny,
  jsonSafe,
  nextId,
  nextRawId,
  notify,
  sessionMeta,
  writeAudit,
} from "@/lib/server/helpers";
import { seedIfEmpty } from "@/lib/server/seed";
import { isSupportStaff } from "@/lib/workflow";

export type TicketFilters = {
  q?: string;
  status?: string;
  category?: string;
  priority?: string;
  mine?: boolean;
  portal?: boolean;
};

export const listTickets = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: TicketFilters) => data ?? {})
  .handler(async ({ context, data }) => {
    const { sql, profile } = await sessionMeta(context.userId);
    await seedIfEmpty(sql);
    const rows = await sql<Ticket>`
      select * from tickets order by
        case priority when 'urgent' then 0 when 'high' then 1 when 'normal' then 2 else 3 end,
        updated_at desc
    `;
    let out = jsonSafe(rows);
    const f = data ?? {};
    if (f.portal || !isSupportStaff(profile.role)) {
      out = out.filter((t) => t.requester_id === profile.id);
    }
    if (f.status && f.status !== "all") out = out.filter((t) => t.status === f.status);
    if (f.category && f.category !== "all") out = out.filter((t) => t.category === f.category);
    if (f.priority && f.priority !== "all") out = out.filter((t) => t.priority === f.priority);
    if (f.mine) {
      out = out.filter(
        (t) => t.assignee_id === profile.id || t.assignee_name === profile.display_name,
      );
    }
    if (f.q) {
      const q = f.q.toLowerCase();
      out = out.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          t.body.toLowerCase().includes(q) ||
          (t.customer_name ?? "").toLowerCase().includes(q),
      );
    }
    return out;
  });

export const getTicket = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    const { sql, profile } = await sessionMeta(context.userId);
    await seedIfEmpty(sql);
    const rows = await sql<Ticket>`select * from tickets where id = ${id} limit 1`;
    const ticket = rows[0];
    if (!ticket) return null;
    if (!isSupportStaff(profile.role) && ticket.requester_id !== profile.id) deny();
    const comments = await sql<Comment>`
      select * from comments where entity_type = 'ticket' and entity_id = ${id} order by created_at asc
    `;
    const transitions = await sql<StatusTransition>`
      select * from status_transitions where entity_type = 'ticket' and entity_id = ${id} order by created_at asc
    `;
    const attachments = await sql<Attachment>`
      select * from attachments where entity_type = 'ticket' and entity_id = ${id} order by created_at asc
    `;
    const links = await sql<{ work_item_id: string; reason: string | null; title: string; status: string }>`
      select e.work_item_id, e.reason, w.title, w.status
      from ticket_escalations e join work_items w on w.id = e.work_item_id
      where e.ticket_id = ${id}
    `;
    return jsonSafe({ ticket, comments, transitions, attachments, links });
  });

export type CreateTicketInput = {
  subject: string;
  body: string;
  category: TicketCategory;
  expected_behavior?: string;
  customer_name?: string;
  customer_email?: string;
  app_version?: string;
  device?: string;
  os_name?: string;
  priority?: TicketPriority;
  evidenceDataUrl?: string;
  evidenceName?: string;
  caption?: string;
};

export const createTicket = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: CreateTicketInput) => data)
  .handler(async ({ context, data }) => {
    const { sql, profile } = await sessionMeta(context.userId);
    const subject = data.subject.trim();
    const body = data.body.trim();
    if (!subject || !body) deny("Subject and description required");
    const id = await nextId(sql, "ticket", "HD");
    const seq = Number(id.split("-")[1]);
    const priority = data.priority ?? (data.category === "billing" ? "high" : "normal");
    const sla = slaHoursForTicketPriority(priority);
    const due = new Date(Date.now() + sla * 3600000).toISOString();
    await sql`
      insert into tickets (
        id, seq, channel, category, subject, body, expected_behavior,
        customer_name, customer_email, app_version, device, os_name,
        status, priority, requester_id, sla_hours, sla_due_at
      ) values (
        ${id}, ${seq}, ${"portal"}, ${data.category}, ${subject}, ${body}, ${data.expected_behavior ?? null},
        ${data.customer_name ?? profile.display_name}, ${data.customer_email ?? profile.email},
        ${data.app_version ?? null}, ${data.device ?? null}, ${data.os_name ?? null},
        ${"new"}, ${priority}, ${profile.id}, ${sla}, ${due}
      )
    `;
    const tid = await nextRawId(sql, "audit");
    await sql`
      insert into status_transitions (id, entity_type, entity_id, from_status, to_status, actor_id, actor_name, reason)
      values (${tid}, ${"ticket"}, ${id}, ${null}, ${"new"}, ${profile.id}, ${profile.display_name}, ${"Opened from portal"})
    `;
    if (data.evidenceDataUrl && data.evidenceDataUrl.length < 900_000) {
      const aid = await nextRawId(sql, "attachment");
      await sql`
        insert into attachments (id, entity_type, entity_id, filename, mime, caption, data_url, created_by, access_scope)
        values (${aid}, ${"ticket"}, ${id}, ${data.evidenceName ?? "screenshot"}, ${"image/*"}, ${data.caption ?? null}, ${data.evidenceDataUrl}, ${profile.id}, ${"restricted"})
      `;
    }
    await writeAudit(sql, {
      actorId: profile.id,
      actorName: profile.display_name,
      action: "ticket.create",
      objectType: "ticket",
      objectId: id,
      metadata: { category: data.category, priority },
    });
    return { id };
  });

export const transitionTicket = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: string; to: TicketStatus; reason?: string }) => data)
  .handler(async ({ context, data }) => {
    const { sql, profile } = await sessionMeta(context.userId);
    if (!canTransitionTicket(profile.role)) deny();
    const rows = await sql<Ticket>`select * from tickets where id = ${data.id} limit 1`;
    const ticket = rows[0];
    if (!ticket) deny("Not found");
    const allowed = TICKET_TRANSITIONS[ticket.status] ?? [];
    if (!allowed.includes(data.to)) deny("Illegal transition");
    const first =
      !ticket.first_response_at && data.to !== "duplicate"
        ? new Date().toISOString()
        : ticket.first_response_at;
    const resolved =
      data.to === "resolved" || data.to === "closed" ? new Date().toISOString() : ticket.resolved_at;
    await sql`
      update tickets set
        status = ${data.to},
        first_response_at = ${first},
        resolved_at = ${resolved},
        updated_at = now(),
        last_transition_at = now()
      where id = ${data.id}
    `;
    const tid = await nextRawId(sql, "audit");
    await sql`
      insert into status_transitions (id, entity_type, entity_id, from_status, to_status, actor_id, actor_name, reason)
      values (${tid}, ${"ticket"}, ${data.id}, ${ticket.status}, ${data.to}, ${profile.id}, ${profile.display_name}, ${data.reason ?? null})
    `;
    if (ticket.requester_id) {
      await notify(sql, {
        userId: ticket.requester_id,
        title: `${data.id} ${data.to}`,
        body: ticket.subject,
        link: `/portal/${data.id}`,
      });
    }
    return { ok: true };
  });

export const addTicketComment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: string; body: string; kind?: Comment["kind"] }) => data)
  .handler(async ({ context, data }) => {
    const { sql, profile } = await sessionMeta(context.userId);
    const rows = await sql<Ticket>`select * from tickets where id = ${data.id} limit 1`;
    const ticket = rows[0];
    if (!ticket) deny("Not found");
    const staff = isSupportStaff(profile.role);
    if (!staff && ticket.requester_id !== profile.id) deny();
    const body = data.body.trim();
    if (!body) deny("Empty");
    const id = await nextRawId(sql, "comment");
    await sql`
      insert into comments (id, entity_type, entity_id, author_id, author_name, kind, body)
      values (${id}, ${"ticket"}, ${data.id}, ${profile.id}, ${profile.display_name}, ${data.kind ?? (staff ? "answer" : "note")}, ${body})
    `;
    if (!ticket.first_response_at && staff) {
      await sql`update tickets set first_response_at = now(), status = case when status = 'new' then 'open' else status end, updated_at = now() where id = ${data.id}`;
    }
    const target = staff ? ticket.requester_id : ticket.assignee_id;
    if (target) {
      await notify(sql, {
        userId: target,
        title: `Reply on ${data.id}`,
        body: body.slice(0, 140),
        link: staff ? `/portal/${data.id}` : `/ops/desk/${data.id}`,
      });
    }
    return { id };
  });

export const assignTicket = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: string; assigneeName: string; assigneeId?: string }) => data)
  .handler(async ({ context, data }) => {
    const { sql, profile } = await sessionMeta(context.userId);
    if (!isSupportStaff(profile.role)) deny();
    await sql`
      update tickets set
        assignee_name = ${data.assigneeName},
        assignee_id = ${data.assigneeId ?? null},
        status = case when status = 'new' then 'open' else status end,
        updated_at = now()
      where id = ${data.id}
    `;
    return { ok: true };
  });

export const escalateTicket = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: string; reason: string }) => data)
  .handler(async ({ context, data }) => {
    const { sql, profile } = await sessionMeta(context.userId);
    if (!canEscalate(profile.role)) deny();
    const rows = await sql<Ticket>`select * from tickets where id = ${data.id} limit 1`;
    const ticket = rows[0];
    if (!ticket) deny("Not found");
    const reason = data.reason.trim();
    if (!reason) deny("Reason required");

    const workId = await nextId(sql, "work_item", "MC");
    const seq = Number(workId.split("-")[1]);
    const type = ticket.category === "bug" ? "bug" : ticket.priority === "urgent" ? "incident" : "bug";
    const priority = ticket.priority === "urgent" ? "P1" : ticket.priority === "high" ? "P2" : "P3";
    const scores = {
      user_impact: ticket.priority === "urgent" ? 4 : 3,
      business_impact: 3,
      risk_reduction: 2,
      time_criticality: ticket.priority === "urgent" ? 4 : 2,
      strategic_fit: 2,
      confidence: "med" as const,
      effort: 3,
    };
    const score = computeScore(scores);
    await sql`
      insert into work_items (
        id, seq, title, type, product_module, environment,
        expected_behavior, actual_behavior, current_behavior, steps_to_reproduce,
        affected_users, priority, priority_rationale,
        user_impact, business_impact, risk_reduction, time_criticality, strategic_fit,
        effort, confidence, computed_score, owner_name, owner_id, status, created_by
      ) values (
        ${workId}, ${seq}, ${"[From helpdesk] " + ticket.subject}, ${type}, ${"Platform"}, ${ticket.environment},
        ${ticket.expected_behavior}, ${ticket.body}, ${ticket.body}, ${null},
        ${ticket.customer_name}, ${priority},
        ${"Escalated from " + ticket.id + " — helpdesk ticket remains the customer record."},
        ${scores.user_impact}, ${scores.business_impact}, ${scores.risk_reduction}, ${scores.time_criticality}, ${scores.strategic_fit},
        ${scores.effort}, ${scores.confidence}, ${score},
        ${profile.display_name}, ${profile.id}, ${"new"}, ${profile.id}
      )
    `;
    const eid = await nextRawId(sql, "audit");
    await sql`
      insert into ticket_escalations (id, ticket_id, work_item_id, reason, created_by)
      values (${eid}, ${ticket.id}, ${workId}, ${reason}, ${profile.id})
    `;
    await sql`
      update tickets set status = 'escalated', updated_at = now(), last_transition_at = now()
      where id = ${ticket.id}
    `;
    const tid = await nextRawId(sql, "audit");
    await sql`
      insert into status_transitions (id, entity_type, entity_id, from_status, to_status, actor_id, actor_name, reason)
      values (${tid}, ${"ticket"}, ${ticket.id}, ${ticket.status}, ${"escalated"}, ${profile.id}, ${profile.display_name}, ${reason})
    `;
    const cid = await nextRawId(sql, "comment");
    await sql`
      insert into comments (id, entity_type, entity_id, author_id, author_name, kind, body)
      values (${cid}, ${"ticket"}, ${ticket.id}, ${profile.id}, ${profile.display_name}, ${"note"}, ${"Escalated to engineering as " + workId + ". The helpdesk ticket stays here; engineering work is tracked separately."})
    `;
    await writeAudit(sql, {
      actorId: profile.id,
      actorName: profile.display_name,
      action: "ticket.escalate",
      objectType: "ticket",
      objectId: ticket.id,
      metadata: { workId },
    });
    return { workId };
  });

export type WorkItemRow = WorkItem;
