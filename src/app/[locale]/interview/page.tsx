import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, LOCALES, resolveLocale, type Locale } from "@/i18n";
import { isLocale } from "@/i18n/config";
import { InterviewFlow } from "@/components/interview/interview-flow";
import { LocaleSwitcher } from "@/components/marketing/locale-switcher";
import { IconShield } from "@/components/marketing/icons";

// 全屏独立的引导式访谈页（转化页）：不进营销锚点布局，单列居中，
// 顶部小 logo 回首页，底部 Powered by Aegis。

type RouteProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = resolveLocale(raw);
  const t = getDictionary(locale);
  return {
    title: t.interview.meta.title,
    description: t.interview.meta.description,
    alternates: {
      canonical: `/${locale}/interview`,
      languages: { zh: "/zh/interview", en: "/en/interview", "x-default": "/zh/interview" },
    },
  };
}

export default async function InterviewPage({ params }: RouteProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const t = getDictionary(locale);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-6">
        <Link href={`/${locale}`} className="flex items-center gap-2" aria-label={t.interview.success.backHome}>
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-700 text-white">
            <IconShield className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-slate-900">{t.common.appName}</span>
        </Link>
        <LocaleSwitcher
          locale={locale}
          label={t.common.switchLanguage}
          className="text-slate-600 hover:text-slate-900"
        />
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-8 sm:py-12">
        <div className="w-full max-w-xl">
          <InterviewFlow t={t} locale={locale} />
        </div>
      </main>

      <footer className="pb-6 pt-2 text-center">
        <p className="text-xs text-slate-400">{t.interview.poweredBy}</p>
      </footer>
    </div>
  );
}
