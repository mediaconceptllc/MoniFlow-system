import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { EmptyState, WorkCard } from "@/components/item-card";
import { listWorkItems } from "@/lib/fns/work";
import { t } from "@/lib/i18n";
import { useLocale } from "@/lib/locale-store";
import type { WorkItem } from "@/lib/types";

export const Route = createFileRoute("/ops/triage")({ component: Triage });

function Triage() {
  const locale = useLocale((s) => s.locale);
  const [items, setItems] = useState<WorkItem[]>([]);
  useEffect(() => {
    void listWorkItems({ data: {} }).then((rows) =>
      setItems(rows.filter((r) => ["new", "triage", "needs_info"].includes(r.status))),
    );
  }, []);
  const missing = items.filter((i) => !i.actual_behavior && !i.steps_to_reproduce);
  return (
    <div className="pb-16">
      <PageHeader
        kicker={t(locale, "engineering")}
        title={t(locale, "triage")}
        description={locale === "mn" ? "Шинэ, мэдээлэл дутуу, эзэнгүй зүйлс." : "New, needs-info, and unowned items."}
      />
      <div className="space-y-2">
        {items.map((item) => (
          <WorkCard key={item.id} item={item} locale={locale} />
        ))}
        {items.length === 0 ? <EmptyState title={t(locale, "emptyEng")} /> : null}
      </div>
      {missing.length > 0 ? (
        <p className="mt-4 text-xs text-p1">
          {locale === "mn" ? "Нотлох баримт дутуу" : "Missing evidence"}: {missing.length}
        </p>
      ) : null}
    </div>
  );
}
