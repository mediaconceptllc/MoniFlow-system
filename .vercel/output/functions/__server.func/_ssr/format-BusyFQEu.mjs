import { i as isValid, n as formatDistanceToNow, r as format, t as parseISO } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/format-BusyFQEu.js
function parseDate(value) {
	if (!value) return null;
	if (value instanceof Date) return isValid(value) ? value : null;
	const d = parseISO(value);
	return isValid(d) ? d : null;
}
function relTime(value, locale) {
	const d = parseDate(value);
	if (!d) return "—";
	const s = formatDistanceToNow(d, { addSuffix: true });
	if (locale === "mn") return s.replace("about ", "").replace("less than a minute ago", "саяхан").replace("minutes ago", "мин өмнө").replace("minute ago", "мин өмнө").replace("hours ago", "ц өмнө").replace("hour ago", "ц өмнө").replace("days ago", "өдрийн өмнө").replace("day ago", "өдрийн өмнө").replace("months ago", "сарын өмнө").replace("month ago", "сарын өмнө").replace("in ", "").replace("ago", "өмнө");
	return s;
}
function absDate(value) {
	const d = parseDate(value);
	if (!d) return "—";
	return format(d, "yyyy-MM-dd HH:mm");
}
//#endregion
export { relTime as n, absDate as t };
