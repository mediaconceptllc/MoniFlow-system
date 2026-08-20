import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as useCurrentUserState } from "./use-current-user-DZ7NZd4-.mjs";
import { t as RedirectToSignIn } from "./gates-Bd6SxBtl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-gate-CYr4wcoG.js
var import_jsx_runtime = require_jsx_runtime();
function AuthGate({ children }) {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-bg text-muted",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-8 animate-pulse rounded-sm bg-surface-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm",
				children: "…"
			})]
		})
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
//#endregion
export { AuthGate as t };
