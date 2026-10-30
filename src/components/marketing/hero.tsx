import type { MarketingDict } from "./types";
import type { Locale } from "@/i18n";
import { IconArrowRight, IconCheck } from "./icons";

// PRD 12.1 Hero: dark navy first screen, dual CTAs + trust summary.
export function Hero({ t, locale }: { t: MarketingDict; locale: Locale }) {
  return (
    <section id="hero" className="relative overflow-hidden bg-slate-950 text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(55% 45% at 50% 0%, rgba(37,99,235,0.30), transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(35% 30% at 82% 18%, rgba(99,102,241,0.20), transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,184,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.22) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-20 sm:pb-28 sm:pt-28">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
          </span>
          {t.common.tagline}
        </div>

        <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
          {t.hero.title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
          {t.hero.subtitle}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href="#download"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-200"
          >
            {t.hero.ctaPrimary}
            <IconArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#policy-engine"
            className="inline-flex items-center rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            {t.hero.ctaSecondary}
          </a>
          <a
            href={`/${locale}/interview`}
            className="inline-flex items-center gap-2 rounded-lg border border-blue-400/40 bg-blue-500/10 px-5 py-2.5 text-sm font-semibold text-blue-200 transition-colors hover:bg-blue-500/20 hover:text-white"
          >
            {t.hero.ctaInterview}
            <IconArrowRight className="h-4 w-4" />
          </a>
        </div>

        <ul className="mt-16 grid gap-x-8 gap-y-4 border-t border-white/10 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {t.hero.trust.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-400">
              <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
