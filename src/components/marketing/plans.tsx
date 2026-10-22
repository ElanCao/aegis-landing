import { Button, Card } from "@/components/ui";
import type { MarketingDict } from "./types";
import { Section } from "./section";
import { IconCheck } from "./icons";

// QA.MD commercial model: open-core + hybrid deployment. Four tiers — free
// self-hosted Community, Cloud Pro (self-hosted data plane + SaaS control
// plane), Enterprise (full on-premise + offline license), Hosted (fully
// managed SaaS). Enterprise features unlock via License Key; Community
// upgrades seamlessly (same gateway core).
export function Plans({ t }: { t: MarketingDict }) {
  const p = t.plans;
  const plans = [
    { plan: p.community, featured: false },
    { plan: p.cloudPro, featured: true },
    { plan: p.enterprise, featured: false },
    { plan: p.hosted, featured: false },
  ];

  return (
    <Section id="plans" title={p.title} subtitle={"subtitle" in p ? (p as { subtitle?: string }).subtitle : undefined}>
      <div className="grid items-stretch gap-5 lg:grid-cols-4">
        {plans.map(({ plan, featured }) => (
          <Card
            key={plan.name}
            className={`flex h-full flex-col p-6 sm:p-7 ${
              featured ? "ring-2 ring-blue-600 shadow-lg shadow-blue-600/10" : ""
            }`}
          >
            <h3 className="font-semibold text-slate-900">{plan.name}</h3>
            <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              {plan.price}
              {plan.period ? (
                <span className="ml-1 text-sm font-normal text-slate-500">{plan.period}</span>
              ) : null}
            </p>
            <p className="mt-1.5 text-xs font-medium text-blue-700">{plan.deploy}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{plan.desc}</p>
            <ul className="mt-6 flex-1 space-y-2.5">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              href="#demo"
              variant={featured ? "primary" : "secondary"}
              className="mt-8 w-full"
            >
              {plan.cta}
            </Button>
          </Card>
        ))}
      </div>
      <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-slate-500">
        {p.note}
      </p>
    </Section>
  );
}
