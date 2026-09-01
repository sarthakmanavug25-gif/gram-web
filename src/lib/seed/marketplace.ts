export type MarketProduct = {
  id: string;
  name: string;
  nameHi: string;
  category: "machinery" | "irrigation" | "protection" | "inputs" | "storage";
  seller: string;
  location: string;
  price: number;
  unit: string;
  blurb: string;
  blurbHi: string;
  /** Product photo under /public */
  image: string;
};

export const MARKET_CATEGORIES = [
  { id: "all", label: "All tools", labelHi: "सभी औज़ार" },
  { id: "machinery", label: "Machinery", labelHi: "मशीनरी" },
  { id: "irrigation", label: "Irrigation", labelHi: "सिंचाई" },
  { id: "protection", label: "Crop protection", labelHi: "फसल सुरक्षा" },
  { id: "inputs", label: "Inputs", labelHi: "इनपुट" },
  { id: "storage", label: "Storage", labelHi: "भंडारण" },
] as const;

export const MARKET_PRODUCTS: MarketProduct[] = [
  {
    id: "mini-tractor",
    name: "Compact Mini Tractor 25 HP",
    nameHi: "कॉम्पैक्ट मिनी ट्रैक्टर 25 एचपी",
    category: "machinery",
    seller: "GreenField Motors",
    location: "Pune, Maharashtra",
    price: 385000,
    unit: "unit",
    blurb: "Ideal for 2–5 acre farms. Includes rotavator hitch kit.",
    blurbHi: "2–5 एकड़ खेत के लिए उपयुक्त। रोटावेटर हिट्च किट सहित।",
    image: "/market/mini-tractor.jpg",
  },
  {
    id: "drip-kit",
    name: "1-Acre Drip Irrigation Kit",
    nameHi: "1-एकड़ ड्रिप सिंचाई किट",
    category: "irrigation",
    seller: "JalSeva Agri Systems",
    location: "Nashik, Maharashtra",
    price: 28500,
    unit: "kit",
    blurb: "Complete drip set with filters, laterals and emitters.",
    blurbHi: "फ़िल्टर, लैटरल और एमिटर के साथ पूरा ड्रिप सेट।",
    image: "/market/drip-kit.jpg",
  },
  {
    id: "battery-sprayer",
    name: "Battery Knapsack Sprayer 16L",
    nameHi: "बैटरी नैपसैक स्प्रेयर 16 लीटर",
    category: "protection",
    seller: "KhetSuraksha Tools",
    location: "Indore, Madhya Pradesh",
    price: 3499,
    unit: "unit",
    blurb: "Lightweight sprayer for pesticide and nutrient foliar spray.",
    blurbHi: "कीटनाशक और पोषक छिड़काव के लिए हल्का स्प्रेयर।",
    image: "/market/battery-sprayer.jpg",
  },
  {
    id: "seed-drill",
    name: "Multi-Crop Seed Drill",
    nameHi: "मल्टी-क्रॉप सीड ड्रिल",
    category: "machinery",
    seller: "Bharat Agro Implements",
    location: "Ludhiana, Punjab",
    price: 62000,
    unit: "unit",
    blurb: "Even sowing for wheat, soybean and pulses.",
    blurbHi: "गेहूँ, सोयाबीन और दालों के लिए समान बुवाई।",
    image: "/market/seed-drill.jpg",
  },
  {
    id: "solar-pump",
    name: "3 HP Solar Water Pump",
    nameHi: "3 एचपी सोलर वॉटर पंप",
    category: "irrigation",
    seller: "SuryaJal Energy",
    location: "Jaipur, Rajasthan",
    price: 145000,
    unit: "set",
    blurb: "Daytime irrigation without diesel cost. Panel set included.",
    blurbHi: "डीज़ल खर्च के बिना दिन की सिंचाई। पैनल सेट शामिल।",
    image: "/market/solar-pump.jpg",
  },
  {
    id: "neem-oil",
    name: "Cold-Pressed Neem Oil 5L",
    nameHi: "कोल्ड-प्रेस्ड नीम तेल 5 लीटर",
    category: "inputs",
    seller: "BioCrop Organics",
    location: "Coimbatore, Tamil Nadu",
    price: 1890,
    unit: "can",
    blurb: "Natural pest management input for vegetable and fruit crops.",
    blurbHi: "सब्ज़ी और फल फसलों के लिए प्राकृतिक कीट नियंत्रण।",
    image: "/market/neem-oil.jpg",
  },
  {
    id: "grain-bin",
    name: "Metal Grain Storage Bin 1 Ton",
    nameHi: "धातु अनाज भंडारण बिन 1 टन",
    category: "storage",
    seller: "SafeHarvest Storage",
    location: "Kanpur, Uttar Pradesh",
    price: 22000,
    unit: "bin",
    blurb: "Moisture-safe storage to reduce post-harvest loss.",
    blurbHi: "कटाई बाद नुकसान घटाने के लिए नमी-सुरक्षित भंडारण।",
    image: "/market/grain-bin.jpg",
  },
  {
    id: "power-weeder",
    name: "Petrol Power Weeder",
    nameHi: "पेट्रोल पावर वीडर",
    category: "machinery",
    seller: "FieldForce Equipment",
    location: "Bengaluru, Karnataka",
    price: 28999,
    unit: "unit",
    blurb: "Fast inter-row weeding for vegetables and plantation rows.",
    blurbHi: "सब्ज़ी और बाग कतारों में तेज़ निराई।",
    image: "/market/power-weeder.jpg",
  },
];
