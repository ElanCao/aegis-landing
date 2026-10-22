import type { MarketingDict } from "./types";
import { Section } from "./section";

// PRD 12.4 Governance principles and security boundaries.
export function Principles({ t }: { t: MarketingDict }) {
  return (
    <Section id="principles" title={t.principles.title}>
      <ol className="max-w-3xl divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {t.principles.items.map((item, i) => (
          <li key={item} className="flex gap-4 p-5 sm:px-6">
            <span className="w-7 shrink-0 font-mono text-sm font-semibold text-blue-600">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="text-sm leading-relaxed text-slate-700">{item}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
