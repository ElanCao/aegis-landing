import { Card } from "@/components/ui";
import type { MarketingDict } from "./types";
import { Section } from "./section";
import { IconLock, IconMonitor, IconRefreshCw, IconServer } from "./icons";

// PRD 12.4 Platform architecture: SaaS control plane + local client,
// with the data-boundary statement.
export function Architecture({ t }: { t: MarketingDict }) {
  return (
    <Section id="architecture" title={t.architecture.title} subtitle={t.architecture.subtitle}>
      <div className="relative grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
        <Card className="h-full p-6 sm:p-8">
          <span className="inline-grid h-11 w-11 place-items-center rounded-lg bg-blue-50 text-blue-700">
            <IconServer className="h-5 w-5" />
          </span>
          <h3 className="mt-5 text-lg font-semibold text-slate-900">
            {t.architecture.controlPlane.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {t.architecture.controlPlane.desc}
          </p>
        </Card>

        <div className="flex items-center justify-center gap-2 text-slate-300 lg:flex-col lg:px-1">
          <span className="hidden h-px flex-1 border-t border-dashed border-slate-200 lg:hidden" />
          <IconRefreshCw className="h-6 w-6 text-blue-600" />
          <span className="hidden w-px flex-1 border-l border-dashed border-slate-200 lg:block" />
          <span className="hidden h-px flex-1 border-t border-dashed border-slate-200 lg:hidden" />
        </div>

        <Card className="h-full p-6 sm:p-8">
          <span className="inline-grid h-11 w-11 place-items-center rounded-lg bg-indigo-50 text-indigo-700">
            <IconMonitor className="h-5 w-5" />
          </span>
          <h3 className="mt-5 text-lg font-semibold text-slate-900">
            {t.architecture.localClient.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {t.architecture.localClient.desc}
          </p>
        </Card>
      </div>

      <div className="mt-8 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 sm:p-5">
        <IconLock className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
        <p className="text-sm leading-relaxed text-blue-900">{t.architecture.boundary}</p>
      </div>
    </Section>
  );
}
