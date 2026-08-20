import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { EmptyState, WorkCard } from "@/components/item-card";
import { WorkForm } from "@/components/work-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { createWorkItem, listWorkItems } from "@/lib/fns/work";
import { t } from "@/lib/i18n";
import { useLocale } from "@/lib/locale-store";
import { MODULES, PRIORITIES, WORK_STATUSES, WORK_TYPES, type WorkItem } from "@/lib/types";

export const Route = createFileRoute("/ops/eng/")({ component: EngBoard });

const LANES: { key: string; statuses: string[] }[] = [
  { key: "P0", statuses: [] },
  { key: "P1", statuses: [] },
  { key: "P2", statuses: [] },
  { key: "P3", statuses: [] },
];

function EngBoard() {
  const locale = useLocale((s) => s.locale);
  const [items, setItems] = useState<WorkItem[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [mod, setMod] = useState("all");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function reload() {
    const rows = await listWorkItems({
      data: { q, status, type, module: mod },
    });
    setItems(rows);
  }

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, status, type, mod]);

  const lanes = useMemo(
    () =>
      PRIORITIES.map((p) => ({
        priority: p,
        items: items.filter((i) => i.priority === p && !["closed", "rejected", "duplicate"].includes(i.status)),
      })),
    [items],
  );

  return (
    <div className="pb-20">
      <PageHeader
        kicker={t(locale, "engineering")}
        title={t(locale, "board")}
        description={t(locale, "tracksNeverMix")}
        actions={
          <Button onClick={() => setOpen(true)}>{t(locale, "newItem")}</Button>
        }
      />
      <div className="mb-5 grid gap-2 sm:grid-cols-4">
        <Input placeholder={t(locale, "search")} value={q} onChange={(e) => setQ(e.target.value)} />
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">{t(locale, "status")}</option>
          {WORK_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="all">{t(locale, "type")}</option>
          {WORK_TYPES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        <Select value={mod} onChange={(e) => setMod(e.target.value)}>
          <option value="all">{t(locale, "module")}</option>
          {MODULES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid gap-4 xl:grid-cols-4">
        {lanes.map((lane) => (
          <section key={lane.priority} className="min-w-0">
            <div className="mb-2 flex items-baseline justify-between">
              <h2 className="font-mono text-sm">{lane.priority}</h2>
              <span className="font-mono text-xs text-muted tabular-nums">{lane.items.length}</span>
            </div>
            <div className="space-y-2">
              {lane.items.map((item) => (
                <WorkCard key={item.id} item={item} locale={locale} />
              ))}
              {lane.items.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border px-3 py-8 text-center text-xs text-subtle">
                  {t(locale, "none")}
                </div>
              ) : null}
            </div>
          </section>
        ))}
      </div>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title={t(locale, "newItem")}
        description={t(locale, "captureHint")}
      >
        <WorkForm
          locale={locale}
          busy={busy}
          onSubmit={async (data) => {
            setBusy(true);
            try {
              const res = await createWorkItem({ data });
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

void EmptyState;
void LANES;
