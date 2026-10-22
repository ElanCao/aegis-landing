import { Card } from "@/components/ui";
import type { MarketingDict } from "./types";
import { Section } from "./section";
import { IconGauge, IconInfo, IconRadar, IconSliders } from "./icons";

// PRD 12.4 Public AI control evaluation: reachability / control rate /
// maturity metric cards + boundary note (no fabricated numbers; PRD 14).
export function PublicAi({ t }: { t: MarketingDict }) {
  const cards = [
    { icon: IconRadar, label: t.publicAi.reachability, desc: t.publicAi.reachabilityDesc },
    { icon: IconSliders, label: t.publicAi.controlRate, desc: t.publicAi.controlRateDesc },
    { icon: IconGauge, label: t.publicAi.maturity, desc: t.publicAi.maturityDesc },
  ];

  return (
    <Section id="public-ai" title={t.publicAi.title} subtitle={t.publicAi.subtitle}>
      <div className="grid gap-5 md:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.label} className="h-full p-6 transition-shadow hover:shadow-md">
            <span className="inline-grid h-11 w-11 place-items-center rounded-lg bg-blue-50 text-blue-700">
              <card.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-5 font-semibold text-slate-900">{card.label}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.desc}</p>
            <div aria-hidden className="mt-6 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500" />
            </div>
          </Card>
        ))}
      </div>
      <p className="mt-8 flex items-start gap-2 text-sm leading-relaxed text-slate-500">
        <IconInfo className="mt-0.5 h-4 w-4 shrink-0" />
        {t.publicAi.note}
      </p>
    </Section>
  );
}
