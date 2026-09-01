"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Landmark } from "lucide-react";
import MarketingShell from "@/components/MarketingShell";
import { SCHEME_CATEGORIES, SCHEMES } from "@/lib/seed/schemes";
import { useT } from "@/lib/i18n";
import { useApp } from "@/lib/store";

export default function SchemesPage() {
  const { t } = useT();
  const lang = useApp((s) => s.language);
  const [category, setCategory] = useState<string>("all");

  const list = useMemo(
    () =>
      category === "all"
        ? SCHEMES
        : SCHEMES.filter((s) => s.category === category),
    [category]
  );

  return (
    <MarketingShell>
      <div className="mx-auto w-full max-w-site px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-primary/12 text-green-bright">
            <Landmark size={20} />
          </div>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("schemes.title")}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">
            {t("schemes.sub")}
          </p>
        </div>

        <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto pb-1">
          {SCHEME_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition ${
                category === c.id
                  ? "bg-green-primary text-white"
                  : "hairline surface text-text-secondary hover-surface"
              }`}
            >
              {lang === "hi" ? c.labelHi : c.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {list.map((scheme) => (
            <article
              key={scheme.id}
              className="flex flex-col rounded-2xl border border-[var(--hairline)] bg-[var(--card-bg)] p-5 shadow-[var(--card-shadow)]"
            >
              <h2 className="text-[18px] font-bold">
                {lang === "hi" ? scheme.nameHi : scheme.name}
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">
                {lang === "hi" ? scheme.summaryHi : scheme.summary}
              </p>
              <div className="mt-4 space-y-2 text-[13px]">
                <p>
                  <span className="font-semibold text-text-primary">
                    {t("schemes.forWhom")}:
                  </span>{" "}
                  <span className="text-text-secondary">
                    {lang === "hi" ? scheme.forWhomHi : scheme.forWhom}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-text-primary">
                    {t("schemes.benefit")}:
                  </span>{" "}
                  <span className="text-text-secondary">
                    {lang === "hi" ? scheme.benefitHi : scheme.benefit}
                  </span>
                </p>
              </div>
              <a
                href={scheme.link}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-green-primary px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-green-dark"
              >
                {t("schemes.open")}
                <ExternalLink size={14} />
              </a>
            </article>
          ))}
        </div>

        <p className="mt-8 text-[12px] text-text-muted">{t("schemes.note")}</p>
      </div>
    </MarketingShell>
  );
}
