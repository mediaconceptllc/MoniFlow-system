import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as cn } from "./utils-D9lm1PsI.mjs";
import { t as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/modal-Bbixcg1E.js
var import_jsx_runtime = require_jsx_runtime();
function Modal({ open, onOpenChange, title, description, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-bg/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: cn("fixed top-1/2 left-1/2 z-50 max-h-[86vh] w-[min(640px,calc(100%-1.5rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-border bg-bg-elevated p-5 shadow-soft focus:outline-none", className),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "serif text-xl text-fg",
					children: title
				}), description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "mt-1 text-sm text-muted",
					children: description
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "sr-only",
					children: title
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
					className: "grid size-10 place-items-center rounded-sm text-muted hover:bg-surface hover:text-fg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})]
			}), children]
		})] })
	});
}
//#endregion
export { Modal as t };
