export type CropCalendarPlan = {
  crop: string;
  emoji: string;
  season: string;
  stages: { month: string; task: string; kind: "sow" | "care" | "harvest" }[];
};

export const CROP_CALENDAR: CropCalendarPlan[] = [
  {
    crop: "Rice",
    emoji: "🌾",
    season: "Kharif",
    stages: [
      { month: "Jun", task: "Prepare nursery", kind: "sow" },
      { month: "Jul", task: "Transplant seedlings", kind: "sow" },
      { month: "Aug", task: "Weed + first top-dress", kind: "care" },
      { month: "Sep", task: "Scout blast weekly", kind: "care" },
      { month: "Oct", task: "Drain before harvest", kind: "harvest" },
      { month: "Nov", task: "Harvest & dry grain", kind: "harvest" },
    ],
  },
  {
    crop: "Wheat",
    emoji: "🌾",
    season: "Rabi",
    stages: [
      { month: "Oct", task: "Prepare field", kind: "sow" },
      { month: "Nov", task: "Sow treated seed", kind: "sow" },
      { month: "Jan", task: "First irrigation + urea", kind: "care" },
      { month: "Feb", task: "Watch for yellow rust", kind: "care" },
      { month: "Mar", task: "Final irrigation", kind: "care" },
      { month: "Apr", task: "Harvest at full maturity", kind: "harvest" },
    ],
  },
  {
    crop: "Cotton",
    emoji: "🌱",
    season: "Kharif",
    stages: [
      { month: "May", task: "Sow on ridges", kind: "sow" },
      { month: "Jun", task: "Gap fill + first weeding", kind: "care" },
      { month: "Jul", task: "Install pheromone traps", kind: "care" },
      { month: "Aug", task: "Scout whitefly & bollworm", kind: "care" },
      { month: "Oct", task: "Begin picking", kind: "harvest" },
      { month: "Jan", task: "Final picking", kind: "harvest" },
    ],
  },
  {
    crop: "Maize",
    emoji: "🌽",
    season: "Kharif",
    stages: [
      { month: "Jun", task: "Sow on ridges", kind: "sow" },
      { month: "Jul", task: "Weed + earth up", kind: "care" },
      { month: "Aug", task: "Top-dress nitrogen", kind: "care" },
      { month: "Sep", task: "Scout stalk rot", kind: "care" },
      { month: "Oct", task: "Harvest dry cobs", kind: "harvest" },
    ],
  },
];

export const CALENDAR_TASK_HI: Record<string, string> = {
  "Prepare nursery": "नर्सरी तैयार करें",
  "Transplant seedlings": "पौध रोपें",
  "Weed + first top-dress": "निराई + पहली टॉप-ड्रेस",
  "Scout blast weekly": "हर हफ़्ते ब्लास्ट जाँचें",
  "Drain before harvest": "कटाई से पहले पानी निकालें",
  "Harvest & dry grain": "कटाई करके दाना सुखाएँ",
  "Prepare field": "खेत तैयार करें",
  "Sow treated seed": "उपचारित बीज बोएँ",
  "First irrigation + urea": "पहली सिंचाई + यूरिया",
  "Watch for yellow rust": "पीले रतुए की जाँच करें",
  "Final irrigation": "आख़िरी सिंचाई",
  "Harvest at full maturity": "पूरी पकने पर कटाई करें",
  "Sow on ridges": "मेड़ों पर बुवाई करें",
  "Gap fill + first weeding": "खाली जगह भरें + पहली निराई",
  "Install pheromone traps": "फेरोमोन ट्रैप लगाएँ",
  "Scout whitefly & bollworm": "सफ़ेद मक्खी और सुंडी जाँचें",
  "Begin picking": "पहली तुड़ाई शुरू करें",
  "Final picking": "अंतिम तुड़ाई करें",
  "Weed + earth up": "निराई + मिट्टी चढ़ाएँ",
  "Top-dress nitrogen": "नाइट्रोजन टॉप-ड्रेस करें",
  "Scout stalk rot": "तना सड़न की जाँच करें",
  "Harvest dry cobs": "सूखे भुट्टे काटें",
};

