import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { KpiSnapshot, Notification, Profile, Role } from "@/lib/types";
import { ROLES } from "@/lib/types";
import { canAdmin } from "@/lib/workflow";
import { deny, ensureProfile, jsonSafe, sessionMeta, writeAudit } from "@/lib/server/helpers";
import { seedIfEmpty } from "@/lib/server/seed";
import { agingHoursForWork, isAging } from "@/lib/scoring";

export const bootstrapApp = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await seedIfEmpty(sql);
    const profile = await ensureProfile(context.userId);
    return { profile };
  });

export const getMe = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const profile = await ensureProfile(context.userId);
    return { profile };
  });

export const listMembers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { sql } = await sessionMeta(context.userId);
    const rows = await sql<Profile>`select * from profiles order by created_at asc`;
    return jsonSafe(rows);
  });

export const updateMyLocale = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { locale: "mn" | "en" }) => data)
  .handler(async ({ context, data }) => {
    const { sql } = await sessionMeta(context.userId);
    await sql`update profiles set locale = ${data.locale} where id = ${context.userId}`;
    return { ok: true };
  });

export const setMemberRole = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { userId: string; role: Role }) => data)
  .handler(async ({ context, data }) => {
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
      metadata: { role: data.role },
    });
    return { ok: true };
  });

export const listNotifications = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { sql } = await sessionMeta(context.userId);
    const rows = await sql<Notification>`
      select * from notifications where user_id = ${context.userId}
      order by created_at desc limit 40
    `;
    return jsonSafe(rows);
  });

export const markNotificationsRead = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { sql } = await sessionMeta(context.userId);
    await sql`update notifications set read = true where user_id = ${context.userId}`;
    return { ok: true };
  });

export const getKpis = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { sql } = await sessionMeta(context.userId);
    await seedIfEmpty(sql);

    const openWork = await sql<{ n: number }>`
      select count(*)::int as n from work_items
      where status not in ('closed','rejected','duplicate','verified')
    `;
    const untriaged = await sql<{ n: number }>`
      select count(*)::int as n from work_items where status in ('new','triage','needs_info')
    `;
    const blocked = await sql<{ n: number }>`
      select count(*)::int as n from work_items where blocked = true
        and status not in ('closed','rejected','duplicate')
    `;
    const p0 = await sql<{ n: number }>`
      select count(*)::int as n from work_items where priority = 'P0'
        and status not in ('closed','rejected','duplicate','verified')
    `;
    const p1 = await sql<{ n: number }>`
      select count(*)::int as n from work_items where priority = 'P1'
        and status not in ('closed','rejected','duplicate','verified')
    `;
    const readyQa = await sql<{ n: number }>`
      select count(*)::int as n from work_items where status = 'ready_for_qa'
    `;
    const readyRel = await sql<{ n: number }>`
      select count(*)::int as n from work_items where status = 'ready_for_release'
    `;
    const openTickets = await sql<{ n: number }>`
      select count(*)::int as n from tickets
      where status not in ('closed','resolved','duplicate')
    `;
    const waiting = await sql<{ n: number }>`
      select count(*)::int as n from tickets where status = 'waiting_customer'
    `;
    const escalated = await sql<{ n: number }>`
      select count(*)::int as n from tickets where status = 'escalated'
    `;
    const sla = await sql<{ n: number }>`
      select count(*)::int as n from tickets
      where sla_due_at is not null and sla_due_at < now()
        and status not in ('closed','resolved','duplicate')
    `;
    const flags = await sql<{
      growth: number;
      retention: number;
      payment: number;
      stability: number;
    }>`
      select
        coalesce(sum(case when flag_growth then 1 else 0 end),0)::int as growth,
        coalesce(sum(case when flag_retention then 1 else 0 end),0)::int as retention,
        coalesce(sum(case when flag_payment then 1 else 0 end),0)::int as payment,
        coalesce(sum(case when flag_stability then 1 else 0 end),0)::int as stability
      from work_items
      where status not in ('closed','rejected','duplicate')
    `;
    const polish = await sql<{ n: number }>`
      select count(*)::int as n from work_items
      where priority = 'P3' and status not in ('closed','rejected','duplicate')
    `;
    const agingRows = await sql<{ last_transition_at: string; priority: string; status: string }>`
      select last_transition_at, priority, status from work_items
      where status not in ('closed','rejected','duplicate','verified')
    `;
    let untriagedAging = 0;
    let overdue = 0;
    for (const row of agingRows) {
      const hrs = agingHoursForWork(row.priority);
      if (isAging(row.last_transition_at, hrs)) overdue += 1;
      if (
        (row.status === "new" || row.status === "triage") &&
        isAging(row.last_transition_at, 8)
      ) {
        untriagedAging += 1;
      }
    }
    const evidenceMissing = await sql<{ n: number }>`
      select count(*)::int as n from work_items w
      where w.status in ('ready_for_qa','ready_for_release')
        and not exists (
          select 1 from test_runs t where t.work_item_id = w.id
        )
    `;

    const snapshot: KpiSnapshot = {
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
        polish: Number(polish[0]?.n ?? 0),
      },
    };
    return snapshot;
  });
