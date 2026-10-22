import type { MarketingDict } from "./types";
import { Section } from "./section";

// PRD 12.4 Agent governance loop: register -> authorize -> invoke -> audit -> optimize.
export function GovernanceLoop({ t }: { t: MarketingDict }) {
  return (
    <Section id="loop" tone="slate" title={t.loop.title}>
      <div className="relative">
        <div
          aria-hidden
          className="absolute bottom-0 left-6 top-2 border-l-2 border-dashed border-slate-200 lg:hidden"
        />
        <div
          aria-hidden
          className="absolute left-[10%] right-[10%] top-6 hidden border-t-2 border-dashed border-slate-200 lg:block"
        />
        <ol className="relative grid gap-10 lg:grid-cols-5 lg:gap-6">
          {t.loop.steps.map((step, i) => (
            <li key={step.title} className="relative flex gap-4 lg:flex-col">
              <div className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-blue-600 bg-white text-blue-700">
                <span className="text-sm font-bold">{i + 1}</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 lg:mt-4">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
