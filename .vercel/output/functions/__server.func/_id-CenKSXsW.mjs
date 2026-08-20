import { o as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { c as t, l as useLocale } from "./_ssr/locale-store-DzqSZ9A_.mjs";
import { i as TicketCatChip, n as IdChip, o as TicketStatusChip } from "./_ssr/chips-EoiKBl8-.mjs";
import { n as relTime } from "./_ssr/format-BusyFQEu.mjs";
import { i as Route$6 } from "./_ssr/router-DwG3Czr7.mjs";
import { t as Button } from "./_ssr/button-Dk7rzdxt.mjs";
import { n as Input } from "./_ssr/input-h4AR-jrR.mjs";
import { a as getTicket, t as addTicketComment } from "./_ssr/tickets-BqGqAz2_.mjs";
import { n as toast } from "./_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-CenKSXsW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PortalTicket() {
	const { id } = Route$6.useParams();
	const locale = useLocale((s) => s.locale);
	const [ticket, setTicket] = (0, import_react.useState)(null);
	const [comments, setComments] = (0, import_react.useState)([]);
	const [body, setBody] = (0, import_react.useState)("");
	const load = (0, import_react.useCallback)(async () => {
		const data = await getTicket({ data: id });
		if (!data) {
			setTicket(null);
			return;
		}
		setTicket(data.ticket);
		setComments(data.comments);
	}, [id]);
	(0, import_react.useEffect)(() => {
		load().catch((err) => toast.error(String(err)));
	}, [load]);
	if (!ticket) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: t(locale, "loading")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl pb-20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdChip, { id: ticket.id }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketCatChip, {
						category: ticket.category,
						locale
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketStatusChip, {
						status: ticket.status,
						locale
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "serif text-3xl",
				children: ticket.subject
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 whitespace-pre-wrap text-sm",
				children: ticket.body
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mt-8 space-y-3",
				children: comments.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-surface p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [
							c.author_name,
							" · ",
							relTime(c.created_at, locale)
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm",
						children: c.body
					})]
				}, c.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: body,
					onChange: (e) => setBody(e.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => {
						addTicketComment({ data: {
							id: ticket.id,
							body
						} }).then(() => {
							setBody("");
							return load();
						});
					},
					children: t(locale, "addComment")
				})]
			})
		]
	});
}
//#endregion
export { PortalTicket as component };
