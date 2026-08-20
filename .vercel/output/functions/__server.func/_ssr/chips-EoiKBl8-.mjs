import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as WORK_STATUS_LABEL, i as TICKET_STATUS_LABEL, o as WORK_TYPE_LABEL, r as TICKET_CAT_LABEL, s as label } from "./locale-store-DzqSZ9A_.mjs";
import { t as cn } from "./utils-D9lm1PsI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chips-EoiKBl8-.js
var import_jsx_runtime = require_jsx_runtime();
function Badge({ className, tone = "muted", children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide", {
			muted: "bg-surface-2 text-muted",
			p0: "bg-p0/15 text-p0",
			p1: "bg-p1/15 text-p1",
			p2: "bg-p2/15 text-p2",
			p3: "bg-surface-2 text-subtle",
			ok: "bg-ok/15 text-ok",
			warn: "bg-warn/15 text-warn",
			danger: "bg-danger/15 text-danger",
			eng: "bg-track-eng/15 text-track-eng",
			desk: "bg-track-desk/15 text-track-desk"
		}[tone], className),
		children
	});
}
function PriorityBadge({ value }) {
	const tone = value.toLowerCase();
	const mapped = [
		"p0",
		"p1",
		"p2",
		"p3"
	].includes(tone) ? tone : "muted";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		tone: mapped,
		children: value
	});
}
function TicketPriorityBadge({ value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		tone: {
			urgent: "danger",
			high: "warn",
			normal: "p2",
			low: "muted"
		}[value] ?? "muted",
		children: value
	});
}
function WorkStatusChip({ status, locale }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		tone: status === "qa_failed" || status === "rejected" ? "danger" : status === "released" || status === "verified" || status === "closed" ? "ok" : status === "ready_for_qa" || status === "ready_for_release" ? "warn" : "muted",
		children: label(WORK_STATUS_LABEL, status, locale)
	});
}
function TicketStatusChip({ status, locale }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		tone: status === "escalated" ? "warn" : status === "resolved" || status === "closed" ? "ok" : status === "new" ? "danger" : "muted",
		children: label(TICKET_STATUS_LABEL, status, locale)
	});
}
function WorkTypeChip({ type, locale }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		tone: "eng",
		children: label(WORK_TYPE_LABEL, type, locale)
	});
}
function TicketCatChip({ category, locale }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		tone: "desk",
		children: label(TICKET_CAT_LABEL, category, locale)
	});
}
function IdChip({ id }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "font-mono text-[11px] tracking-wide text-muted tabular-nums",
		children: id
	});
}
//#endregion
export { TicketPriorityBadge as a, WorkTypeChip as c, TicketCatChip as i, IdChip as n, TicketStatusChip as o, PriorityBadge as r, WorkStatusChip as s, Badge as t };
