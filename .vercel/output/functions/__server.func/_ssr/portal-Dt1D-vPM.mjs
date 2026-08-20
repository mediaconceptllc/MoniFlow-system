import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as t, l as useLocale } from "./locale-store-DzqSZ9A_.mjs";
import { t as Button } from "./button-Dk7rzdxt.mjs";
import { o as listTickets } from "./tickets-BqGqAz2_.mjs";
import { r as PageHeader } from "./app-shell-D08HiN12.mjs";
import { n as TicketCard, t as EmptyState } from "./item-card-BhTEeTSG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal-Dt1D-vPM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PortalHome() {
	const locale = useLocale((s) => s.locale);
	const [rows, setRows] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		listTickets({ data: { portal: true } }).then(setRows);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: t(locale, "portal"),
			title: t(locale, "myTickets"),
			description: t(locale, "portalBlurb"),
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/portal/new",
					children: t(locale, "reportIssue")
				})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [rows.map((ticket) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketCard, {
				ticket,
				locale,
				href: "portal"
			}, ticket.id)), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: t(locale, "emptyPortal"),
				body: t(locale, "portalBlurb")
			}) : null]
		})]
	});
}
//#endregion
export { PortalHome as component };
