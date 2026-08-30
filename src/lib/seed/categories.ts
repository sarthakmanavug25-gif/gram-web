export type CategoryKey =
  | "Fertilizer"
  | "Seeds"
  | "Labor"
  | "Pesticides"
  | "Diesel & Fuel"
  | "Irrigation"
  | "Transport"
  | "Machinery"
  | "Other";

export type CategoryMeta = {
  key: CategoryKey;
  color: string;
  tint: string;
  icon:
    | "triangle-alert"
    | "leaf"
    | "users"
    | "spray"
    | "fuel"
    | "droplets"
    | "truck"
    | "tractor"
    | "package";
};

export const CATEGORIES: CategoryMeta[] = [
  {
    key: "Fertilizer",
    color: "var(--amber)",
    tint: "rgba(245,158,11,0.16)",
    icon: "triangle-alert",
  },
  {
    key: "Seeds",
    color: "var(--green-primary)",
    tint: "rgba(34,197,94,0.16)",
    icon: "leaf",
  },
  {
    key: "Labor",
    color: "var(--purple-labor)",
    tint: "rgba(129,140,248,0.16)",
    icon: "users",
  },
  {
    key: "Pesticides",
    color: "var(--orange)",
    tint: "rgba(251,146,60,0.16)",
    icon: "spray",
  },
  {
    key: "Diesel & Fuel",
    color: "var(--red-critical)",
    tint: "rgba(239,68,68,0.16)",
    icon: "fuel",
  },
  {
    key: "Irrigation",
    color: "var(--blue-info)",
    tint: "rgba(59,130,246,0.16)",
    icon: "droplets",
  },
  {
    key: "Transport",
    color: "#2dd4bf",
    tint: "rgba(45,212,191,0.16)",
    icon: "truck",
  },
  {
    key: "Machinery",
    color: "#a3e635",
    tint: "rgba(163,230,53,0.16)",
    icon: "tractor",
  },
  {
    key: "Other",
    color: "var(--text-secondary)",
    tint: "rgba(156,163,175,0.16)",
    icon: "package",
  },
];

export const CATEGORY_KEYS = CATEGORIES.map((c) => c.key);

export function categoryMeta(key: string): CategoryMeta {
  return CATEGORIES.find((c) => c.key === key) ?? CATEGORIES[CATEGORIES.length - 1];
}

export const PAYMENT_METHODS = ["Cash", "UPI", "Bank", "Credit"] as const;

export const EXPENSE_CROPS = [
  "Rice",
  "Wheat",
  "Maize",
  "Cotton",
  "Sugarcane",
  "Mustard",
  "Vegetables",
  "General",
];
