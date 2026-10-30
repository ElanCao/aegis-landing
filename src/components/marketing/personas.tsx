import Link from "next/link";
import type { Locale } from "@/i18n";
import { Card } from "@/components/ui";
import type { MarketingDict } from "./types";
import { Section } from "./section";
import { IconArrowRight, IconBuilding, IconLayers, IconShieldCheck } from "./icons";

// PRD 12.4 Target-customer benefits: CIO / CISO / AI platform teams.
// CIO 卡片附带引导式治理访谈入口（/{locale}/interview）。
export function Personas({ t, locale }: { t: MarketingDict; locale: Locale }) {
  const items: {
    icon: typeof IconBuilding;
    tone: string;
    title: string;
    desc: string;
    cta?: string;
    href?: string;
  }[] = [
    {
      icon: IconBuilding,
      tone: "bg-blue-50 text-blue-700",
      title: t.personas.cio.title,
      desc: t.personas.cio.desc,
      cta: t.personas.cio.cta,
      href: `/${locale}/interview`,
    },
    { icon: IconShieldCheck, tone: "bg-emerald-50 text-emerald-700", title: t.personas.ciso.title, desc: t.personas.ciso.desc },
    { icon: IconLayers, tone: "bg-indigo-50 text-indigo-700", title: t.personas.platform.title, desc: t.personas.platform.desc },
  ];

  return (
    <Section id="personas" tone="slate" title={t.personas.title}>
      <div className="grid gap-5 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.title} className="h-full p-6 transition-shadow hover:shadow-md sm:p-8">
            <span className={`inline-grid h-11 w-11 place-items-center rounded-lg ${item.tone}`}>
              <item.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-5 text-lg font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.desc}</p>
            {item.cta && item.href ? (
              <Link
                href={item.href}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 transition-colors hover:text-blue-900"
              >
                {item.cta}
                <IconArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
          </Card>
        ))}
      </div>
    </Section>
  );
}
