import { Card } from "@/components/ui";
import type { MarketingDict } from "./types";
import { Section } from "./section";
import { IconBuilding, IconLayers, IconShieldCheck } from "./icons";

// PRD 12.4 Target-customer benefits: CIO / CISO / AI platform teams.
export function Personas({ t }: { t: MarketingDict }) {
  const items = [
    { icon: IconBuilding, tone: "bg-blue-50 text-blue-700", title: t.personas.cio.title, desc: t.personas.cio.desc },
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
          </Card>
        ))}
      </div>
    </Section>
  );
}
