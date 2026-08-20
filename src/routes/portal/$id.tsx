import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { IdChip, TicketCatChip, TicketStatusChip } from "@/components/chips";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addTicketComment, getTicket } from "@/lib/fns/tickets";
import { relTime } from "@/lib/format";
import { t } from "@/lib/i18n";
import { useLocale } from "@/lib/locale-store";
import type { Comment, Ticket } from "@/lib/types";

export const Route = createFileRoute("/portal/$id")({ component: PortalTicket });

function PortalTicket() {
  const { id } = Route.useParams();
  const locale = useLocale((s) => s.locale);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");

  const load = useCallback(async () => {
    const data = await getTicket({ data: id });
    if (!data) {
      setTicket(null);
      return;
    }
    setTicket(data.ticket);
    setComments(data.comments);
  }, [id]);

  useEffect(() => {
    void load().catch((err) => toast.error(String(err)));
  }, [load]);

  if (!ticket) return <p className="text-sm text-muted">{t(locale, "loading")}</p>;

  return (
    <div className="mx-auto max-w-2xl pb-20">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <IdChip id={ticket.id} />
        <TicketCatChip category={ticket.category} locale={locale} />
        <TicketStatusChip status={ticket.status} locale={locale} />
      </div>
      <h1 className="serif text-3xl">{ticket.subject}</h1>
      <p className="mt-4 whitespace-pre-wrap text-sm">{ticket.body}</p>
      <section className="mt-8 space-y-3">
        {comments.map((c) => (
          <div key={c.id} className="rounded-lg border border-border bg-surface p-3">
            <p className="text-xs text-muted">
              {c.author_name} · {relTime(c.created_at, locale)}
            </p>
            <p className="mt-1 text-sm">{c.body}</p>
          </div>
        ))}
      </section>
      <div className="mt-4 flex gap-2">
        <Input value={body} onChange={(e) => setBody(e.target.value)} />
        <Button
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
    </div>
  );
}
