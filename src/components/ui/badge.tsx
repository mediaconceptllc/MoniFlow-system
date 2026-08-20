import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "muted",
  children,
}: {
  className?: string;
  tone?: "muted" | "p0" | "p1" | "p2" | "p3" | "ok" | "warn" | "danger" | "eng" | "desk";
  children: ReactNode;
}) {
  const tones: Record<string, string> = {
    muted: "bg-surface-2 text-muted",
    p0: "bg-p0/15 text-p0",
    p1: "bg-p1/15 text-p1",
    p2: "bg-p2/15 text-p2",
    p3: "bg-surface-2 text-subtle",
    ok: "bg-ok/15 text-ok",
    warn: "bg-warn/15 text-warn",
    danger: "bg-danger/15 text-danger",
    eng: "bg-track-eng/15 text-track-eng",
    desk: "bg-track-desk/15 text-track-desk",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function PriorityBadge({ value }: { value: string }) {
  const tone = value.toLowerCase();
  const mapped = ["p0", "p1", "p2", "p3"].includes(tone)
    ? (tone as "p0" | "p1" | "p2" | "p3")
    : "muted";
  return <Badge tone={mapped}>{value}</Badge>;
}

export function TicketPriorityBadge({ value }: { value: string }) {
  const map: Record<string, "danger" | "warn" | "p2" | "muted"> = {
    urgent: "danger",
    high: "warn",
    normal: "p2",
    low: "muted",
  };
  return <Badge tone={map[value] ?? "muted"}>{value}</Badge>;
}
