import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as TicketPriorityBadge, c as WorkTypeChip, i as TicketCatChip, n as IdChip, o as TicketStatusChip, r as PriorityBadge, s as WorkStatusChip } from "./chips-EoiKBl8-.mjs";
import { n as relTime } from "./format-BusyFQEu.mjs";
import { i as TriangleAlert } from "../_libs/lucide-react.mjs";
import { r as isAging, t as agingHoursForWork } from "./scoring-Bp88wWL5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/item-card-BhTEeTSG.js
var import_jsx_runtime = require_jsx_runtime();
function WorkCard({ item, locale }) {
	const aging = isAging(item.last_transition_at, agingHoursForWork(item.priority));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/ops/eng/$id",
		params: { id: item.id },
		className: "block rounded-lg border border-border bg-surface p-4 transition-colors duration-150 hover:border-border-strong hover:bg-surface-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1.5 flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdChip, { id: item.id }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { value: item.priority }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkTypeChip, {
								type: item.type,
								locale
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkStatusChip, {
								status: item.status,
								locale
							}),
							item.blocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 text-[11px] text-p0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-3" }), "blocked"]
							}) : null,
							aging ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-p1",
								children: "aging"
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium leading-snug",
						children: item.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 truncate text-xs text-muted",
						children: [
							item.product_module,
							item.assignee_name ? ` · ${item.assignee_name}` : "",
							item.owner_name ? ` · ${item.owner_name}` : ""
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-right",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-lg tabular-nums text-accent",
					children: item.computed_score
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] text-subtle",
					children: relTime(item.updated_at, locale)
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex flex-wrap gap-1",
			children: [
				item.flag_growth ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { children: "growth" }) : null,
				item.flag_retention ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { children: "retention" }) : null,
				item.flag_payment ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { children: "payment" }) : null,
				item.flag_stability ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { children: "stability" }) : null,
				item.flag_network ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { children: "network" }) : null
			]
		})]
	});
}
function TicketCard({ ticket, locale, href }) {
	const slaBreached = Boolean(ticket.sla_due_at) && new Date(ticket.sla_due_at).getTime() < Date.now() && ![
		"resolved",
		"closed",
		"duplicate"
	].includes(ticket.status);
	const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-1.5 flex flex-wrap items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdChip, { id: ticket.id }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketPriorityBadge, { value: ticket.priority }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketCatChip, {
					category: ticket.category,
					locale
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketStatusChip, {
					status: ticket.status,
					locale
				}),
				slaBreached ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] text-p0",
					children: "SLA"
				}) : null
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium leading-snug",
			children: ticket.subject
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-1 truncate text-xs text-muted",
			children: [
				ticket.customer_name ?? "—",
				ticket.device ? ` · ${ticket.device}` : "",
				ticket.assignee_name ? ` · ${ticket.assignee_name}` : ""
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-[10px] text-subtle",
			children: relTime(ticket.updated_at, locale)
		})
	] });
	const cls = "block rounded-lg border border-border bg-surface p-4 transition-colors duration-150 hover:border-border-strong hover:bg-surface-2";
	if (href === "portal") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/portal/$id",
		params: { id: ticket.id },
		className: cls,
		children: inner
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/ops/desk/$id",
		params: { id: ticket.id },
		className: cls,
		children: inner
	});
}
function Flag({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "rounded-full bg-bg px-2 py-0.5 text-[10px] tracking-wide text-subtle",
		children
	});
}
function EmptyState({ title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-dashed border-border px-6 py-16 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "serif text-xl",
			children: title
		}), body ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mx-auto mt-2 max-w-md text-sm text-muted",
			children: body
		}) : null]
	});
}
//#endregion
export { TicketCard as n, WorkCard as r, EmptyState as t };
