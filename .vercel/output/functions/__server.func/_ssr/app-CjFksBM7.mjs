import { r as canAdmin } from "./workflow-Da-XSiWn.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-ElitWSjz.mjs";
import { r as getSql } from "./db-CfdCrqbe.mjs";
import { i as ROLES } from "./types-Cz51tgQ5.mjs";
import { r as isAging, t as agingHoursForWork } from "./scoring-Bp88wWL5.mjs";
import { c as seedIfEmpty, i as jsonSafe, l as sessionMeta, n as deny, r as ensureProfile, t as createServerRpc, u as writeAudit } from "./seed-BUYVuAj0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-CjFksBM7.js
var bootstrapApp_createServerFn_handler = createServerRpc({
	id: "48506022df5ecdd5b28e31f31fb53a32ce50a7a10c01d40f0690104bd603eaa7",
	name: "bootstrapApp",
	filename: "src/lib/fns/app.ts"
}, (opts) => bootstrapApp.__executeServer(opts));
var bootstrapApp = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(bootstrapApp_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await seedIfEmpty(sql);
	return { profile: await ensureProfile(context.userId) };
});
var getMe_createServerFn_handler = createServerRpc({
	id: "56bdddd1c2b6f84293d7c25444a9af3ac1880d884d55b6ccf52981d3a2a5b0aa",
	name: "getMe",
	filename: "src/lib/fns/app.ts"
}, (opts) => getMe.__executeServer(opts));
var getMe = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMe_createServerFn_handler, async ({ context }) => {
	return { profile: await ensureProfile(context.userId) };
});
var listMembers_createServerFn_handler = createServerRpc({
	id: "109ce20833b38806936ab3977e6533d088e0f4304a5f7af617840dda5acb38e4",
	name: "listMembers",
	filename: "src/lib/fns/app.ts"
}, (opts) => listMembers.__executeServer(opts));
var listMembers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMembers_createServerFn_handler, async ({ context }) => {
	const { sql } = await sessionMeta(context.userId);
	const rows = await sql`select * from profiles order by created_at asc`;
	return jsonSafe(rows);
});
var updateMyLocale_createServerFn_handler = createServerRpc({
	id: "e09254766e43aaeb20303496dff27a162fb1428c90dd7c67d55fe284f78dc7b6",
	name: "updateMyLocale",
	filename: "src/lib/fns/app.ts"
}, (opts) => updateMyLocale.__executeServer(opts));
var updateMyLocale = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(updateMyLocale_createServerFn_handler, async ({ context, data }) => {
	const { sql } = await sessionMeta(context.userId);
	await sql`update profiles set locale = ${data.locale} where id = ${context.userId}`;
	return { ok: true };
});
var setMemberRole_createServerFn_handler = createServerRpc({
	id: "dcd34e4b4af054047393499e6c561c7bd4b19cc90c46d90eb23ee58f2a0625b2",
	name: "setMemberRole",
	filename: "src/lib/fns/app.ts"
}, (opts) => setMemberRole.__executeServer(opts));
var setMemberRole = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(setMemberRole_createServerFn_handler, async ({ context, data }) => {
	const { sql, profile } = await sessionMeta(context.userId);
	if (!canAdmin(profile.role)) deny();
	if (!ROLES.includes(data.role)) deny("Invalid role");
	await sql`update profiles set role = ${data.role} where id = ${data.userId}`;
	await writeAudit(sql, {
		actorId: profile.id,
		actorName: profile.display_name,
		action: "role.change",
		objectType: "profile",
		objectId: data.userId,
		metadata: { role: data.role }
	});
	return { ok: true };
});
var listNotifications_createServerFn_handler = createServerRpc({
	id: "d280f3eeaea155badd251a67bf5b7b88b775b39ad50d39775e76f4add9327719",
	name: "listNotifications",
	filename: "src/lib/fns/app.ts"
}, (opts) => listNotifications.__executeServer(opts));
var listNotifications = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listNotifications_createServerFn_handler, async ({ context }) => {
	const { sql } = await sessionMeta(context.userId);
	const rows = await sql`
      select * from notifications where user_id = ${context.userId}
      order by created_at desc limit 40
    `;
	return jsonSafe(rows);
});
var markNotificationsRead_createServerFn_handler = createServerRpc({
	id: "36c23e2fea2db592f7bc7bc8fda8d934d6bf4335ec13c6edb2b55558482c37d8",
	name: "markNotificationsRead",
	filename: "src/lib/fns/app.ts"
}, (opts) => markNotificationsRead.__executeServer(opts));
var markNotificationsRead = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(markNotificationsRead_createServerFn_handler, async ({ context }) => {
	const { sql } = await sessionMeta(context.userId);
	await sql`update notifications set read = true where user_id = ${context.userId}`;
	return { ok: true };
});
var getKpis_createServerFn_handler = createServerRpc({
	id: "2cbf0128d5f82660ddf1d5e831f8c119f90521b19534a46c47dd466f89d34db0",
	name: "getKpis",
	filename: "src/lib/fns/app.ts"
}, (opts) => getKpis.__executeServer(opts));
var getKpis = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getKpis_createServerFn_handler, async ({ context }) => {
	const { sql } = await sessionMeta(context.userId);
	await seedIfEmpty(sql);
	const openWork = await sql`
      select count(*)::int as n from work_items
      where status not in ('closed','rejected','duplicate','verified')
    `;
	const untriaged = await sql`
      select count(*)::int as n from work_items where status in ('new','triage','needs_info')
    `;
	const blocked = await sql`
      select count(*)::int as n from work_items where blocked = true
        and status not in ('closed','rejected','duplicate')
    `;
	const p0 = await sql`
      select count(*)::int as n from work_items where priority = 'P0'
        and status not in ('closed','rejected','duplicate','verified')
    `;
	const p1 = await sql`
      select count(*)::int as n from work_items where priority = 'P1'
        and status not in ('closed','rejected','duplicate','verified')
    `;
	const readyQa = await sql`
      select count(*)::int as n from work_items where status = 'ready_for_qa'
    `;
	const readyRel = await sql`
      select count(*)::int as n from work_items where status = 'ready_for_release'
    `;
	const openTickets = await sql`
      select count(*)::int as n from tickets
      where status not in ('closed','resolved','duplicate')
    `;
	const waiting = await sql`
      select count(*)::int as n from tickets where status = 'waiting_customer'
    `;
	const escalated = await sql`
      select count(*)::int as n from tickets where status = 'escalated'
    `;
	const sla = await sql`
      select count(*)::int as n from tickets
      where sla_due_at is not null and sla_due_at < now()
        and status not in ('closed','resolved','duplicate')
    `;
	const flags = await sql`
      select
        coalesce(sum(case when flag_growth then 1 else 0 end),0)::int as growth,
        coalesce(sum(case when flag_retention then 1 else 0 end),0)::int as retention,
        coalesce(sum(case when flag_payment then 1 else 0 end),0)::int as payment,
        coalesce(sum(case when flag_stability then 1 else 0 end),0)::int as stability
      from work_items
      where status not in ('closed','rejected','duplicate')
    `;
	const polish = await sql`
      select count(*)::int as n from work_items
      where priority = 'P3' and status not in ('closed','rejected','duplicate')
    `;
	const agingRows = await sql`
      select last_transition_at, priority, status from work_items
      where status not in ('closed','rejected','duplicate','verified')
    `;
	let untriagedAging = 0;
	let overdue = 0;
	for (const row of agingRows) {
		const hrs = agingHoursForWork(row.priority);
		if (isAging(row.last_transition_at, hrs)) overdue += 1;
		if ((row.status === "new" || row.status === "triage") && isAging(row.last_transition_at, 8)) untriagedAging += 1;
	}
	const evidenceMissing = await sql`
      select count(*)::int as n from work_items w
      where w.status in ('ready_for_qa','ready_for_release')
        and not exists (
          select 1 from test_runs t where t.work_item_id = w.id
        )
    `;
	return {
		untriaged: Number(untriaged[0]?.n ?? 0),
		untriagedAging,
		openWork: Number(openWork[0]?.n ?? 0),
		blocked: Number(blocked[0]?.n ?? 0),
		overdue,
		p0: Number(p0[0]?.n ?? 0),
		p1: Number(p1[0]?.n ?? 0),
		readyForQa: Number(readyQa[0]?.n ?? 0),
		readyForRelease: Number(readyRel[0]?.n ?? 0),
		openTickets: Number(openTickets[0]?.n ?? 0),
		slaBreached: Number(sla[0]?.n ?? 0),
		waitingCustomer: Number(waiting[0]?.n ?? 0),
		escalatedTickets: Number(escalated[0]?.n ?? 0),
		evidenceMissing: Number(evidenceMissing[0]?.n ?? 0),
		strategicMix: {
			growth: Number(flags[0]?.growth ?? 0),
			retention: Number(flags[0]?.retention ?? 0),
			payment: Number(flags[0]?.payment ?? 0),
			stability: Number(flags[0]?.stability ?? 0),
			polish: Number(polish[0]?.n ?? 0)
		}
	};
});
//#endregion
export { bootstrapApp_createServerFn_handler, getKpis_createServerFn_handler, getMe_createServerFn_handler, listMembers_createServerFn_handler, listNotifications_createServerFn_handler, markNotificationsRead_createServerFn_handler, setMemberRole_createServerFn_handler, updateMyLocale_createServerFn_handler };
