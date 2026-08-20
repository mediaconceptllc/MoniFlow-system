import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as listMembers, r as getMe, s as setMemberRole } from "./app-BKKSBMjb.mjs";
import { c as t, l as useLocale, n as ROLE_LABEL, s as label } from "./locale-store-DzqSZ9A_.mjs";
import { t as Select } from "./select-BWJQoe6m.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as ROLES } from "./types-Cz51tgQ5.mjs";
import { r as PageHeader } from "./app-shell-D08HiN12.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-Cozc2w2R.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPage() {
	const locale = useLocale((s) => s.locale);
	const [me, setMe] = (0, import_react.useState)(null);
	const [members, setMembers] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		getMe().then((r) => setMe(r.profile));
		listMembers().then(setMembers);
	}, []);
	if (me && me.role !== "admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: t(locale, "noPermission")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: t(locale, "staffOnly"),
			title: t(locale, "admin")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-hidden rounded-xl border border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-surface text-xs tracking-wide text-muted uppercase",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: t(locale, "name")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: t(locale, "email")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: t(locale, "role")
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: members.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: m.display_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-muted",
							children: m.email ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								value: m.role,
								onChange: (e) => {
									const role = e.target.value;
									setMemberRole({ data: {
										userId: m.id,
										role
									} }).then(() => setMembers((rows) => rows.map((r) => r.id === m.id ? {
										...r,
										role
									} : r))).catch((err) => toast.error(err instanceof Error ? err.message : "Denied"));
								},
								children: ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: r,
									children: label(ROLE_LABEL, r, locale)
								}, r))
							})
						})
					]
				}, m.id)) })]
			})
		})]
	});
}
//#endregion
export { AdminPage as component };
