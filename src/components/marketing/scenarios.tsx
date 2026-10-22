import { Card } from "@/components/ui";
import type { MarketingDict } from "./types";
import { Section } from "./section";
import { IconBookOpen, IconCode } from "./icons";

// PRD 12.5 Launch scenarios: one low-sensitivity, one high-sensitivity.
export function Scenarios({ t }: { t: MarketingDict }) {
  const cards = [
    { icon: IconBookOpen, tone: "bg-blue-50 text-blue-700", title: t.scenarios.low.title, desc: t.scenarios.low.desc },
    { icon: IconCode, tone: "bg-indigo-50 text-indigo-700", title: t.scenarios.high.title, desc: t.scenarios.high.desc },
  ];

  return (
    <Section id="scenarios" tone="slate" title={t.scenarios.title}>
      <div className="grid gap-5 lg:grid-cols-2">
        {cards.map((card) => (
          <Card key={card.title} className="h-full p-6 transition-shadow hover:shadow-md sm:p-8">
            <span className={`inline-grid h-11 w-11 place-items-center rounded-lg ${card.tone}`}>
              <card.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-5 text-lg font-semibold leading-snug text-slate-900">
              {card.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{card.desc}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
