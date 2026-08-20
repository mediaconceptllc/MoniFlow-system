import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as t, l as useLocale } from "./locale-store-DzqSZ9A_.mjs";
import { t as Button } from "./button-Dk7rzdxt.mjs";
import { n as Input, r as Textarea, t as Field } from "./input-h4AR-jrR.mjs";
import { t as Select } from "./select-BWJQoe6m.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as WORK_STATUSES, l as WORK_TYPES, n as MODULES, r as PRIORITIES } from "./types-Cz51tgQ5.mjs";
import { n as computeScore } from "./scoring-Bp88wWL5.mjs";
import { o as listWorkItems, r as createWorkItem } from "./work-Bx14KpU3.mjs";
import { r as PageHeader } from "./app-shell-D08HiN12.mjs";
import { r as WorkCard } from "./item-card-BhTEeTSG.mjs";
import { t as Modal } from "./modal-Bbixcg1E.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/eng-Dhj3jTB2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WorkForm({ locale, onSubmit, busy }) {
	const [title, setTitle] = (0, import_react.useState)("");
	const [type, setType] = (0, import_react.useState)("bug");
	const [module, setModule] = (0, import_react.useState)("Chat");
	const [expected, setExpected] = (0, import_react.useState)("");
	const [actual, setActual] = (0, import_react.useState)("");
	const [steps, setSteps] = (0, import_react.useState)("");
	const [flow, setFlow] = (0, import_react.useState)("");
	const [users, setUsers] = (0, import_react.useState)("");
	const [priority, setPriority] = (0, import_react.useState)("P2");
	const [rationale, setRationale] = (0, import_react.useState)("");
	const [acceptance, setAcceptance] = (0, import_react.useState)("");
	const [device, setDevice] = (0, import_react.useState)("");
	const [os, setOs] = (0, import_react.useState)("");
	const [version, setVersion] = (0, import_react.useState)("");
	const [ui, setUi] = (0, import_react.useState)(3);
	const [bi, setBi] = (0, import_react.useState)(3);
	const [rr, setRr] = (0, import_react.useState)(2);
	const [tc, setTc] = (0, import_react.useState)(2);
	const [sf, setSf] = (0, import_react.useState)(3);
	const [effort, setEffort] = (0, import_react.useState)(3);
	const [confidence, setConfidence] = (0, import_react.useState)("med");
	const [flags, setFlags] = (0, import_react.useState)({
		growth: false,
		retention: false,
		payment: false,
		stability: false,
		network: false
	});
	const [file, setFile] = (0, import_react.useState)(null);
	const score = computeScore({
		user_impact: ui,
		business_impact: bi,
		risk_reduction: rr,
		time_criticality: tc,
		strategic_fit: sf,
		confidence,
		effort
	});
	async function handleFile(f) {
		if (!f) return setFile(null);
		if (f.size > 7e5) return;
		const dataUrl = await readFile(f);
		setFile({
			name: f.name,
			dataUrl
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-4",
		onSubmit: (e) => {
			e.preventDefault();
			onSubmit({
				title,
				type,
				product_module: module,
				expected_behavior: expected,
				actual_behavior: actual,
				steps_to_reproduce: steps,
				affected_flow: flow,
				affected_users: users,
				priority,
				priority_rationale: rationale,
				acceptance_criteria: acceptance,
				device,
				os_name: os,
				app_version: version,
				user_impact: ui,
				business_impact: bi,
				risk_reduction: rr,
				time_criticality: tc,
				strategic_fit: sf,
				effort,
				confidence,
				flag_growth: flags.growth,
				flag_retention: flags.retention,
				flag_payment: flags.payment,
				flag_stability: flags.stability,
				flag_network: flags.network,
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
				label: t(locale, "subject"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: title,
					onChange: (e) => setTitle(e.target.value),
					required: true,
					maxLength: 180
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t(locale, "type"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							value: type,
							onChange: (e) => setType(e.target.value),
							children: WORK_TYPES.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: x,
								children: x
							}, x))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t(locale, "module"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							value: module,
							onChange: (e) => setModule(e.target.value),
							children: MODULES.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: x,
								children: x
							}, x))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t(locale, "priority"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							value: priority,
							onChange: (e) => setPriority(e.target.value),
							children: [
								"P0",
								"P1",
								"P2",
								"P3"
							].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: x,
								children: x
							}, x))
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t(locale, "expected"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: expected,
					onChange: (e) => setExpected(e.target.value),
					rows: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t(locale, "whatHappened"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: actual,
					onChange: (e) => setActual(e.target.value),
					rows: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t(locale, "steps"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: steps,
					onChange: (e) => setSteps(e.target.value),
					rows: 3
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: t(locale, "impact"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: flow,
						onChange: (e) => setFlow(e.target.value),
						placeholder: "Chat list → thread"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: locale === "mn" ? "Нөлөөлөх хэрэглэгч" : "Affected users",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: users,
						onChange: (e) => setUsers(e.target.value)
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t(locale, "rationale"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: rationale,
					onChange: (e) => setRationale(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					["growth", t(locale, "growth")],
					["retention", t(locale, "retention")],
					["payment", t(locale, "payment")],
					["stability", t(locale, "stability")],
					["network", t(locale, "network")]
				].map(([k, lab]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex h-10 items-center gap-2 rounded-sm border border-border px-3 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: flags[k],
						onChange: (e) => setFlags((f) => ({
							...f,
							[k]: e.target.checked
						}))
					}), lab]
				}, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Score, {
						label: "User",
						value: ui,
						onChange: setUi
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Score, {
						label: "Business",
						value: bi,
						onChange: setBi
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Score, {
						label: "Risk",
						value: rr,
						onChange: setRr
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Score, {
						label: "Time",
						value: tc,
						onChange: setTc
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Score, {
						label: "Strategic",
						value: sf,
						onChange: setSf
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Score, {
						label: "Effort",
						value: effort,
						min: 1,
						onChange: setEffort
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between rounded-md border border-border bg-bg px-3 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted",
					children: t(locale, "score")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-lg tabular-nums",
					children: score
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Confidence",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: confidence,
					onChange: (e) => setConfidence(e.target.value),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "low",
							children: "Low"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "med",
							children: "Med"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "high",
							children: "High"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t(locale, "acceptance"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: acceptance,
					onChange: (e) => setAcceptance(e.target.value),
					rows: 2
				})
			}),
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
					onChange: (e) => void handleFile(e.target.files?.[0])
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end gap-2 pt-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: busy || !title.trim(),
					children: t(locale, "submit")
				})
			})
		]
	});
}
function Score({ label, value, onChange, min = 0 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "mb-1 flex justify-between text-[11px] text-muted",
			children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono tabular-nums",
				children: value
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "range",
			min,
			max: 5,
			value,
			onChange: (e) => onChange(Number(e.target.value)),
			className: "w-full accent-accent"
		})]
	});
}
function readFile(file) {
	return new Promise((resolve, reject) => {
		const r = new FileReader();
		r.onload = () => resolve(String(r.result));
		r.onerror = reject;
		r.readAsDataURL(file);
	});
}
function EngBoard() {
	const locale = useLocale((s) => s.locale);
	const [items, setItems] = (0, import_react.useState)([]);
	const [q, setQ] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [type, setType] = (0, import_react.useState)("all");
	const [mod, setMod] = (0, import_react.useState)("all");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function reload() {
		const rows = await listWorkItems({ data: {
			q,
			status,
			type,
			module: mod
		} });
		setItems(rows);
	}
	(0, import_react.useEffect)(() => {
		reload();
	}, [
		q,
		status,
		type,
		mod
	]);
	const lanes = (0, import_react.useMemo)(() => PRIORITIES.map((p) => ({
		priority: p,
		items: items.filter((i) => i.priority === p && ![
			"closed",
			"rejected",
			"duplicate"
		].includes(i.status))
	})), [items]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: t(locale, "engineering"),
				title: t(locale, "board"),
				description: t(locale, "tracksNeverMix"),
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => setOpen(true),
					children: t(locale, "newItem")
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
						}), WORK_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s,
							children: s
						}, s))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: type,
						onChange: (e) => setType(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: t(locale, "type")
						}), WORK_TYPES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s,
							children: s
						}, s))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: mod,
						onChange: (e) => setMod(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: t(locale, "module")
						}), MODULES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s,
							children: s
						}, s))]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 xl:grid-cols-4",
				children: lanes.map((lane) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-baseline justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-mono text-sm",
							children: lane.priority
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs text-muted tabular-nums",
							children: lane.items.length
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [lane.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkCard, {
							item,
							locale
						}, item.id)), lane.items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-lg border border-dashed border-border px-3 py-8 text-center text-xs text-subtle",
							children: t(locale, "none")
						}) : null]
					})]
				}, lane.priority))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
				open,
				onOpenChange: setOpen,
				title: t(locale, "newItem"),
				description: t(locale, "captureHint"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkForm, {
					locale,
					busy,
					onSubmit: async (data) => {
						setBusy(true);
						try {
							const res = await createWorkItem({ data });
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
export { EngBoard as component };
