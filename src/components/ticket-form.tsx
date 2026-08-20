import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { CreateTicketInput } from "@/lib/fns/tickets";
import { t, type Locale, TICKET_CAT_LABEL, label } from "@/lib/i18n";
import { TICKET_CATEGORIES, TICKET_PRIORITIES, type TicketCategory, type TicketPriority } from "@/lib/types";

export function TicketForm({
  locale,
  onSubmit,
  busy,
  showPriority,
}: {
  locale: Locale;
  onSubmit: (data: CreateTicketInput) => Promise<void>;
  busy?: boolean;
  showPriority?: boolean;
}) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [expected, setExpected] = useState("");
  const [category, setCategory] = useState<TicketCategory>("bug");
  const [priority, setPriority] = useState<TicketPriority>("normal");
  const [device, setDevice] = useState("");
  const [os, setOs] = useState("");
  const [version, setVersion] = useState("");
  const [file, setFile] = useState<{ name: string; dataUrl: string } | null>(null);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        void onSubmit({
          subject,
          body,
          category,
          expected_behavior: expected,
          device,
          os_name: os,
          app_version: version,
          priority: showPriority ? priority : undefined,
          evidenceDataUrl: file?.dataUrl,
          evidenceName: file?.name,
        });
      }}
    >
      <p className="text-xs text-muted">{t(locale, "captureHint")}</p>
      <Field label={t(locale, "category")}>
        <Select value={category} onChange={(e) => setCategory(e.target.value as TicketCategory)}>
          {TICKET_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {label(TICKET_CAT_LABEL, c, locale)}
            </option>
          ))}
        </Select>
      </Field>
      <Field label={t(locale, "subject")}>
        <Input value={subject} onChange={(e) => setSubject(e.target.value)} required maxLength={160} />
      </Field>
      <Field label={t(locale, "whatHappened")}>
        <Textarea value={body} onChange={(e) => setBody(e.target.value)} required rows={4} />
      </Field>
      <Field label={t(locale, "expected")}>
        <Textarea value={expected} onChange={(e) => setExpected(e.target.value)} rows={2} />
      </Field>
      {showPriority ? (
        <Field label={t(locale, "priority")}>
          <Select value={priority} onChange={(e) => setPriority(e.target.value as TicketPriority)}>
            {TICKET_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </Field>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label={t(locale, "device")}>
          <Input value={device} onChange={(e) => setDevice(e.target.value)} />
        </Field>
        <Field label="OS">
          <Input value={os} onChange={(e) => setOs(e.target.value)} />
        </Field>
        <Field label={t(locale, "version")}>
          <Input value={version} onChange={(e) => setVersion(e.target.value)} />
        </Field>
      </div>
      <Field label={t(locale, "attach")}>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            if (f.size > 700_000) return;
            const r = new FileReader();
            r.onload = () => setFile({ name: f.name, dataUrl: String(r.result) });
            r.readAsDataURL(f);
          }}
        />
      </Field>
      <div className="flex justify-end">
        <Button type="submit" disabled={busy || !subject.trim() || !body.trim()}>
          {t(locale, "submit")}
        </Button>
      </div>
    </form>
  );
}
