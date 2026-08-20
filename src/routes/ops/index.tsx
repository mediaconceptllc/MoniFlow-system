import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, Kpi, PageHeader } from "@/components/app-shell";
import { EmptyState, TicketCard, WorkCard } from "@/components/item-card";
import { getKpis } from "@/lib/fns/app";
import { listWorkItems } from "@/lib/fns/work";
import { listTickets } from "@/lib/fns/tickets";
import { t } from "@/lib/i18n";
import { useLocale } from "@/lib/locale-store";
import type { KpiSnapshot, Ticket, WorkItem } from "@/lib/types";
import { agingHoursForWork, isAging } from "@/lib/scoring";

void AppShell;

export const Route = createFileRoute("/ops/")({ component: CommandCenter });

function CommandCenter() {
  const locale = useLocale((s) => s.locale);
  const [kpi, setKpi] = useState<KpiSnapshot | null>(null);
  const [work, setWork] = useState<WorkItem[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    void getKpis().then(setKpi);
    void listWorkItems({ data: {} }).then(setWork);
    void listTickets({ data: {} }).then(setTickets);
  }, []);

  const p0 = work.filter(
    (w) => (w.priority === "P0" || w.priority === "P1") && !["closed", "rejected", "duplicate", "verified"].includes(w.status),
  );
  const aging = work.filter(
    (w) =>
      !["closed", "rejected", "duplicate", "verified"].includes(w.status) &&
      isAging(w.last_transition_at, agingHoursForWork(w.priority)),
  );
  const openTickets = tickets.filter((tck) => !["closed", "resolved", "duplicate"].includes(tck.status));

  return (
    <div className="pb-16">
      <PageHeader
        kicker={t(locale, "welcomeBack")}
        title={t(locale, "command")}
        description={t(locale, "tagline")}
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label={t(locale, "openWork")} value={kpi?.openWork ?? "—"} />
        <Kpi label="P0 / P1" value={(kpi?.p0 ?? 0) + "/" + (kpi?.p1 ?? 0)} tone="danger" />
        <Kpi label={t(locale, "openTickets")} value={kpi?.openTickets ?? "—"} tone="warn" />
        <Kpi label={t(locale, "slaBreach")} value={kpi?.slaBreached ?? "—"} tone={(kpi?.slaBreached ?? 0) > 0 ? "danger" : "ok"} />
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label={t(locale, "untriaged")} value={kpi?.untriaged ?? "—"} />
        <Kpi label={t(locale, "blocked")} value={kpi?.blocked ?? "—"} />
        <Kpi label={t(locale, "aging")} value={kpi?.overdue ?? "—"} />
        <Kpi label={t(locale, "escalated")} value={kpi?.escalatedTickets ?? "—"} />
      </div>

      {kpi ? (
        <div className="mt-8">
          <p className="mb-3 text-[11px] tracking-[0.16em] text-subtle uppercase">{t(locale, "strategic")}</p>
          <div className="grid grid-cols-5 gap-2">
            {(
              [
                [t(locale, "growth"), kpi.strategicMix.growth],
                [t(locale, "retention"), kpi.strategicMix.retention],
                [t(locale, "payment"), kpi.strategicMix.payment],
                [t(locale, "stability"), kpi.strategicMix.stability],
                [t(locale, "polish"), kpi.strategicMix.polish],
              ] as const
            ).map(([lab, n]) => (
              <div key={lab} className="rounded-md border border-border px-3 py-3">
                <p className="text-[10px] text-muted">{lab}</p>
                <p className="font-mono text-xl tabular-nums">{n}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-track-eng" />
              <h2 className="serif text-2xl">{t(locale, "p0pin")}</h2>
            </div>
            <Link to="/ops/eng" className="text-xs text-muted hover:text-fg">
              {t(locale, "viewAll")}
            </Link>
          </div>
          <div className="space-y-2">
            {p0.slice(0, 5).map((item) => (
              <WorkCard key={item.id} item={item} locale={locale} />
            ))}
            {p0.length === 0 ? <EmptyState title={t(locale, "emptyEng")} /> : null}
          </div>
          {aging.length > 0 ? (
            <p className="mt-3 text-xs text-p1">
              {t(locale, "agingAlert")}: {aging.length}
            </p>
          ) : null}
        </section>
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-track-desk" />
              <h2 className="serif text-2xl">{t(locale, "inbox")}</h2>
            </div>
            <Link to="/ops/desk" className="text-xs text-muted hover:text-fg">
              {t(locale, "viewAll")}
            </Link>
          </div>
          <div className="space-y-2">
            {openTickets.slice(0, 5).map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} locale={locale} href="desk" />
            ))}
            {openTickets.length === 0 ? <EmptyState title={t(locale, "emptyDesk")} /> : null}
          </div>
        </section>
      </div>
    </div>
  );
}
