import { o as __toESM } from "./_runtime.mjs";
import { m as nextWorkStatuses } from "./_ssr/workflow-Da-XSiWn.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { r as getMe } from "./_ssr/app-BKKSBMjb.mjs";
import { a as WORK_STATUS_LABEL, c as t, l as useLocale, s as label, t as COMMENT_KIND_LABEL } from "./_ssr/locale-store-DzqSZ9A_.mjs";
import { c as WorkTypeChip, n as IdChip, r as PriorityBadge, s as WorkStatusChip } from "./_ssr/chips-EoiKBl8-.mjs";
import { n as relTime, t as absDate } from "./_ssr/format-BusyFQEu.mjs";
import { n as Route } from "./_ssr/router-DwG3Czr7.mjs";
import { t as Button } from "./_ssr/button-Dk7rzdxt.mjs";
import { n as Input, r as Textarea, t as Field } from "./_ssr/input-h4AR-jrR.mjs";
import { t as Select } from "./_ssr/select-BWJQoe6m.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { t as DECISION_KINDS } from "./_ssr/types-Cz51tgQ5.mjs";
import { n as computeScore } from "./_ssr/scoring-Bp88wWL5.mjs";
import { c as transitionWork, i as getWorkItem, l as updateWorkItem, n as addWorkComment, s as recordDecision, t as addTestRun } from "./_ssr/work-Bx14KpU3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-IrpGwzlp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WorkDetail() {
	const { id } = Route.useParams();
	const locale = useLocale((s) => s.locale);
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [item, setItem] = (0, import_react.useState)(null);
	const [comments, setComments] = (0, import_react.useState)([]);
	const [decisions, setDecisions] = (0, import_react.useState)([]);
	const [transitions, setTransitions] = (0, import_react.useState)([]);
	const [attachments, setAttachments] = (0, import_react.useState)([]);
	const [tests, setTests] = (0, import_react.useState)([]);
	const [linked, setLinked] = (0, import_react.useState)([]);
	const [body, setBody] = (0, import_react.useState)("");
	const [kind, setKind] = (0, import_react.useState)("note");
	const [dKind, setDKind] = (0, import_react.useState)("approve");
	const [rationale, setRationale] = (0, import_react.useState)("");
	const [testTitle, setTestTitle] = (0, import_react.useState)("Acceptance pass");
	const [testResult, setTestResult] = (0, import_react.useState)("pass");
	const [testEvidence, setTestEvidence] = (0, import_react.useState)("");
	const [reason, setReason] = (0, import_react.useState)("");
	const load = (0, import_react.useCallback)(async () => {
		const [me, data] = await Promise.all([getMe(), getWorkItem({ data: id })]);
		setProfile(me.profile);
		if (!data) {
			setItem(null);
			return;
		}
		setItem(data.item);
		setComments(data.comments);
		setDecisions(data.decisions);
		setTransitions(data.transitions);
		setAttachments(data.attachments);
		setTests(data.tests);
		setLinked(data.linkedTickets);
	}, [id]);
	(0, import_react.useEffect)(() => {
		load().catch((err) => toast.error(String(err)));
	}, [load]);
	if (!item) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: t(locale, "loading")
	});
	const next = profile ? nextWorkStatuses(item.status, profile.role) : [];
	const score = computeScore(item);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-wrap items-start justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdChip, { id: item.id }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { value: item.priority }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkTypeChip, {
							type: item.type,
							locale
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkStatusChip, {
							status: item.status,
							locale
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "serif max-w-3xl text-3xl sm:text-4xl",
					children: item.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted",
					children: [
						item.product_module,
						" · ",
						item.environment,
						" · ",
						item.owner_name ?? "—"
					]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-surface px-4 py-3 text-right",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] tracking-wide text-muted uppercase",
					children: t(locale, "score")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-3xl tabular-nums",
					children: score
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-[1fr_280px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl border border-border bg-surface p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mb-3 text-xs tracking-[0.16em] text-subtle uppercase",
							children: "Problem"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "space-y-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: t(locale, "expected"),
									v: item.expected_behavior
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: t(locale, "whatHappened"),
									v: item.actual_behavior
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: t(locale, "steps"),
									v: item.steps_to_reproduce
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: t(locale, "rationale"),
									v: item.priority_rationale
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: t(locale, "acceptance"),
									v: item.acceptance_criteria
								}),
								item.blocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: t(locale, "blocked"),
									v: item.blocker_note
								}) : null
							]
						})]
					}),
					attachments.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl border border-border bg-surface p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mb-3 text-xs tracking-[0.16em] text-subtle uppercase",
							children: t(locale, "evidence")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: attachments.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
								className: "overflow-hidden rounded-md border border-border",
								children: [a.data_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: a.data_url,
									alt: a.caption ?? a.filename,
									className: "max-h-56 w-full object-cover"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "px-3 py-6 text-center text-xs text-muted",
									children: a.filename
								}), a.caption ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
									className: "px-3 py-2 text-xs text-muted",
									children: a.caption
								}) : null]
							}, a.id))
						})]
					}) : null,
					linked.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl border border-border bg-surface p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mb-2 text-xs tracking-[0.16em] text-subtle uppercase",
								children: t(locale, "linkedTicket")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-2 text-xs text-subtle",
								children: t(locale, "tracksNeverMix")
							}),
							linked.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/ops/desk/$id",
								params: { id: l.ticket_id },
								className: "block font-mono text-sm hover:text-accent",
								children: [l.ticket_id, l.reason ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 font-sans text-muted",
									children: l.reason
								}) : null]
							}, l.ticket_id))
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl border border-border bg-surface p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mb-3 text-xs tracking-[0.16em] text-subtle uppercase",
								children: t(locale, "decide")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2 sm:grid-cols-[140px_1fr_auto]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
										value: dKind,
										onChange: (e) => setDKind(e.target.value),
										children: DECISION_KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: k,
											children: k
										}, k))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: rationale,
										onChange: (e) => setRationale(e.target.value),
										placeholder: t(locale, "rationale")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "secondary",
										onClick: () => {
											recordDecision({ data: {
												id: item.id,
												kind: dKind,
												rationale
											} }).then(() => {
												setRationale("");
												return load();
											}).catch((err) => toast.error(err instanceof Error ? err.message : "Denied"));
										},
										children: t(locale, "recordDecision")
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-4 space-y-3",
								children: decisions.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "border-t border-border pt-3 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted",
										children: [
											d.kind,
											" · ",
											d.approver_name,
											" · ",
											relTime(d.created_at, locale)
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1",
										children: d.rationale
									})]
								}, d.id))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl border border-border bg-surface p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mb-3 text-xs tracking-[0.16em] text-subtle uppercase",
								children: t(locale, "qaEvidence")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: testTitle,
									onChange: (e) => setTestTitle(e.target.value)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: testResult,
									onChange: (e) => setTestResult(e.target.value),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "pass",
											children: "pass"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "fail",
											children: "fail"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "blocked",
											children: "blocked"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								className: "mt-2",
								value: testEvidence,
								onChange: (e) => setTestEvidence(e.target.value),
								placeholder: t(locale, "evidence")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "mt-2",
								variant: "secondary",
								onClick: () => {
									addTestRun({ data: {
										id: item.id,
										title: testTitle,
										result: testResult,
										evidence: testEvidence
									} }).then(load).catch((err) => toast.error(err instanceof Error ? err.message : "Denied"));
								},
								children: t(locale, "submit")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-4 space-y-2 text-sm",
								children: tests.map((tr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "rounded-md border border-border px-3 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										tr.result,
										" · ",
										tr.title,
										" · ",
										tr.tester_name
									] }), tr.evidence ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted",
										children: tr.evidence
									}) : null]
								}, tr.id))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl border border-border bg-surface p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mb-3 text-xs tracking-[0.16em] text-subtle uppercase",
								children: t(locale, "comment")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-4",
								children: [...transitions.map((x) => ({
									kind: "transition",
									at: x.created_at,
									x
								})), ...comments.map((x) => ({
									kind: "comment",
									at: x.created_at,
									x
								}))].sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime()).map((entry) => entry.kind === "transition" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted",
									children: [
										entry.x.actor_name,
										": ",
										entry.x.from_status ?? "∅",
										" → ",
										label(WORK_STATUS_LABEL, entry.x.to_status, locale),
										entry.x.reason ? ` — ${entry.x.reason}` : "",
										" · ",
										relTime(entry.at, locale)
									]
								}, entry.x.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted",
									children: [
										entry.x.author_name,
										" · ",
										label(COMMENT_KIND_LABEL, entry.x.kind, locale),
										" · ",
										relTime(entry.at, locale)
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm",
									children: entry.x.body
								})] }, entry.x.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 grid gap-2 sm:grid-cols-[140px_1fr_auto]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
										value: kind,
										onChange: (e) => setKind(e.target.value),
										children: [
											"note",
											"question",
											"answer",
											"risk",
											"evidence"
										].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: k,
											children: label(COMMENT_KIND_LABEL, k, locale)
										}, k))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: body,
										onChange: (e) => setBody(e.target.value)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "secondary",
										onClick: () => {
											addWorkComment({ data: {
												id: item.id,
												body,
												kind
											} }).then(() => {
												setBody("");
												return load();
											});
										},
										children: t(locale, "addComment")
									})
								]
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-2 text-[11px] tracking-wide text-muted uppercase",
							children: t(locale, "nextAction")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: t(locale, "status"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: "",
								onChange: (e) => {
									const to = e.target.value;
									if (!to) return;
									transitionWork({ data: {
										id: item.id,
										to,
										reason
									} }).then(load).catch((err) => toast.error(err instanceof Error ? err.message : "Denied"));
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: label(WORK_STATUS_LABEL, item.status, locale)
								}), next.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: s,
									children: label(WORK_STATUS_LABEL, s, locale)
								}, s))]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-2",
							placeholder: t(locale, "rationale"),
							value: reason,
							onChange: (e) => setReason(e.target.value)
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl border border-border bg-surface p-4 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-2 text-[11px] tracking-wide text-muted uppercase",
							children: t(locale, "owner")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: item.owner_name ?? "—" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-[11px] tracking-wide text-muted uppercase",
							children: t(locale, "assignee")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: item.assignee_name ?? "—" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-[11px] tracking-wide text-muted uppercase",
							children: t(locale, "effort")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono tabular-nums",
							children: [
								item.effort,
								" · ",
								item.confidence
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-[11px] tracking-wide text-muted uppercase",
							children: t(locale, "updated")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted",
							children: absDate(item.updated_at)
						}),
						item.pr_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: item.pr_url,
							className: "mt-3 block text-xs text-accent",
							target: "_blank",
							rel: "noreferrer",
							children: item.pr_url
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-4 w-full",
							variant: "secondary",
							onClick: () => {
								updateWorkItem({ data: {
									id: item.id,
									patch: {
										blocked: !item.blocked,
										blocker_note: item.blocked ? null : "Flagged from detail"
									}
								} }).then(load);
							},
							children: item.blocked ? "Unblock" : t(locale, "blocked")
						})
					]
				})]
			})]
		})]
	});
}
function Row({ k, v }) {
	if (!v) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-xs text-muted",
		children: k
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "mt-1 whitespace-pre-wrap",
		children: v
	})] });
}
//#endregion
export { WorkDetail as component };
