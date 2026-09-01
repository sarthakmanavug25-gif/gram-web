"use client";

import Link from "next/link";
import { Sprout } from "lucide-react";
import { useT } from "@/lib/i18n";

export default function SiteFooter() {
  const { t } = useT();

  return (
    <footer className="site-footer mt-auto">
      <div className="mx-auto grid w-full max-w-site gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-primary text-white">
              <Sprout size={18} />
            </span>
            <span className="font-display text-xl font-semibold">{t("app.name")}</span>
          </div>
          <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-[var(--footer-text)] opacity-80">
            {t("site.footer.blurb")}
          </p>
        </div>

        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] opacity-60">
            {t("site.footer.explore")}
          </p>
          <ul className="mt-3 space-y-2 text-[14px] opacity-85">
            <li>
              <Link href="/#app-guide" className="hover:opacity-100">
                {t("site.nav.guide")}
              </Link>
            </li>
            <li>
              <Link href="/diseases" className="hover:opacity-100">
                {t("site.nav.diseases")}
              </Link>
            </li>
            <li>
              <Link href="/schemes" className="hover:opacity-100">
                {t("site.nav.schemes")}
              </Link>
            </li>
            <li>
              <Link href="/marketplace" className="hover:opacity-100">
                {t("site.nav.marketplace")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] opacity-60">
            {t("site.footer.company")}
          </p>
          <ul className="mt-3 space-y-2 text-[14px] opacity-85">
            <li>
              <Link href="/about" className="hover:opacity-100">
                {t("about.title")}
              </Link>
            </li>
            <li>
              <Link href="/help" className="hover:opacity-100">
                {t("help.title")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-site flex-col gap-2 px-4 py-5 text-[12px] opacity-65 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>{t("site.footer.rights")}</p>
          <p>{t("site.footer.appsNote")}</p>
        </div>
      </div>
    </footer>
  );
}
