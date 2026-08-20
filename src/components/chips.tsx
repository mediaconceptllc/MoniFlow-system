import {
  label,
  type Locale,
  TICKET_CAT_LABEL,
  TICKET_STATUS_LABEL,
  WORK_STATUS_LABEL,
  WORK_TYPE_LABEL,
} from "@/lib/i18n";
import { Badge, PriorityBadge, TicketPriorityBadge } from "@/components/ui/badge";

export { PriorityBadge, TicketPriorityBadge };

export function WorkStatusChip({ status, locale }: { status: string; locale: Locale }) {
  const tone =
    status === "qa_failed" || status === "rejected"
      ? "danger"
      : status === "released" || status === "verified" || status === "closed"
        ? "ok"
        : status === "ready_for_qa" || status === "ready_for_release"
          ? "warn"
          : "muted";
  return <Badge tone={tone}>{label(WORK_STATUS_LABEL, status, locale)}</Badge>;
}

export function TicketStatusChip({ status, locale }: { status: string; locale: Locale }) {
  const tone =
    status === "escalated"
      ? "warn"
      : status === "resolved" || status === "closed"
        ? "ok"
        : status === "new"
          ? "danger"
          : "muted";
  return <Badge tone={tone}>{label(TICKET_STATUS_LABEL, status, locale)}</Badge>;
}

export function WorkTypeChip({ type, locale }: { type: string; locale: Locale }) {
  return <Badge tone="eng">{label(WORK_TYPE_LABEL, type, locale)}</Badge>;
}

export function TicketCatChip({ category, locale }: { category: string; locale: Locale }) {
  return <Badge tone="desk">{label(TICKET_CAT_LABEL, category, locale)}</Badge>;
}

export function IdChip({ id }: { id: string }) {
  return <span className="font-mono text-[11px] tracking-wide text-muted tabular-nums">{id}</span>;
}
