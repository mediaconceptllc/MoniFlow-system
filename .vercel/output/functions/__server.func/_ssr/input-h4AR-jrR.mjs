import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as cn } from "./utils-D9lm1PsI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/input-h4AR-jrR.js
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-10 w-full rounded-sm border border-border bg-bg px-3 text-sm text-fg placeholder:text-subtle outline-none transition-colors duration-150 focus:border-border-strong focus:ring-2 focus:ring-ring/30", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("min-h-24 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg placeholder:text-subtle outline-none transition-colors duration-150 focus:border-border-strong focus:ring-2 focus:ring-ring/30", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("mb-1.5 block text-xs font-medium tracking-wide text-muted", className),
		...props
	});
}
function Field({ label, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
//#endregion
export { Input as n, Textarea as r, Field as t };
