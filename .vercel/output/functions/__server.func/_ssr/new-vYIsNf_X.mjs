import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as t, l as useLocale } from "./locale-store-DzqSZ9A_.mjs";
import { r as createTicket } from "./tickets-BqGqAz2_.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as PageHeader } from "./app-shell-D08HiN12.mjs";
import { t as TicketForm } from "./ticket-form-CXV6AJpY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/new-vYIsNf_X.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PortalNew() {
	const locale = useLocale((s) => s.locale);
	const navigate = useNavigate();
	const [busy, setBusy] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl pb-20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: t(locale, "portal"),
			title: t(locale, "reportIssue"),
			description: t(locale, "portalBlurb")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-border bg-surface p-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketForm, {
				locale,
				busy,
				onSubmit: async (data) => {
					setBusy(true);
					try {
						const res = await createTicket({ data });
						toast.success(res.id);
						await navigate({
							to: "/portal/$id",
							params: { id: res.id }
						});
					} catch (err) {
						toast.error(err instanceof Error ? err.message : "Failed");
					} finally {
						setBusy(false);
					}
				}
			})
		})]
	});
}
//#endregion
export { PortalNew as component };
