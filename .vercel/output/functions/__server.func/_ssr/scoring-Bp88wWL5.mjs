//#region node_modules/.nitro/vite/services/ssr/assets/scoring-Bp88wWL5.js
var CONFIDENCE_FACTOR = {
	low: .6,
	med: .85,
	high: 1
};
function computeScore(input) {
	const effort = Math.max(1, input.effort);
	const raw = (input.user_impact + input.business_impact + input.risk_reduction + input.time_criticality + input.strategic_fit) * CONFIDENCE_FACTOR[input.confidence] / effort;
	return Math.round(raw * 10) / 10;
}
function slaHoursForTicketPriority(priority) {
	switch (priority) {
		case "urgent": return 4;
		case "high": return 12;
		case "low": return 72;
		default: return 24;
	}
}
function agingHoursForWork(priority) {
	switch (priority) {
		case "P0": return 4;
		case "P1": return 12;
		case "P2": return 48;
		default: return 120;
	}
}
function isAging(updatedAt, hours) {
	const t = typeof updatedAt === "string" ? new Date(updatedAt).getTime() : updatedAt.getTime();
	return Date.now() - t > hours * 3600 * 1e3;
}
//#endregion
export { slaHoursForTicketPriority as i, computeScore as n, isAging as r, agingHoursForWork as t };
