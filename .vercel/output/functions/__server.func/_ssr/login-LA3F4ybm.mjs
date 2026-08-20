import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as t, l as useLocale } from "./locale-store-DzqSZ9A_.mjs";
import { t as GROK_PROVIDERS } from "./server-CAtz4hAG.mjs";
import { t as Button } from "./button-Dk7rzdxt.mjs";
import { n as Input, t as Field } from "./input-h4AR-jrR.mjs";
import { r as signIn, t as authClient } from "./client-sGid3STf.mjs";
import { n as useCurrentUserState } from "./use-current-user-DZ7NZd4-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-LA3F4ybm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const locale = useLocale((s) => s.locale);
	const setLocale = useLocale((s) => s.setLocale);
	const navigate = useNavigate();
	const { user, isPending } = useCurrentUserState();
	const [mode, setMode] = (0, import_react.useState)("in");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (!isPending && user) navigate({ to: "/ops" });
	async function onEmail(e) {
		e.preventDefault();
		setError(null);
		setBusy(true);
		try {
			if (mode === "up") {
				const res = await authClient.signUp.email({
					name: name || email.split("@")[0],
					email,
					password
				});
				if (res.error) throw new Error(res.error.message);
			} else {
				const res = await authClient.signIn.email({
					email,
					password
				});
				if (res.error) throw new Error(res.error.message);
			}
			await navigate({ to: "/ops" });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative min-h-screen bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-y-0 left-0 hidden w-1/2 border-r border-border lg:block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-full flex-col justify-between p-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "serif text-2xl",
						children: "MoniFlow"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] tracking-[0.18em] text-subtle uppercase",
						children: t(locale, "tagline")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "serif mt-4 max-w-sm text-4xl leading-tight",
						children: t(locale, "firstAccount")
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-subtle",
						children: "MoniChat · 2026"
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex min-h-screen items-center justify-center px-5 py-16 lg:ml-[50%]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-8 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "serif text-3xl",
							children: t(locale, "signIn")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setLocale(locale === "mn" ? "en" : "mn"),
							className: "h-10 px-2 font-mono text-xs text-muted",
							children: locale === "mn" ? "EN" : "MN"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "secondary",
							className: "w-full",
							onClick: () => void signIn(p.providerId, { callbackURL: "/ops" }),
							children: p.providerId === "grok-google" ? t(locale, "continueGoogle") : t(locale, "continueX")
						}, p.providerId))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "my-6 flex items-center gap-3 text-[11px] tracking-wide text-subtle uppercase",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" }),
							locale === "mn" ? "эсвэл имэйл" : "or email",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "space-y-3",
						onSubmit: (e) => void onEmail(e),
						children: [
							mode === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: t(locale, "name"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: name,
									onChange: (e) => setName(e.target.value),
									autoComplete: "name"
								})
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: t(locale, "email"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "email",
									required: true,
									value: email,
									onChange: (e) => setEmail(e.target.value),
									autoComplete: "email"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: t(locale, "password"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "password",
									required: true,
									minLength: 8,
									value: password,
									onChange: (e) => setPassword(e.target.value),
									autoComplete: mode === "up" ? "new-password" : "current-password"
								})
							}),
							error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-p0",
								children: error
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "w-full",
								disabled: busy,
								children: mode === "up" ? t(locale, "signUp") : t(locale, "signIn")
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-4 text-sm text-muted hover:text-fg",
						onClick: () => setMode(mode === "up" ? "in" : "up"),
						children: mode === "up" ? t(locale, "signIn") : t(locale, "signUp")
					})
				]
			})
		})]
	});
}
//#endregion
export { Login as component };
