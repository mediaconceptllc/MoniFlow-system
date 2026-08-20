import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  ClipboardCheck,
  Inbox,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  Rocket,
  Settings,
  Shield,
  UserRound,
  Workflow,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { toast, Toaster } from "sonner";
import { signOut } from "@/lib/auth/client";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { bootstrapApp, listNotifications, markNotificationsRead } from "@/lib/fns/app";
import { t, type Locale, ROLE_LABEL, label as i18nLabel } from "@/lib/i18n";
import { useLocale } from "@/lib/locale-store";
import type { Notification, Profile } from "@/lib/types";
import { cn, initials } from "@/lib/utils";

type Track = "ops" | "portal";

export function AppShell({
  children,
  track,
}: {
  children: ReactNode;
  track: Track;
}) {
  const locale = useLocale((s) => s.locale);
  const setLocale = useLocale((s) => s.setLocale);
  const user = useCurrentUser();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [profile, setProfile] = useState<Profile | null>(null);
  const [notes, setNotes] = useState<Notification[]>([]);
  const [openNav, setOpenNav] = useState(false);
  const [openBell, setOpenBell] = useState(false);

  useEffect(() => {
    bootstrapApp()
      .then((r) => setProfile(r.profile))
      .catch((err) => {
        console.error(err);
        toast.error(err instanceof Error ? err.message : "Failed to load");
      });
    listNotifications()
      .then(setNotes)
      .catch(() => setNotes([]));
  }, []);

  const unread = notes.filter((n) => !n.read).length;
  const role = profile?.role ?? "requester";

  const eng = [
    { to: "/ops", icon: LayoutDashboard, key: "command", exact: true },
    { to: "/ops/eng", icon: Workflow, key: "board" },
    { to: "/ops/triage", icon: Shield, key: "triage" },
    { to: "/ops/qa", icon: ClipboardCheck, key: "qaQueue" },
    { to: "/ops/releases", icon: Rocket, key: "releases" },
    { to: "/ops/my", icon: UserRound, key: "myWork" },
  ];
  const desk = [
    { to: "/ops/desk", icon: Inbox, key: "inbox" },
    { to: "/portal", icon: LifeBuoy, key: "portal" },
  ];

  function active(to: string, exact?: boolean) {
    if (exact) return pathname === to;
    return pathname === to || pathname.startsWith(`${to}/`);
  }

  return (
    <div className="min-h-screen bg-bg text-fg">
      <Toaster theme="dark" position="bottom-right" />
      <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur">
        <div className="flex h-14 items-center gap-3 px-3 sm:px-5">
          <button
            type="button"
            className="grid size-10 place-items-center rounded-sm text-muted hover:bg-surface lg:hidden"
            onClick={() => setOpenNav(true)}
            aria-label="Menu"
          >
            <Menu className="size-5" />
          </button>
          <Link to={track === "portal" ? "/portal" : "/ops"} className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 grid-cols-2 gap-0.5 p-1">
              <span className="rounded-[2px] bg-primary" />
              <span className="rounded-[2px] bg-muted" />
              <span className="rounded-[2px] bg-primary" />
              <span className="rounded-[2px] bg-muted" />
            </span>
            <span className="serif text-lg leading-none tracking-tight">{t(locale, "app")}</span>
          </Link>
          <span className="hidden h-4 w-px bg-border sm:block" />
          <span className="hidden text-xs tracking-wide text-muted sm:block">
            {track === "portal" ? t(locale, "portal") : t(locale, "welcomeBack")}
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setLocale(locale === "mn" ? "en" : "mn")}
              className="h-10 rounded-sm px-2.5 font-mono text-[11px] text-muted hover:bg-surface hover:text-fg"
            >
              {locale === "mn" ? "EN" : "MN"}
            </button>
            <div className="relative">
              <button
                type="button"
                className="relative grid size-10 place-items-center rounded-sm text-muted hover:bg-surface hover:text-fg"
                onClick={() => setOpenBell((v) => !v)}
                aria-label={t(locale, "notifications")}
              >
                <Bell className="size-4" />
                {unread > 0 ? <span className="absolute top-2 right-2 size-1.5 rounded-full bg-p0" /> : null}
              </button>
              {openBell ? (
                <div className="absolute right-0 mt-1 w-80 rounded-lg border border-border bg-bg-elevated p-2 shadow-soft">
                  <div className="mb-2 flex items-center justify-between px-2">
                    <p className="text-xs font-medium text-muted">{t(locale, "notifications")}</p>
                    <button
                      type="button"
                      className="text-[11px] text-muted hover:text-fg"
                      onClick={() => {
                        void markNotificationsRead().then(() =>
                          setNotes((n) => n.map((x) => ({ ...x, read: true }))),
                        );
                      }}
                    >
                      {t(locale, "markRead")}
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notes.length === 0 ? (
                      <p className="px-2 py-6 text-center text-sm text-subtle">{t(locale, "none")}</p>
                    ) : (
                      notes.map((n) => (
                        <Link
                          key={n.id}
                          to={n.link || "/ops"}
                          className="block rounded-sm px-2 py-2 hover:bg-surface"
                          onClick={() => setOpenBell(false)}
                        >
                          <p className="text-sm">{n.title}</p>
                          {n.body ? <p className="text-xs text-muted">{n.body}</p> : null}
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              ) : null}
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <span className="grid size-8 place-items-center rounded-full bg-surface-2 text-xs">
                {initials(user?.displayName ?? profile?.display_name)}
              </span>
              <div className="hidden leading-tight md:block">
                <p className="text-xs font-medium">{user?.displayName ?? profile?.display_name}</p>
                <p className="text-[10px] text-muted">{i18nLabel(ROLE_LABEL, role, locale)}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {openNav ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-bg/70" onClick={() => setOpenNav(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 overflow-y-auto border-r border-border bg-bg-elevated p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="serif text-lg">{t(locale, "app")}</span>
              <button type="button" className="grid size-10 place-items-center" onClick={() => setOpenNav(false)}>
                <X className="size-4" />
              </button>
            </div>
            <NavBlocks
              locale={locale}
              eng={eng}
              desk={desk}
              active={active}
              onNavigate={() => setOpenNav(false)}
              role={role}
            />
            <button
              type="button"
              onClick={() => void signOut("/")}
              className="mt-6 flex w-full items-center gap-2 rounded-sm px-2 py-2 text-sm text-muted hover:bg-surface hover:text-fg"
            >
              <LogOut className="size-4" />
              {t(locale, "signOut")}
            </button>
          </aside>
        </div>
      ) : null}

      <div className="mx-auto flex max-w-[1440px]">
        <aside className="sticky top-14 hidden h-[calc(100vh-56px)] w-60 shrink-0 overflow-y-auto border-r border-border px-3 py-5 lg:block">
          <NavBlocks locale={locale} eng={eng} desk={desk} active={active} role={role} />
          <button
            type="button"
            onClick={() => void signOut("/")}
            className="mt-6 flex w-full items-center gap-2 rounded-sm px-2 py-2 text-sm text-muted hover:bg-surface hover:text-fg"
          >
            <LogOut className="size-4" />
            {t(locale, "signOut")}
          </button>
        </aside>
        <main id="main" className="min-w-0 flex-1 px-4 py-6 pb-24 sm:px-8 lg:pb-8">
          <p className="mb-5 text-[11px] tracking-wide text-subtle uppercase">
            {track === "portal" ? t(locale, "portalBlurb") : t(locale, "tracksNeverMix")}
          </p>
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg/95 pb-[env(safe-area-inset-bottom)] lg:hidden">
        <div className="grid grid-cols-4">
          {(track === "portal"
            ? [
                { to: "/portal", icon: LifeBuoy, label: t(locale, "myTickets") },
                { to: "/portal/new", icon: Inbox, label: t(locale, "reportIssue") },
                { to: "/ops", icon: Workflow, label: t(locale, "engineering") },
                { to: "/ops/desk", icon: Inbox, label: t(locale, "helpdesk") },
              ]
            : [
                { to: "/ops", icon: LayoutDashboard, label: t(locale, "command") },
                { to: "/ops/eng", icon: Workflow, label: t(locale, "engineering") },
                { to: "/ops/desk", icon: Inbox, label: t(locale, "helpdesk") },
                { to: "/portal", icon: LifeBuoy, label: t(locale, "portal") },
              ]
          ).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 px-1 text-center text-[10px]",
                pathname === item.to || pathname.startsWith(`${item.to}/`) ? "text-fg" : "text-muted",
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

function NavBlocks({
  locale,
  eng,
  desk,
  active,
  onNavigate,
  role,
}: {
  locale: Locale;
  eng: { to: string; icon: typeof LayoutDashboard; key: string; exact?: boolean }[];
  desk: { to: string; icon: typeof LayoutDashboard; key: string }[];
  active: (to: string, exact?: boolean) => boolean;
  onNavigate?: () => void;
  role: string;
}) {
  return (
    <div className="space-y-6">
      <NavGroup title={t(locale, "engineering")} tone="eng">
        {eng.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={t(locale, item.key)}
            active={active(item.to, item.exact)}
            onClick={onNavigate}
          />
        ))}
      </NavGroup>
      <NavGroup title={t(locale, "helpdesk")} tone="desk">
        {desk.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={t(locale, item.key)}
            active={active(item.to)}
            onClick={onNavigate}
          />
        ))}
      </NavGroup>
      {role === "admin" ? (
        <NavLink
          to="/ops/admin"
          icon={Settings}
          label={t(locale, "admin")}
          active={active("/ops/admin")}
          onClick={onNavigate}
        />
      ) : null}
    </div>
  );
}

function NavGroup({
  title,
  tone,
  children,
}: {
  title: string;
  tone: "eng" | "desk";
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 px-2">
        <span className={cn("size-1.5 rounded-full", tone === "eng" ? "bg-track-eng" : "bg-track-desk")} />
        <p className="text-[10px] font-medium tracking-[0.16em] text-subtle uppercase">{title}</p>
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function NavLink({
  to,
  icon: Icon,
  label,
  active,
  onClick,
}: {
  to: string;
  icon: typeof LayoutDashboard;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-sm px-2 py-2 text-sm transition-colors duration-150",
        active ? "bg-surface text-fg" : "text-muted hover:bg-surface hover:text-fg",
      )}
    >
      <Icon className="size-4 shrink-0" />
      {label}
    </Link>
  );
}

export function PageHeader({
  kicker,
  title,
  description,
  actions,
}: {
  kicker?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {kicker ? (
          <p className="mb-1 text-[11px] tracking-[0.16em] text-subtle uppercase">{kicker}</p>
        ) : null}
        <h1 className="serif text-3xl sm:text-4xl">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function Kpi({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: number | string;
  hint?: string;
  tone?: "danger" | "warn" | "ok" | "default";
}) {
  const color =
    tone === "danger" ? "text-p0" : tone === "warn" ? "text-p1" : tone === "ok" ? "text-ok" : "text-fg";
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="text-[11px] tracking-wide text-muted uppercase">{label}</p>
      <p className={cn("mt-2 font-mono text-3xl tabular-nums", color)}>{value}</p>
      {hint ? <p className="mt-1 text-xs text-subtle">{hint}</p> : null}
    </div>
  );
}
