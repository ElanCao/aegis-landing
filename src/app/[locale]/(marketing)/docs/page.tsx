import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, LOCALES, resolveLocale, type Locale } from "@/i18n";
import { isLocale } from "@/i18n/config";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { DocsBody } from "@/components/marketing/docs-content";

// Public documentation site (PRD 12 companion): no login required, same visual
// language as the landing page. Content lives in docs-content.tsx (Chinese-first).

type RouteProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = resolveLocale(raw);
  const t = getDictionary(locale);
  return {
    title: `${t.docs.title} · ${t.common.appName}`,
    description: t.docs.subtitle,
    alternates: {
      canonical: `/${locale}/docs`,
      languages: { zh: "/zh/docs", en: "/en/docs", "x-default": "/zh/docs" },
    },
  };
}

const NAV_ANCHORS = [
  { key: "quickstart", id: "quickstart" },
  { key: "policy", id: "policy" },
  { key: "contentSafety", id: "content-safety" },
  { key: "limits", id: "limits" },
  { key: "aiGuard", id: "ai-guard" },
  { key: "audit", id: "audit" },
  { key: "faq", id: "faq" },
] as const;

export default async function DocsPage({ params }: RouteProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const t = getDictionary(locale);

  return (
    <div className="min-h-screen bg-white">
      <Header t={t} locale={locale} linkBase={`/${locale}`} />
      <main>
        {/* Page hero */}
        <div className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto flex max-w-4xl flex-wrap items-end justify-between gap-4 px-6 pb-10 pt-16">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{t.docs.title}</h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">{t.docs.subtitle}</p>
              <p className="mt-2 text-xs text-slate-400">{t.docs.updated}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/${locale}`}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
              >
                {t.docs.backHome}
              </Link>
              <Link
                href={`/${locale}#capabilities`}
                className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800"
              >
                {t.docs.landingCta}
              </Link>
            </div>
          </div>
        </div>

        {/* Sticky anchor TOC */}
        <nav className="sticky top-16 z-40 border-b border-slate-200 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/75">
          <div className="mx-auto flex max-w-4xl gap-1 overflow-x-auto px-6 py-2.5">
            {NAV_ANCHORS.map((a, i) => (
              <a
                key={a.id}
                href={`#${a.id}`}
                className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <span className="mr-1.5 font-mono text-xs text-slate-400">{String(i + 1).padStart(2, "0")}</span>
                {t.docs.nav[a.key]}
              </a>
            ))}
          </div>
        </nav>

        <DocsBody />
      </main>
      <Footer t={t} locale={locale} linkBase={`/${locale}`} />
    </div>
  );
}
