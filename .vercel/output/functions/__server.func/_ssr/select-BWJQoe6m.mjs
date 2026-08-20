import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as cn } from "./utils-D9lm1PsI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/select-BWJQoe6m.js
var import_jsx_runtime = require_jsx_runtime();
function Select({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		className: cn("h-10 w-full appearance-none rounded-sm border border-border bg-bg bg-[length:12px] bg-[right_10px_center] bg-no-repeat px-3 pr-8 text-sm text-fg outline-none focus:border-border-strong focus:ring-2 focus:ring-ring/30", className),
		style: { backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239a9aa3' stroke-width='2'><path d='m6 9 6 6 6-6'/></svg>")` },
		...props,
		children
	});
}
//#endregion
export { Select as t };
