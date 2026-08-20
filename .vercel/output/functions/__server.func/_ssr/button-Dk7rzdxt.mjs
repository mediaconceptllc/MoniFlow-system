import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as Slot } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-D9lm1PsI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-Dk7rzdxt.js
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm font-medium transition-opacity duration-150 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60", {
	variants: {
		variant: {
			primary: "bg-primary text-primary-fg hover:opacity-90",
			secondary: "border border-border bg-surface text-fg hover:bg-surface-2",
			ghost: "text-muted hover:text-fg hover:bg-surface",
			danger: "bg-danger text-primary-fg hover:opacity-90",
			outline: "border border-border-strong text-fg hover:bg-surface"
		},
		size: {
			sm: "h-8 px-3 text-xs",
			md: "h-10 px-4 text-sm",
			lg: "h-11 px-5 text-sm",
			icon: "size-10"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
//#endregion
export { Button as t };
