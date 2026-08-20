import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as t, r as TICKET_CAT_LABEL, s as label } from "./locale-store-DzqSZ9A_.mjs";
import { t as Button } from "./button-Dk7rzdxt.mjs";
import { n as Input, r as Textarea, t as Field } from "./input-h4AR-jrR.mjs";
import { t as Select } from "./select-BWJQoe6m.mjs";
import { a as TICKET_CATEGORIES, o as TICKET_PRIORITIES } from "./types-Cz51tgQ5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ticket-form-CXV6AJpY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TicketForm({ locale, onSubmit, busy, showPriority }) {
	const [subject, setSubject] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	const [expected, setExpected] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("bug");
	const [priority, setPriority] = (0, import_react.useState)("normal");
	const [device, setDevice] = (0, import_react.useState)("");
	const [os, setOs] = (0, import_react.useState)("");
	const [version, setVersion] = (0, import_react.useState)("");
	const [file, setFile] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-4",
		onSubmit: (e) => {
			e.preventDefault();
			onSubmit({
				subject,
				body,
				category,
				expected_behavior: expected,
				device,
				os_name: os,
				app_version: version,
				priority: showPriority ? priority : void 0,
				evidenceDataUrl: file?.dataUrl,
				evidenceName: file?.name
			});
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: t(locale, "captureHint")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t(locale, "category"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
					value: category,
					onChange: (e) => setCategory(e.target.value),
					children: TICKET_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: c,
						children: label(TICKET_CAT_LABEL, c, locale)
					}, c))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t(locale, "subject"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: subject,
					onChange: (e) => setSubject(e.target.value),
					required: true,
					maxLength: 160
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t(locale, "whatHappened"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: body,
					onChange: (e) => setBody(e.target.value),
					required: true,
					rows: 4
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t(locale, "expected"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: expected,
					onChange: (e) => setExpected(e.target.value),
					rows: 2
				})
			}),
			showPriority ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t(locale, "priority"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
					value: priority,
					onChange: (e) => setPriority(e.target.value),
					children: TICKET_PRIORITIES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: p,
						children: p
					}, p))
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t(locale, "device"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: device,
							onChange: (e) => setDevice(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "OS",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: os,
							onChange: (e) => setOs(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t(locale, "version"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: version,
							onChange: (e) => setVersion(e.target.value)
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t(locale, "attach"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "file",
					accept: "image/*",
					onChange: (e) => {
						const f = e.target.files?.[0];
						if (!f) return;
						if (f.size > 7e5) return;
						const r = new FileReader();
						r.onload = () => setFile({
							name: f.name,
							dataUrl: String(r.result)
						});
						r.readAsDataURL(f);
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: busy || !subject.trim() || !body.trim(),
					children: t(locale, "submit")
				})
			})
		]
	});
}
//#endregion
export { TicketForm as t };
