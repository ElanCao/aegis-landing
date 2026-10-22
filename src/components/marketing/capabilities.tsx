import { Card } from "@/components/ui";
import type { MarketingDict } from "./types";
import { Section } from "./section";
import {
  IconBlocks,
  IconBot,
  IconFileSearch,
  IconGauge,
  IconKeyRound,
  IconRadar,
  IconWallet,
} from "./icons";

// PRD 12.3 Capability showcase (7 items).
export function Capabilities({ t }: { t: MarketingDict }) {
  const icons = [
    IconBot,
    IconKeyRound,
    IconBlocks,
    IconFileSearch,
    IconWallet,
    IconRadar,
    IconGauge,
  ];

  return (
    <Section id="capabilities" tone="slate" title={t.capabilities.title}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {t.capabilities.items.map((item, i) => {
          const Icon = icons[i % icons.length] ?? IconBot;
          return (
            <Card key={item.title} className="h-full p-6 transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="inline-grid h-11 w-11 place-items-center rounded-lg bg-blue-50 text-blue-700">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-mono text-xs font-medium text-slate-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-5 font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
