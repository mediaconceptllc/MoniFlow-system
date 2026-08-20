import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { IdChip } from "@/components/chips";
import { listReleases } from "@/lib/fns/work";
import { t } from "@/lib/i18n";
import { useLocale } from "@/lib/locale-store";
import type { Release } from "@/lib/types";

export const Route = createFileRoute("/ops/releases")({ component: ReleasesPage });

function ReleasesPage() {
  const locale = useLocale((s) => s.locale);
  const [data, setData] = useState<{
    releases: Release[];
    items: { release_id: string; work_item_id: string; title: string; status: string; priority: string }[];
  } | null>(null);
  useEffect(() => {
    void listReleases().then(setData);
  }, []);
  return (
    <div className="pb-16">
      <PageHeader kicker={t(locale, "engineering")} title={t(locale, "releases")} />
      <div className="space-y-4">
        {(data?.releases ?? []).map((rel) => {
          const included = (data?.items ?? []).filter((i) => i.release_id === rel.id);
          return (
            <article key={rel.id} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-sm text-muted">{rel.id}</p>
                  <h2 className="serif text-2xl">{rel.version}</h2>
                </div>
                <Badge tone={rel.status === "released" ? "ok" : "warn"}>{rel.status}</Badge>
              </div>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-muted">Rollout</dt>
                  <dd className="mt-1 text-muted">{rel.rollout}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Rollback</dt>
                  <dd className="mt-1 text-muted">{rel.rollback_plan}</dd>
                </div>
              </dl>
              {rel.notes ? <p className="mt-3 text-sm">{rel.notes}</p> : null}
              <ul className="mt-4 space-y-2">
                {included.map((i) => (
                  <li key={i.work_item_id}>
                    <Link to="/ops/eng/$id" params={{ id: i.work_item_id }} className="flex items-center gap-2 text-sm hover:text-accent">
                      <IdChip id={i.work_item_id} />
                      <span>{i.title}</span>
                      <span className="text-xs text-subtle">{i.status}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </div>
  );
}
