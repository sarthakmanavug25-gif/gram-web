"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import {
  Coins,
  MapPin,
  MessageCircle,
  ShoppingCart,
  Sprout,
  Store,
  Wrench,
} from "lucide-react";
import MarketingShell from "@/components/MarketingShell";
import MarketplaceCartCheckout from "@/components/MarketplaceCartCheckout";
import { MARKET_CATEGORIES, MARKET_PRODUCTS } from "@/lib/seed/marketplace";
import {
  GRAM_POINTS,
  discountFromPoints,
  maxCartRedeemablePoints,
  maxRedeemablePoints,
} from "@/lib/gramPoints";
import { useT } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import { rupees } from "@/lib/format";

export default function MarketplacePage() {
  const { t } = useT();
  const lang = useApp((s) => s.language);
  const gramPoints = useApp((s) => s.gramPoints);
  const history = useApp((s) => s.gramPointsHistory);
  const claimWelcome = useApp((s) => s.claimMarketplaceWelcome);
  const recordEnquire = useApp((s) => s.recordToolEnquire);
  const recordSellIntent = useApp((s) => s.recordCropSellIntent);
  const redeemOnEnquire = useApp((s) => s.redeemOnEnquire);
  const claimedWelcome = useApp((s) => s.claimedMarketplaceWelcome);
  const hydrated = useApp((s) => s.hydrated);
  const addToCart = useApp((s) => s.addToCart);

  const [category, setCategory] = useState<string>("all");
  const [enquiry, setEnquiry] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [usePointsFor, setUsePointsFor] = useState<string | null>(null);
  const [cropName, setCropName] = useState("");
  const [cropNote, setCropNote] = useState("");
  const [sellDone, setSellDone] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    const { earned } = claimWelcome();
    if (earned > 0) {
      setFlash(t("marketPlace.points.welcomeFlash", { n: earned }));
    }
  }, [hydrated, claimWelcome, t]);

  // Safety: if persist never finishes, still allow earning after a beat.
  useEffect(() => {
    const id = window.setTimeout(() => {
      if (!useApp.getState().hydrated) useApp.getState().setHydrated();
    }, 1200);
    return () => window.clearTimeout(id);
  }, []);

  const list = useMemo(
    () =>
      category === "all"
        ? MARKET_PRODUCTS
        : MARKET_PRODUCTS.filter((p) => p.category === category),
    [category]
  );

  function flashMsg(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 4200);
  }

  function handleEnquire(productId: string, listPrice: number) {
    let discount = 0;
    let spent = 0;
    if (usePointsFor === productId) {
      const result = redeemOnEnquire(productId, listPrice);
      if (result.ok) {
        discount = result.discount;
        spent = result.spent;
      }
      setUsePointsFor(null);
    }

    const earn = recordEnquire(productId);
    setEnquiry(productId);

    const parts: string[] = [];
    if (earn.earned > 0) {
      parts.push(t("marketPlace.points.earnedEnquire", { n: earn.earned }));
    } else if (earn.dailyCap) {
      parts.push(t("marketPlace.points.dailyCap"));
    } else if (earn.already) {
      parts.push(t("marketPlace.points.alreadyEnquired"));
    }
    if (spent > 0) {
      parts.push(
        t("marketPlace.points.redeemed", {
          n: spent,
          off: rupees(discount),
        })
      );
    }
    if (parts.length) flashMsg(parts.join(" · "));
  }

  function handleSellIntent(e: FormEvent) {
    e.preventDefault();
    if (!cropName.trim()) return;
    const result = recordSellIntent();
    setSellDone(true);
    if (result.earned > 0) {
      flashMsg(t("marketPlace.points.earnedSell", { n: result.earned }));
    } else if (result.alreadyToday) {
      flashMsg(t("marketPlace.points.sellAlready"));
    }
  }

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

          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <div className="rounded-2xl glass px-4 py-3 text-[13px] text-text-secondary">
              <p className="flex items-center gap-2 font-semibold text-text-primary">
                <Coins size={15} className="text-green-bright" />
                {t("marketPlace.points.balance")}
              </p>
              <p className="mt-1 font-display text-2xl font-bold text-green-bright">
                {gramPoints}
                <span className="ml-1 text-[12px] font-semibold text-text-muted">
                  GP
                </span>
              </p>
              <p className="mt-1 text-[12px] leading-snug">
                {t("marketPlace.points.balanceHint")}
              </p>
              {!claimedWelcome && (
                <p className="mt-1 text-[11px] text-text-muted">
                  {t("marketPlace.points.loadingWelcome")}
                </p>
              )}
            </div>
            <div className="rounded-2xl glass px-4 py-3 text-[13px] text-text-secondary">
              <p className="flex items-center gap-2 font-semibold text-text-primary">
                <Store size={15} />
                {t("marketPlace.sellerCta")}
              </p>
              <p className="mt-1">{t("marketPlace.sellerNote")}</p>
            </div>
          </div>
        </div>

        {flash && (
          <p className="mt-5 rounded-2xl bg-green-primary/12 px-4 py-3 text-[13px] font-medium text-green-bright">
            {flash}
          </p>
        )}

        <section className="mt-6 rounded-[28px] glass p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-primary/12 text-green-bright">
              <Sprout size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-[17px] font-bold text-text-primary">
                {t("marketPlace.sell.title")}
              </h2>
              <p className="mt-1 text-[13px] text-text-secondary">
                {t("marketPlace.sell.sub", { n: GRAM_POINTS.SELL_INTENT })}
              </p>
              <form
                onSubmit={handleSellIntent}
                className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
              >
                <input
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  placeholder={t("marketPlace.sell.cropPh")}
                  className="rounded-xl border border-[var(--hairline-edge)] bg-[var(--input-bg)] px-3 py-2.5 text-[14px] text-text-primary outline-none focus:border-green-primary"
                  required
                />
                <input
                  value={cropNote}
                  onChange={(e) => setCropNote(e.target.value)}
                  placeholder={t("marketPlace.sell.notePh")}
                  className="rounded-xl border border-[var(--hairline-edge)] bg-[var(--input-bg)] px-3 py-2.5 text-[14px] text-text-primary outline-none focus:border-green-primary"
                />
                <button
                  type="submit"
                  className="rounded-full bg-green-primary px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-green-dark"
                >
                  {t("marketPlace.sell.cta")}
                </button>
              </form>
              {sellDone && (
                <p className="mt-3 text-[12px] text-green-bright">
                  {t("marketPlace.sell.done")}
                </p>
              )}
            </div>
          </div>
        </section>

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
          {list.map((product) => {
            const redeemable = maxRedeemablePoints(product.price, gramPoints);
            const cartPoints = maxCartRedeemablePoints(product.price, gramPoints);
            const apply = usePointsFor === product.id && redeemable > 0;
            const enquireDiscount = apply ? discountFromPoints(redeemable) : 0;
            const cartDiscount = discountFromPoints(cartPoints);
            const showCartDeal = cartDiscount > 0;
            const effective = showCartDeal
              ? product.price - cartDiscount
              : product.price - enquireDiscount;

            return (
              <article
                key={product.id}
                className="flex flex-col rounded-2xl glass glass-hover p-5"
              >
                <div className="relative h-40 overflow-hidden rounded-xl bg-[linear-gradient(145deg,rgba(31,122,69,0.16),rgba(31,122,69,0.04))]">
                  <Image
                    src={product.image}
                    alt={lang === "hi" ? product.nameHi : product.name}
                    fill
                    sizes="(max-width:640px) 100vw, (max-width:1280px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <p className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-green-bright backdrop-blur-sm dark:bg-[#102318]/85">
                    {lang === "hi"
                      ? MARKET_CATEGORIES.find((c) => c.id === product.category)
                          ?.labelHi
                      : MARKET_CATEGORIES.find((c) => c.id === product.category)
                          ?.label}
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

                <div className="mt-4">
                  <p className="text-[20px] font-bold text-green-bright">
                    {rupees(effective)}
                  </p>
                  {showCartDeal ? (
                    <p className="mt-1 text-[12px] font-medium text-green-bright">
                      <span className="text-text-muted line-through">
                        {rupees(product.price)}
                      </span>
                      {" · "}
                      {t("cart.cardDeal", {
                        n: cartPoints,
                        off: rupees(cartDiscount),
                      })}
                    </p>
                  ) : enquireDiscount > 0 ? (
                    <p className="text-[11px] text-text-muted">
                      <span className="line-through">{rupees(product.price)}</span>
                      {" · "}
                      {t("marketPlace.points.off", {
                        off: rupees(enquireDiscount),
                      })}
                    </p>
                  ) : (
                    <p className="text-[11px] text-text-muted">/{product.unit}</p>
                  )}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(product.id);
                      flashMsg(
                        showCartDeal
                          ? t("cart.addedWithPoints", {
                              n: cartPoints,
                              off: rupees(cartDiscount),
                            })
                          : t("cart.added")
                      );
                    }}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border-2 border-green-primary bg-green-primary/12 px-3 py-2.5 text-[13px] font-bold text-green-bright transition hover:bg-green-primary/20"
                  >
                    <ShoppingCart size={15} />
                    {t("cart.add")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEnquire(product.id, product.price)}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-green-primary px-3 py-2.5 text-[13px] font-bold text-white transition hover:bg-green-dark"
                  >
                    <MessageCircle size={15} />
                    {t("marketPlace.enquire")}
                  </button>
                </div>

                {redeemable >= GRAM_POINTS.MIN_REDEEM && (
                  <label className="mt-3 flex cursor-pointer items-start gap-2 rounded-xl border border-[var(--hairline-edge)] bg-[var(--surface)] px-3 py-2 text-[12px] text-text-secondary">
                    <input
                      type="checkbox"
                      className="mt-0.5 accent-[var(--green-primary)]"
                      checked={usePointsFor === product.id}
                      onChange={(e) =>
                        setUsePointsFor(e.target.checked ? product.id : null)
                      }
                    />
                    <span>
                      {t("marketPlace.points.useOnEnquire", {
                        n: redeemable,
                        off: rupees(discountFromPoints(redeemable)),
                      })}
                    </span>
                  </label>
                )}

                {enquiry === product.id && (
                  <p className="mt-3 rounded-xl bg-green-primary/10 px-3 py-2 text-[12px] text-green-bright">
                    {t("marketPlace.enquireDone", { seller: product.seller })}
                  </p>
                )}
              </article>
            );
          })}
        </div>

        {history.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-bold text-text-primary">
              {t("marketPlace.points.history")}
            </h2>
            <ul className="mt-3 divide-y divide-[var(--hairline-edge)] rounded-2xl glass">
              {history.slice(0, 8).map((ev) => (
                <li
                  key={ev.id}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-[13px]"
                >
                  <span className="text-text-secondary">
                    {lang === "hi" ? ev.labelHi : ev.label}
                  </span>
                  <span
                    className={
                      ev.amount >= 0
                        ? "font-semibold text-green-bright"
                        : "font-semibold text-text-primary"
                    }
                  >
                    {ev.amount >= 0 ? `+${ev.amount}` : ev.amount} GP
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
      <div className="h-20" aria-hidden />
      <MarketplaceCartCheckout />
    </MarketingShell>
  );
}
