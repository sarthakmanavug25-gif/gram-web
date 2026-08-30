import type { StringKey } from "./i18n";

type Translator = (key: StringKey, vars?: Record<string, string | number>) => string;

const LOCALE = { en: "en-IN", hi: "hi-IN" } as const;

export function rupees(value: number, opts: { compact?: boolean } = {}) {
  if (opts.compact && value >= 100000)
    return `₹${(value / 100000).toFixed(1)}L`;
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

export function formatDate(dateStr: string, lang: "en" | "hi" = "en") {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString(LOCALE[lang], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function shortDate(dateStr: string, lang: "en" | "hi" = "en") {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString(LOCALE[lang], { day: "numeric", month: "short" });
}

export function greeting(t: Translator, date = new Date()) {
  const h = date.getHours();
  if (h < 5) return t("greeting.night");
  if (h < 12) return t("greeting.morning");
  if (h < 17) return t("greeting.afternoon");
  if (h < 21) return t("greeting.evening");
  return t("greeting.night");
}

export function todayLong(date = new Date(), lang: "en" | "hi" = "en") {
  return date.toLocaleDateString(LOCALE[lang], {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function isThisMonth(dateStr: string, now = new Date()) {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export function timeAgoLabel(date = new Date(), lang: "en" | "hi" = "en") {
  return date.toLocaleTimeString(LOCALE[lang], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
