import { getSql } from "@/lib/db";
import type { Sql } from "@/lib/db";
import type { Profile, Role } from "@/lib/types";

export function jsonSafe<T>(value: T): T {
  if (value == null) return value;
  if (value instanceof Date) return value.toISOString() as T;
  if (typeof value === "bigint") return Number(value) as T;
  if (Array.isArray(value)) return value.map((v) => jsonSafe(v)) as T;
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = jsonSafe(v);
    }
    return out as T;
  }
  return value;
}

export function asBool(v: unknown): boolean {
  return v === true || v === "t" || v === "true" || v === 1 || v === "1";
}

export async function nextId(sql: Sql, counter: string, prefix: string): Promise<string> {
  const rows = await sql<{ value: number }>`
    update counters set value = value + 1 where name = ${counter} returning value
  `;
  const n = Number(rows[0]?.value ?? 1);
  return `${prefix}-${String(n).padStart(6, "0")}`;
}

export async function nextRawId(sql: Sql, counter: string): Promise<string> {
  const rows = await sql<{ value: number }>`
    update counters set value = value + 1 where name = ${counter} returning value
  `;
  return `${counter}_${rows[0]?.value ?? Date.now()}`;
}

export async function writeAudit(
  sql: Sql,
  input: {
    actorId: string | null;
    actorName: string;
    action: string;
    objectType: string;
    objectId: string;
    metadata?: unknown;
  },
) {
  const id = await nextRawId(sql, "audit");
  await sql`
    insert into audit_events (id, actor_id, actor_name, action, object_type, object_id, metadata)
    values (
      ${id},
      ${input.actorId},
      ${input.actorName},
      ${input.action},
      ${input.objectType},
      ${input.objectId},
      ${input.metadata ? JSON.stringify(input.metadata) : null}
    )
  `;
}

export async function notify(
  sql: Sql,
  input: { userId: string; title: string; body?: string; link?: string; severity?: string },
) {
  if (!input.userId || input.userId === "system") return;
  const id = await nextRawId(sql, "notification");
  await sql`
    insert into notifications (id, user_id, title, body, link, severity)
    values (${id}, ${input.userId}, ${input.title}, ${input.body ?? null}, ${input.link ?? null}, ${input.severity ?? "info"})
  `;
}

export async function ensureProfile(
  userId: string,
  hint?: { email?: string | null; name?: string | null },
): Promise<Profile> {
  const sql = await getSql();
  const authRows = await sql<{ name: string; email: string }>`
    select name, email from "user" where id = ${userId} limit 1
  `;
  const existing = await sql<Profile>`select * from profiles where id = ${userId} limit 1`;
  if (existing[0]) {
    const row = existing[0];
    if (authRows[0] && (!row.email || row.display_name === "Member")) {
      const name = authRows[0].name || row.display_name;
      const email = authRows[0].email || row.email;
      await sql`update profiles set email = ${email}, display_name = ${name} where id = ${userId}`;
      return jsonSafe({ ...row, email, display_name: name });
    }
    return jsonSafe(row);
  }

  const countRows = await sql<{ n: number }>`select count(*)::int as n from profiles`;
  const isFirst = Number(countRows[0]?.n ?? 0) === 0;
  const role: Role = isFirst ? "admin" : "requester";
  const display =
    hint?.name?.trim() ||
    authRows[0]?.name ||
    hint?.email?.split("@")[0] ||
    authRows[0]?.email?.split("@")[0] ||
    (isFirst ? "Workspace Admin" : "Member");
  const email = hint?.email ?? authRows[0]?.email ?? null;

  await sql`
    insert into profiles (id, email, display_name, role)
    values (${userId}, ${email}, ${display}, ${role})
    on conflict (id) do nothing
  `;
  const created = await sql<Profile>`select * from profiles where id = ${userId} limit 1`;
  return jsonSafe(created[0]!);
}

export async function getProfile(userId: string): Promise<Profile> {
  return ensureProfile(userId);
}

export function deny(message = "Forbidden"): never {
  const err = new Error(message) as Error & { status?: number };
  err.status = 403;
  throw err;
}

export async function sessionMeta(userId: string): Promise<{
  profile: Profile;
  sql: Sql;
}> {
  const sql = await getSql();
  const profile = await ensureProfile(userId);
  return { profile, sql };
}
