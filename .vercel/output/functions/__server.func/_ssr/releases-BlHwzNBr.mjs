import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as t, l as useLocale } from "./locale-store-DzqSZ9A_.mjs";
import { n as IdChip, t as Badge } from "./chips-EoiKBl8-.mjs";
import { a as listReleases } from "./work-Bx14KpU3.mjs";
import { r as PageHeader } from "./app-shell-D08HiN12.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/releases-BlHwzNBr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReleasesPage() {
	const locale = useLocale((s) => s.locale);
	const [data, setData] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		listReleases().then(setData);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: t(locale, "engineering"),
			title: t(locale, "releases")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children: (data?.releases ?? []).map((rel) => {
				const included = (data?.items ?? []).filter((i) => i.release_id === rel.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl border border-border bg-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-sm text-muted",
								children: rel.id
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "serif text-2xl",
								children: rel.version
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: rel.status === "released" ? "ok" : "warn",
								children: rel.status
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-4 grid gap-3 text-sm sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted",
								children: "Rollout"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 text-muted",
								children: rel.rollout
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted",
								children: "Rollback"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 text-muted",
								children: rel.rollback_plan
							})] })]
						}),
						rel.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm",
							children: rel.notes
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 space-y-2",
							children: included.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/ops/eng/$id",
								params: { id: i.work_item_id },
								className: "flex items-center gap-2 text-sm hover:text-accent",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdChip, { id: i.work_item_id }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: i.title }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-subtle",
										children: i.status
									})
								]
							}) }, i.work_item_id))
						})
					]
				}, rel.id);
			})
		})]
	});
}
//#endregion
export { ReleasesPage as component };
