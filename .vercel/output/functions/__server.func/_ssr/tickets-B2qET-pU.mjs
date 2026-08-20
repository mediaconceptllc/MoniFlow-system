import { f as isSupportStaff, o as canEscalate, t as TICKET_TRANSITIONS, u as canTransitionTicket } from "./workflow-Da-XSiWn.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-ElitWSjz.mjs";
import { i as slaHoursForTicketPriority, n as computeScore } from "./scoring-Bp88wWL5.mjs";
import { a as nextId, c as seedIfEmpty, i as jsonSafe, l as sessionMeta, n as deny, o as nextRawId, s as notify, t as createServerRpc, u as writeAudit } from "./seed-BUYVuAj0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tickets-B2qET-pU.js
var listTickets_createServerFn_handler = createServerRpc({
	id: "b61348dc23762ecf02e063adec8050abec82e2d3e61aaa0e81182297421bbaf2",
	name: "listTickets",
	filename: "src/lib/fns/tickets.ts"
}, (opts) => listTickets.__executeServer(opts));
var listTickets = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => data ?? {}).handler(listTickets_createServerFn_handler, async ({ context, data }) => {
	const { sql, profile } = await sessionMeta(context.userId);
	await seedIfEmpty(sql);
	const rows = await sql`
      select * from tickets order by
        case priority when 'urgent' then 0 when 'high' then 1 when 'normal' then 2 else 3 end,
        updated_at desc
    `;
	let out = jsonSafe(rows);
	const f = data ?? {};
	if (f.portal || !isSupportStaff(profile.role)) out = out.filter((t) => t.requester_id === profile.id);
	if (f.status && f.status !== "all") out = out.filter((t) => t.status === f.status);
	if (f.category && f.category !== "all") out = out.filter((t) => t.category === f.category);
	if (f.priority && f.priority !== "all") out = out.filter((t) => t.priority === f.priority);
	if (f.mine) out = out.filter((t) => t.assignee_id === profile.id || t.assignee_name === profile.display_name);
	if (f.q) {
		const q = f.q.toLowerCase();
		out = out.filter((t) => t.id.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q) || t.body.toLowerCase().includes(q) || (t.customer_name ?? "").toLowerCase().includes(q));
	}
	return out;
});
var getTicket_createServerFn_handler = createServerRpc({
	id: "ab79cf1792122f2cee831af29379027bf470908cc5acae1a161acf91c6069acd",
	name: "getTicket",
	filename: "src/lib/fns/tickets.ts"
}, (opts) => getTicket.__executeServer(opts));
var getTicket = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(getTicket_createServerFn_handler, async ({ context, data: id }) => {
	const { sql, profile } = await sessionMeta(context.userId);
	await seedIfEmpty(sql);
	const ticket = (await sql`select * from tickets where id = ${id} limit 1`)[0];
	if (!ticket) return null;
	if (!isSupportStaff(profile.role) && ticket.requester_id !== profile.id) deny();
	const comments = await sql`
      select * from comments where entity_type = 'ticket' and entity_id = ${id} order by created_at asc
    `;
	const transitions = await sql`
      select * from status_transitions where entity_type = 'ticket' and entity_id = ${id} order by created_at asc
    `;
	const attachments = await sql`
      select * from attachments where entity_type = 'ticket' and entity_id = ${id} order by created_at asc
    `;
	const links = await sql`
      select e.work_item_id, e.reason, w.title, w.status
      from ticket_escalations e join work_items w on w.id = e.work_item_id
      where e.ticket_id = ${id}
    `;
	return jsonSafe({
		ticket,
		comments,
		transitions,
		attachments,
		links
	});
});
var createTicket_createServerFn_handler = createServerRpc({
	id: "2d8f9877b4fa263420558aaa2fc5c95331d33699613bb730a784825e04d7ba54",
	name: "createTicket",
	filename: "src/lib/fns/tickets.ts"
}, (opts) => createTicket.__executeServer(opts));
var createTicket = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createTicket_createServerFn_handler, async ({ context, data }) => {
	const { sql, profile } = await sessionMeta(context.userId);
	const subject = data.subject.trim();
	const body = data.body.trim();
	if (!subject || !body) deny("Subject and description required");
	const id = await nextId(sql, "ticket", "HD");
	const seq = Number(id.split("-")[1]);
	const priority = data.priority ?? (data.category === "billing" ? "high" : "normal");
	const sla = slaHoursForTicketPriority(priority);
	const due = new Date(Date.now() + sla * 36e5).toISOString();
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
	await sql`
      insert into status_transitions (id, entity_type, entity_id, from_status, to_status, actor_id, actor_name, reason)
      values (${await nextRawId(sql, "audit")}, ${"ticket"}, ${id}, ${null}, ${"new"}, ${profile.id}, ${profile.display_name}, ${"Opened from portal"})
    `;
	if (data.evidenceDataUrl && data.evidenceDataUrl.length < 9e5) await sql`
        insert into attachments (id, entity_type, entity_id, filename, mime, caption, data_url, created_by, access_scope)
        values (${await nextRawId(sql, "attachment")}, ${"ticket"}, ${id}, ${data.evidenceName ?? "screenshot"}, ${"image/*"}, ${data.caption ?? null}, ${data.evidenceDataUrl}, ${profile.id}, ${"restricted"})
      `;
	await writeAudit(sql, {
		actorId: profile.id,
		actorName: profile.display_name,
		action: "ticket.create",
		objectType: "ticket",
		objectId: id,
		metadata: {
			category: data.category,
			priority
		}
	});
	return { id };
});
var transitionTicket_createServerFn_handler = createServerRpc({
	id: "67e128e501271abd198324f4faebf0bf092e7816d6b45450b95b6b06230cfa59",
	name: "transitionTicket",
	filename: "src/lib/fns/tickets.ts"
}, (opts) => transitionTicket.__executeServer(opts));
var transitionTicket = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(transitionTicket_createServerFn_handler, async ({ context, data }) => {
	const { sql, profile } = await sessionMeta(context.userId);
	if (!canTransitionTicket(profile.role)) deny();
	const ticket = (await sql`select * from tickets where id = ${data.id} limit 1`)[0];
	if (!ticket) deny("Not found");
	if (!(TICKET_TRANSITIONS[ticket.status] ?? []).includes(data.to)) deny("Illegal transition");
	const first = !ticket.first_response_at && data.to !== "duplicate" ? (/* @__PURE__ */ new Date()).toISOString() : ticket.first_response_at;
	const resolved = data.to === "resolved" || data.to === "closed" ? (/* @__PURE__ */ new Date()).toISOString() : ticket.resolved_at;
	await sql`
      update tickets set
        status = ${data.to},
        first_response_at = ${first},
        resolved_at = ${resolved},
        updated_at = now(),
        last_transition_at = now()
      where id = ${data.id}
    `;
	await sql`
      insert into status_transitions (id, entity_type, entity_id, from_status, to_status, actor_id, actor_name, reason)
      values (${await nextRawId(sql, "audit")}, ${"ticket"}, ${data.id}, ${ticket.status}, ${data.to}, ${profile.id}, ${profile.display_name}, ${data.reason ?? null})
    `;
	if (ticket.requester_id) await notify(sql, {
		userId: ticket.requester_id,
		title: `${data.id} ${data.to}`,
		body: ticket.subject,
		link: `/portal/${data.id}`
	});
	return { ok: true };
});
var addTicketComment_createServerFn_handler = createServerRpc({
	id: "7c0443e8e11e38aa99cfa7c80ef1f927a3a039c8620051376c2297128676b8d5",
	name: "addTicketComment",
	filename: "src/lib/fns/tickets.ts"
}, (opts) => addTicketComment.__executeServer(opts));
var addTicketComment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(addTicketComment_createServerFn_handler, async ({ context, data }) => {
	const { sql, profile } = await sessionMeta(context.userId);
	const ticket = (await sql`select * from tickets where id = ${data.id} limit 1`)[0];
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
	if (!ticket.first_response_at && staff) await sql`update tickets set first_response_at = now(), status = case when status = 'new' then 'open' else status end, updated_at = now() where id = ${data.id}`;
	const target = staff ? ticket.requester_id : ticket.assignee_id;
	if (target) await notify(sql, {
		userId: target,
		title: `Reply on ${data.id}`,
		body: body.slice(0, 140),
		link: staff ? `/portal/${data.id}` : `/ops/desk/${data.id}`
	});
	return { id };
});
var assignTicket_createServerFn_handler = createServerRpc({
	id: "e511c90e28b04d50b166596aee252253d3892b1806ddb810922bf1ba297199b5",
	name: "assignTicket",
	filename: "src/lib/fns/tickets.ts"
}, (opts) => assignTicket.__executeServer(opts));
var assignTicket = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(assignTicket_createServerFn_handler, async ({ context, data }) => {
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
var escalateTicket_createServerFn_handler = createServerRpc({
	id: "531a89c0bf61627ce48abf63e835d46613416d270855c4f6a1ffb4b5d6b77e9c",
	name: "escalateTicket",
	filename: "src/lib/fns/tickets.ts"
}, (opts) => escalateTicket.__executeServer(opts));
var escalateTicket = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(escalateTicket_createServerFn_handler, async ({ context, data }) => {
	const { sql, profile } = await sessionMeta(context.userId);
	if (!canEscalate(profile.role)) deny();
	const ticket = (await sql`select * from tickets where id = ${data.id} limit 1`)[0];
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
		confidence: "med",
		effort: 3
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
	await sql`
      insert into ticket_escalations (id, ticket_id, work_item_id, reason, created_by)
      values (${await nextRawId(sql, "audit")}, ${ticket.id}, ${workId}, ${reason}, ${profile.id})
    `;
	await sql`
      update tickets set status = 'escalated', updated_at = now(), last_transition_at = now()
      where id = ${ticket.id}
    `;
	await sql`
      insert into status_transitions (id, entity_type, entity_id, from_status, to_status, actor_id, actor_name, reason)
      values (${await nextRawId(sql, "audit")}, ${"ticket"}, ${ticket.id}, ${ticket.status}, ${"escalated"}, ${profile.id}, ${profile.display_name}, ${reason})
    `;
	await sql`
      insert into comments (id, entity_type, entity_id, author_id, author_name, kind, body)
      values (${await nextRawId(sql, "comment")}, ${"ticket"}, ${ticket.id}, ${profile.id}, ${profile.display_name}, ${"note"}, ${"Escalated to engineering as " + workId + ". The helpdesk ticket stays here; engineering work is tracked separately."})
    `;
	await writeAudit(sql, {
		actorId: profile.id,
		actorName: profile.display_name,
		action: "ticket.escalate",
		objectType: "ticket",
		objectId: ticket.id,
		metadata: { workId }
	});
	return { workId };
});
//#endregion
export { addTicketComment_createServerFn_handler, assignTicket_createServerFn_handler, createTicket_createServerFn_handler, escalateTicket_createServerFn_handler, getTicket_createServerFn_handler, listTickets_createServerFn_handler, transitionTicket_createServerFn_handler };
