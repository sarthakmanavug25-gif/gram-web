export type MspPrice = {
  crop: string;
  price: number;
  unit: string;
  change: number;
};

/** MSP announced by Govt. of India for the 2024-25 marketing season (₹ per quintal). */
export const MSP_PRICES: MspPrice[] = [
  { crop: "Paddy", price: 2300, unit: "q", change: 5.4 },
  { crop: "Wheat", price: 2275, unit: "q", change: 6.6 },
  { crop: "Maize", price: 2225, unit: "q", change: 6.2 },
  { crop: "Cotton", price: 7121, unit: "q", change: 7.0 },
  { crop: "Mustard", price: 5650, unit: "q", change: 4.2 },
  { crop: "Gram", price: 5440, unit: "q", change: 2.0 },
];

export type SeasonCrop = {
  name: string;
  season: string;
  avgTemp: string;
  rainfall: string;
  window: string;
  note: string;
  emoji: string;
};

export const SEASON_CROPS: SeasonCrop[] = [
  {
    name: "Paddy",
    season: "Monsoon",
    avgTemp: "31°C",
    rainfall: "165 mm",
    window: "Jun - Jul sowing",
    note: "Transplant 25-day seedlings once the field holds water.",
    emoji: "🌾",
  },
  {
    name: "Maize",
    season: "Monsoon",
    avgTemp: "29°C",
    rainfall: "140 mm",
    window: "Jun - Jul sowing",
    note: "Sow on ridges so heavy rain drains off quickly.",
    emoji: "🌽",
  },
  {
    name: "Cotton",
    season: "Monsoon",
    avgTemp: "32°C",
    rainfall: "120 mm",
    window: "May - Jun sowing",
    note: "Keep the refuge belt and scout weekly for bollworm.",
    emoji: "🌱",
  },
  {
    name: "Soybean",
    season: "Monsoon",
    avgTemp: "28°C",
    rainfall: "155 mm",
    window: "Jun sowing",
    note: "Treat seed with Rhizobium before sowing.",
    emoji: "🫘",
  },
  {
    name: "Bajra",
    season: "Monsoon",
    avgTemp: "33°C",
    rainfall: "95 mm",
    window: "Jul sowing",
    note: "Best fit for light soils with an uncertain rain spell.",
    emoji: "🌾",
  },
];

export type Priority = {
  id: string;
  title: string;
  body: string;
  tone: "warning" | "info" | "success";
  icon: "bug" | "droplet" | "sun";
};

export const PRIORITIES: Priority[] = [
  {
    id: "p1",
    title: "Monsoon disease watch",
    body: "Scout rice for blast & cotton for bollworm this week.",
    tone: "warning",
    icon: "bug",
  },
  {
    id: "p2",
    title: "Drainage check",
    body: "Clear field channels before the next heavy spell.",
    tone: "info",
    icon: "droplet",
  },
  {
    id: "p3",
    title: "Nitrogen top-dress",
    body: "Hold the urea split until rain eases for 2 days.",
    tone: "success",
    icon: "sun",
  },
];

export const FIELD_TIPS = [
  "Spray in the early morning or late evening — midday heat evaporates the solution before it works.",
  "Keep 15 cm of standing water in paddy at tillering, then drain for 3 days to strengthen roots.",
  "Mix neem cake with urea before top-dressing to slow nitrogen loss.",
  "Take a soil test once every three seasons — it usually pays for itself in saved fertiliser.",
  "Record every expense the same day you spend it; month-end totals are guesswork otherwise.",
];

export type ClimateMonth = {
  month: string;
  rain: number;
  temp: number;
};

/** India-average monthly rainfall (mm) and mean temperature (°C). */
export const CLIMATE_CALENDAR: ClimateMonth[] = [
  { month: "Jan", rain: 16, temp: 19 },
  { month: "Feb", rain: 22, temp: 22 },
  { month: "Mar", rain: 28, temp: 27 },
  { month: "Apr", rain: 35, temp: 31 },
  { month: "May", rain: 55, temp: 34 },
  { month: "Jun", rain: 165, temp: 33 },
  { month: "Jul", rain: 285, temp: 31 },
  { month: "Aug", rain: 265, temp: 30 },
  { month: "Sep", rain: 175, temp: 30 },
  { month: "Oct", rain: 78, temp: 28 },
  { month: "Nov", rain: 30, temp: 24 },
  { month: "Dec", rain: 14, temp: 20 },
];

export type SeasonAdvisory = {
  season: string;
  headline: string;
  crops: string[];
  tips: Record<string, string[]>;
};

export const SEASON_ADVISORY: SeasonAdvisory = {
  season: "Monsoon",
  headline: "Monsoon season — crop & irrigation tips",
  crops: ["All", "Rice", "Cotton", "Maize", "Soybean"],
  tips: {
    All: [
      "Ensure field drainage to avoid waterlogging.",
      "Delay nitrogen top-dress if heavy rain is forecast.",
      "Scout rice for blast during humid spells.",
      "Keep bunds repaired so the field holds an even water depth.",
    ],
    Rice: [
      "Hold 5 cm water at tillering, drain before top-dressing urea.",
      "Watch the neck of the panicle for blast after a cloudy week.",
      "Do not clip seedling tips — it invites bacterial leaf blight.",
    ],
    Cotton: [
      "Install pheromone traps at 5 per acre for bollworm.",
      "Drain furrows within 24 hours of heavy rain to avoid wilt.",
      "Check the underside of leaves for whitefly every third day.",
    ],
    Maize: [
      "Earth up along the ridges after the first heavy shower.",
      "Apply potash if the lower stalk feels soft.",
      "Remove tall weeds early — they hold humidity in the canopy.",
    ],
    Soybean: [
      "Do not let water stand for more than 12 hours.",
      "Scout for girdle beetle at the 30-day stage.",
      "Skip the second weeding if the canopy has already closed.",
    ],
  },
};

export const SEASONS = ["Monsoon", "Winter", "Summer"] as const;

/** Rough India season by calendar month. */
export function currentSeason(date = new Date()): string {
  const m = date.getMonth();
  if (m >= 5 && m <= 9) return "Monsoon";
  if (m >= 10 || m <= 1) return "Winter";
  return "Summer";
}
