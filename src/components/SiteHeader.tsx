"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Languages, Menu, Moon, Sprout, Sun, X } from "lucide-react";
import clsx from "clsx";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";

const NAV = [
  { href: "/", labelKey: "site.nav.home" as const },
  { href: "/#app-guide", labelKey: "site.nav.guide" as const },
  { href: "/schemes", labelKey: "site.nav.schemes" as const },
  { href: "/marketplace", labelKey: "site.nav.marketplace" as const },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { t } = useT();
  const language = useApp((s) => s.language);
  const setLanguage = useApp((s) => s.setLanguage);
  const theme = useApp((s) => s.theme);
  const setTheme = useApp((s) => s.setTheme);
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="site-header sticky top-0 z-50">
      <div className="mx-auto flex h-16 w-full max-w-site items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-primary text-white shadow-glow transition group-hover:bg-green-dark">
            <Sprout size={20} strokeWidth={2.4} />
          </span>
          <span className="font-display text-[1.35rem] font-semibold tracking-tight text-text-primary">
            {t("app.name")}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map(({ href, labelKey }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "rounded-lg px-3 py-2 text-[13.5px] font-semibold transition",
                isActive(href)
                  ? "bg-green-primary/12 text-green-bright"
                  : "text-text-secondary hover:bg-[rgba(0,0,0,0.04)] hover:text-text-primary"
              )}
            >
              {t(labelKey)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={t("more.language")}
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            className="hidden h-9 items-center gap-1.5 rounded-full hairline bg-white/70 px-3 text-[12px] font-semibold text-text-secondary transition hover:text-text-primary sm:inline-flex"
          >
            <Languages size={14} />
            {language === "en" ? "हिंदी" : "EN"}
          </button>
          <button
            type="button"
            aria-label={theme === "dark" ? "Light mode" : "Dark mode"}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hidden h-9 w-9 items-center justify-center rounded-full hairline bg-white/70 text-text-secondary transition hover:text-text-primary sm:inline-flex"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <a
            href="/#get-app"
            className="rounded-full bg-green-primary px-4 py-2 text-[13.5px] font-semibold text-white shadow-glow transition hover:bg-green-dark"
          >
            {t("site.nav.getApp")}
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl hairline bg-white/80 text-text-primary md:hidden"
            aria-label={open ? t("common.close") : "Menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[var(--hairline)] bg-[var(--nav-bg)] px-4 py-3 md:hidden">
          <div className="mx-auto flex max-w-site flex-col gap-1">
            {NAV.map(({ href, labelKey }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-[14px] font-semibold text-text-primary"
              >
                {t(labelKey)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
