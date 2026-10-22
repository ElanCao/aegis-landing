import { isLocale, type Locale, DEFAULT_LOCALE } from "./config";
import { zh } from "./dictionaries/zh";
import { en } from "./dictionaries/en";

export type { Locale } from "./config";
export { LOCALES, DEFAULT_LOCALE, LOCALE_COOKIE } from "./config";

export function getDictionary(locale: Locale) {
  return locale === "zh" ? zh : en;
}

export function resolveLocale(v: string | undefined | null): Locale {
  return v && isLocale(v) ? v : DEFAULT_LOCALE;
}
