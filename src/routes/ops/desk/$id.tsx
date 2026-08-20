import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { IdChip, TicketCatChip, TicketPriorityBadge, TicketStatusChip } from "@/components/chips";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getMe } from "@/lib/fns/app";
import {
  addTicketComment,
  assignTicket,
  escalateTicket,
  getTicket,
  transitionTicket,
} from "@/lib/fns/tickets";
import { absDate, relTime } from "@/lib/format";
import { label, t, TICKET_STATUS_LABEL } from "@/lib/i18n";
import { useLocale } from "@/lib/locale-store";
import type { Attachment, Comment, Profile, StatusTransition, Ticket, TicketStatus } from "@/lib/types";
import { canEscalate, nextTicketStatuses } from "@/lib/workflow";

export const Route = createFileRoute("/ops/desk/$id")({ component: TicketDetail });

function TicketDetail() {
  const { id } = Route.useParams();
  const locale = useLocale((s) => s.locale);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [transitions, setTransitions] = useState<StatusTransition[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [links, setLinks] = useState<{ work_item_id: string; reason: string | null; title: string; status: string }[]>([]);
  const [body, setBody] = useState("");
  const [esc, setEsc] = useState("");
  const [reason, setReason] = useState("");

  const load = useCallback(async () => {
    const [me, data] = await Promise.all([getMe(), getTicket({ data: id })]);
    setProfile(me.profile);
    if (!data) {
      setTicket(null);
      return;
    }
    setTicket(data.ticket);
    setComments(data.comments);
    setTransitions(data.transitions);
    setAttachments(data.attachments);
    setLinks(data.links);
  }, [id]);

  useEffect(() => {
    void load().catch((err) => toast.error(String(err)));
  }, [load]);

  if (!ticket) return <p className="text-sm text-muted">{t(locale, "loading")}</p>;

  const next = profile ? nextTicketStatuses(ticket.status, profile.role) : [];
  const slaBreached =
    ticket.sla_due_at &&
    new Date(ticket.sla_due_at).getTime() < Date.now() &&
    !["resolved", "closed", "duplicate"].includes(ticket.status);

  return (
    <div className="pb-24">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <IdChip id={ticket.id} />
        <TicketPriorityBadge value={ticket.priority} />
        <TicketCatChip category={ticket.category} locale={locale} />
        <TicketStatusChip status={ticket.status} locale={locale} />
        {slaBreached ? <span className="text-xs text-p0">SLA</span> : null}
      </div>
      <h1 className="serif max-w-3xl text-3xl sm:text-4xl">{ticket.subject}</h1>
      <p className="mt-2 text-sm text-muted">
        {t(locale, "customer")}: {ticket.customer_name} · {ticket.customer_email}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-surface p-5">
            <p className="whitespace-pre-wrap text-sm">{ticket.body}</p>
            {ticket.expected_behavior ? (
              <p className="mt-4 text-sm text-muted">
                {t(locale, "expected")}: {ticket.expected_behavior}
              </p>
            ) : null}
          </section>

          {attachments.length > 0 ? (
            <section className="rounded-xl border border-border bg-surface p-5">
              {attachments.map((a) =>
                a.data_url ? (
                  <img key={a.id} src={a.data_url} alt={a.filename} className="max-h-64 rounded-md" />
                ) : (
                  <p key={a.id} className="text-sm">
                    {a.filename}
                  </p>
                ),
              )}
            </section>
          ) : null}

          {links.length > 0 ? (
            <section className="rounded-xl border border-border bg-surface p-5">
              <h2 className="mb-2 text-xs tracking-[0.16em] text-subtle uppercase">{t(locale, "linkedWork")}</h2>
              <p className="mb-3 text-xs text-subtle">{t(locale, "tracksNeverMix")}</p>
              {links.map((l) => (
                <Link
                  key={l.work_item_id}
                  to="/ops/eng/$id"
                  params={{ id: l.work_item_id }}
                  className="block rounded-md border border-border px-3 py-2 text-sm hover:bg-surface-2"
                >
                  <span className="font-mono text-xs">{l.work_item_id}</span>
                  <span className="ml-2">{l.title}</span>
                </Link>
              ))}
            </section>
          ) : null}

          <section className="rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-3 text-xs tracking-[0.16em] text-subtle uppercase">{t(locale, "comment")}</h2>
            <div className="space-y-3">
              {comments.map((c) => (
                <div key={c.id}>
                  <p className="text-xs text-muted">
                    {c.author_name} · {relTime(c.created_at, locale)}
                  </p>
                  <p className="mt-1 text-sm">{c.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Input value={body} onChange={(e) => setBody(e.target.value)} />
              <Button
                variant="secondary"
                onClick={() => {
                  void addTicketComment({ data: { id: ticket.id, body } }).then(() => {
                    setBody("");
                    return load();
                  });
                }}
              >
                {t(locale, "addComment")}
              </Button>
            </div>
          </section>

          {profile && canEscalate(profile.role) ? (
            <section className="rounded-xl border border-border bg-surface p-5">
              <h2 className="mb-2 text-xs tracking-[0.16em] text-subtle uppercase">{t(locale, "escalate")}</h2>
              <p className="mb-3 text-xs text-muted">{t(locale, "tracksNeverMix")}</p>
              <Textarea value={esc} onChange={(e) => setEsc(e.target.value)} rows={2} />
              <Button
                className="mt-2"
                onClick={() => {
                  void escalateTicket({ data: { id: ticket.id, reason: esc } })
                    .then((r) => {
                      toast.success(r.workId);
                      return load();
                    })
                    .catch((err) => toast.error(err instanceof Error ? err.message : "Denied"));
                }}
              >
                {t(locale, "escalate")}
              </Button>
            </section>
          ) : null}
        </div>

        <aside className="space-y-4">
          <section className="rounded-xl border border-border bg-surface p-4">
            <Field label={t(locale, "status")}>
              <Select
                value=""
                onChange={(e) => {
                  const to = e.target.value as TicketStatus;
                  if (!to) return;
                  void transitionTicket({ data: { id: ticket.id, to, reason } })
                    .then(load)
                    .catch((err) => toast.error(err instanceof Error ? err.message : "Denied"));
                }}
              >
                <option value="">{label(TICKET_STATUS_LABEL, ticket.status, locale)}</option>
                {next.map((s) => (
                  <option key={s} value={s}>
                    {label(TICKET_STATUS_LABEL, s, locale)}
                  </option>
                ))}
              </Select>
            </Field>
            <Input className="mt-2" value={reason} onChange={(e) => setReason(e.target.value)} placeholder={t(locale, "rationale")} />
            <Button
              className="mt-3 w-full"
              variant="secondary"
              onClick={() => {
                if (!profile) return;
                void assignTicket({
                  data: { id: ticket.id, assigneeName: profile.display_name, assigneeId: profile.id },
                }).then(load);
              }}
            >
              {locale === "mn" ? "Надад оноох" : "Assign to me"}
            </Button>
          </section>
          <section className="rounded-xl border border-border bg-surface p-4 text-sm">
            <p className="text-[11px] text-muted uppercase">{t(locale, "device")}</p>
            <p>
              {ticket.device ?? "—"} · {ticket.os_name ?? "—"}
            </p>
            <p className="mt-3 text-[11px] text-muted uppercase">{t(locale, "version")}</p>
            <p>{ticket.app_version ?? "—"}</p>
            <p className="mt-3 text-[11px] text-muted uppercase">SLA</p>
            <p>{ticket.sla_due_at ? absDate(ticket.sla_due_at) : "—"}</p>
            <p className="mt-3 text-[11px] text-muted uppercase">{t(locale, "assignee")}</p>
            <p>{ticket.assignee_name ?? "—"}</p>
          </section>
          {transitions.length > 0 ? (
            <section className="rounded-xl border border-border bg-surface p-4 text-xs text-muted">
              {transitions.map((tr) => (
                <p key={tr.id} className="mb-2">
                  {tr.from_status ?? "∅"} → {tr.to_status} · {tr.actor_name}
                </p>
              ))}
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
