import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { EmptyState, WorkCard } from "@/components/item-card";
import { listWorkItems } from "@/lib/fns/work";
import { t } from "@/lib/i18n";
import { useLocale } from "@/lib/locale-store";
import type { WorkItem } from "@/lib/types";

export const Route = createFileRoute("/ops/qa")({ component: QaQueue });

function QaQueue() {
  const locale = useLocale((s) => s.locale);
  const [items, setItems] = useState<WorkItem[]>([]);
  useEffect(() => {
    void listWorkItems({ data: {} }).then((rows) =>
      setItems(rows.filter((r) => ["ready_for_qa", "qa_failed", "in_review"].includes(r.status))),
    );
  }, []);
  return (
    <div className="pb-16">
      <PageHeader
        kicker={t(locale, "engineering")}
        title={t(locale, "qaQueue")}
        description={t(locale, "gate")}
      />
      <div className="space-y-2">
        {items.map((item) => (
          <WorkCard key={item.id} item={item} locale={locale} />
        ))}
        {items.length === 0 ? <EmptyState title={t(locale, "emptyEng")} /> : null}
      </div>
    </div>
  );
}
