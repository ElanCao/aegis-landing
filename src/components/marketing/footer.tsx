import type { Locale } from "@/i18n";
import { CONSOLE_URL } from "@/lib/site";
import type { MarketingDict } from "./types";
import { LocaleSwitcher } from "./locale-switcher";
import { IconShield } from "./icons";

// PRD 12.4 Footer: product / solutions / trust center / contact, plus the
// brand boundary statement.
export function Footer({ t, locale, linkBase = "" }: { t: MarketingDict; locale: Locale; linkBase?: string }) {
  const docsHref = `/${locale}/docs`;
  // On sub-pages (e.g. /docs) in-page anchor links must point back to the
  // landing page; on the landing page itself they stay relative.
  const anchor = (href: string) => (href.startsWith("#") && linkBase ? linkBase + href : href);
  const columns = [
    {
      title: t.footer.product,
      links: [
        { label: t.nav.agentGovernance, href: "#loop" },
        { label: t.nav.mcpSkill, href: "#capabilities" },
        { label: t.nav.auditBilling, href: "#capabilities" },
        { label: t.nav.maturity, href: "#public-ai" },
      ],
    },
    {
      title: t.footer.solutions,
      links: [
        { label: t.nav.lowSensitivity, href: "#scenarios" },
        { label: t.nav.engData, href: "#scenarios" },
        { label: t.nav.publicAiGov, href: "#public-ai" },
      ],
    },
    {
      title: t.footer.trustCenter,
      links: [
        { label: t.nav.saasControl, href: "#architecture" },
        { label: t.nav.localClient, href: "#architecture" },
        { label: t.nav.dataBoundary, href: "#principles" },
        { label: t.nav.docs, href: docsHref },
      ],
    },
    {
      title: t.footer.contact,
      links: [
        { label: t.nav.requestDemo, href: "#demo" },
        { label: t.nav.loginPlatform, href: CONSOLE_URL },
      ],
    },
  ];

  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white">
                <IconShield className="h-5 w-5" />
              </span>
              <span className="text-base font-semibold text-white">{t.common.appName}</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">{t.footer.slogan}</p>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-white">{column.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label + link.href}>
                    <a href={anchor(link.href)} className="text-sm transition-colors hover:text-white">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs leading-relaxed text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>{t.footer.copyright}</p>
          <p className="max-w-xl">{t.footer.boundary}</p>
          <LocaleSwitcher
            locale={locale}
            label={t.common.switchLanguage}
            className="text-slate-400 hover:text-white"
          />
        </div>
      </div>
    </footer>
  );
}
