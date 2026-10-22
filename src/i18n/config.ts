export const LOCALES = ["zh", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "zh";

export function isLocale(v: string): v is Locale {
  return (LOCALES as readonly string[]).includes(v);
}

// Detection order (PRD V1.3): explicit cookie preference -> path locale ->
// browser Accept-Language. Implemented in middleware.ts.
export const LOCALE_COOKIE = "aegis_locale";
