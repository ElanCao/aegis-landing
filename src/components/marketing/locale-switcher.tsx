"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALE_COOKIE, type Locale } from "@/i18n";
import { IconGlobe } from "./icons";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

// Locale toggle: keeps the rest of the current path, persists the preference
// in the aegis_locale cookie (PRD V1.3 language switching).
export function LocaleSwitcher({
  locale,
  label,
  className = "",
}: {
  locale: Locale;
  label: string;
  className?: string;
}) {
  const pathname = usePathname();
  const target: Locale = locale === "zh" ? "en" : "zh";
  const href = pathname.replace(/^\/(zh|en)(?=\/|$)/, `/${target}`);

  const persistPreference = () => {
    document.cookie = `${LOCALE_COOKIE}=${target};path=/;max-age=${ONE_YEAR_SECONDS}`;
  };

  return (
    <Link
      href={href}
      onClick={persistPreference}
      className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${className}`}
    >
      <IconGlobe className="h-4 w-4" />
      {label}
    </Link>
  );
}
