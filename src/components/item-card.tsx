import { Link } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import {
  IdChip,
  PriorityBadge,
  TicketCatChip,
  TicketPriorityBadge,
  TicketStatusChip,
  WorkStatusChip,
  WorkTypeChip,
} from "@/components/chips";
import { relTime } from "@/lib/format";
import { agingHoursForWork, isAging } from "@/lib/scoring";
import type { Locale } from "@/lib/i18n";
import type { Ticket, WorkItem } from "@/lib/types";

export function WorkCard({ item, locale }: { item: WorkItem; locale: Locale }) {
  const aging = isAging(item.last_transition_at, agingHoursForWork(item.priority));
  return (
    <Link
      to="/ops/eng/$id"
      params={{ id: item.id }}
      className="block rounded-lg border border-border bg-surface p-4 transition-colors duration-150 hover:border-border-strong hover:bg-surface-2"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <IdChip id={item.id} />
            <PriorityBadge value={item.priority} />
            <WorkTypeChip type={item.type} locale={locale} />
            <WorkStatusChip status={item.status} locale={locale} />
            {item.blocked ? (
              <span className="inline-flex items-center gap-1 text-[11px] text-p0">
                <AlertTriangle className="size-3" />
                blocked
              </span>
            ) : null}
            {aging ? <span className="text-[11px] text-p1">aging</span> : null}
          </div>
          <p className="text-sm font-medium leading-snug">{item.title}</p>
          <p className="mt-1 truncate text-xs text-muted">
            {item.product_module}
            {item.assignee_name ? ` · ${item.assignee_name}` : ""}
            {item.owner_name ? ` · ${item.owner_name}` : ""}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-lg tabular-nums text-accent">{item.computed_score}</p>
          <p className="text-[10px] text-subtle">{relTime(item.updated_at, locale)}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {item.flag_growth ? <Flag>growth</Flag> : null}
        {item.flag_retention ? <Flag>retention</Flag> : null}
        {item.flag_payment ? <Flag>payment</Flag> : null}
        {item.flag_stability ? <Flag>stability</Flag> : null}
        {item.flag_network ? <Flag>network</Flag> : null}
      </div>
    </Link>
  );
}

export function TicketCard({
  ticket,
  locale,
  href,
}: {
  ticket: Ticket;
  locale: Locale;
  href: "desk" | "portal";
}) {
  const slaBreached =
    Boolean(ticket.sla_due_at) &&
    new Date(ticket.sla_due_at as string).getTime() < Date.now() &&
    !["resolved", "closed", "duplicate"].includes(ticket.status);
  const inner = (
    <>
      <div className="mb-1.5 flex flex-wrap items-center gap-2">
        <IdChip id={ticket.id} />
        <TicketPriorityBadge value={ticket.priority} />
        <TicketCatChip category={ticket.category} locale={locale} />
        <TicketStatusChip status={ticket.status} locale={locale} />
        {slaBreached ? <span className="text-[11px] text-p0">SLA</span> : null}
      </div>
      <p className="text-sm font-medium leading-snug">{ticket.subject}</p>
      <p className="mt-1 truncate text-xs text-muted">
        {ticket.customer_name ?? "—"}
        {ticket.device ? ` · ${ticket.device}` : ""}
        {ticket.assignee_name ? ` · ${ticket.assignee_name}` : ""}
      </p>
      <p className="mt-2 text-[10px] text-subtle">{relTime(ticket.updated_at, locale)}</p>
    </>
  );
  const cls =
    "block rounded-lg border border-border bg-surface p-4 transition-colors duration-150 hover:border-border-strong hover:bg-surface-2";
  if (href === "portal") {
    return (
      <Link to="/portal/$id" params={{ id: ticket.id }} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <Link to="/ops/desk/$id" params={{ id: ticket.id }} className={cls}>
      {inner}
    </Link>
  );
}

function Flag({ children }: { children: string }) {
  return (
    <span className="rounded-full bg-bg px-2 py-0.5 text-[10px] tracking-wide text-subtle">{children}</span>
  );
}

export function EmptyState({ title, body }: { title: string; body?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
      <p className="serif text-xl">{title}</p>
      {body ? <p className="mx-auto mt-2 max-w-md text-sm text-muted">{body}</p> : null}
    </div>
  );
}
