import { o as __toESM } from "./_runtime.mjs";
import { o as canEscalate, p as nextTicketStatuses } from "./_ssr/workflow-Da-XSiWn.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { r as getMe } from "./_ssr/app-BKKSBMjb.mjs";
import { c as t, i as TICKET_STATUS_LABEL, l as useLocale, s as label } from "./_ssr/locale-store-DzqSZ9A_.mjs";
import { a as TicketPriorityBadge, i as TicketCatChip, n as IdChip, o as TicketStatusChip } from "./_ssr/chips-EoiKBl8-.mjs";
import { n as relTime, t as absDate } from "./_ssr/format-BusyFQEu.mjs";
import { r as Route$2 } from "./_ssr/router-DwG3Czr7.mjs";
import { t as Button } from "./_ssr/button-Dk7rzdxt.mjs";
import { n as Input, r as Textarea, t as Field } from "./_ssr/input-h4AR-jrR.mjs";
import { t as Select } from "./_ssr/select-BWJQoe6m.mjs";
import { a as getTicket, i as escalateTicket, n as assignTicket, s as transitionTicket, t as addTicketComment } from "./_ssr/tickets-BqGqAz2_.mjs";
import { n as toast } from "./_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-BN4NuKsC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TicketDetail() {
	const { id } = Route$2.useParams();
	const locale = useLocale((s) => s.locale);
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [ticket, setTicket] = (0, import_react.useState)(null);
	const [comments, setComments] = (0, import_react.useState)([]);
	const [transitions, setTransitions] = (0, import_react.useState)([]);
	const [attachments, setAttachments] = (0, import_react.useState)([]);
	const [links, setLinks] = (0, import_react.useState)([]);
	const [body, setBody] = (0, import_react.useState)("");
	const [esc, setEsc] = (0, import_react.useState)("");
	const [reason, setReason] = (0, import_react.useState)("");
	const load = (0, import_react.useCallback)(async () => {
		const [me, data] = await Promise.all([getMe(), getTicket({ data: id })]);
		setProfile(me.profile);
		if (!data) {
			setTicket(null);
			return;
		}
		setTicket(data.ticket);
		setComments(data.comments);
		setTransitions(data.transitions);
		setAttachments(data.attachments);
		setLinks(data.links);
	}, [id]);
	(0, import_react.useEffect)(() => {
		load().catch((err) => toast.error(String(err)));
	}, [load]);
	if (!ticket) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: t(locale, "loading")
	});
	const next = profile ? nextTicketStatuses(ticket.status, profile.role) : [];
	const slaBreached = ticket.sla_due_at && new Date(ticket.sla_due_at).getTime() < Date.now() && ![
		"resolved",
		"closed",
		"duplicate"
	].includes(ticket.status);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdChip, { id: ticket.id }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketPriorityBadge, { value: ticket.priority }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketCatChip, {
						category: ticket.category,
						locale
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketStatusChip, {
						status: ticket.status,
						locale
					}),
					slaBreached ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-p0",
						children: "SLA"
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "serif max-w-3xl text-3xl sm:text-4xl",
				children: ticket.subject
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted",
				children: [
					t(locale, "customer"),
					": ",
					ticket.customer_name,
					" · ",
					ticket.customer_email
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-6 lg:grid-cols-[1fr_280px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-xl border border-border bg-surface p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "whitespace-pre-wrap text-sm",
								children: ticket.body
							}), ticket.expected_behavior ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-4 text-sm text-muted",
								children: [
									t(locale, "expected"),
									": ",
									ticket.expected_behavior
								]
							}) : null]
						}),
						attachments.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
							className: "rounded-xl border border-border bg-surface p-5",
							children: attachments.map((a) => a.data_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: a.data_url,
								alt: a.filename,
								className: "max-h-64 rounded-md"
							}, a.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: a.filename
							}, a.id))
						}) : null,
						links.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-xl border border-border bg-surface p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mb-2 text-xs tracking-[0.16em] text-subtle uppercase",
									children: t(locale, "linkedWork")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-3 text-xs text-subtle",
									children: t(locale, "tracksNeverMix")
								}),
								links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/ops/eng/$id",
									params: { id: l.work_item_id },
									className: "block rounded-md border border-border px-3 py-2 text-sm hover:bg-surface-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xs",
										children: l.work_item_id
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-2",
										children: l.title
									})]
								}, l.work_item_id))
							]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-xl border border-border bg-surface p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mb-3 text-xs tracking-[0.16em] text-subtle uppercase",
									children: t(locale, "comment")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-3",
									children: comments.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted",
										children: [
											c.author_name,
											" · ",
											relTime(c.created_at, locale)
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm",
										children: c.body
									})] }, c.id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: body,
										onChange: (e) => setBody(e.target.value)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "secondary",
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
						}),
						profile && canEscalate(profile.role) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-xl border border-border bg-surface p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mb-2 text-xs tracking-[0.16em] text-subtle uppercase",
									children: t(locale, "escalate")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-3 text-xs text-muted",
									children: t(locale, "tracksNeverMix")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: esc,
									onChange: (e) => setEsc(e.target.value),
									rows: 2
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: "mt-2",
									onClick: () => {
										escalateTicket({ data: {
											id: ticket.id,
											reason: esc
										} }).then((r) => {
											toast.success(r.workId);
											return load();
										}).catch((err) => toast.error(err instanceof Error ? err.message : "Denied"));
									},
									children: t(locale, "escalate")
								})
							]
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-xl border border-border bg-surface p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: t(locale, "status"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: "",
										onChange: (e) => {
											const to = e.target.value;
											if (!to) return;
											transitionTicket({ data: {
												id: ticket.id,
												to,
												reason
											} }).then(load).catch((err) => toast.error(err instanceof Error ? err.message : "Denied"));
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: label(TICKET_STATUS_LABEL, ticket.status, locale)
										}), next.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: s,
											children: label(TICKET_STATUS_LABEL, s, locale)
										}, s))]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "mt-2",
									value: reason,
									onChange: (e) => setReason(e.target.value),
									placeholder: t(locale, "rationale")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: "mt-3 w-full",
									variant: "secondary",
									onClick: () => {
										if (!profile) return;
										assignTicket({ data: {
											id: ticket.id,
											assigneeName: profile.display_name,
											assigneeId: profile.id
										} }).then(load);
									},
									children: locale === "mn" ? "Надад оноох" : "Assign to me"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-xl border border-border bg-surface p-4 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted uppercase",
									children: t(locale, "device")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									ticket.device ?? "—",
									" · ",
									ticket.os_name ?? "—"
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-[11px] text-muted uppercase",
									children: t(locale, "version")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: ticket.app_version ?? "—" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-[11px] text-muted uppercase",
									children: "SLA"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: ticket.sla_due_at ? absDate(ticket.sla_due_at) : "—" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-[11px] text-muted uppercase",
									children: t(locale, "assignee")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: ticket.assignee_name ?? "—" })
							]
						}),
						transitions.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
							className: "rounded-xl border border-border bg-surface p-4 text-xs text-muted",
							children: transitions.map((tr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mb-2",
								children: [
									tr.from_status ?? "∅",
									" → ",
									tr.to_status,
									" · ",
									tr.actor_name
								]
							}, tr.id))
						}) : null
					]
				})]
			})
		]
	});
}
//#endregion
export { TicketDetail as component };
