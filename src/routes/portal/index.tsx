import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { EmptyState, TicketCard } from "@/components/item-card";
import { Button } from "@/components/ui/button";
import { listTickets } from "@/lib/fns/tickets";
import { t } from "@/lib/i18n";
import { useLocale } from "@/lib/locale-store";
import type { Ticket } from "@/lib/types";

export const Route = createFileRoute("/portal/")({ component: PortalHome });

function PortalHome() {
  const locale = useLocale((s) => s.locale);
  const [rows, setRows] = useState<Ticket[]>([]);
  useEffect(() => {
    void listTickets({ data: { portal: true } }).then(setRows);
  }, []);
  return (
    <div className="pb-20">
      <PageHeader
        kicker={t(locale, "portal")}
        title={t(locale, "myTickets")}
        description={t(locale, "portalBlurb")}
        actions={
          <Button asChild>
            <Link to="/portal/new">{t(locale, "reportIssue")}</Link>
          </Button>
        }
      />
      <div className="space-y-2">
        {rows.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} locale={locale} href="portal" />
        ))}
        {rows.length === 0 ? (
          <EmptyState title={t(locale, "emptyPortal")} body={t(locale, "portalBlurb")} />
        ) : null}
      </div>
    </div>
  );
}
