import { Card } from "@/components/ui";
import type { MarketingDict } from "./types";
import { Section } from "./section";
import { IconChart, IconEye, IconLock, IconShieldCheck } from "./icons";

// PRD 12.2 Four value propositions.
export function Values({ t }: { t: MarketingDict }) {
  const items = [
    { icon: IconEye, title: t.values.see.title, desc: t.values.see.desc },
    { icon: IconShieldCheck, title: t.values.control.title, desc: t.values.control.desc },
    { icon: IconLock, title: t.values.protect.title, desc: t.values.protect.desc },
    { icon: IconChart, title: t.values.measure.title, desc: t.values.measure.desc },
  ];

  return (
    <Section id="values" title={t.values.title}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <Card key={item.title} className="h-full p-6 transition-shadow hover:shadow-md">
            <span className="inline-grid h-11 w-11 place-items-center rounded-lg bg-blue-50 text-blue-700">
              <item.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-5 font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
