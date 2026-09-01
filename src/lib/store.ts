"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { currentSeason } from "./seed/reference";

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
    }),
    {
      name: "gramconnect-state",
      version: 3,
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    }
  )
);
