import Link from "next/link";
import type { Locale } from "@/i18n";
import { Card } from "@/components/ui";
import type { MarketingDict } from "./types";
import { Section } from "./section";
import { IconArrowRight, IconGauge, IconShieldCheck, IconSliders, IconZap } from "./icons";

// Policy governance engine highlight (PRD 7.5 + content safety + limits):
// expression policies, AI decision evaluation, content safety, and budget
// circuit breakers — the four enforcement layers behind every call.
const CARD_ICONS = {
  expr: { Icon: IconSliders, tone: "bg-blue-50 text-blue-700" },
  ai: { Icon: IconZap, tone: "bg-violet-50 text-violet-700" },
  safety: { Icon: IconShieldCheck, tone: "bg-emerald-50 text-emerald-700" },
  limits: { Icon: IconGauge, tone: "bg-amber-50 text-amber-700" },
} as const;

export function PolicyEngine({ t, locale }: { t: MarketingDict; locale: Locale }) {
  const m = t.policyEngine;
  return (
    <Section id="policy-engine" tone="slate" title={m.title} subtitle={m.subtitle}>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {m.cards.map((card) => {
          const { Icon, tone } = CARD_ICONS[card.icon as keyof typeof CARD_ICONS] ?? CARD_ICONS.expr;
          return (
            <Card key={card.title} className="flex h-full flex-col p-6 transition-shadow hover:shadow-md">
              <span className={`inline-grid h-11 w-11 place-items-center rounded-lg ${tone}`}>
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{card.desc}</p>
              <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-950 p-3 font-mono text-[11px] leading-relaxed text-slate-200">
                {card.code}
              </pre>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-blue-100 bg-white p-4 sm:p-5">
        <div>
          <div className="text-sm font-semibold text-slate-900">{m.docsCta}</div>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{m.docsDesc}</p>
        </div>
        <Link
          href={`/${locale}/docs`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800"
        >
          {t.nav.docs}
          <IconArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Section>
  );
}
