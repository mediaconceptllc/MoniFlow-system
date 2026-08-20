import { formatDistanceToNow, format, isValid, parseISO } from "date-fns";
import type { Locale } from "./i18n";

export function parseDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return isValid(value) ? value : null;
  const d = parseISO(value);
  return isValid(d) ? d : null;
}

export function relTime(value: string | Date | null | undefined, locale: Locale): string {
  const d = parseDate(value);
  if (!d) return "—";
  const s = formatDistanceToNow(d, { addSuffix: true });
  if (locale === "mn") {
    return s
      .replace("about ", "")
      .replace("less than a minute ago", "саяхан")
      .replace("minutes ago", "мин өмнө")
      .replace("minute ago", "мин өмнө")
      .replace("hours ago", "ц өмнө")
      .replace("hour ago", "ц өмнө")
      .replace("days ago", "өдрийн өмнө")
      .replace("day ago", "өдрийн өмнө")
      .replace("months ago", "сарын өмнө")
      .replace("month ago", "сарын өмнө")
      .replace("in ", "")
      .replace("ago", "өмнө");
  }
  return s;
}

export function absDate(value: string | Date | null | undefined): string {
  const d = parseDate(value);
  if (!d) return "—";
  return format(d, "yyyy-MM-dd HH:mm");
}

export function hoursSince(value: string | Date | null | undefined): number {
  const d = parseDate(value);
  if (!d) return 0;
  return (Date.now() - d.getTime()) / 3600000;
}
