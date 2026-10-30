import Link from "next/link";
import type { Locale } from "@/i18n";
import { CONSOLE_URL } from "@/lib/site";
import type { MarketingDict } from "./types";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileMenu, type MobileNavGroup } from "./mobile-menu";
import { IconChevronDown, IconShield } from "./icons";

// PRD 12.4 navigation: Products / Solutions / Platform / Resources / Get started,
// with anchor dropdowns plus language switch and platform sign-in.
export function Header({ t, locale, linkBase = "" }: { t: MarketingDict; locale: Locale; linkBase?: string }) {
  // 登录平台直达独立部署的 SaaS 控制台登录页（NEXT_PUBLIC_CONSOLE_URL）。
  const loginHref = `${CONSOLE_URL}/${locale}/login`;
  const docsHref = `/${locale}/docs`;
  const interviewHref = `/${locale}/interview`;
  // On sub-pages (e.g. /docs) in-page anchor links must point back to the
  // landing page; on the landing page itself they stay relative.
  const anchor = (href: string) => (href.startsWith("#") && linkBase ? linkBase + href : href);
  const groups: MobileNavGroup[] = [
    {
      label: t.nav.products,
      items: [
        { label: t.nav.agentGovernance, href: "#loop" },
        { label: t.nav.mcpSkill, href: "#capabilities" },
        { label: t.nav.auditBilling, href: "#capabilities" },
        { label: t.nav.maturity, href: "#public-ai" },
      ],
    },
    {
      label: t.nav.solutions,
      items: [
        { label: t.nav.lowSensitivity, href: "#scenarios" },
        { label: t.nav.engData, href: "#scenarios" },
        { label: t.nav.publicAiGov, href: "#public-ai" },
      ],
    },
    {
      label: t.nav.platform,
      items: [
        { label: t.nav.saasControl, href: "#architecture" },
        { label: t.nav.localClient, href: "#architecture" },
        { label: t.nav.dataBoundary, href: "#principles" },
      ],
    },
    {
      label: t.nav.resources,
      items: [
        { label: t.nav.docs, href: docsHref },
        { label: t.nav.demoCenter, href: "#demo" },
        { label: t.nav.changelog, href: "https://github.com/ElanCao/aegis-community/releases" },
        { label: t.nav.interview, href: interviewHref },
      ],
    },
    {
      label: t.nav.getStarted,
      items: [
        { label: t.nav.requestDemo, href: "#demo" },
        { label: t.nav.loginPlatform, href: loginHref },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <Link href={`/${locale}`} className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-700 text-white">
            <IconShield className="h-5 w-5" />
          </span>
          <span className="flex flex-col justify-center leading-none">
            <span className="text-base font-semibold tracking-tight text-slate-900">
              {t.common.appName}
            </span>
            <span className="mt-1 hidden text-[11px] text-slate-500 lg:block">
              {t.common.tagline}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center md:flex" aria-label={t.nav.products}>
          {groups.map((group) => (
            <div key={group.label} className="group relative">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                {group.label}
                <IconChevronDown className="h-3.5 w-3.5 text-slate-400 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              <div className="invisible absolute left-0 top-full pt-1 opacity-0 transition-all duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                <ul className="w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-900/5">
                  {group.items.map((item) => (
                    <li key={item.label + item.href}>
                      {item.href.startsWith("#") || item.href.startsWith("http") ? (
                        <a
                          href={item.href.startsWith("http") ? item.href : anchor(item.href)}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher
            locale={locale}
            label={t.common.switchLanguage}
            className="hidden text-slate-600 hover:text-slate-900 sm:inline-flex"
          />
          <a
            href={loginHref}
            className="hidden items-center justify-center gap-2 rounded-lg bg-blue-700 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-800 sm:inline-flex"
          >
            {t.nav.loginPlatform}
          </a>
          <MobileMenu t={t} locale={locale} groups={groups} loginHref={loginHref} />
        </div>
      </div>
    </header>
  );
}
