import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as t, l as useLocale } from "./locale-store-DzqSZ9A_.mjs";
import { t as Button } from "./button-Dk7rzdxt.mjs";
import { n as Input } from "./input-h4AR-jrR.mjs";
import { t as Select } from "./select-BWJQoe6m.mjs";
import { o as listTickets, r as createTicket } from "./tickets-BqGqAz2_.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as TICKET_CATEGORIES, o as TICKET_PRIORITIES, s as TICKET_STATUSES } from "./types-Cz51tgQ5.mjs";
import { r as PageHeader } from "./app-shell-D08HiN12.mjs";
import { n as TicketCard, t as EmptyState } from "./item-card-BhTEeTSG.mjs";
import { t as TicketForm } from "./ticket-form-CXV6AJpY.mjs";
import { t as Modal } from "./modal-Bbixcg1E.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/desk-BP1LoMQX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DeskInbox() {
	const locale = useLocale((s) => s.locale);
	const [rows, setRows] = (0, import_react.useState)([]);
	const [q, setQ] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [category, setCategory] = (0, import_react.useState)("all");
	const [priority, setPriority] = (0, import_react.useState)("all");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function reload() {
		setRows(await listTickets({ data: {
			q,
			status,
			category,
			priority
		} }));
	}
	(0, import_react.useEffect)(() => {
		reload();
	}, [
		q,
		status,
		category,
		priority
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: t(locale, "helpdesk"),
				title: t(locale, "inbox"),
				description: t(locale, "tracksNeverMix"),
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => setOpen(true),
					children: t(locale, "newTicket")
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-5 grid gap-2 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: t(locale, "search"),
						value: q,
						onChange: (e) => setQ(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: status,
						onChange: (e) => setStatus(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: t(locale, "status")
						}), TICKET_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s,
							children: s
						}, s))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: category,
						onChange: (e) => setCategory(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: t(locale, "category")
						}), TICKET_CATEGORIES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s,
							children: s
						}, s))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: priority,
						onChange: (e) => setPriority(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: t(locale, "priority")
						}), TICKET_PRIORITIES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s,
							children: s
						}, s))]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [rows.map((ticket) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketCard, {
					ticket,
					locale,
					href: "desk"
				}, ticket.id)), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: t(locale, "emptyDesk"),
					body: t(locale, "tracksNeverMix")
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
				open,
				onOpenChange: setOpen,
				title: t(locale, "newTicket"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketForm, {
					locale,
					busy,
					showPriority: true,
					onSubmit: async (data) => {
						setBusy(true);
						try {
							const res = await createTicket({ data });
							toast.success(res.id);
							setOpen(false);
							await reload();
						} catch (err) {
							toast.error(err instanceof Error ? err.message : "Failed");
						} finally {
							setBusy(false);
						}
					}
				})
			})
		]
	});
}
//#endregion
export { DeskInbox as component };
