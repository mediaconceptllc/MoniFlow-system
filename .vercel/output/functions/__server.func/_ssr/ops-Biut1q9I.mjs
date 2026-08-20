import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as getKpis } from "./app-BKKSBMjb.mjs";
import { c as t, l as useLocale } from "./locale-store-DzqSZ9A_.mjs";
import { o as listTickets } from "./tickets-BqGqAz2_.mjs";
import { r as isAging, t as agingHoursForWork } from "./scoring-Bp88wWL5.mjs";
import { o as listWorkItems } from "./work-Bx14KpU3.mjs";
import { n as Kpi, r as PageHeader } from "./app-shell-D08HiN12.mjs";
import { n as TicketCard, r as WorkCard, t as EmptyState } from "./item-card-BhTEeTSG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ops-Biut1q9I.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CommandCenter() {
	const locale = useLocale((s) => s.locale);
	const [kpi, setKpi] = (0, import_react.useState)(null);
	const [work, setWork] = (0, import_react.useState)([]);
	const [tickets, setTickets] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		getKpis().then(setKpi);
		listWorkItems({ data: {} }).then(setWork);
		listTickets({ data: {} }).then(setTickets);
	}, []);
	const p0 = work.filter((w) => (w.priority === "P0" || w.priority === "P1") && ![
		"closed",
		"rejected",
		"duplicate",
		"verified"
	].includes(w.status));
	const aging = work.filter((w) => ![
		"closed",
		"rejected",
		"duplicate",
		"verified"
	].includes(w.status) && isAging(w.last_transition_at, agingHoursForWork(w.priority)));
	const openTickets = tickets.filter((tck) => ![
		"closed",
		"resolved",
		"duplicate"
	].includes(tck.status));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: t(locale, "welcomeBack"),
				title: t(locale, "command"),
				description: t(locale, "tagline")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: t(locale, "openWork"),
						value: kpi?.openWork ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "P0 / P1",
						value: (kpi?.p0 ?? 0) + "/" + (kpi?.p1 ?? 0),
						tone: "danger"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: t(locale, "openTickets"),
						value: kpi?.openTickets ?? "—",
						tone: "warn"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: t(locale, "slaBreach"),
						value: kpi?.slaBreached ?? "—",
						tone: (kpi?.slaBreached ?? 0) > 0 ? "danger" : "ok"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: t(locale, "untriaged"),
						value: kpi?.untriaged ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: t(locale, "blocked"),
						value: kpi?.blocked ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: t(locale, "aging"),
						value: kpi?.overdue ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: t(locale, "escalated"),
						value: kpi?.escalatedTickets ?? "—"
					})
				]
			}),
			kpi ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-[11px] tracking-[0.16em] text-subtle uppercase",
					children: t(locale, "strategic")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-5 gap-2",
					children: [
						[t(locale, "growth"), kpi.strategicMix.growth],
						[t(locale, "retention"), kpi.strategicMix.retention],
						[t(locale, "payment"), kpi.strategicMix.payment],
						[t(locale, "stability"), kpi.strategicMix.stability],
						[t(locale, "polish"), kpi.strategicMix.polish]
					].map(([lab, n]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-border px-3 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-muted",
							children: lab
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xl tabular-nums",
							children: n
						})]
					}, lab))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-10 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-track-eng" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "serif text-2xl",
								children: t(locale, "p0pin")
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/ops/eng",
							className: "text-xs text-muted hover:text-fg",
							children: t(locale, "viewAll")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [p0.slice(0, 5).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkCard, {
							item,
							locale
						}, item.id)), p0.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { title: t(locale, "emptyEng") }) : null]
					}),
					aging.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs text-p1",
						children: [
							t(locale, "agingAlert"),
							": ",
							aging.length
						]
					}) : null
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-track-desk" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "serif text-2xl",
							children: t(locale, "inbox")
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/ops/desk",
						className: "text-xs text-muted hover:text-fg",
						children: t(locale, "viewAll")
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [openTickets.slice(0, 5).map((ticket) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketCard, {
						ticket,
						locale,
						href: "desk"
					}, ticket.id)), openTickets.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { title: t(locale, "emptyDesk") }) : null]
				})] })]
			})
		]
	});
}
//#endregion
export { CommandCenter as component };
