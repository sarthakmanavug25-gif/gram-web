"use client";

import { useMemo, useState } from "react";
import { MapPin, MessageCircle, Store, Wrench } from "lucide-react";
import MarketingShell from "@/components/MarketingShell";
import { MARKET_CATEGORIES, MARKET_PRODUCTS } from "@/lib/seed/marketplace";
import { useT } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import { rupees } from "@/lib/format";

export default function MarketplacePage() {
  const { t } = useT();
  const lang = useApp((s) => s.language);
  const [category, setCategory] = useState<string>("all");
  const [enquiry, setEnquiry] = useState<string | null>(null);

  const list = useMemo(
    () =>
      category === "all"
        ? MARKET_PRODUCTS
        : MARKET_PRODUCTS.filter((p) => p.category === category),
    [category]
  );

  return (
    <MarketingShell>
      <div className="mx-auto w-full max-w-site px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-primary/12 text-green-bright">
              <Wrench size={20} />
            </div>
            <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("marketPlace.title")}
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">
              {t("marketPlace.sub")}
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--card-bg)] px-4 py-3 text-[13px] text-text-secondary">
            <p className="flex items-center gap-2 font-semibold text-text-primary">
              <Store size={15} />
              {t("marketPlace.sellerCta")}
            </p>
            <p className="mt-1">{t("marketPlace.sellerNote")}</p>
          </div>
        </div>

        <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto pb-1">
          {MARKET_CATEGORIES.map((c) => (
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

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((product) => (
            <article
              key={product.id}
              className="flex flex-col rounded-2xl border border-[var(--hairline)] bg-[var(--card-bg)] p-5 shadow-[var(--card-shadow)]"
            >
              <div className="flex h-28 items-end rounded-xl bg-[linear-gradient(145deg,rgba(31,122,69,0.16),rgba(31,122,69,0.04))] p-4">
                <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-green-bright">
                  {lang === "hi"
                    ? MARKET_CATEGORIES.find((c) => c.id === product.category)?.labelHi
                    : MARKET_CATEGORIES.find((c) => c.id === product.category)?.label}
                </p>
              </div>
              <h2 className="mt-4 text-[17px] font-bold leading-snug">
                {lang === "hi" ? product.nameHi : product.name}
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
                {lang === "hi" ? product.blurbHi : product.blurb}
              </p>
              <p className="mt-3 flex items-center gap-1.5 text-[12px] text-text-muted">
                <MapPin size={13} />
                {product.seller} · {product.location}
              </p>
              <div className="mt-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-[20px] font-bold text-green-bright">
                    {rupees(product.price)}
                  </p>
                  <p className="text-[11px] text-text-muted">/{product.unit}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEnquiry(product.id)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-green-primary px-3.5 py-2 text-[12.5px] font-semibold text-white transition hover:bg-green-dark"
                >
                  <MessageCircle size={14} />
                  {t("marketPlace.enquire")}
                </button>
              </div>
              {enquiry === product.id && (
                <p className="mt-3 rounded-xl bg-green-primary/10 px-3 py-2 text-[12px] text-green-bright">
                  {t("marketPlace.enquireDone", { seller: product.seller })}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </MarketingShell>
  );
}
