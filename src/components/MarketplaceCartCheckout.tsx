"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  CreditCard,
  Coins,
  Minus,
  Plus,
  ShoppingCart,
  Smartphone,
  Trash2,
  Wallet,
  X,
} from "lucide-react";
import { MARKET_PRODUCTS } from "@/lib/seed/marketplace";
import {
  discountFromPoints,
  maxCartRedeemablePoints,
} from "@/lib/gramPoints";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { rupees } from "@/lib/format";

type PayMethod = "upi" | "card" | "cod";

function onlyDigits(value: string, max: number) {
  return value.replace(/\D/g, "").slice(0, max);
}

function formatCardNumber(value: string) {
  const digits = onlyDigits(value, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export default function MarketplaceCartCheckout() {
  const { t } = useT();
  const lang = useApp((s) => s.language);
  const cart = useApp((s) => s.cart);
  const gramPoints = useApp((s) => s.gramPoints);
  const setCartQty = useApp((s) => s.setCartQty);
  const removeFromCart = useApp((s) => s.removeFromCart);
  const checkoutCart = useApp((s) => s.checkoutCart);
  const toolOrders = useApp((s) => s.toolOrders);

  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState<PayMethod>("card");
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState<string | null>(null);
  const [pointsSpent, setPointsSpent] = useState(0);
  const [error, setError] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [upiId, setUpiId] = useState("");

  const lines = useMemo(
    () =>
      cart
        .map((c) => {
          const product = MARKET_PRODUCTS.find((p) => p.id === c.productId);
          if (!product) return null;
          return { ...c, product };
        })
        .filter(Boolean) as {
        productId: string;
        qty: number;
        product: (typeof MARKET_PRODUCTS)[number];
      }[],
    [cart]
  );

  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  const redeemable = maxCartRedeemablePoints(subtotal, gramPoints);
  const discount = discountFromPoints(redeemable);
  const total = Math.max(0, subtotal - discount);
  const count = lines.reduce((n, l) => n + l.qty, 0);

  function validatePay() {
    if (method === "card") {
      const digits = onlyDigits(cardNumber, 16);
      if (cardName.trim().length < 2) {
        return t("cart.cardErrorName");
      }
      if (digits.length < 16) {
        return t("cart.cardErrorNumber");
      }
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        return t("cart.cardErrorExpiry");
      }
      if (cardCvv.length < 3) {
        return t("cart.cardErrorCvv");
      }
    }
    if (method === "upi" && upiId.trim().length < 3) {
      return t("cart.upiError");
    }
    return "";
  }

  function pay() {
    const validation = validatePay();
    if (validation) {
      setError(validation);
      return;
    }
    setBusy(true);
    setError("");
    const catalog = MARKET_PRODUCTS.map((p) => ({
      id: p.id,
      name: lang === "hi" ? p.nameHi : p.name,
      price: p.price,
    }));
    const result = checkoutCart({
      method,
      usePoints: true,
      catalog,
    });
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setPointsSpent(result.order.pointsUsed);
    setReceipt(result.order.id);
    setCardNumber("");
    setCardCvv("");
    setCardExpiry("");
    setCardName("");
    setUpiId("");
  }

  if (count === 0 && !open && !receipt) return null;

  return (
    <>
      {count > 0 && !open && (
        <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:px-6">
          <button
            type="button"
            onClick={() => {
              setOpen(true);
              setReceipt(null);
            }}
            className="mx-auto flex w-full max-w-site items-center justify-between gap-3 rounded-2xl bg-green-primary px-5 py-3.5 text-white shadow-[0_16px_40px_rgba(16,55,30,0.35)]"
          >
            <span className="inline-flex flex-col items-start gap-0.5 text-left">
              <span className="inline-flex items-center gap-2 text-[14px] font-semibold">
                <ShoppingCart size={18} />
                {t("cart.bar", { n: count })}
              </span>
              {redeemable > 0 && (
                <span className="text-[11px] font-medium text-white/85">
                  {t("cart.barPoints", {
                    n: redeemable,
                    off: rupees(discount),
                  })}
                </span>
              )}
            </span>
            <span className="text-right">
              {discount > 0 && (
                <span className="block text-[11px] text-white/70 line-through">
                  {rupees(subtotal)}
                </span>
              )}
              <span className="text-[14px] font-bold">{rupees(total)}</span>
            </span>
          </button>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 sm:items-center sm:px-4">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-[28px] bg-[var(--sheet-bg)] p-5 shadow-2xl backdrop-blur-xl sm:rounded-[28px] sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-display text-xl font-bold text-text-primary">
                {t("cart.title")}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-text-muted hover:bg-black/5"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {receipt ? (
              <div className="space-y-3 rounded-2xl bg-green-primary/10 p-4">
                <p className="text-[16px] font-bold text-green-bright">
                  {t("cart.success")}
                </p>
                <p className="text-[13px] text-text-secondary">
                  {t("cart.successBody", { id: receipt })}
                </p>
                {pointsSpent > 0 && (
                  <p className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-green-bright">
                    <Coins size={14} />
                    {t("cart.pointsDeducted", {
                      n: pointsSpent,
                      off: rupees(discountFromPoints(pointsSpent)),
                    })}
                  </p>
                )}
                <p className="text-[12px] text-text-muted">{t("cart.demoNote")}</p>
                <button
                  type="button"
                  onClick={() => {
                    setReceipt(null);
                    setPointsSpent(0);
                    setOpen(false);
                  }}
                  className="mt-2 w-full rounded-full bg-green-primary px-4 py-3 text-[14px] font-semibold text-white"
                >
                  {t("cart.done")}
                </button>
              </div>
            ) : lines.length === 0 ? (
              <p className="text-[14px] text-text-secondary">{t("cart.empty")}</p>
            ) : (
              <>
                <ul className="space-y-3">
                  {lines.map(({ product, qty, productId }) => (
                    <li
                      key={productId}
                      className="flex gap-3 rounded-2xl border border-[var(--hairline-edge)] bg-[var(--surface-2)] p-3"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                        <Image
                          src={product.image}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-semibold text-text-primary">
                          {lang === "hi" ? product.nameHi : product.name}
                        </p>
                        <p className="text-[12px] text-text-muted">
                          {rupees(product.price)}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            type="button"
                            className="rounded-full border border-[var(--hairline-edge)] p-1"
                            onClick={() => setCartQty(productId, qty - 1)}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="min-w-[1.5rem] text-center text-[13px] font-semibold">
                            {qty}
                          </span>
                          <button
                            type="button"
                            className="rounded-full border border-[var(--hairline-edge)] p-1"
                            onClick={() => setCartQty(productId, qty + 1)}
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            type="button"
                            className="ml-auto text-text-muted"
                            onClick={() => removeFromCart(productId)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {redeemable > 0 ? (
                  <div className="mt-4 rounded-xl border border-green-primary/30 bg-green-primary/8 px-3 py-3 text-[13px] text-green-bright">
                    <p className="inline-flex items-center gap-1.5 font-semibold">
                      <Coins size={15} />
                      {t("cart.discountApplied")}
                    </p>
                    <p className="mt-1">
                      {t("cart.autoPoints", {
                        n: redeemable,
                        off: rupees(discount),
                        left: gramPoints - redeemable,
                      })}
                    </p>
                  </div>
                ) : (
                  <p className="mt-4 text-[12px] text-text-muted">
                    {t("cart.noPoints")}
                  </p>
                )}

                <div className="mt-4 space-y-1.5 text-[13px]">
                  <div className="flex justify-between text-text-secondary">
                    <span>{t("cart.subtotal")}</span>
                    <span>{rupees(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between font-semibold text-green-bright">
                      <span>{t("cart.discount")}</span>
                      <span>−{rupees(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[16px] font-bold text-text-primary">
                    <span>{t("cart.total")}</span>
                    <span>{rupees(total)}</span>
                  </div>
                </div>

                <p className="mt-5 text-[12px] font-semibold text-text-primary">
                  {t("cart.payMethod")}
                </p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(
                    [
                      ["card", CreditCard, t("cart.card")],
                      ["upi", Smartphone, t("cart.upi")],
                      ["cod", Wallet, t("cart.cod")],
                    ] as const
                  ).map(([id, Icon, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setMethod(id);
                        setError("");
                      }}
                      className={`rounded-xl border px-2 py-3 text-[12px] font-semibold ${
                        method === id
                          ? "border-green-primary bg-green-primary/10 text-green-bright shadow-[0_0_0_1px_rgba(31,122,69,0.35)]"
                          : "border-[var(--hairline-edge)] text-text-secondary"
                      }`}
                    >
                      <Icon size={16} className="mx-auto mb-1" />
                      {label}
                    </button>
                  ))}
                </div>

                {method === "card" && (
                  <div className="mt-4 space-y-3 rounded-2xl border border-[var(--hairline-edge)] bg-[var(--surface-2)] p-4">
                    <p className="inline-flex items-center gap-1.5 text-[13px] font-bold text-text-primary">
                      <CreditCard size={15} />
                      {t("cart.cardTitle")}
                    </p>
                    <label className="block text-[12px] font-semibold text-text-muted">
                      {t("cart.cardName")}
                      <input
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder={t("cart.cardNamePh")}
                        className="mt-1.5 w-full rounded-xl border border-[var(--hairline-edge)] bg-[var(--input-bg)] px-3 py-2.5 text-[14px] text-text-primary outline-none focus:border-green-primary"
                      />
                    </label>
                    <label className="block text-[12px] font-semibold text-text-muted">
                      {t("cart.cardNumber")}
                      <input
                        inputMode="numeric"
                        autoComplete="cc-number"
                        value={cardNumber}
                        onChange={(e) =>
                          setCardNumber(formatCardNumber(e.target.value))
                        }
                        placeholder="XXXX XXXX XXXX XXXX"
                        className="mt-1.5 w-full rounded-xl border border-[var(--hairline-edge)] bg-[var(--input-bg)] px-3 py-2.5 text-[14px] tracking-wider text-text-primary outline-none focus:border-green-primary"
                      />
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="block text-[12px] font-semibold text-text-muted">
                        {t("cart.cardExpiry")}
                        <input
                          inputMode="numeric"
                          value={cardExpiry}
                          onChange={(e) => {
                            const raw = onlyDigits(e.target.value, 4);
                            const formatted =
                              raw.length > 2
                                ? `${raw.slice(0, 2)}/${raw.slice(2)}`
                                : raw;
                            setCardExpiry(formatted);
                          }}
                          placeholder="MM/YY"
                          className="mt-1.5 w-full rounded-xl border border-[var(--hairline-edge)] bg-[var(--input-bg)] px-3 py-2.5 text-[14px] text-text-primary outline-none focus:border-green-primary"
                        />
                      </label>
                      <label className="block text-[12px] font-semibold text-text-muted">
                        {t("cart.cardCvv")}
                        <input
                          inputMode="numeric"
                          type="password"
                          value={cardCvv}
                          onChange={(e) =>
                            setCardCvv(onlyDigits(e.target.value, 4))
                          }
                          placeholder="***"
                          className="mt-1.5 w-full rounded-xl border border-[var(--hairline-edge)] bg-[var(--input-bg)] px-3 py-2.5 text-[14px] text-text-primary outline-none focus:border-green-primary"
                        />
                      </label>
                    </div>
                    <p className="text-[11px] text-text-muted">
                      {t("cart.cardDemoHint")}
                    </p>
                  </div>
                )}

                {method === "upi" && (
                  <label className="mt-4 block rounded-2xl border border-[var(--hairline-edge)] bg-[var(--surface-2)] p-4 text-[12px] font-semibold text-text-muted">
                    {t("cart.upiId")}
                    <input
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="name@upi"
                      className="mt-1.5 w-full rounded-xl border border-[var(--hairline-edge)] bg-[var(--input-bg)] px-3 py-2.5 text-[14px] font-normal text-text-primary outline-none focus:border-green-primary"
                    />
                  </label>
                )}

                {method === "cod" && (
                  <p className="mt-4 rounded-xl border border-[var(--hairline-edge)] bg-[var(--surface-2)] px-3 py-2.5 text-[12px] text-text-secondary">
                    {t("cart.codNote")}
                  </p>
                )}

                {error && (
                  <p className="mt-3 text-[12px] text-critical">{error}</p>
                )}

                <button
                  type="button"
                  disabled={busy}
                  onClick={pay}
                  className="mt-5 w-full rounded-full bg-green-primary px-4 py-3.5 text-[15px] font-semibold text-white disabled:opacity-60"
                >
                  {busy
                    ? t("cart.paying")
                    : method === "card"
                      ? t("cart.payCard", { amount: rupees(total) })
                      : t("cart.payNow", { amount: rupees(total) })}
                </button>
                <p className="mt-2 text-center text-[11px] text-text-muted">
                  {t("cart.demoNote")}
                </p>
              </>
            )}

            {toolOrders.length > 0 && !receipt && (
              <div className="mt-6 border-t border-[var(--hairline-edge)] pt-4">
                <p className="text-[13px] font-bold text-text-primary">
                  {t("cart.recentOrders")}
                </p>
                <ul className="mt-2 space-y-2">
                  {toolOrders.slice(0, 3).map((o) => (
                    <li
                      key={o.id}
                      className="flex justify-between text-[12px] text-text-secondary"
                    >
                      <span>
                        {o.id.slice(-6)} · {o.method.toUpperCase()} · {o.status}
                        {o.pointsUsed > 0 ? ` · −${o.pointsUsed} GP` : ""}
                      </span>
                      <span className="font-semibold">{rupees(o.total)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
