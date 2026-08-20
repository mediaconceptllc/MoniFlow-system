import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { EmptyState, TicketCard } from "@/components/item-card";
import { TicketForm } from "@/components/ticket-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { createTicket, listTickets } from "@/lib/fns/tickets";
import { t } from "@/lib/i18n";
import { useLocale } from "@/lib/locale-store";
import { TICKET_CATEGORIES, TICKET_PRIORITIES, TICKET_STATUSES, type Ticket } from "@/lib/types";

export const Route = createFileRoute("/ops/desk/")({ component: DeskInbox });

function DeskInbox() {
  const locale = useLocale((s) => s.locale);
  const [rows, setRows] = useState<Ticket[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [priority, setPriority] = useState("all");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function reload() {
    setRows(await listTickets({ data: { q, status, category, priority } }));
  }
  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, status, category, priority]);

  return (
    <div className="pb-20">
      <PageHeader
        kicker={t(locale, "helpdesk")}
        title={t(locale, "inbox")}
        description={t(locale, "tracksNeverMix")}
        actions={<Button onClick={() => setOpen(true)}>{t(locale, "newTicket")}</Button>}
      />
      <div className="mb-5 grid gap-2 sm:grid-cols-4">
        <Input placeholder={t(locale, "search")} value={q} onChange={(e) => setQ(e.target.value)} />
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">{t(locale, "status")}</option>
          {TICKET_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">{t(locale, "category")}</option>
          {TICKET_CATEGORIES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="all">{t(locale, "priority")}</option>
          {TICKET_PRIORITIES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-2">
        {rows.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} locale={locale} href="desk" />
        ))}
        {rows.length === 0 ? (
          <EmptyState title={t(locale, "emptyDesk")} body={t(locale, "tracksNeverMix")} />
        ) : null}
      </div>
      <Modal open={open} onOpenChange={setOpen} title={t(locale, "newTicket")}>
        <TicketForm
          locale={locale}
          busy={busy}
          showPriority
          onSubmit={async (data) => {
            setBusy(true);
            try {
              const res = await createTicket({ data });
              toast.success(res.id);
              setOpen(false);
              await reload();
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Failed");
            } finally {
              setBusy(false);
            }
          }}
        />
      </Modal>
    </div>
  );
}
