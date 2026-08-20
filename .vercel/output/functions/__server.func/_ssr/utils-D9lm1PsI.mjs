import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-D9lm1PsI.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function initials(name) {
	if (!name) return "?";
	return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}
//#endregion
export { initials as n, cn as t };
