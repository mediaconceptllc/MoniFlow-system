import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { CreateWorkInput } from "@/lib/fns/work";
import { t, type Locale } from "@/lib/i18n";
import { MODULES, WORK_TYPES, type Priority } from "@/lib/types";
import { computeScore } from "@/lib/scoring";

export function WorkForm({
  locale,
  onSubmit,
  busy,
}: {
  locale: Locale;
  onSubmit: (data: CreateWorkInput) => Promise<void>;
  busy?: boolean;
}) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<CreateWorkInput["type"]>("bug");
  const [module, setModule] = useState("Chat");
  const [expected, setExpected] = useState("");
  const [actual, setActual] = useState("");
  const [steps, setSteps] = useState("");
  const [flow, setFlow] = useState("");
  const [users, setUsers] = useState("");
  const [priority, setPriority] = useState<Priority>("P2");
  const [rationale, setRationale] = useState("");
  const [acceptance, setAcceptance] = useState("");
  const [device, setDevice] = useState("");
  const [os, setOs] = useState("");
  const [version, setVersion] = useState("");
  const [ui, setUi] = useState(3);
  const [bi, setBi] = useState(3);
  const [rr, setRr] = useState(2);
  const [tc, setTc] = useState(2);
  const [sf, setSf] = useState(3);
  const [effort, setEffort] = useState(3);
  const [confidence, setConfidence] = useState<"low" | "med" | "high">("med");
  const [flags, setFlags] = useState({
    growth: false,
    retention: false,
    payment: false,
    stability: false,
    network: false,
  });
  const [file, setFile] = useState<{ name: string; dataUrl: string } | null>(null);

  const score = computeScore({
    user_impact: ui,
    business_impact: bi,
    risk_reduction: rr,
    time_criticality: tc,
    strategic_fit: sf,
    confidence,
    effort,
  });

  async function handleFile(f: File | undefined) {
    if (!f) return setFile(null);
    if (f.size > 700_000) return;
    const dataUrl = await readFile(f);
    setFile({ name: f.name, dataUrl });
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        void onSubmit({
          title,
          type,
          product_module: module,
          expected_behavior: expected,
          actual_behavior: actual,
          steps_to_reproduce: steps,
          affected_flow: flow,
          affected_users: users,
          priority,
          priority_rationale: rationale,
          acceptance_criteria: acceptance,
          device,
          os_name: os,
          app_version: version,
          user_impact: ui,
          business_impact: bi,
          risk_reduction: rr,
          time_criticality: tc,
          strategic_fit: sf,
          effort,
          confidence,
          flag_growth: flags.growth,
          flag_retention: flags.retention,
          flag_payment: flags.payment,
          flag_stability: flags.stability,
          flag_network: flags.network,
          evidenceDataUrl: file?.dataUrl,
          evidenceName: file?.name,
        });
      }}
    >
      <p className="text-xs text-muted">{t(locale, "captureHint")}</p>
      <Field label={t(locale, "subject")}>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={180} />
      </Field>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label={t(locale, "type")}>
          <Select value={type} onChange={(e) => setType(e.target.value as CreateWorkInput["type"])}>
            {WORK_TYPES.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </Select>
        </Field>
        <Field label={t(locale, "module")}>
          <Select value={module} onChange={(e) => setModule(e.target.value)}>
            {MODULES.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </Select>
        </Field>
        <Field label={t(locale, "priority")}>
          <Select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
            {["P0", "P1", "P2", "P3"].map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label={t(locale, "expected")}>
        <Textarea value={expected} onChange={(e) => setExpected(e.target.value)} rows={2} />
      </Field>
      <Field label={t(locale, "whatHappened")}>
        <Textarea value={actual} onChange={(e) => setActual(e.target.value)} rows={2} />
      </Field>
      <Field label={t(locale, "steps")}>
        <Textarea value={steps} onChange={(e) => setSteps(e.target.value)} rows={3} />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={t(locale, "impact")}>
          <Input value={flow} onChange={(e) => setFlow(e.target.value)} placeholder="Chat list → thread" />
        </Field>
        <Field label={locale === "mn" ? "Нөлөөлөх хэрэглэгч" : "Affected users"}>
          <Input value={users} onChange={(e) => setUsers(e.target.value)} />
        </Field>
      </div>
      <Field label={t(locale, "rationale")}>
        <Input value={rationale} onChange={(e) => setRationale(e.target.value)} />
      </Field>
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["growth", t(locale, "growth")],
            ["retention", t(locale, "retention")],
            ["payment", t(locale, "payment")],
            ["stability", t(locale, "stability")],
            ["network", t(locale, "network")],
          ] as const
        ).map(([k, lab]) => (
          <label key={k} className="flex h-10 items-center gap-2 rounded-sm border border-border px-3 text-xs">
            <input
              type="checkbox"
              checked={flags[k]}
              onChange={(e) => setFlags((f) => ({ ...f, [k]: e.target.checked }))}
            />
            {lab}
          </label>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Score label="User" value={ui} onChange={setUi} />
        <Score label="Business" value={bi} onChange={setBi} />
        <Score label="Risk" value={rr} onChange={setRr} />
        <Score label="Time" value={tc} onChange={setTc} />
        <Score label="Strategic" value={sf} onChange={setSf} />
        <Score label="Effort" value={effort} min={1} onChange={setEffort} />
      </div>
      <div className="flex items-center justify-between rounded-md border border-border bg-bg px-3 py-2">
        <span className="text-xs text-muted">{t(locale, "score")}</span>
        <span className="font-mono text-lg tabular-nums">{score}</span>
      </div>
      <Field label="Confidence">
        <Select value={confidence} onChange={(e) => setConfidence(e.target.value as "low" | "med" | "high")}>
          <option value="low">Low</option>
          <option value="med">Med</option>
          <option value="high">High</option>
        </Select>
      </Field>
      <Field label={t(locale, "acceptance")}>
        <Textarea value={acceptance} onChange={(e) => setAcceptance(e.target.value)} rows={2} />
      </Field>
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
          onChange={(e) => void handleFile(e.target.files?.[0])}
        />
      </Field>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={busy || !title.trim()}>
          {t(locale, "submit")}
        </Button>
      </div>
    </form>
  );
}

function Score({
  label,
  value,
  onChange,
  min = 0,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex justify-between text-[11px] text-muted">
        {label}
        <span className="font-mono tabular-nums">{value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-accent"
      />
    </label>
  );
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
