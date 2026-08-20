import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as t, l as useLocale } from "./locale-store-DzqSZ9A_.mjs";
import { n as SignedIn } from "./gates-Bd6SxBtl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CgUOAWIm.js
var import_jsx_runtime = require_jsx_runtime();
function Landing() {
	const locale = useLocale((s) => s.locale);
	const setLocale = useLocale((s) => s.setLocale);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-screen bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between px-5 py-5 sm:px-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "grid h-7 w-7 grid-cols-2 gap-0.5 p-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "rounded-[2px] bg-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "rounded-[2px] bg-muted" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "rounded-[2px] bg-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "rounded-[2px] bg-muted" })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "serif text-xl",
						children: "MoniFlow"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setLocale(locale === "mn" ? "en" : "mn"),
							className: "h-10 px-2 font-mono text-xs text-muted",
							children: locale === "mn" ? "EN" : "MN"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "inline-flex h-10 items-center rounded-sm border border-border px-4 text-sm text-fg",
							children: t(locale, "signIn")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/ops",
							className: "inline-flex h-10 items-center rounded-sm bg-primary px-4 text-sm font-medium text-primary-fg",
							children: t(locale, "command")
						}) })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "px-5 pt-10 pb-16 sm:px-10 sm:pt-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] tracking-[0.2em] text-subtle uppercase",
						children: t(locale, "tagline")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "serif mt-4 max-w-3xl text-4xl leading-[1.1] sm:text-6xl",
						children: t(locale, "landingLead")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "inline-flex h-11 items-center rounded-sm bg-primary px-5 text-sm font-medium text-primary-fg",
							children: t(locale, "signIn")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/portal",
							className: "inline-flex h-11 items-center rounded-sm border border-border px-5 text-sm text-fg",
							children: t(locale, "reportIssue")
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid border-t border-border lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "border-b border-border px-5 py-12 sm:px-10 lg:border-r lg:border-b-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-track-eng" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] tracking-[0.16em] text-subtle uppercase",
								children: t(locale, "engineering")
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "serif text-3xl",
							children: t(locale, "landingEng")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-6 space-y-2 text-sm text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "P0–P3 · score · rank · effort · strategic flags" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "New → Triage → Develop → QA → Release → Verified" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Structured decisions · immutable audit · aging alerts" })
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "px-5 py-12 sm:px-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-track-desk" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] tracking-[0.16em] text-subtle uppercase",
								children: t(locale, "helpdesk")
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "serif text-3xl",
							children: t(locale, "landingDesk")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-6 space-y-2 text-sm text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Гомдол · санал · алдаа · төлбөр · бүртгэл" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "SLA · first response · escalate (creates a linked work item)" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: t(locale, "tracksNeverMix") })
							]
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { Landing as component };
