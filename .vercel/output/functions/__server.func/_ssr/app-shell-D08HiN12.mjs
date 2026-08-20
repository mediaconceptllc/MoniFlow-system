import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { d as useRouterState, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as listNotifications, o as markNotificationsRead, t as bootstrapApp } from "./app-BKKSBMjb.mjs";
import { c as t, l as useLocale, n as ROLE_LABEL, s as label } from "./locale-store-DzqSZ9A_.mjs";
import { n as initials, t as cn } from "./utils-D9lm1PsI.mjs";
import { a as Shield, c as Menu, d as LayoutDashboard, f as Inbox, l as LogOut, m as Bell, n as Workflow, o as Settings, p as ClipboardCheck, r as UserRound, s as Rocket, t as X, u as LifeBuoy } from "../_libs/lucide-react.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { i as signOut } from "./client-sGid3STf.mjs";
import { t as useCurrentUser } from "./use-current-user-DZ7NZd4-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-D08HiN12.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AppShell({ children, track }) {
	const locale = useLocale((s) => s.locale);
	const setLocale = useLocale((s) => s.setLocale);
	const user = useCurrentUser();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [notes, setNotes] = (0, import_react.useState)([]);
	const [openNav, setOpenNav] = (0, import_react.useState)(false);
	const [openBell, setOpenBell] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		bootstrapApp().then((r) => setProfile(r.profile)).catch((err) => {
			console.error(err);
			toast.error(err instanceof Error ? err.message : "Failed to load");
		});
		listNotifications().then(setNotes).catch(() => setNotes([]));
	}, []);
	const unread = notes.filter((n) => !n.read).length;
	const role = profile?.role ?? "requester";
	const eng = [
		{
			to: "/ops",
			icon: LayoutDashboard,
			key: "command",
			exact: true
		},
		{
			to: "/ops/eng",
			icon: Workflow,
			key: "board"
		},
		{
			to: "/ops/triage",
			icon: Shield,
			key: "triage"
		},
		{
			to: "/ops/qa",
			icon: ClipboardCheck,
			key: "qaQueue"
		},
		{
			to: "/ops/releases",
			icon: Rocket,
			key: "releases"
		},
		{
			to: "/ops/my",
			icon: UserRound,
			key: "myWork"
		}
	];
	const desk = [{
		to: "/ops/desk",
		icon: Inbox,
		key: "inbox"
	}, {
		to: "/portal",
		icon: LifeBuoy,
		key: "portal"
	}];
	function active(to, exact) {
		if (exact) return pathname === to;
		return pathname === to || pathname.startsWith(`${to}/`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				position: "bottom-right"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-14 items-center gap-3 px-3 sm:px-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "grid size-10 place-items-center rounded-sm text-muted hover:bg-surface lg:hidden",
							onClick: () => setOpenNav(true),
							"aria-label": "Menu",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: track === "portal" ? "/portal" : "/ops",
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "grid h-7 w-7 grid-cols-2 gap-0.5 p-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "rounded-[2px] bg-primary" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "rounded-[2px] bg-muted" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "rounded-[2px] bg-primary" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "rounded-[2px] bg-muted" })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "serif text-lg leading-none tracking-tight",
								children: t(locale, "app")
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "hidden h-4 w-px bg-border sm:block" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden text-xs tracking-wide text-muted sm:block",
							children: track === "portal" ? t(locale, "portal") : t(locale, "welcomeBack")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setLocale(locale === "mn" ? "en" : "mn"),
									className: "h-10 rounded-sm px-2.5 font-mono text-[11px] text-muted hover:bg-surface hover:text-fg",
									children: locale === "mn" ? "EN" : "MN"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "relative grid size-10 place-items-center rounded-sm text-muted hover:bg-surface hover:text-fg",
										onClick: () => setOpenBell((v) => !v),
										"aria-label": t(locale, "notifications"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-4" }), unread > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-2 right-2 size-1.5 rounded-full bg-p0" }) : null]
									}), openBell ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute right-0 mt-1 w-80 rounded-lg border border-border bg-bg-elevated p-2 shadow-soft",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-2 flex items-center justify-between px-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-medium text-muted",
												children: t(locale, "notifications")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "text-[11px] text-muted hover:text-fg",
												onClick: () => {
													markNotificationsRead().then(() => setNotes((n) => n.map((x) => ({
														...x,
														read: true
													}))));
												},
												children: t(locale, "markRead")
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "max-h-72 overflow-y-auto",
											children: notes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "px-2 py-6 text-center text-sm text-subtle",
												children: t(locale, "none")
											}) : notes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: n.link || "/ops",
												className: "block rounded-sm px-2 py-2 hover:bg-surface",
												onClick: () => setOpenBell(false),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm",
													children: n.title
												}), n.body ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-muted",
													children: n.body
												}) : null]
											}, n.id))
										})]
									}) : null]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "hidden items-center gap-2 sm:flex",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid size-8 place-items-center rounded-full bg-surface-2 text-xs",
										children: initials(user?.displayName ?? profile?.display_name)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "hidden leading-tight md:block",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-medium",
											children: user?.displayName ?? profile?.display_name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-muted",
											children: label(ROLE_LABEL, role, locale)
										})]
									})]
								})
							]
						})
					]
				})
			}),
			openNav ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-50 lg:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "absolute inset-0 bg-bg/70",
					onClick: () => setOpenNav(false)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "absolute inset-y-0 left-0 w-72 overflow-y-auto border-r border-border bg-bg-elevated p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "serif text-lg",
								children: t(locale, "app")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "grid size-10 place-items-center",
								onClick: () => setOpenNav(false),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavBlocks, {
							locale,
							eng,
							desk,
							active,
							onNavigate: () => setOpenNav(false),
							role
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => void signOut("/"),
							className: "mt-6 flex w-full items-center gap-2 rounded-sm px-2 py-2 text-sm text-muted hover:bg-surface hover:text-fg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), t(locale, "signOut")]
						})
					]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-[1440px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "sticky top-14 hidden h-[calc(100vh-56px)] w-60 shrink-0 overflow-y-auto border-r border-border px-3 py-5 lg:block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavBlocks, {
						locale,
						eng,
						desk,
						active,
						role
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => void signOut("/"),
						className: "mt-6 flex w-full items-center gap-2 rounded-sm px-2 py-2 text-sm text-muted hover:bg-surface hover:text-fg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), t(locale, "signOut")]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					id: "main",
					className: "min-w-0 flex-1 px-4 py-6 pb-24 sm:px-8 lg:pb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-5 text-[11px] tracking-wide text-subtle uppercase",
						children: track === "portal" ? t(locale, "portalBlurb") : t(locale, "tracksNeverMix")
					}), children]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg/95 pb-[env(safe-area-inset-bottom)] lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-4",
					children: (track === "portal" ? [
						{
							to: "/portal",
							icon: LifeBuoy,
							label: t(locale, "myTickets")
						},
						{
							to: "/portal/new",
							icon: Inbox,
							label: t(locale, "reportIssue")
						},
						{
							to: "/ops",
							icon: Workflow,
							label: t(locale, "engineering")
						},
						{
							to: "/ops/desk",
							icon: Inbox,
							label: t(locale, "helpdesk")
						}
					] : [
						{
							to: "/ops",
							icon: LayoutDashboard,
							label: t(locale, "command")
						},
						{
							to: "/ops/eng",
							icon: Workflow,
							label: t(locale, "engineering")
						},
						{
							to: "/ops/desk",
							icon: Inbox,
							label: t(locale, "helpdesk")
						},
						{
							to: "/portal",
							icon: LifeBuoy,
							label: t(locale, "portal")
						}
					]).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						className: cn("flex min-h-14 flex-col items-center justify-center gap-1 px-1 text-center text-[10px]", pathname === item.to || pathname.startsWith(`${item.to}/`) ? "text-fg" : "text-muted"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4" }), item.label]
					}, item.to))
				})
			})
		]
	});
}
function NavBlocks({ locale, eng, desk, active, onNavigate, role }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavGroup, {
				title: t(locale, "engineering"),
				tone: "eng",
				children: eng.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
					to: item.to,
					icon: item.icon,
					label: t(locale, item.key),
					active: active(item.to, item.exact),
					onClick: onNavigate
				}, item.to))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavGroup, {
				title: t(locale, "helpdesk"),
				tone: "desk",
				children: desk.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
					to: item.to,
					icon: item.icon,
					label: t(locale, item.key),
					active: active(item.to),
					onClick: onNavigate
				}, item.to))
			}),
			role === "admin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
				to: "/ops/admin",
				icon: Settings,
				label: t(locale, "admin"),
				active: active("/ops/admin"),
				onClick: onNavigate
			}) : null
		]
	});
}
function NavGroup({ title, tone, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-2 flex items-center gap-2 px-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-1.5 rounded-full", tone === "eng" ? "bg-track-eng" : "bg-track-desk") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[10px] font-medium tracking-[0.16em] text-subtle uppercase",
			children: title
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-0.5",
		children
	})] });
}
function NavLink({ to, icon: Icon, label, active, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		onClick,
		className: cn("flex items-center gap-2 rounded-sm px-2 py-2 text-sm transition-colors duration-150", active ? "bg-surface text-fg" : "text-muted hover:bg-surface hover:text-fg"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0" }), label]
	});
}
function PageHeader({ kicker, title, description, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			kicker ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-1 text-[11px] tracking-[0.16em] text-subtle uppercase",
				children: kicker
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "serif text-3xl sm:text-4xl",
				children: title
			}),
			description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-sm text-muted",
				children: description
			}) : null
		] }), actions ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			children: actions
		}) : null]
	});
}
function Kpi({ label, value, hint, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-surface p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] tracking-wide text-muted uppercase",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("mt-2 font-mono text-3xl tabular-nums", tone === "danger" ? "text-p0" : tone === "warn" ? "text-p1" : tone === "ok" ? "text-ok" : "text-fg"),
				children: value
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-subtle",
				children: hint
			}) : null
		]
	});
}
//#endregion
export { Kpi as n, PageHeader as r, AppShell as t };
