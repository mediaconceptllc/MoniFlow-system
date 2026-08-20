import { m as Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as AppShell } from "./app-shell-D08HiN12.mjs";
import { t as AuthGate } from "./auth-gate-CYr4wcoG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal-sjjPrAVL.js
var import_jsx_runtime = require_jsx_runtime();
function PortalLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		track: "portal",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	}) });
}
//#endregion
export { PortalLayout as component };
