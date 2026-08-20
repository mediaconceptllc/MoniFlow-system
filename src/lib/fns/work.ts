import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import type {
  Attachment,
  Comment,
  Decision,
  Priority,
  Release,
  StatusTransition,
  TestRun,
  WorkItem,
  WorkStatus,
  WorkType,
} from "@/lib/types";
import { computeScore } from "@/lib/scoring";
import {
  canAssignWork,
  canDecide,
  canQa,
  canRelease,
  canSetPriority,
  canTransitionWork,
  WORK_TRANSITIONS,
} from "@/lib/workflow";
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

export type WorkFilters = {
  q?: string;
  status?: string;
  priority?: string;
  type?: string;
  module?: string;
  mine?: boolean;
  aging?: boolean;
};

export const listWorkItems = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: WorkFilters) => data ?? {})
  .handler(async ({ context, data }) => {
    const { sql, profile } = await sessionMeta(context.userId);
    await seedIfEmpty(sql);
    const rows = await sql<WorkItem>`
      select * from work_items order by
        case priority when 'P0' then 0 when 'P1' then 1 when 'P2' then 2 else 3 end,
        coalesce(rank, 999), computed_score desc, updated_at desc
    `;
    let out = jsonSafe(rows);
    const f = data ?? {};
    if (f.status && f.status !== "all") out = out.filter((r) => r.status === f.status);
    if (f.priority && f.priority !== "all") out = out.filter((r) => r.priority === f.priority);
    if (f.type && f.type !== "all") out = out.filter((r) => r.type === f.type);
    if (f.module && f.module !== "all") out = out.filter((r) => r.product_module === f.module);
    if (f.mine) {
      out = out.filter(
        (r) =>
          r.assignee_id === profile.id ||
          r.owner_id === profile.id ||
          r.assignee_name === profile.display_name,
      );
    }
    if (f.q) {
      const q = f.q.toLowerCase();
      out = out.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          (r.priority_rationale ?? "").toLowerCase().includes(q) ||
          (r.actual_behavior ?? "").toLowerCase().includes(q),
      );
    }
    return out;
  });

export const getWorkItem = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    const { sql } = await sessionMeta(context.userId);
    await seedIfEmpty(sql);
    const items = await sql<WorkItem>`select * from work_items where id = ${id} limit 1`;
    if (!items[0]) return null;
    const comments = await sql<Comment>`
      select * from comments where entity_type = 'work_item' and entity_id = ${id} order by created_at asc
    `;
    const decisions = await sql<Decision>`
      select * from decisions where work_item_id = ${id} order by created_at asc
    `;
    const transitions = await sql<StatusTransition>`
      select * from status_transitions where entity_type = 'work_item' and entity_id = ${id} order by created_at asc
    `;
    const attachments = await sql<Attachment>`
      select * from attachments where entity_type = 'work_item' and entity_id = ${id} order by created_at asc
    `;
    const tests = await sql<TestRun>`
      select * from test_runs where work_item_id = ${id} order by created_at desc
    `;
    const linkedTickets = await sql<{ ticket_id: string; reason: string | null }>`
      select ticket_id, reason from ticket_escalations where work_item_id = ${id}
    `;
    return jsonSafe({
      item: items[0],
      comments,
      decisions,
      transitions,
      attachments,
      tests,
      linkedTickets,
    });
  });

export type CreateWorkInput = {
  title: string;
  type: WorkType;
  product_module: string;
  environment?: string;
  expected_behavior?: string;
  actual_behavior?: string;
  steps_to_reproduce?: string;
  affected_flow?: string;
  affected_users?: string;
  flag_growth?: boolean;
  flag_retention?: boolean;
  flag_payment?: boolean;
  flag_stability?: boolean;
  flag_network?: boolean;
  priority?: Priority;
  priority_rationale?: string;
  user_impact?: number;
  business_impact?: number;
  risk_reduction?: number;
  time_criticality?: number;
  strategic_fit?: number;
  effort?: number;
  confidence?: "low" | "med" | "high";
  acceptance_criteria?: string;
  device?: string;
  os_name?: string;
  app_version?: string;
  caption?: string;
  evidenceDataUrl?: string;
  evidenceName?: string;
};

export const createWorkItem = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: CreateWorkInput) => data)
  .handler(async ({ context, data }) => {
    const { sql, profile } = await sessionMeta(context.userId);
    const title = data.title.trim();
    if (!title) deny("Title required");
    const id = await nextId(sql, "work_item", "MC");
    const seq = Number(id.split("-")[1]);
    const scores = {
      user_impact: data.user_impact ?? 2,
      business_impact: data.business_impact ?? 2,
      risk_reduction: data.risk_reduction ?? 1,
      time_criticality: data.time_criticality ?? 2,
      strategic_fit: data.strategic_fit ?? 2,
      confidence: data.confidence ?? "med",
      effort: data.effort ?? 3,
    };
    const score = computeScore(scores);
    const priority = data.priority ?? "P2";
    await sql`
      insert into work_items (
        id, seq, title, type, product_module, environment,
        expected_behavior, actual_behavior, steps_to_reproduce, current_behavior,
        affected_flow, affected_users,
        flag_growth, flag_retention, flag_payment, flag_stability, flag_network,
        priority, priority_rationale,
        user_impact, business_impact, risk_reduction, time_criticality, strategic_fit,
        effort, confidence, computed_score,
        owner_name, owner_id, status, acceptance_criteria,
        device, os_name, app_version, created_by
      ) values (
        ${id}, ${seq}, ${title}, ${data.type}, ${data.product_module}, ${data.environment ?? "Production"},
        ${data.expected_behavior ?? null}, ${data.actual_behavior ?? null}, ${data.steps_to_reproduce ?? null},
        ${data.actual_behavior ?? null},
        ${data.affected_flow ?? null}, ${data.affected_users ?? null},
        ${data.flag_growth ?? false}, ${data.flag_retention ?? false}, ${data.flag_payment ?? false},
        ${data.flag_stability ?? false}, ${data.flag_network ?? false},
        ${priority}, ${data.priority_rationale ?? null},
        ${scores.user_impact}, ${scores.business_impact}, ${scores.risk_reduction}, ${scores.time_criticality}, ${scores.strategic_fit},
        ${scores.effort}, ${scores.confidence}, ${score},
        ${profile.display_name}, ${profile.id}, ${"new"}, ${data.acceptance_criteria ?? null},
        ${data.device ?? null}, ${data.os_name ?? null}, ${data.app_version ?? null}, ${profile.id}
      )
    `;
    const tid = await nextRawId(sql, "audit");
    await sql`
      insert into status_transitions (id, entity_type, entity_id, from_status, to_status, actor_id, actor_name, reason)
      values (${tid}, ${"work_item"}, ${id}, ${null}, ${"new"}, ${profile.id}, ${profile.display_name}, ${"Created"})
    `;
    if (data.evidenceDataUrl && data.evidenceDataUrl.length < 900_000) {
      const aid = await nextRawId(sql, "attachment");
      await sql`
        insert into attachments (id, entity_type, entity_id, filename, mime, caption, data_url, created_by)
        values (${aid}, ${"work_item"}, ${id}, ${data.evidenceName ?? "evidence"}, ${"image/*"}, ${data.caption ?? null}, ${data.evidenceDataUrl}, ${profile.id})
      `;
    }
    await writeAudit(sql, {
      actorId: profile.id,
      actorName: profile.display_name,
      action: "work.create",
      objectType: "work_item",
      objectId: id,
      metadata: { priority, type: data.type },
    });
    return { id };
  });

export const updateWorkItem = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (data: {
      id: string;
      patch: Partial<
        Pick<
          WorkItem,
          | "title"
          | "priority"
          | "priority_rationale"
          | "rank"
          | "owner_name"
          | "assignee_name"
          | "assignee_id"
          | "sprint"
          | "release_target"
          | "due_date"
          | "acceptance_criteria"
          | "pr_url"
          | "build_url"
          | "version"
          | "blocked"
          | "blocker_note"
          | "user_impact"
          | "business_impact"
          | "risk_reduction"
          | "time_criticality"
          | "strategic_fit"
          | "effort"
          | "confidence"
          | "resolution"
          | "root_cause"
          | "lesson"
        >
      >;
    }) => data,
  )
  .handler(async ({ context, data }) => {
    const { sql, profile } = await sessionMeta(context.userId);
    const current = await sql<WorkItem>`select * from work_items where id = ${data.id} limit 1`;
    if (!current[0]) deny("Not found");
    const item = current[0];
    if (data.patch.priority && data.patch.priority !== item.priority && !canSetPriority(profile.role)) {
      deny();
    }
    if (data.patch.assignee_name && !canAssignWork(profile.role) && profile.role !== "developer") {
      deny();
    }
    const next = { ...item, ...data.patch };
    const score = computeScore({
      user_impact: Number(next.user_impact),
      business_impact: Number(next.business_impact),
      risk_reduction: Number(next.risk_reduction),
      time_criticality: Number(next.time_criticality),
      strategic_fit: Number(next.strategic_fit),
      confidence: next.confidence,
      effort: Number(next.effort),
    });
    await sql`
      update work_items set
        title = ${next.title},
        priority = ${next.priority},
        priority_rationale = ${next.priority_rationale},
        rank = ${next.rank},
        owner_name = ${next.owner_name},
        assignee_name = ${next.assignee_name},
        assignee_id = ${next.assignee_id},
        sprint = ${next.sprint},
        release_target = ${next.release_target},
        due_date = ${next.due_date},
        acceptance_criteria = ${next.acceptance_criteria},
        pr_url = ${next.pr_url},
        build_url = ${next.build_url},
        version = ${next.version},
        blocked = ${next.blocked},
        blocker_note = ${next.blocker_note},
        user_impact = ${next.user_impact},
        business_impact = ${next.business_impact},
        risk_reduction = ${next.risk_reduction},
        time_criticality = ${next.time_criticality},
        strategic_fit = ${next.strategic_fit},
        effort = ${next.effort},
        confidence = ${next.confidence},
        computed_score = ${score},
        resolution = ${next.resolution},
        root_cause = ${next.root_cause},
        lesson = ${next.lesson},
        updated_at = now()
      where id = ${data.id}
    `;
    await writeAudit(sql, {
      actorId: profile.id,
      actorName: profile.display_name,
      action: "work.update",
      objectType: "work_item",
      objectId: data.id,
      metadata: data.patch,
    });
    return { ok: true, score };
  });

export const transitionWork = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: string; to: WorkStatus; reason?: string }) => data)
  .handler(async ({ context, data }) => {
    const { sql, profile } = await sessionMeta(context.userId);
    const rows = await sql<WorkItem>`select * from work_items where id = ${data.id} limit 1`;
    const item = rows[0];
    if (!item) deny("Not found");
    const allowed = WORK_TRANSITIONS[item.status] ?? [];
    if (!allowed.includes(data.to)) deny("Illegal transition");
    if (!canTransitionWork(profile.role, data.to)) deny();
    if (data.to === "ready_for_release" && !canQa(profile.role) && profile.role !== "admin") deny();
    if (data.to === "released" && !canRelease(profile.role)) deny();
    await sql`
      update work_items set status = ${data.to}, updated_at = now(), last_transition_at = now()
      where id = ${data.id}
    `;
    const tid = await nextRawId(sql, "audit");
    await sql`
      insert into status_transitions (id, entity_type, entity_id, from_status, to_status, actor_id, actor_name, reason)
      values (${tid}, ${"work_item"}, ${data.id}, ${item.status}, ${data.to}, ${profile.id}, ${profile.display_name}, ${data.reason ?? null})
    `;
    if (item.assignee_id) {
      await notify(sql, {
        userId: item.assignee_id,
        title: `${data.id} → ${data.to}`,
        body: data.reason ?? item.title,
        link: `/ops/eng/${data.id}`,
        severity: item.priority === "P0" ? "critical" : "info",
      });
    }
    await writeAudit(sql, {
      actorId: profile.id,
      actorName: profile.display_name,
      action: "work.transition",
      objectType: "work_item",
      objectId: data.id,
      metadata: { from: item.status, to: data.to },
    });
    return { ok: true };
  });

export const addWorkComment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: string; body: string; kind?: Comment["kind"] }) => data)
  .handler(async ({ context, data }) => {
    const { sql, profile } = await sessionMeta(context.userId);
    const body = data.body.trim();
    if (!body) deny("Empty");
    const id = await nextRawId(sql, "comment");
    await sql`
      insert into comments (id, entity_type, entity_id, author_id, author_name, kind, body)
      values (${id}, ${"work_item"}, ${data.id}, ${profile.id}, ${profile.display_name}, ${data.kind ?? "note"}, ${body})
    `;
    return { id };
  });

export const recordDecision = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: string; kind: Decision["kind"]; rationale: string }) => data)
  .handler(async ({ context, data }) => {
    const { sql, profile } = await sessionMeta(context.userId);
    if (!canDecide(profile.role)) deny();
    const rationale = data.rationale.trim();
    if (!rationale) deny("Rationale required");
    const id = await nextRawId(sql, "decision");
    await sql`
      insert into decisions (id, work_item_id, kind, rationale, approver_id, approver_name)
      values (${id}, ${data.id}, ${data.kind}, ${rationale}, ${profile.id}, ${profile.display_name})
    `;
    const map: Record<string, WorkStatus> = {
      approve: "approved_backlog",
      revise: "needs_info",
      reject: "rejected",
      defer: "deferred",
    };
    const to = map[data.kind];
    if (to) {
      await sql`
        update work_items set status = ${to}, updated_at = now(), last_transition_at = now()
        where id = ${data.id} and status in ('new','triage','needs_info','approved_backlog')
      `;
      const tid = await nextRawId(sql, "audit");
      await sql`
        insert into status_transitions (id, entity_type, entity_id, from_status, to_status, actor_id, actor_name, reason)
        values (${tid}, ${"work_item"}, ${data.id}, ${"triage"}, ${to}, ${profile.id}, ${profile.display_name}, ${rationale})
      `;
    }
    await writeAudit(sql, {
      actorId: profile.id,
      actorName: profile.display_name,
      action: "work.decision",
      objectType: "work_item",
      objectId: data.id,
      metadata: { kind: data.kind },
    });
    return { id };
  });

export const addTestRun = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (data: { id: string; title: string; result: string; environment?: string; evidence?: string }) =>
      data,
  )
  .handler(async ({ context, data }) => {
    const { sql, profile } = await sessionMeta(context.userId);
    if (!canQa(profile.role) && profile.role !== "developer" && profile.role !== "admin") deny();
    const id = await nextRawId(sql, "test_run");
    await sql`
      insert into test_runs (id, work_item_id, title, result, environment, evidence, tester_id, tester_name)
      values (${id}, ${data.id}, ${data.title}, ${data.result}, ${data.environment ?? null}, ${data.evidence ?? null}, ${profile.id}, ${profile.display_name})
    `;
    if (data.result === "fail") {
      await sql`
        update work_items set status = 'qa_failed', updated_at = now(), last_transition_at = now()
        where id = ${data.id} and status in ('ready_for_qa','in_review')
      `;
    }
    return { id };
  });

export const listReleases = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { sql } = await sessionMeta(context.userId);
    await seedIfEmpty(sql);
    const releases = await sql<Release>`select * from releases order by created_at desc`;
    const items = await sql<{ release_id: string; work_item_id: string; title: string; status: string; priority: string }>`
      select ri.release_id, ri.work_item_id, w.title, w.status, w.priority
      from release_items ri join work_items w on w.id = ri.work_item_id
    `;
    return jsonSafe({ releases, items });
  });
