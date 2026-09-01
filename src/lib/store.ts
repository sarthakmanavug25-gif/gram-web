"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { currentSeason } from "./seed/reference";
import {
  GRAM_POINTS,
  maxCartRedeemablePoints,
  maxRedeemablePoints,
  normalizeDay,
  type GramPointEvent,
  type GramPointsDay,
  type PendingLoginReward,
} from "./gramPoints";

export type Expense = {
  id: string;
  crop: string;
  category: string;
  amount: number;
  paymentMethod: string;
  date: string; // yyyy-mm-dd
  notes: string;
};

export type Profile = {
  name: string;
  phone: string;
  farmSizeAcres: number;
  season: string;
  crops: string[];
  locationName: string;
  latitude: number;
  longitude: number;
  monthlyBudget: number;
  profilePhoto?: string;
  farmPhoto?: string;
};

export type ScanRecord = {
  id: string;
  diseaseSlug: string;
  diseaseName: string;
  crop: string;
  confidence: number;
  createdAt: string;
  imageDataUrl?: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type DroneBooking = {
  id: string;
  operatorName: string;
  crop: string;
  acres: number;
  date: string;
  slot: string;
  estimate: number;
  status: "Requested" | "Confirmed";
  createdAt: string;
};

export type CartItem = {
  productId: string;
  qty: number;
};

export type ToolOrder = {
  id: string;
  items: { productId: string; name: string; qty: number; unitPrice: number }[];
  subtotal: number;
  pointsUsed: number;
  discount: number;
  total: number;
  method: "upi" | "card" | "cod";
  status: "Paid" | "COD pending";
  createdAt: string;
};

export type Account = {
  id: string;
  name: string;
  phone: string;
  password: string;
};

type Session = { id: string; name: string; phone: string } | null;

export const DEFAULT_PROFILE: Profile = {
  name: "Farmer",
  phone: "",
  farmSizeAcres: 2,
  season: currentSeason(),
  crops: ["Rice", "Wheat"],
  locationName: "Nashik, Maharashtra",
  latitude: 19.9975,
  longitude: 73.7898,
  monthlyBudget: 20000,
};

function iso(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

export function demoExpenses(): Expense[] {
  const rows: Omit<Expense, "id">[] = [
    {
      crop: "Rice",
      category: "Fertilizer",
      amount: 1450,
      paymentMethod: "UPI",
      date: iso(2),
      notes: "Urea top-dress, 2 bags",
    },
    {
      crop: "Rice",
      category: "Labor",
      amount: 1200,
      paymentMethod: "Cash",
      date: iso(4),
      notes: "Transplanting, 6 workers",
    },
    {
      crop: "Wheat",
      category: "Fertilizer",
      amount: 900,
      paymentMethod: "Bank",
      date: iso(7),
      notes: "DAP basal dose",
    },
    {
      crop: "Rice",
      category: "Seeds",
      amount: 780,
      paymentMethod: "Cash",
      date: iso(11),
      notes: "Certified paddy seed",
    },
    {
      crop: "Rice",
      category: "Pesticides",
      amount: 560,
      paymentMethod: "UPI",
      date: iso(13),
      notes: "Tricyclazole for blast",
    },
    {
      crop: "General",
      category: "Diesel & Fuel",
      amount: 450,
      paymentMethod: "Cash",
      date: iso(16),
      notes: "Pump set diesel",
    },
    {
      crop: "Maize",
      category: "Irrigation",
      amount: 380,
      paymentMethod: "Bank",
      date: iso(19),
      notes: "Canal water charge",
    },
    {
      crop: "Rice",
      category: "Transport",
      amount: 200,
      paymentMethod: "Cash",
      date: iso(22),
      notes: "Tempo to mandi",
    },
  ];
  return rows.map((r, i) => ({ ...r, id: `demo-${i + 1}` }));
}

type State = {
  hydrated: boolean;
  session: Session;
  accounts: Account[];
  profile: Profile;
  expenses: Expense[];
  scans: ScanRecord[];
  chat: ChatMessage[];
  droneBookings: DroneBooking[];
  sprinklerPercent: number;
  sprinklerAuto: boolean;
  language: "en" | "hi";
  theme: "dark" | "light";
  hasSeenWelcome: boolean;
  hasSeenGuide: boolean;
  /** Local Gram Points balance for tool-market rewards. */
  gramPoints: number;
  gramPointsHistory: GramPointEvent[];
  /** Product ids already rewarded for enquiry (anti-repeat). */
  enquiredProductIds: string[];
  gramPointsDay: GramPointsDay;
  claimedMarketplaceWelcome: boolean;
  claimedFirstLoginBonus: boolean;
  pendingLoginReward: PendingLoginReward;
  cart: CartItem[];
  toolOrders: ToolOrder[];
};

type Actions = {
  setHydrated: () => void;
  signUp: (
    name: string,
    phone: string,
    password: string
  ) => { ok: true } | { ok: false; error: string };
  signIn: (
    phone: string,
    password: string
  ) => { ok: true } | { ok: false; error: string };
  /** Device-only fallback when an SMS provider has not been connected yet. */
  demoOtpSignIn: (phone: string, name: string) => void;
  signOut: () => void;
  setSession: (s: Session) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  addExpense: (e: Omit<Expense, "id">) => void;
  deleteExpense: (id: string) => void;
  setExpenses: (rows: Expense[]) => void;
  addScan: (s: ScanRecord) => void;
  setSprinkler: (percent: number) => void;
  toggleSprinklerAuto: () => void;
  pushChat: (m: ChatMessage) => void;
  updateChat: (id: string, content: string) => void;
  clearChat: () => void;
  addDroneBooking: (booking: Omit<DroneBooking, "id" | "createdAt" | "status">) => void;
  setLanguage: (l: "en" | "hi") => void;
  setTheme: (t: "dark" | "light") => void;
  seedDemoData: () => void;
  markWelcomeSeen: () => void;
  markGuideSeen: () => void;
  replayGuide: () => void;
  claimMarketplaceWelcome: () => { earned: number };
  recordToolEnquire: (productId: string) => {
    earned: number;
    already: boolean;
    dailyCap: boolean;
  };
  recordCropSellIntent: () => { earned: number; alreadyToday: boolean };
  redeemOnEnquire: (
    productId: string,
    listPrice: number
  ) => { ok: boolean; spent: number; discount: number };
  /** Award +100 GP on login (once per day). Returns reward for bubble UI. */
  claimLoginBonus: () => PendingLoginReward;
  clearLoginReward: () => void;
  addToCart: (productId: string, qty?: number) => void;
  setCartQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  checkoutCart: (input: {
    method: ToolOrder["method"];
    usePoints: boolean;
    catalog: { id: string; name: string; price: number }[];
  }) => { ok: true; order: ToolOrder } | { ok: false; error: string };
};

export const useApp = create<State & Actions>()(
  persist(
    (set, get) => ({
      hydrated: false,
      session: null,
      accounts: [],
      profile: DEFAULT_PROFILE,
      expenses: demoExpenses(),
      scans: [],
      chat: [],
      droneBookings: [],
      sprinklerPercent: 74,
      sprinklerAuto: true,
      language: "en",
      theme: "light",
      hasSeenWelcome: false,
      hasSeenGuide: false,
      gramPoints: 0,
      gramPointsHistory: [],
      enquiredProductIds: [],
      gramPointsDay: { date: "", enquireCount: 0, sellIntent: false, loginBonus: false },
      claimedMarketplaceWelcome: false,
      claimedFirstLoginBonus: false,
      pendingLoginReward: null,
      cart: [],
      toolOrders: [],

      setHydrated: () => set({ hydrated: true }),

      signUp: (name, phone, password) => {
        const clean = phone.replace(/\s+/g, "");
        if (get().accounts.some((a) => a.phone === clean)) {
          return { ok: false, error: "An account with this number already exists." };
        }
        const account: Account = {
          id: `local-${Date.now()}`,
          name,
          phone: clean,
          password,
        };
        set((s) => ({
          accounts: [...s.accounts, account],
          session: { id: account.id, name, phone: clean },
          profile: { ...s.profile, name, phone: clean },
          hasSeenWelcome: false,
        }));
        get().claimLoginBonus();
        return { ok: true };
      },

      signIn: (phone, password) => {
        const clean = phone.replace(/\s+/g, "");
        const account = get().accounts.find((a) => a.phone === clean);
        if (!account) {
          return { ok: false, error: "No account found for this number. Create one first." };
        }
        if (!account.password) {
          return {
            ok: false,
            error: "This number was registered with OTP. Use the OTP tab to sign in.",
          };
        }
        if (account.password !== password) {
          return { ok: false, error: "Incorrect password. Please try again." };
        }
        set((s) => ({
          session: { id: account.id, name: account.name, phone: clean },
          profile: { ...s.profile, name: account.name, phone: clean },
        }));
        get().claimLoginBonus();
        return { ok: true };
      },

      demoOtpSignIn: (phone, name) => {
        const clean = phone.replace(/\s+/g, "");
        const existing = get().accounts.find((a) => a.phone === clean);
        const account =
          existing ??
          ({
            id: `local-${Date.now()}`,
            name,
            phone: clean,
            password: "",
          } satisfies Account);

        set((s) => ({
          accounts: existing ? s.accounts : [...s.accounts, account],
          session: { id: account.id, name, phone: clean },
          profile: { ...s.profile, name, phone: clean },
          hasSeenGuide: false,
        }));
        get().claimLoginBonus();
      },

      signOut: () => set({ session: null, chat: [] }),
      setSession: (session) => set({ session }),

      updateProfile: (patch) =>
        set((s) => ({ profile: { ...s.profile, ...patch } })),

      addExpense: (e) =>
        set((s) => ({
          expenses: [{ ...e, id: `exp-${Date.now()}` }, ...s.expenses],
        })),

      deleteExpense: (id) =>
        set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) })),

      setExpenses: (rows) => set({ expenses: rows }),

      addScan: (scan) => set((s) => ({ scans: [scan, ...s.scans].slice(0, 20) })),

      setSprinkler: (percent) =>
        set({ sprinklerPercent: Math.max(0, Math.min(100, Math.round(percent))) }),

      toggleSprinklerAuto: () => set((s) => ({ sprinklerAuto: !s.sprinklerAuto })),

      pushChat: (m) => set((s) => ({ chat: [...s.chat, m] })),

      updateChat: (id, content) =>
        set((s) => ({
          chat: s.chat.map((m) => (m.id === id ? { ...m, content } : m)),
        })),

      clearChat: () => set({ chat: [] }),

      addDroneBooking: (booking) =>
        set((s) => ({
          droneBookings: [
            {
              ...booking,
              id: `drone-${Date.now()}`,
              createdAt: new Date().toISOString(),
              status: "Requested",
            },
            ...s.droneBookings,
          ],
        })),

      setLanguage: (language) => set({ language }),

      setTheme: (theme) => set({ theme }),

      seedDemoData: () => set({ expenses: demoExpenses() }),

      markWelcomeSeen: () => set({ hasSeenWelcome: true }),

      markGuideSeen: () => set({ hasSeenGuide: true }),

      replayGuide: () => set({ hasSeenGuide: false }),

      claimMarketplaceWelcome: () => {
        if (get().claimedMarketplaceWelcome) return { earned: 0 };
        const earned = GRAM_POINTS.WELCOME;
        const event: GramPointEvent = {
          id: `gp-${Date.now()}`,
          reason: "welcome",
          amount: earned,
          label: "Welcome to tool market",
          labelHi: "औज़ार बाज़ार में स्वागत",
          at: new Date().toISOString(),
        };
        set((s) => ({
          claimedMarketplaceWelcome: true,
          gramPoints: s.gramPoints + earned,
          gramPointsHistory: [event, ...s.gramPointsHistory].slice(0, 40),
        }));
        return { earned };
      },

      recordToolEnquire: (productId) => {
        const s = get();
        if (s.enquiredProductIds.includes(productId)) {
          return { earned: 0, already: true, dailyCap: false };
        }
        const day = normalizeDay(s.gramPointsDay);
        if (day.enquireCount >= GRAM_POINTS.MAX_ENQUIRE_PER_DAY) {
          return { earned: 0, already: false, dailyCap: true };
        }
        const earned = GRAM_POINTS.ENQUIRE;
        const event: GramPointEvent = {
          id: `gp-${Date.now()}`,
          reason: "enquire",
          amount: earned,
          label: "Tool enquiry",
          labelHi: "औज़ार पूछताछ",
          productId,
          at: new Date().toISOString(),
        };
        set({
          enquiredProductIds: [...s.enquiredProductIds, productId],
          gramPoints: s.gramPoints + earned,
          gramPointsDay: { ...day, enquireCount: day.enquireCount + 1 },
          gramPointsHistory: [event, ...s.gramPointsHistory].slice(0, 40),
        });
        return { earned, already: false, dailyCap: false };
      },

      recordCropSellIntent: () => {
        const s = get();
        const day = normalizeDay(s.gramPointsDay);
        if (day.sellIntent) return { earned: 0, alreadyToday: true };
        const earned = GRAM_POINTS.SELL_INTENT;
        const event: GramPointEvent = {
          id: `gp-${Date.now()}`,
          reason: "sell_intent",
          amount: earned,
          label: "Crop sell intent shared",
          labelHi: "फसल बेचने का इरादा साझा",
          at: new Date().toISOString(),
        };
        set({
          gramPoints: s.gramPoints + earned,
          gramPointsDay: { ...day, sellIntent: true },
          gramPointsHistory: [event, ...s.gramPointsHistory].slice(0, 40),
        });
        return { earned, alreadyToday: false };
      },

      redeemOnEnquire: (productId, listPrice) => {
        const s = get();
        const spend = maxRedeemablePoints(listPrice, s.gramPoints);
        if (spend < GRAM_POINTS.MIN_REDEEM) {
          return { ok: false, spent: 0, discount: 0 };
        }
        const discount = spend * GRAM_POINTS.RUPEE_PER_POINT;
        const event: GramPointEvent = {
          id: `gp-${Date.now()}`,
          reason: "redeem",
          amount: -spend,
          label: "Points used on tool enquire",
          labelHi: "औज़ार पूछताछ पर पॉइंट्स इस्तेमाल",
          productId,
          at: new Date().toISOString(),
        };
        set({
          gramPoints: s.gramPoints - spend,
          gramPointsHistory: [event, ...s.gramPointsHistory].slice(0, 40),
        });
        return { ok: true, spent: spend, discount };
      },

      claimLoginBonus: () => {
        const s = get();
        const day = normalizeDay(s.gramPointsDay);
        if (day.loginBonus) return null;

        const firstTime = !s.claimedFirstLoginBonus;
        const earned = GRAM_POINTS.LOGIN;
        const event: GramPointEvent = {
          id: `gp-${Date.now()}`,
          reason: "login",
          amount: earned,
          label: firstTime ? "First login bonus" : "Daily login bonus",
          labelHi: firstTime ? "पहली लॉगिन बोनस" : "रोज़ाना लॉगिन बोनस",
          at: new Date().toISOString(),
        };
        const reward = { amount: earned, firstTime };
        set({
          claimedFirstLoginBonus: true,
          gramPoints: s.gramPoints + earned,
          gramPointsDay: { ...day, loginBonus: true },
          gramPointsHistory: [event, ...s.gramPointsHistory].slice(0, 40),
          pendingLoginReward: reward,
        });
        return reward;
      },

      clearLoginReward: () => set({ pendingLoginReward: null }),

      addToCart: (productId, qty = 1) => {
        const add = Math.max(1, Math.floor(qty));
        set((s) => {
          const existing = s.cart.find((c) => c.productId === productId);
          if (existing) {
            return {
              cart: s.cart.map((c) =>
                c.productId === productId ? { ...c, qty: c.qty + add } : c
              ),
            };
          }
          return { cart: [...s.cart, { productId, qty: add }] };
        });
      },

      setCartQty: (productId, qty) => {
        const next = Math.floor(qty);
        set((s) => ({
          cart:
            next <= 0
              ? s.cart.filter((c) => c.productId !== productId)
              : s.cart.map((c) =>
                  c.productId === productId ? { ...c, qty: next } : c
                ),
        }));
      },

      removeFromCart: (productId) =>
        set((s) => ({ cart: s.cart.filter((c) => c.productId !== productId) })),

      clearCart: () => set({ cart: [] }),

      checkoutCart: ({ method, usePoints, catalog }) => {
        const s = get();
        if (s.cart.length === 0) {
          return { ok: false, error: "Cart is empty." };
        }
        const items = [];
        let subtotal = 0;
        for (const line of s.cart) {
          const product = catalog.find((p) => p.id === line.productId);
          if (!product) continue;
          items.push({
            productId: product.id,
            name: product.name,
            qty: line.qty,
            unitPrice: product.price,
          });
          subtotal += product.price * line.qty;
        }
        if (items.length === 0) {
          return { ok: false, error: "Cart items not found." };
        }

        // Always redeem available Gram Points on cart pay (capped at subtotal).
        const pointsUsed = usePoints
          ? maxCartRedeemablePoints(subtotal, s.gramPoints)
          : 0;
        const discount = pointsUsed * GRAM_POINTS.RUPEE_PER_POINT;
        const total = Math.max(0, subtotal - discount);
        const order: ToolOrder = {
          id: `ord-${Date.now()}`,
          items,
          subtotal,
          pointsUsed,
          discount,
          total,
          method,
          status: method === "cod" ? "COD pending" : "Paid",
          createdAt: new Date().toISOString(),
        };

        const historyExtra: GramPointEvent[] = [];
        if (pointsUsed > 0) {
          historyExtra.push({
            id: `gp-${Date.now()}`,
            reason: "redeem",
            amount: -pointsUsed,
            label: "Points used on tool purchase",
            labelHi: "औज़ार खरीद पर पॉइंट्स इस्तेमाल",
            at: new Date().toISOString(),
          });
        }

        set({
          cart: [],
          toolOrders: [order, ...s.toolOrders].slice(0, 20),
          gramPoints: s.gramPoints - pointsUsed,
          gramPointsHistory: [...historyExtra, ...s.gramPointsHistory].slice(0, 40),
        });
        return { ok: true, order };
      },
    }),
    {
      name: "gramconnect-state",
      version: 6,
      migrate: (persisted, fromVersion) => {
        const p = {
          ...((persisted ?? {}) as Record<string, unknown>),
        };
        if (fromVersion < 4) {
          if (p.gramPoints == null) p.gramPoints = 0;
          if (p.gramPointsHistory == null) p.gramPointsHistory = [];
          if (p.enquiredProductIds == null) p.enquiredProductIds = [];
          if (p.gramPointsDay == null) {
            p.gramPointsDay = {
              date: "",
              enquireCount: 0,
              sellIntent: false,
              loginBonus: false,
            };
          }
          if (p.claimedMarketplaceWelcome == null) {
            p.claimedMarketplaceWelcome = false;
          }
        }
        if (fromVersion < 5) {
          const day = (p.gramPointsDay ?? {}) as Record<string, unknown>;
          p.gramPointsDay = {
            date: day.date ?? "",
            enquireCount: day.enquireCount ?? 0,
            sellIntent: !!day.sellIntent,
            loginBonus: !!day.loginBonus,
          };
          if (p.claimedFirstLoginBonus == null) p.claimedFirstLoginBonus = false;
          p.pendingLoginReward = null;
        }
        if (fromVersion < 6) {
          if (p.cart == null) p.cart = [];
          if (p.toolOrders == null) p.toolOrders = [];
        }
        return p;
      },
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("gramconnect persist rehydrate failed", error);
        }
        if (state) state.setHydrated();
        else queueMicrotask(() => useApp.getState().setHydrated());
      },
    }
  )
);
