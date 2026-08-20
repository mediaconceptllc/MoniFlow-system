//#region node_modules/.nitro/vite/services/ssr/assets/workflow-Da-XSiWn.js
var WORK_TRANSITIONS = {
	new: [
		"triage",
		"needs_info",
		"rejected",
		"duplicate"
	],
	triage: [
		"needs_info",
		"approved_backlog",
		"rejected",
		"deferred",
		"duplicate"
	],
	needs_info: [
		"triage",
		"approved_backlog",
		"rejected"
	],
	approved_backlog: [
		"in_progress",
		"deferred",
		"rejected"
	],
	in_progress: [
		"in_review",
		"ready_for_qa",
		"needs_info"
	],
	in_review: ["in_progress", "ready_for_qa"],
	ready_for_qa: ["qa_failed", "ready_for_release"],
	qa_failed: ["in_progress", "ready_for_qa"],
	ready_for_release: ["released", "in_progress"],
	released: ["verified", "qa_failed"],
	verified: ["closed"],
	closed: [],
	deferred: ["approved_backlog", "triage"],
	rejected: [],
	duplicate: []
};
var TICKET_TRANSITIONS = {
	new: [
		"open",
		"duplicate",
		"closed"
	],
	open: [
		"waiting_customer",
		"waiting_internal",
		"escalated",
		"resolved",
		"duplicate"
	],
	waiting_customer: [
		"open",
		"resolved",
		"closed"
	],
	waiting_internal: [
		"open",
		"escalated",
		"resolved"
	],
	escalated: [
		"open",
		"resolved",
		"waiting_internal"
	],
	resolved: ["closed", "open"],
	closed: [],
	duplicate: []
};
var WORK_ROLE_TRANSITIONS = {
	requester: ["needs_info"],
	product_owner: [
		"triage",
		"needs_info",
		"approved_backlog",
		"deferred",
		"rejected",
		"duplicate",
		"verified",
		"closed"
	],
	tech_lead: [
		"triage",
		"needs_info",
		"approved_backlog",
		"in_progress",
		"in_review",
		"ready_for_qa",
		"deferred",
		"duplicate"
	],
	developer: [
		"in_progress",
		"in_review",
		"ready_for_qa",
		"needs_info"
	],
	qa: [
		"ready_for_qa",
		"qa_failed",
		"ready_for_release"
	],
	release_manager: [
		"ready_for_release",
		"released",
		"verified"
	],
	admin: [
		"new",
		"triage",
		"needs_info",
		"approved_backlog",
		"in_progress",
		"in_review",
		"ready_for_qa",
		"qa_failed",
		"ready_for_release",
		"released",
		"verified",
		"closed",
		"deferred",
		"rejected",
		"duplicate"
	]
};
function canTransitionWork(role, to) {
	if (role === "admin") return true;
	const allowed = WORK_ROLE_TRANSITIONS[role];
	return Boolean(allowed?.includes(to));
}
function canTransitionTicket(role) {
	return role === "admin" || role === "support_agent" || role === "support_lead";
}
function canEscalate(role) {
	return role === "admin" || role === "support_lead";
}
function canDecide(role) {
	return role === "admin" || role === "product_owner" || role === "tech_lead";
}
function canSetPriority(role) {
	return role === "admin" || role === "product_owner";
}
function canAssignWork(role) {
	return role === "admin" || role === "tech_lead" || role === "product_owner";
}
function canQa(role) {
	return role === "admin" || role === "qa";
}
function canRelease(role) {
	return role === "admin" || role === "release_manager";
}
function isSupportStaff(role) {
	return role === "admin" || role === "support_agent" || role === "support_lead";
}
function canAdmin(role) {
	return role === "admin";
}
function nextWorkStatuses(from, role) {
	return (WORK_TRANSITIONS[from] ?? []).filter((to) => canTransitionWork(role, to));
}
function nextTicketStatuses(from, role) {
	if (!canTransitionTicket(role)) return [];
	return TICKET_TRANSITIONS[from] ?? [];
}
//#endregion
export { canDecide as a, canRelease as c, canTransitionWork as d, isSupportStaff as f, canAssignWork as i, canSetPriority as l, nextWorkStatuses as m, WORK_TRANSITIONS as n, canEscalate as o, nextTicketStatuses as p, canAdmin as r, canQa as s, TICKET_TRANSITIONS as t, canTransitionTicket as u };
