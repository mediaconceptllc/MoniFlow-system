import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as t, l as useLocale } from "./locale-store-DzqSZ9A_.mjs";
import { o as listTickets } from "./tickets-BqGqAz2_.mjs";
import { o as listWorkItems } from "./work-Bx14KpU3.mjs";
import { r as PageHeader } from "./app-shell-D08HiN12.mjs";
import { n as TicketCard, r as WorkCard, t as EmptyState } from "./item-card-BhTEeTSG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/my-DDZtsDdZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MyWork() {
	const locale = useLocale((s) => s.locale);
	const [work, setWork] = (0, import_react.useState)([]);
	const [tickets, setTickets] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		listWorkItems({ data: { mine: true } }).then(setWork);
		listTickets({ data: { mine: true } }).then(setTickets);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: t(locale, "welcomeBack"),
			title: t(locale, "myWork")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-10 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 serif text-2xl",
				children: t(locale, "engineering")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [work.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkCard, {
					item,
					locale
				}, item.id)), work.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { title: t(locale, "emptyEng") }) : null]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 serif text-2xl",
				children: t(locale, "helpdesk")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [tickets.map((ticket) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketCard, {
					ticket,
					locale,
					href: "desk"
				}, ticket.id)), tickets.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { title: t(locale, "emptyDesk") }) : null]
			})] })]
		})]
	});
}
//#endregion
export { MyWork as component };
