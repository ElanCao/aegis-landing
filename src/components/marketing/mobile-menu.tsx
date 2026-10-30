"use client";

import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n";
import type { MarketingDict } from "./types";
import { LocaleSwitcher } from "./locale-switcher";
import { IconMenu, IconX } from "./icons";

export type MobileNavGroup = { label: string; items: { label: string; href: string }[] };

export function MobileMenu({
  t,
  locale,
  groups,
  loginHref,
}: {
  t: MarketingDict;
  locale: Locale;
  groups: MobileNavGroup[];
  loginHref: string;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t.common.menu}
        aria-expanded={open}
        className="grid h-9 w-9 place-items-center rounded-lg text-slate-700 hover:bg-slate-100"
      >
        {open ? <IconX className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
      </button>
      {open ? (
        <div className="fixed inset-x-0 top-16 z-40 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-slate-200 bg-white px-6 pb-8 pt-2 shadow-xl">
          {groups.map((group) => (
            <div key={group.label} className="mt-5 first:mt-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {group.label}
              </p>
              <ul className="mt-1.5 space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.label + item.href}>
                    {item.href.startsWith("#") || item.href.startsWith("http") ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        onClick={close}
                        className="block rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={close}
                        className="block rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
            <LocaleSwitcher
              locale={locale}
              label={t.common.switchLanguage}
              className="text-slate-600 hover:text-slate-900"
            />
            <a
              href={loginHref}
              onClick={close}
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
            >
              {t.nav.loginPlatform}
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
