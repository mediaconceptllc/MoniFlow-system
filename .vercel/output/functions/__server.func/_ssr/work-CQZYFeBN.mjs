import { a as canDecide, c as canRelease, d as canTransitionWork, i as canAssignWork, l as canSetPriority, n as WORK_TRANSITIONS, s as canQa } from "./workflow-Da-XSiWn.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-ElitWSjz.mjs";
import { n as computeScore } from "./scoring-Bp88wWL5.mjs";
import { a as nextId, c as seedIfEmpty, i as jsonSafe, l as sessionMeta, n as deny, o as nextRawId, s as notify, t as createServerRpc, u as writeAudit } from "./seed-BUYVuAj0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/work-CQZYFeBN.js
var listWorkItems_createServerFn_handler = createServerRpc({
	id: "f6f5465650c19bfe0d62f0daac0b58af1c89aec2821f26150380d78caf96f30b",
	name: "listWorkItems",
	filename: "src/lib/fns/work.ts"
}, (opts) => listWorkItems.__executeServer(opts));
var listWorkItems = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => data ?? {}).handler(listWorkItems_createServerFn_handler, async ({ context, data }) => {
	const { sql, profile } = await sessionMeta(context.userId);
	await seedIfEmpty(sql);
	const rows = await sql`
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
	if (f.mine) out = out.filter((r) => r.assignee_id === profile.id || r.owner_id === profile.id || r.assignee_name === profile.display_name);
	if (f.q) {
		const q = f.q.toLowerCase();
		out = out.filter((r) => r.id.toLowerCase().includes(q) || r.title.toLowerCase().includes(q) || (r.priority_rationale ?? "").toLowerCase().includes(q) || (r.actual_behavior ?? "").toLowerCase().includes(q));
	}
	return out;
});
var getWorkItem_createServerFn_handler = createServerRpc({
	id: "1181b3bed496955d548b8ef85cf695163ba779df52db5559cc91590f9e303b63",
	name: "getWorkItem",
	filename: "src/lib/fns/work.ts"
}, (opts) => getWorkItem.__executeServer(opts));
var getWorkItem = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(getWorkItem_createServerFn_handler, async ({ context, data: id }) => {
	const { sql } = await sessionMeta(context.userId);
	await seedIfEmpty(sql);
	const items = await sql`select * from work_items where id = ${id} limit 1`;
	if (!items[0]) return null;
	const comments = await sql`
      select * from comments where entity_type = 'work_item' and entity_id = ${id} order by created_at asc
    `;
	const decisions = await sql`
      select * from decisions where work_item_id = ${id} order by created_at asc
    `;
	const transitions = await sql`
      select * from status_transitions where entity_type = 'work_item' and entity_id = ${id} order by created_at asc
    `;
	const attachments = await sql`
      select * from attachments where entity_type = 'work_item' and entity_id = ${id} order by created_at asc
    `;
	const tests = await sql`
      select * from test_runs where work_item_id = ${id} order by created_at desc
    `;
	const linkedTickets = await sql`
      select ticket_id, reason from ticket_escalations where work_item_id = ${id}
    `;
	return jsonSafe({
		item: items[0],
		comments,
		decisions,
		transitions,
		attachments,
		tests,
		linkedTickets
	});
});
var createWorkItem_createServerFn_handler = createServerRpc({
	id: "cf39959937e6b4d114f65eda1be59f6af9a298bf4f9f4c9f88bbac14353f8a4d",
	name: "createWorkItem",
	filename: "src/lib/fns/work.ts"
}, (opts) => createWorkItem.__executeServer(opts));
var createWorkItem = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createWorkItem_createServerFn_handler, async ({ context, data }) => {
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
		effort: data.effort ?? 3
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
	await sql`
      insert into status_transitions (id, entity_type, entity_id, from_status, to_status, actor_id, actor_name, reason)
      values (${await nextRawId(sql, "audit")}, ${"work_item"}, ${id}, ${null}, ${"new"}, ${profile.id}, ${profile.display_name}, ${"Created"})
    `;
	if (data.evidenceDataUrl && data.evidenceDataUrl.length < 9e5) await sql`
        insert into attachments (id, entity_type, entity_id, filename, mime, caption, data_url, created_by)
        values (${await nextRawId(sql, "attachment")}, ${"work_item"}, ${id}, ${data.evidenceName ?? "evidence"}, ${"image/*"}, ${data.caption ?? null}, ${data.evidenceDataUrl}, ${profile.id})
      `;
	await writeAudit(sql, {
		actorId: profile.id,
		actorName: profile.display_name,
		action: "work.create",
		objectType: "work_item",
		objectId: id,
		metadata: {
			priority,
			type: data.type
		}
	});
	return { id };
});
var updateWorkItem_createServerFn_handler = createServerRpc({
	id: "85d6bf47ffc9cc976827d28286681ecb9acb72a06d895f7e1a6b6631e4681d4c",
	name: "updateWorkItem",
	filename: "src/lib/fns/work.ts"
}, (opts) => updateWorkItem.__executeServer(opts));
var updateWorkItem = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(updateWorkItem_createServerFn_handler, async ({ context, data }) => {
	const { sql, profile } = await sessionMeta(context.userId);
	const current = await sql`select * from work_items where id = ${data.id} limit 1`;
	if (!current[0]) deny("Not found");
	const item = current[0];
	if (data.patch.priority && data.patch.priority !== item.priority && !canSetPriority(profile.role)) deny();
	if (data.patch.assignee_name && !canAssignWork(profile.role) && profile.role !== "developer") deny();
	const next = {
		...item,
		...data.patch
	};
	const score = computeScore({
		user_impact: Number(next.user_impact),
		business_impact: Number(next.business_impact),
		risk_reduction: Number(next.risk_reduction),
		time_criticality: Number(next.time_criticality),
		strategic_fit: Number(next.strategic_fit),
		confidence: next.confidence,
		effort: Number(next.effort)
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
		metadata: data.patch
	});
	return {
		ok: true,
		score
	};
});
var transitionWork_createServerFn_handler = createServerRpc({
	id: "2a26880f47744d6cf41edee5cf3b23a17d58c2b623badee851e2fccc47aff30e",
	name: "transitionWork",
	filename: "src/lib/fns/work.ts"
}, (opts) => transitionWork.__executeServer(opts));
var transitionWork = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(transitionWork_createServerFn_handler, async ({ context, data }) => {
	const { sql, profile } = await sessionMeta(context.userId);
	const item = (await sql`select * from work_items where id = ${data.id} limit 1`)[0];
	if (!item) deny("Not found");
	if (!(WORK_TRANSITIONS[item.status] ?? []).includes(data.to)) deny("Illegal transition");
	if (!canTransitionWork(profile.role, data.to)) deny();
	if (data.to === "ready_for_release" && !canQa(profile.role) && profile.role !== "admin") deny();
	if (data.to === "released" && !canRelease(profile.role)) deny();
	await sql`
      update work_items set status = ${data.to}, updated_at = now(), last_transition_at = now()
      where id = ${data.id}
    `;
	await sql`
      insert into status_transitions (id, entity_type, entity_id, from_status, to_status, actor_id, actor_name, reason)
      values (${await nextRawId(sql, "audit")}, ${"work_item"}, ${data.id}, ${item.status}, ${data.to}, ${profile.id}, ${profile.display_name}, ${data.reason ?? null})
    `;
	if (item.assignee_id) await notify(sql, {
		userId: item.assignee_id,
		title: `${data.id} → ${data.to}`,
		body: data.reason ?? item.title,
		link: `/ops/eng/${data.id}`,
		severity: item.priority === "P0" ? "critical" : "info"
	});
	await writeAudit(sql, {
		actorId: profile.id,
		actorName: profile.display_name,
		action: "work.transition",
		objectType: "work_item",
		objectId: data.id,
		metadata: {
			from: item.status,
			to: data.to
		}
	});
	return { ok: true };
});
var addWorkComment_createServerFn_handler = createServerRpc({
	id: "4af3d926d967168f2068498aac723e756f40343bb589edaa16422e3b0ca3355c",
	name: "addWorkComment",
	filename: "src/lib/fns/work.ts"
}, (opts) => addWorkComment.__executeServer(opts));
var addWorkComment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(addWorkComment_createServerFn_handler, async ({ context, data }) => {
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
var recordDecision_createServerFn_handler = createServerRpc({
	id: "a857dafc66c3fc78597c38493df40e22e9b56db8cf5fe61fae5d01f35534c801",
	name: "recordDecision",
	filename: "src/lib/fns/work.ts"
}, (opts) => recordDecision.__executeServer(opts));
var recordDecision = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(recordDecision_createServerFn_handler, async ({ context, data }) => {
	const { sql, profile } = await sessionMeta(context.userId);
	if (!canDecide(profile.role)) deny();
	const rationale = data.rationale.trim();
	if (!rationale) deny("Rationale required");
	const id = await nextRawId(sql, "decision");
	await sql`
      insert into decisions (id, work_item_id, kind, rationale, approver_id, approver_name)
      values (${id}, ${data.id}, ${data.kind}, ${rationale}, ${profile.id}, ${profile.display_name})
    `;
	const to = {
		approve: "approved_backlog",
		revise: "needs_info",
		reject: "rejected",
		defer: "deferred"
	}[data.kind];
	if (to) {
		await sql`
        update work_items set status = ${to}, updated_at = now(), last_transition_at = now()
        where id = ${data.id} and status in ('new','triage','needs_info','approved_backlog')
      `;
		await sql`
        insert into status_transitions (id, entity_type, entity_id, from_status, to_status, actor_id, actor_name, reason)
        values (${await nextRawId(sql, "audit")}, ${"work_item"}, ${data.id}, ${"triage"}, ${to}, ${profile.id}, ${profile.display_name}, ${rationale})
      `;
	}
	await writeAudit(sql, {
		actorId: profile.id,
		actorName: profile.display_name,
		action: "work.decision",
		objectType: "work_item",
		objectId: data.id,
		metadata: { kind: data.kind }
	});
	return { id };
});
var addTestRun_createServerFn_handler = createServerRpc({
	id: "bd7cff161b3a2d002086ccb830c2fe5056e6719435a2c4ebf5f912646bb799bc",
	name: "addTestRun",
	filename: "src/lib/fns/work.ts"
}, (opts) => addTestRun.__executeServer(opts));
var addTestRun = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(addTestRun_createServerFn_handler, async ({ context, data }) => {
	const { sql, profile } = await sessionMeta(context.userId);
	if (!canQa(profile.role) && profile.role !== "developer" && profile.role !== "admin") deny();
	const id = await nextRawId(sql, "test_run");
	await sql`
      insert into test_runs (id, work_item_id, title, result, environment, evidence, tester_id, tester_name)
      values (${id}, ${data.id}, ${data.title}, ${data.result}, ${data.environment ?? null}, ${data.evidence ?? null}, ${profile.id}, ${profile.display_name})
    `;
	if (data.result === "fail") await sql`
        update work_items set status = 'qa_failed', updated_at = now(), last_transition_at = now()
        where id = ${data.id} and status in ('ready_for_qa','in_review')
      `;
	return { id };
});
var listReleases_createServerFn_handler = createServerRpc({
	id: "6e9758e1c82595b3f74db093e812df6872dde54e42fba57887a432a083f676c0",
	name: "listReleases",
	filename: "src/lib/fns/work.ts"
}, (opts) => listReleases.__executeServer(opts));
var listReleases = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listReleases_createServerFn_handler, async ({ context }) => {
	const { sql } = await sessionMeta(context.userId);
	await seedIfEmpty(sql);
	const releases = await sql`select * from releases order by created_at desc`;
	const items = await sql`
      select ri.release_id, ri.work_item_id, w.title, w.status, w.priority
      from release_items ri join work_items w on w.id = ri.work_item_id
    `;
	return jsonSafe({
		releases,
		items
	});
});
//#endregion
export { addTestRun_createServerFn_handler, addWorkComment_createServerFn_handler, createWorkItem_createServerFn_handler, getWorkItem_createServerFn_handler, listReleases_createServerFn_handler, listWorkItems_createServerFn_handler, recordDecision_createServerFn_handler, transitionWork_createServerFn_handler, updateWorkItem_createServerFn_handler };
