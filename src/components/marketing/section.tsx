import type { ReactNode } from "react";

const tones = {
  white: "bg-white",
  slate: "bg-slate-50",
} as const;

// Shared section shell: anchor id, title/subtitle header, alternating tones.
export function Section({
  id,
  title,
  subtitle,
  tone = "white",
  children,
}: {
  id: string;
  title?: string;
  subtitle?: string;
  tone?: keyof typeof tones;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`scroll-mt-20 ${tones[tone]}`}>
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        {title ? (
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-4 text-lg leading-relaxed text-slate-600">{subtitle}</p>
            ) : null}
          </div>
        ) : null}
        <div className={title ? "mt-12" : ""}>{children}</div>
      </div>
    </section>
  );
}
