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
  windowHi: string;
  note: string;
  noteHi: string;
  emoji: string;
};

export const SEASON_CROPS: SeasonCrop[] = [
  {
    name: "Paddy",
    season: "Monsoon",
    avgTemp: "31°C",
    rainfall: "165 mm",
    window: "Jun - Jul sowing",
    windowHi: "जून - जुलाई बुवाई",
    note: "Transplant 25-day seedlings once the field holds water.",
    noteHi: "खेत में पानी टिकने पर 25 दिन की पौध रोपें।",
    emoji: "🌾",
  },
  {
    name: "Maize",
    season: "Monsoon",
    avgTemp: "29°C",
    rainfall: "140 mm",
    window: "Jun - Jul sowing",
    windowHi: "जून - जुलाई बुवाई",
    note: "Sow on ridges so heavy rain drains off quickly.",
    noteHi: "मेड़ों पर बोएँ ताकि तेज़ बारिश का पानी निकल जाए।",
    emoji: "🌽",
  },
  {
    name: "Cotton",
    season: "Monsoon",
    avgTemp: "32°C",
    rainfall: "120 mm",
    window: "May - Jun sowing",
    windowHi: "मई - जून बुवाई",
    note: "Keep the refuge belt and scout weekly for bollworm.",
    noteHi: "रेफ्यूज पट्टी रखें और हर हफ़्ते सुंडी की जाँच करें।",
    emoji: "🌱",
  },
  {
    name: "Soybean",
    season: "Monsoon",
    avgTemp: "28°C",
    rainfall: "155 mm",
    window: "Jun sowing",
    windowHi: "जून बुवाई",
    note: "Treat seed with Rhizobium before sowing.",
    noteHi: "बुवाई से पहले बीज को राइज़ोबियम से उपचारित करें।",
    emoji: "🫘",
  },
  {
    name: "Bajra",
    season: "Monsoon",
    avgTemp: "33°C",
    rainfall: "95 mm",
    window: "Jul sowing",
    windowHi: "जुलाई बुवाई",
    note: "Best fit for light soils with an uncertain rain spell.",
    noteHi: "हल्की मिट्टी और अनिश्चित बारिश के लिए सबसे सही।",
    emoji: "🌾",
  },
];

export type Priority = {
  id: string;
  title: string;
  titleHi: string;
  body: string;
  bodyHi: string;
  tone: "warning" | "info" | "success";
  icon: "bug" | "droplet" | "sun";
};

export const PRIORITIES: Priority[] = [
  {
    id: "p1",
    title: "Monsoon disease watch",
    titleHi: "मानसून रोग निगरानी",
    body: "Scout rice for blast & cotton for bollworm this week.",
    bodyHi: "इस हफ़्ते धान में ब्लास्ट और कपास में सुंडी की जाँच करें।",
    tone: "warning",
    icon: "bug",
  },
  {
    id: "p2",
    title: "Drainage check",
    titleHi: "जल निकासी जाँचें",
    body: "Clear field channels before the next heavy spell.",
    bodyHi: "अगली तेज़ बारिश से पहले खेत की नालियाँ साफ़ कर लें।",
    tone: "info",
    icon: "droplet",
  },
  {
    id: "p3",
    title: "Nitrogen top-dress",
    titleHi: "यूरिया टॉप-ड्रेस",
    body: "Hold the urea split until rain eases for 2 days.",
    bodyHi: "बारिश थमने के 2 दिन बाद ही यूरिया डालें।",
    tone: "success",
    icon: "sun",
  },
];

export const FIELD_TIPS_HI = [
  "छिड़काव सुबह जल्दी या शाम को करें — दोपहर की गर्मी में दवा असर करने से पहले ही उड़ जाती है।",
  "कल्ले फूटते समय धान में 15 सेमी पानी रखें, फिर 3 दिन सुखाकर जड़ मज़बूत करें।",
  "यूरिया डालने से पहले उसमें नीम की खली मिलाएँ, नाइट्रोजन कम उड़ेगी।",
  "हर तीसरे मौसम में मिट्टी की जाँच कराएँ — बची हुई खाद से ही खर्च निकल आता है।",
  "हर खर्च उसी दिन दर्ज करें, वरना महीने का हिसाब सिर्फ़ अंदाज़ा रह जाता है।",
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
  tipsHi: Record<string, string[]>;
};

export const SEASON_ADVISORY: SeasonAdvisory = {
  season: "Monsoon",
  headline: "Monsoon season — crop & irrigation tips",
  crops: ["All", "Rice", "Cotton", "Maize", "Soybean"],
  tipsHi: {
    All: [
      "जलभराव से बचने के लिए खेत की निकासी ठीक रखें।",
      "भारी बारिश का अनुमान हो तो यूरिया टॉप-ड्रेस टाल दें।",
      "नमी वाले दिनों में धान में ब्लास्ट की जाँच करते रहें।",
      "मेड़ें दुरुस्त रखें ताकि खेत में पानी बराबर रहे।",
    ],
    Rice: [
      "कल्ले फूटते समय 5 सेमी पानी रखें, यूरिया डालने से पहले निकाल दें।",
      "बादल वाले हफ़्ते के बाद बाली की गर्दन पर ब्लास्ट देखें।",
      "पौध की नोक न काटें — इससे जीवाणु झुलसा आता है।",
    ],
    Cotton: [
      "सुंडी के लिए प्रति एकड़ 5 फेरोमोन ट्रैप लगाएँ।",
      "तेज़ बारिश के 24 घंटे के भीतर नालियों से पानी निकालें।",
      "हर तीसरे दिन पत्तों के नीचे सफ़ेद मक्खी देखें।",
    ],
    Maize: [
      "पहली तेज़ बारिश के बाद मेड़ों पर मिट्टी चढ़ाएँ।",
      "तने का निचला हिस्सा मुलायम लगे तो पोटाश दें।",
      "लंबे खरपतवार जल्दी हटाएँ, वे फसल में नमी रोकते हैं।",
    ],
    Soybean: [
      "12 घंटे से ज़्यादा पानी न ठहरने दें।",
      "30 दिन की अवस्था पर गर्डल बीटल की जाँच करें।",
      "फसल की छत्र बन चुकी हो तो दूसरी निराई छोड़ दें।",
    ],
  },
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
