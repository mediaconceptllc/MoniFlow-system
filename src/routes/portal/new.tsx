import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { TicketForm } from "@/components/ticket-form";
import { createTicket } from "@/lib/fns/tickets";
import { t } from "@/lib/i18n";
import { useLocale } from "@/lib/locale-store";

export const Route = createFileRoute("/portal/new")({ component: PortalNew });

function PortalNew() {
  const locale = useLocale((s) => s.locale);
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  return (
    <div className="mx-auto max-w-xl pb-20">
      <PageHeader
        kicker={t(locale, "portal")}
        title={t(locale, "reportIssue")}
        description={t(locale, "portalBlurb")}
      />
      <div className="rounded-xl border border-border bg-surface p-5">
        <TicketForm
          locale={locale}
          busy={busy}
          onSubmit={async (data) => {
            setBusy(true);
            try {
              const res = await createTicket({ data });
              toast.success(res.id);
              await navigate({ to: "/portal/$id", params: { id: res.id } });
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Failed");
            } finally {
              setBusy(false);
            }
          }}
        />
      </div>
    </div>
  );
}
