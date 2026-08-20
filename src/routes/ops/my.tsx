import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { EmptyState, TicketCard, WorkCard } from "@/components/item-card";
import { listWorkItems } from "@/lib/fns/work";
import { listTickets } from "@/lib/fns/tickets";
import { t } from "@/lib/i18n";
import { useLocale } from "@/lib/locale-store";
import type { Ticket, WorkItem } from "@/lib/types";

export const Route = createFileRoute("/ops/my")({ component: MyWork });

function MyWork() {
  const locale = useLocale((s) => s.locale);
  const [work, setWork] = useState<WorkItem[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  useEffect(() => {
    void listWorkItems({ data: { mine: true } }).then(setWork);
    void listTickets({ data: { mine: true } }).then(setTickets);
  }, []);
  return (
    <div className="pb-16">
      <PageHeader kicker={t(locale, "welcomeBack")} title={t(locale, "myWork")} />
      <div className="grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 serif text-2xl">{t(locale, "engineering")}</h2>
          <div className="space-y-2">
            {work.map((item) => (
              <WorkCard key={item.id} item={item} locale={locale} />
            ))}
            {work.length === 0 ? <EmptyState title={t(locale, "emptyEng")} /> : null}
          </div>
        </section>
        <section>
          <h2 className="mb-3 serif text-2xl">{t(locale, "helpdesk")}</h2>
          <div className="space-y-2">
            {tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} locale={locale} href="desk" />
            ))}
            {tickets.length === 0 ? <EmptyState title={t(locale, "emptyDesk")} /> : null}
          </div>
        </section>
      </div>
    </div>
  );
}
