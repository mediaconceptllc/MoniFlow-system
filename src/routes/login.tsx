import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { t } from "@/lib/i18n";
import { useLocale } from "@/lib/locale-store";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const locale = useLocale((s) => s.locale);
  const setLocale = useLocale((s) => s.setLocale);
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!isPending && user) {
    void navigate({ to: "/ops" });
  }

  async function onEmail(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "up") {
        const res = await authClient.signUp.email({ name: name || email.split("@")[0], email, password });
        if (res.error) throw new Error(res.error.message);
      } else {
        const res = await authClient.signIn.email({ email, password });
        if (res.error) throw new Error(res.error.message);
      }
      await navigate({ to: "/ops" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="relative min-h-screen bg-bg text-fg">
      <div className="absolute inset-y-0 left-0 hidden w-1/2 border-r border-border lg:block">
        <div className="flex h-full flex-col justify-between p-10">
          <Link to="/" className="serif text-2xl">
            MoniFlow
          </Link>
          <div>
            <p className="text-[11px] tracking-[0.18em] text-subtle uppercase">{t(locale, "tagline")}</p>
            <h1 className="serif mt-4 max-w-sm text-4xl leading-tight">{t(locale, "firstAccount")}</h1>
          </div>
          <p className="text-xs text-subtle">MoniChat · 2026</p>
        </div>
      </div>
      <div className="flex min-h-screen items-center justify-center px-5 py-16 lg:ml-[50%]">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="serif text-3xl">{t(locale, "signIn")}</h2>
            <button
              type="button"
              onClick={() => setLocale(locale === "mn" ? "en" : "mn")}
              className="h-10 px-2 font-mono text-xs text-muted"
            >
              {locale === "mn" ? "EN" : "MN"}
            </button>
          </div>
          {authEnabled ? (
            <div className="space-y-2">
              {GROK_PROVIDERS.map((p) => (
                <Button
                  key={p.providerId}
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => void signIn(p.providerId, { callbackURL: "/ops" })}
                >
                  {p.providerId === "grok-google" ? t(locale, "continueGoogle") : t(locale, "continueX")}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">Sign-in is disabled.</p>
          )}
          <div className="my-6 flex items-center gap-3 text-[11px] tracking-wide text-subtle uppercase">
            <span className="h-px flex-1 bg-border" />
            {locale === "mn" ? "эсвэл имэйл" : "or email"}
            <span className="h-px flex-1 bg-border" />
          </div>
          <form className="space-y-3" onSubmit={(e) => void onEmail(e)}>
            {mode === "up" ? (
              <Field label={t(locale, "name")}>
                <Input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              </Field>
            ) : null}
            <Field label={t(locale, "email")}>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </Field>
            <Field label={t(locale, "password")}>
              <Input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "up" ? "new-password" : "current-password"}
              />
            </Field>
            {error ? <p className="text-sm text-p0">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={busy}>
              {mode === "up" ? t(locale, "signUp") : t(locale, "signIn")}
            </Button>
          </form>
          <button
            type="button"
            className="mt-4 text-sm text-muted hover:text-fg"
            onClick={() => setMode(mode === "up" ? "in" : "up")}
          >
            {mode === "up" ? t(locale, "signIn") : t(locale, "signUp")}
          </button>
        </div>
      </div>
    </main>
  );
}
