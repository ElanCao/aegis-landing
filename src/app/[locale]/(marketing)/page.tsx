import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, LOCALES, resolveLocale, type Locale } from "@/i18n";
import { isLocale } from "@/i18n/config";
import { Header } from "@/components/marketing/header";
import { Hero } from "@/components/marketing/hero";
import { Values } from "@/components/marketing/values";
import { Capabilities } from "@/components/marketing/capabilities";
import { PolicyEngine } from "@/components/marketing/policy-engine";
import { Architecture } from "@/components/marketing/architecture";
import { GatewayModes } from "@/components/marketing/gateway-modes";
import { GovernanceLoop } from "@/components/marketing/loop";
import { PublicAi } from "@/components/marketing/public-ai";
import { Scenarios } from "@/components/marketing/scenarios";
import { Plans } from "@/components/marketing/plans";
import { Personas } from "@/components/marketing/personas";
import { Principles } from "@/components/marketing/principles";
import { DownloadSection } from "@/components/marketing/download-section";
import { DemoSection } from "@/components/marketing/demo-section";
import { Footer } from "@/components/marketing/footer";

type RouteProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = resolveLocale(raw);
  const t = getDictionary(locale);
  return {
    title: t.common.tagline,
    description: t.hero.subtitle,
    alternates: {
      canonical: `/${locale}`,
      languages: { zh: "/zh", en: "/en", "x-default": "/zh" },
    },
  };
}

// Bilingual landing page (PRD ch. 12), section order per PRD 12.4.
export default async function MarketingPage({ params }: RouteProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const t = getDictionary(locale);

  return (
    <div className="min-h-screen bg-white">
      <Header t={t} locale={locale} />
      <main>
        <Hero t={t} />
        <Values t={t} />
        <Capabilities t={t} />
        <PolicyEngine t={t} locale={locale} />
        <Architecture t={t} />
        <GatewayModes t={t} />
        <GovernanceLoop t={t} />
        <PublicAi t={t} />
        <Scenarios t={t} />
        <Plans t={t} />
        <Personas t={t} />
        <Principles t={t} />
        <DownloadSection t={t} />
        <DemoSection t={t} locale={locale} />
      </main>
      <Footer t={t} locale={locale} />
    </div>
  );
}
