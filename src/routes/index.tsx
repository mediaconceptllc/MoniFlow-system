import { createFileRoute, Link } from "@tanstack/react-router";
import { SignedIn } from "@/lib/auth/gates";
import { t } from "@/lib/i18n";
import { useLocale } from "@/lib/locale-store";

export const Route = createFileRoute("/")({ component: Landing });

function Landing() {
  const locale = useLocale((s) => s.locale);
  const setLocale = useLocale((s) => s.setLocale);
  return (
    <main className="min-h-screen bg-bg text-fg">
      <header className="flex items-center justify-between px-5 py-5 sm:px-10">
        <div className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 grid-cols-2 gap-0.5 p-1">
            <span className="rounded-[2px] bg-primary" />
            <span className="rounded-[2px] bg-muted" />
            <span className="rounded-[2px] bg-primary" />
            <span className="rounded-[2px] bg-muted" />
          </span>
          <span className="serif text-xl">MoniFlow</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLocale(locale === "mn" ? "en" : "mn")}
            className="h-10 px-2 font-mono text-xs text-muted"
          >
            {locale === "mn" ? "EN" : "MN"}
          </button>
          <Link
            to="/login"
            className="inline-flex h-10 items-center rounded-sm border border-border px-4 text-sm text-fg"
          >
            {t(locale, "signIn")}
          </Link>
          <SignedIn>
            <Link
              to="/ops"
              className="inline-flex h-10 items-center rounded-sm bg-primary px-4 text-sm font-medium text-primary-fg"
            >
              {t(locale, "command")}
            </Link>
          </SignedIn>
        </div>
      </header>

      <section className="px-5 pt-10 pb-16 sm:px-10 sm:pt-20">
        <p className="text-[11px] tracking-[0.2em] text-subtle uppercase">{t(locale, "tagline")}</p>
        <h1 className="serif mt-4 max-w-3xl text-4xl leading-[1.1] sm:text-6xl">{t(locale, "landingLead")}</h1>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/login"
            className="inline-flex h-11 items-center rounded-sm bg-primary px-5 text-sm font-medium text-primary-fg"
          >
            {t(locale, "signIn")}
          </Link>
          <Link
            to="/portal"
            className="inline-flex h-11 items-center rounded-sm border border-border px-5 text-sm text-fg"
          >
            {t(locale, "reportIssue")}
          </Link>
        </div>
      </section>

      <section className="grid border-t border-border lg:grid-cols-2">
        <article className="border-b border-border px-5 py-12 sm:px-10 lg:border-r lg:border-b-0">
          <div className="mb-4 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-track-eng" />
            <p className="text-[11px] tracking-[0.16em] text-subtle uppercase">{t(locale, "engineering")}</p>
          </div>
          <h2 className="serif text-3xl">{t(locale, "landingEng")}</h2>
          <ul className="mt-6 space-y-2 text-sm text-muted">
            <li>P0–P3 · score · rank · effort · strategic flags</li>
            <li>New → Triage → Develop → QA → Release → Verified</li>
            <li>Structured decisions · immutable audit · aging alerts</li>
          </ul>
        </article>
        <article className="px-5 py-12 sm:px-10">
          <div className="mb-4 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-track-desk" />
            <p className="text-[11px] tracking-[0.16em] text-subtle uppercase">{t(locale, "helpdesk")}</p>
          </div>
          <h2 className="serif text-3xl">{t(locale, "landingDesk")}</h2>
          <ul className="mt-6 space-y-2 text-sm text-muted">
            <li>Гомдол · санал · алдаа · төлбөр · бүртгэл</li>
            <li>SLA · first response · escalate (creates a linked work item)</li>
            <li>{t(locale, "tracksNeverMix")}</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
