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
          <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-text-secondary">
            {t("site.footer.blurb")}
          </p>
        </div>

        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-text-muted">
            {t("site.footer.tools")}
          </p>
          <ul className="mt-3 space-y-2 text-[14px] text-text-secondary">
            <li>
              <Link href="/crop-doctor" className="hover:text-green-bright">
                {t("nav.cropDoctor")}
              </Link>
            </li>
            <li>
              <Link href="/advisor" className="hover:text-green-bright">
                {t("nav.advisor")}
              </Link>
            </li>
            <li>
              <Link href="/expenses" className="hover:text-green-bright">
                {t("nav.expenses")}
              </Link>
            </li>
            <li>
              <Link href="/market" className="hover:text-green-bright">
                {t("nav.market")}
              </Link>
            </li>
            <li>
              <Link href="/drone-spray" className="hover:text-green-bright">
                {t("site.footer.drone")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-text-muted">
            {t("site.footer.company")}
          </p>
          <ul className="mt-3 space-y-2 text-[14px] text-text-secondary">
            <li>
              <Link href="/about" className="hover:text-green-bright">
                {t("about.title")}
              </Link>
            </li>
            <li>
              <Link href="/help" className="hover:text-green-bright">
                {t("help.title")}
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-green-bright">
                {t("site.nav.signIn")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--hairline)]">
        <div className="mx-auto flex w-full max-w-site flex-col gap-2 px-4 py-5 text-[12px] text-text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>{t("site.footer.rights")}</p>
          <p>{t("site.footer.appsNote")}</p>
        </div>
      </div>
    </footer>
  );
}
