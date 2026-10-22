import { notFound } from "next/navigation";
import { LOCALES, type Locale } from "@/i18n";
import { resolveLocale } from "@/i18n";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!LOCALES.includes(resolveLocale(locale))) notFound();

  return <>{children}</>;
}
