"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Camera,
  CloudSun,
  Home,
  IndianRupee,
  Languages,
  Menu,
  Moon,
  MoreHorizontal,
  Sprout,
  Store,
  Sun,
  X,
} from "lucide-react";
import clsx from "clsx";
import { useApp } from "@/lib/store";
import { useT, type StringKey } from "@/lib/i18n";

const LINKS: { href: string; label: StringKey; icon: typeof Home }[] = [
  { href: "/", label: "nav.home", icon: Home },
  { href: "/crop-doctor", label: "nav.cropDoctor", icon: Camera },
  { href: "/advisor", label: "nav.advisor", icon: CloudSun },
  { href: "/expenses", label: "nav.expenses", icon: IndianRupee },
  { href: "/market", label: "nav.market", icon: Store },
  { href: "/more", label: "nav.more", icon: MoreHorizontal },
];

export default function SiteHeader({
  variant = "app",
}: {
  variant?: "marketing" | "app";
}) {
  const pathname = usePathname();
  const { t } = useT();
  const language = useApp((s) => s.language);
  const setLanguage = useApp((s) => s.setLanguage);
  const theme = useApp((s) => s.theme);
  const setTheme = useApp((s) => s.setTheme);
  const session = useApp((s) => s.session);
  const [open, setOpen] = useState(false);

  const marketingLinks = [
    { href: "#features", label: t("site.nav.features") },
    { href: "#tools", label: t("site.nav.tools") },
    { href: "#apps", label: t("site.nav.apps") },
  ];

  return (
    <header className="site-header sticky top-0 z-50">
      <div className="mx-auto flex h-16 w-full max-w-site items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href={variant === "marketing" ? "/welcome" : "/"} className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-primary text-white shadow-glow transition group-hover:bg-green-dark">
            <Sprout size={20} strokeWidth={2.4} />
          </span>
          <span className="font-display text-[1.35rem] font-semibold tracking-tight text-text-primary">
            {t("app.name")}
          </span>
        </Link>

        {variant === "marketing" ? (
          <nav className="hidden items-center gap-7 md:flex">
            {marketingLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[14px] font-medium text-text-secondary transition hover:text-text-primary"
              >
                {l.label}
              </a>
            ))}
          </nav>
        ) : (
          <nav className="hidden items-center gap-1 lg:flex">
            {LINKS.map(({ href, label }) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={clsx(
                    "rounded-lg px-3 py-2 text-[13.5px] font-semibold transition",
                    active
                      ? "bg-green-primary/12 text-green-bright"
                      : "text-text-secondary hover:bg-[rgba(0,0,0,0.04)] hover:text-text-primary"
                  )}
                >
                  {t(label)}
                </Link>
              );
            })}
          </nav>
        )}

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

          {variant === "marketing" ? (
            <>
              <Link
                href="/login"
                className="hidden rounded-full px-3.5 py-2 text-[13.5px] font-semibold text-text-secondary transition hover:text-text-primary sm:inline-flex"
              >
                {t("site.nav.signIn")}
              </Link>
              <Link
                href="/"
                onClick={(e) => {
                  if (!session) {
                    e.preventDefault();
                    const { profile, setSession, markWelcomeSeen } =
                      useApp.getState();
                    setSession({
                      id: "guest",
                      name: profile.name,
                      phone: profile.phone,
                    });
                    markWelcomeSeen();
                    window.location.assign("/");
                  }
                }}
                className="rounded-full bg-green-primary px-4 py-2 text-[13.5px] font-semibold text-white shadow-glow transition hover:bg-green-dark"
              >
                {t("site.nav.openDashboard")}
              </Link>
            </>
          ) : (
            <Link
              href="/settings"
              className="hidden rounded-full bg-green-primary px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-green-dark sm:inline-flex"
            >
              {t("common.settings")}
            </Link>
          )}

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl hairline bg-white/80 text-text-primary lg:hidden"
            aria-label={open ? t("common.close") : "Menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[var(--hairline)] bg-[var(--nav-bg)] px-4 py-3 lg:hidden">
          <div className="mx-auto flex max-w-site flex-col gap-1">
            {(variant === "marketing"
              ? marketingLinks.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-[14px] font-semibold text-text-primary"
                  >
                    {l.label}
                  </a>
                ))
              : LINKS.map(({ href, label, icon: Icon }) => {
                  const active =
                    href === "/" ? pathname === "/" : pathname.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      className={clsx(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-semibold",
                        active
                          ? "bg-green-primary/12 text-green-bright"
                          : "text-text-primary"
                      )}
                    >
                      <Icon size={18} />
                      {t(label)}
                    </Link>
                  );
                }))}
            <div className="mt-2 flex gap-2 px-1 pb-1">
              <button
                type="button"
                onClick={() => setLanguage(language === "en" ? "hi" : "en")}
                className="flex-1 rounded-full hairline px-3 py-2 text-[12px] font-semibold"
              >
                {language === "en" ? "हिंदी" : "English"}
              </button>
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex-1 rounded-full hairline px-3 py-2 text-[12px] font-semibold"
              >
                {theme === "dark" ? "Light" : "Dark"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
