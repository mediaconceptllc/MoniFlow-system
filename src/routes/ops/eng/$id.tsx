import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  IdChip,
  PriorityBadge,
  WorkStatusChip,
  WorkTypeChip,
} from "@/components/chips";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getMe } from "@/lib/fns/app";
import {
  addTestRun,
  addWorkComment,
  getWorkItem,
  recordDecision,
  transitionWork,
  updateWorkItem,
} from "@/lib/fns/work";
import { absDate, relTime } from "@/lib/format";
import {
  COMMENT_KIND_LABEL,
  label,
  t,
  WORK_STATUS_LABEL,
} from "@/lib/i18n";
import { useLocale } from "@/lib/locale-store";
import { computeScore } from "@/lib/scoring";
import type {
  Attachment,
  Comment,
  Decision,
  Profile,
  StatusTransition,
  TestRun,
  WorkItem,
  WorkStatus,
} from "@/lib/types";
import { DECISION_KINDS } from "@/lib/types";
import { nextWorkStatuses } from "@/lib/workflow";

export const Route = createFileRoute("/ops/eng/$id")({ component: WorkDetail });

function WorkDetail() {
  const { id } = Route.useParams();
  const locale = useLocale((s) => s.locale);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [item, setItem] = useState<WorkItem | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [transitions, setTransitions] = useState<StatusTransition[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [tests, setTests] = useState<TestRun[]>([]);
  const [linked, setLinked] = useState<{ ticket_id: string; reason: string | null }[]>([]);
  const [body, setBody] = useState("");
  const [kind, setKind] = useState<Comment["kind"]>("note");
  const [dKind, setDKind] = useState<Decision["kind"]>("approve");
  const [rationale, setRationale] = useState("");
  const [testTitle, setTestTitle] = useState("Acceptance pass");
  const [testResult, setTestResult] = useState("pass");
  const [testEvidence, setTestEvidence] = useState("");
  const [reason, setReason] = useState("");

  const load = useCallback(async () => {
    const [me, data] = await Promise.all([getMe(), getWorkItem({ data: id })]);
    setProfile(me.profile);
    if (!data) {
      setItem(null);
      return;
    }
    setItem(data.item);
    setComments(data.comments);
    setDecisions(data.decisions);
    setTransitions(data.transitions);
    setAttachments(data.attachments);
    setTests(data.tests);
    setLinked(data.linkedTickets);
  }, [id]);

  useEffect(() => {
    void load().catch((err) => toast.error(String(err)));
  }, [load]);

  if (!item) {
    return <p className="text-sm text-muted">{t(locale, "loading")}</p>;
  }

  const next = profile ? nextWorkStatuses(item.status, profile.role) : [];
  const score = computeScore(item);

  return (
    <div className="pb-24">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <IdChip id={item.id} />
            <PriorityBadge value={item.priority} />
            <WorkTypeChip type={item.type} locale={locale} />
            <WorkStatusChip status={item.status} locale={locale} />
          </div>
          <h1 className="serif max-w-3xl text-3xl sm:text-4xl">{item.title}</h1>
          <p className="mt-2 text-sm text-muted">
            {item.product_module} · {item.environment} · {item.owner_name ?? "—"}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface px-4 py-3 text-right">
          <p className="text-[10px] tracking-wide text-muted uppercase">{t(locale, "score")}</p>
          <p className="font-mono text-3xl tabular-nums">{score}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-3 text-xs tracking-[0.16em] text-subtle uppercase">Problem</h2>
            <dl className="space-y-3 text-sm">
              <Row k={t(locale, "expected")} v={item.expected_behavior} />
              <Row k={t(locale, "whatHappened")} v={item.actual_behavior} />
              <Row k={t(locale, "steps")} v={item.steps_to_reproduce} />
              <Row k={t(locale, "rationale")} v={item.priority_rationale} />
              <Row k={t(locale, "acceptance")} v={item.acceptance_criteria} />
              {item.blocked ? <Row k={t(locale, "blocked")} v={item.blocker_note} /> : null}
            </dl>
          </section>

          {attachments.length > 0 ? (
            <section className="rounded-xl border border-border bg-surface p-5">
              <h2 className="mb-3 text-xs tracking-[0.16em] text-subtle uppercase">{t(locale, "evidence")}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {attachments.map((a) => (
                  <figure key={a.id} className="overflow-hidden rounded-md border border-border">
                    {a.data_url ? (
                      <img src={a.data_url} alt={a.caption ?? a.filename} className="max-h-56 w-full object-cover" />
                    ) : (
                      <div className="px-3 py-6 text-center text-xs text-muted">{a.filename}</div>
                    )}
                    {a.caption ? <figcaption className="px-3 py-2 text-xs text-muted">{a.caption}</figcaption> : null}
                  </figure>
                ))}
              </div>
            </section>
          ) : null}

          {linked.length > 0 ? (
            <section className="rounded-xl border border-border bg-surface p-5">
              <h2 className="mb-2 text-xs tracking-[0.16em] text-subtle uppercase">{t(locale, "linkedTicket")}</h2>
              <p className="mb-2 text-xs text-subtle">{t(locale, "tracksNeverMix")}</p>
              {linked.map((l) => (
                <Link key={l.ticket_id} to="/ops/desk/$id" params={{ id: l.ticket_id }} className="block font-mono text-sm hover:text-accent">
                  {l.ticket_id}
                  {l.reason ? <span className="ml-2 font-sans text-muted">{l.reason}</span> : null}
                </Link>
              ))}
            </section>
          ) : null}

          <section className="rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-3 text-xs tracking-[0.16em] text-subtle uppercase">{t(locale, "decide")}</h2>
            <div className="grid gap-2 sm:grid-cols-[140px_1fr_auto]">
              <Select value={dKind} onChange={(e) => setDKind(e.target.value as Decision["kind"])}>
                {DECISION_KINDS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </Select>
              <Input value={rationale} onChange={(e) => setRationale(e.target.value)} placeholder={t(locale, "rationale")} />
              <Button
                variant="secondary"
                onClick={() => {
                  void recordDecision({ data: { id: item.id, kind: dKind, rationale } })
                    .then(() => {
                      setRationale("");
                      return load();
                    })
                    .catch((err) => toast.error(err instanceof Error ? err.message : "Denied"));
                }}
              >
                {t(locale, "recordDecision")}
              </Button>
            </div>
            <ul className="mt-4 space-y-3">
              {decisions.map((d) => (
                <li key={d.id} className="border-t border-border pt-3 text-sm">
                  <p className="text-xs text-muted">
                    {d.kind} · {d.approver_name} · {relTime(d.created_at, locale)}
                  </p>
                  <p className="mt-1">{d.rationale}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-3 text-xs tracking-[0.16em] text-subtle uppercase">{t(locale, "qaEvidence")}</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              <Input value={testTitle} onChange={(e) => setTestTitle(e.target.value)} />
              <Select value={testResult} onChange={(e) => setTestResult(e.target.value)}>
                <option value="pass">pass</option>
                <option value="fail">fail</option>
                <option value="blocked">blocked</option>
              </Select>
            </div>
            <Textarea className="mt-2" value={testEvidence} onChange={(e) => setTestEvidence(e.target.value)} placeholder={t(locale, "evidence")} />
            <Button
              className="mt-2"
              variant="secondary"
              onClick={() => {
                void addTestRun({
                  data: { id: item.id, title: testTitle, result: testResult, evidence: testEvidence },
                })
                  .then(load)
                  .catch((err) => toast.error(err instanceof Error ? err.message : "Denied"));
              }}
            >
              {t(locale, "submit")}
            </Button>
            <ul className="mt-4 space-y-2 text-sm">
              {tests.map((tr) => (
                <li key={tr.id} className="rounded-md border border-border px-3 py-2">
                  <p>
                    {tr.result} · {tr.title} · {tr.tester_name}
                  </p>
                  {tr.evidence ? <p className="text-xs text-muted">{tr.evidence}</p> : null}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-3 text-xs tracking-[0.16em] text-subtle uppercase">{t(locale, "comment")}</h2>
            <div className="space-y-4">
              {[...transitions.map((x) => ({ kind: "transition" as const, at: x.created_at, x })), ...comments.map((x) => ({ kind: "comment" as const, at: x.created_at, x }))]
                .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())
                .map((entry) =>
                  entry.kind === "transition" ? (
                    <div key={entry.x.id} className="text-xs text-muted">
                      {entry.x.actor_name}: {entry.x.from_status ?? "∅"} → {label(WORK_STATUS_LABEL, entry.x.to_status, locale)}
                      {entry.x.reason ? ` — ${entry.x.reason}` : ""} · {relTime(entry.at, locale)}
                    </div>
                  ) : (
                    <div key={entry.x.id}>
                      <p className="text-xs text-muted">
                        {entry.x.author_name} · {label(COMMENT_KIND_LABEL, entry.x.kind, locale)} · {relTime(entry.at, locale)}
                      </p>
                      <p className="mt-1 text-sm">{entry.x.body}</p>
                    </div>
                  ),
                )}
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-[140px_1fr_auto]">
              <Select value={kind} onChange={(e) => setKind(e.target.value as Comment["kind"])}>
                {["note", "question", "answer", "risk", "evidence"].map((k) => (
                  <option key={k} value={k}>
                    {label(COMMENT_KIND_LABEL, k, locale)}
                  </option>
                ))}
              </Select>
              <Input value={body} onChange={(e) => setBody(e.target.value)} />
              <Button
                variant="secondary"
                onClick={() => {
                  void addWorkComment({ data: { id: item.id, body, kind } }).then(() => {
                    setBody("");
                    return load();
                  });
                }}
              >
                {t(locale, "addComment")}
              </Button>
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-xl border border-border bg-surface p-4">
            <p className="mb-2 text-[11px] tracking-wide text-muted uppercase">{t(locale, "nextAction")}</p>
            <Field label={t(locale, "status")}>
              <Select
                value=""
                onChange={(e) => {
                  const to = e.target.value as WorkStatus;
                  if (!to) return;
                  void transitionWork({ data: { id: item.id, to, reason } })
                    .then(load)
                    .catch((err) => toast.error(err instanceof Error ? err.message : "Denied"));
                }}
              >
                <option value="">{label(WORK_STATUS_LABEL, item.status, locale)}</option>
                {next.map((s) => (
                  <option key={s} value={s}>
                    {label(WORK_STATUS_LABEL, s, locale)}
                  </option>
                ))}
              </Select>
            </Field>
            <Input className="mt-2" placeholder={t(locale, "rationale")} value={reason} onChange={(e) => setReason(e.target.value)} />
          </section>
          <section className="rounded-xl border border-border bg-surface p-4 text-sm">
            <p className="mb-2 text-[11px] tracking-wide text-muted uppercase">{t(locale, "owner")}</p>
            <p>{item.owner_name ?? "—"}</p>
            <p className="mt-3 text-[11px] tracking-wide text-muted uppercase">{t(locale, "assignee")}</p>
            <p>{item.assignee_name ?? "—"}</p>
            <p className="mt-3 text-[11px] tracking-wide text-muted uppercase">{t(locale, "effort")}</p>
            <p className="font-mono tabular-nums">{item.effort} · {item.confidence}</p>
            <p className="mt-3 text-[11px] tracking-wide text-muted uppercase">{t(locale, "updated")}</p>
            <p className="text-muted">{absDate(item.updated_at)}</p>
            {item.pr_url ? (
              <a href={item.pr_url} className="mt-3 block text-xs text-accent" target="_blank" rel="noreferrer">
                {item.pr_url}
              </a>
            ) : null}
            <Button
              className="mt-4 w-full"
              variant="secondary"
              onClick={() => {
                void updateWorkItem({
                  data: { id: item.id, patch: { blocked: !item.blocked, blocker_note: item.blocked ? null : "Flagged from detail" } },
                }).then(load);
              }}
            >
              {item.blocked ? "Unblock" : t(locale, "blocked")}
            </Button>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string | null | undefined }) {
  if (!v) return null;
  return (
    <div>
      <dt className="text-xs text-muted">{k}</dt>
      <dd className="mt-1 whitespace-pre-wrap">{v}</dd>
    </div>
  );
}
