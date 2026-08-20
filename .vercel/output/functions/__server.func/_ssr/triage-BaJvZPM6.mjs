import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as t, l as useLocale } from "./locale-store-DzqSZ9A_.mjs";
import { o as listWorkItems } from "./work-Bx14KpU3.mjs";
import { r as PageHeader } from "./app-shell-D08HiN12.mjs";
import { r as WorkCard, t as EmptyState } from "./item-card-BhTEeTSG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/triage-BaJvZPM6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Triage() {
	const locale = useLocale((s) => s.locale);
	const [items, setItems] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		listWorkItems({ data: {} }).then((rows) => setItems(rows.filter((r) => [
			"new",
			"triage",
			"needs_info"
		].includes(r.status))));
	}, []);
	const missing = items.filter((i) => !i.actual_behavior && !i.steps_to_reproduce);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: t(locale, "engineering"),
				title: t(locale, "triage"),
				description: locale === "mn" ? "Шинэ, мэдээлэл дутуу, эзэнгүй зүйлс." : "New, needs-info, and unowned items."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkCard, {
					item,
					locale
				}, item.id)), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { title: t(locale, "emptyEng") }) : null]
			}),
			missing.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-xs text-p1",
				children: [
					locale === "mn" ? "Нотлох баримт дутуу" : "Missing evidence",
					": ",
					missing.length
				]
			}) : null
		]
	});
}
//#endregion
export { Triage as component };
