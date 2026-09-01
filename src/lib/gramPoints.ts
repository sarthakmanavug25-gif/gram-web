/** Light Gram Points rules — local demo rewards for marketplace engagement. */

export const GRAM_POINTS = {
  WELCOME: 25,
  ENQUIRE: 40,
  SELL_INTENT: 60,
  MAX_ENQUIRE_PER_DAY: 5,
  /** 1 point ≈ ₹1 toward tool price (display / enquire quote only). */
  RUPEE_PER_POINT: 1,
  MAX_DISCOUNT_PCT: 0.1,
  MAX_DISCOUNT_ABS: 2500,
  MIN_REDEEM: 50,
} as const;

export type GramPointReason =
  | "welcome"
  | "enquire"
  | "sell_intent"
  | "redeem";

export type GramPointEvent = {
  id: string;
  reason: GramPointReason;
  amount: number;
  label: string;
  labelHi: string;
  productId?: string;
  at: string;
};

export type GramPointsDay = {
  /** yyyy-mm-dd */
  date: string;
  enquireCount: number;
  sellIntent: boolean;
};

export function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

export function normalizeDay(
  day: GramPointsDay | undefined,
  now = new Date()
): GramPointsDay {
  const date = todayKey(now);
  if (!day || day.date !== date) {
    return { date, enquireCount: 0, sellIntent: false };
  }
  return day;
}

/** How many points can be spent on this list price. */
export function maxRedeemablePoints(listPrice: number, balance: number) {
  const byPct = Math.floor(listPrice * GRAM_POINTS.MAX_DISCOUNT_PCT);
  const capped = Math.min(byPct, GRAM_POINTS.MAX_DISCOUNT_ABS, balance);
  if (capped < GRAM_POINTS.MIN_REDEEM) return 0;
  return Math.floor(capped / 10) * 10; // round down to 10s for clean ₹ amounts
}

export function discountFromPoints(points: number) {
  return points * GRAM_POINTS.RUPEE_PER_POINT;
}
