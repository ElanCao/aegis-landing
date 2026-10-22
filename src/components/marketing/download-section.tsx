import type { MarketingDict } from "./types";
import { LATEST_RELEASE } from "@/lib/releases";
import { Section } from "./section";

// Item 20 landing block: 独立站点不连数据库，发布信息来自 src/lib/releases.ts
// 的静态常量（生产环境应改为指向 SaaS 控制面的发布接口，见该文件注释）。
// 3-step onboarding guide (download → admin mints activation string → client
// activates). The download button hides when no URL is configured, the rest
// of the section always renders.
export function DownloadSection({ t }: { t: MarketingDict }) {
  const release = LATEST_RELEASE;

  return (
    <Section id="download" tone="white" title={t.download.title} subtitle={t.download.subtitle}>
      <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {t.download.artifact}
          </div>
          <>
            <div className="mt-2 text-2xl font-semibold text-slate-900">
              {t.download.currentVersion} {release.version}
            </div>
            {release.notes ? (
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                <span className="font-medium text-slate-700">{t.download.releaseNotes}: </span>
                {release.notes}
              </p>
            ) : null}
            {release.downloadUrl ? (
              <a
                href={release.downloadUrl}
                className="mt-5 inline-block rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-800"
              >
                {t.download.download} v{release.version}
              </a>
            ) : null}
          </>
        </div>
        <ol className="space-y-4">
          {t.download.steps.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-700 text-sm font-semibold text-white">
                {i + 1}
              </span>
              <div>
                <div className="text-sm font-semibold text-slate-900">{step.title}</div>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
