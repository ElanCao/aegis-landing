import { Card } from "@/components/ui";
import type { MarketingDict } from "./types";
import { Section } from "./section";
import { IconBuilding, IconCheck, IconGlobe, IconMonitor, IconShieldCheck } from "./icons";

// Dual-mode gateway (PRD 7): Mode 1 desktop proxy gateway for SMBs without a
// stable VPN; Mode 2 central enterprise gateway behind a LAN endpoint / LB.
// Both run the same policy, credential and metering fabric.
export function GatewayModes({ t }: { t: MarketingDict }) {
  const m = t.gatewayModes;
  const modes = [
    {
      badge: m.mode1.badge,
      title: m.mode1.title,
      audience: m.mode1.audience,
      desc: m.mode1.desc,
      points: m.mode1.points,
      icon: <IconMonitor className="h-5 w-5" />,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      badge: m.mode2.badge,
      title: m.mode2.title,
      audience: m.mode2.audience,
      desc: m.mode2.desc,
      points: m.mode2.points,
      icon: <IconBuilding className="h-5 w-5" />,
      tone: "bg-indigo-50 text-indigo-700",
    },
    {
      badge: m.mode3.badge,
      title: m.mode3.title,
      audience: m.mode3.audience,
      desc: m.mode3.desc,
      points: m.mode3.points,
      icon: <IconGlobe className="h-5 w-5" />,
      tone: "bg-sky-50 text-sky-700",
    },
  ];
  return (
    <Section id="gateway" tone="slate" title={m.title} subtitle={m.subtitle}>
      <div className="grid gap-6 lg:grid-cols-3">
        {modes.map((mode) => (
          <Card key={mode.title} className="flex h-full flex-col p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className={`inline-grid h-11 w-11 place-items-center rounded-lg ${mode.tone}`}>
                {mode.icon}
              </span>
              <div>
                <div className="text-xs font-medium tracking-wide text-slate-400">{mode.badge}</div>
                <h3 className="text-lg font-semibold text-slate-900">{mode.title}</h3>
              </div>
            </div>
            <p className="mt-3 text-xs font-medium text-blue-700">{mode.audience}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{mode.desc}</p>
            <ul className="mt-4 space-y-2.5 border-t border-slate-100 pt-4">
              {mode.points.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-700">
                  <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {p}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-white p-4 sm:p-5">
        <IconShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
        <div>
          <div className="text-sm font-semibold text-slate-900">{m.unifiedTitle}</div>
          <ul className="mt-2 grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
            {m.unified.map((u) => (
              <li key={u} className="flex items-start gap-2 text-sm leading-relaxed text-slate-600">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-blue-500" />
                {u}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
