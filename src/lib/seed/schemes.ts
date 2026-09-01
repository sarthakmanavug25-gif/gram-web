export type Scheme = {
  id: string;
  name: string;
  nameHi: string;
  category: "income" | "insurance" | "credit" | "equipment" | "irrigation" | "training";
  summary: string;
  summaryHi: string;
  forWhom: string;
  forWhomHi: string;
  benefit: string;
  benefitHi: string;
  link: string;
};

export const SCHEME_CATEGORIES = [
  { id: "all", label: "All", labelHi: "सभी" },
  { id: "income", label: "Income support", labelHi: "आय सहायता" },
  { id: "insurance", label: "Insurance", labelHi: "बीमा" },
  { id: "credit", label: "Credit", labelHi: "ऋण" },
  { id: "equipment", label: "Equipment", labelHi: "उपकरण" },
  { id: "irrigation", label: "Irrigation", labelHi: "सिंचाई" },
  { id: "training", label: "Training", labelHi: "प्रशिक्षण" },
] as const;

export const SCHEMES: Scheme[] = [
  {
    id: "pm-kisan",
    name: "PM-KISAN",
    nameHi: "पीएम-किसान",
    category: "income",
    summary: "Direct income support for landholding farmer families.",
    summaryHi: "जमीन वाले किसान परिवारों के लिए सीधी आय सहायता।",
    forWhom: "Small and marginal farmers across India",
    forWhomHi: "भारत भर के छोटे और सीमांत किसान",
    benefit: "₹6,000 per year in three instalments",
    benefitHi: "साल में ₹6,000 — तीन किस्तों में",
    link: "https://pmkisan.gov.in/",
  },
  {
    id: "pmfby",
    name: "PM Fasal Bima Yojana",
    nameHi: "पीएम फसल बीमा योजना",
    category: "insurance",
    summary: "Crop insurance against natural calamities, pests and diseases.",
    summaryHi: "प्राकृतिक आपदा, कीट और रोग से फसल बीमा।",
    forWhom: "All farmers growing notified crops",
    forWhomHi: "अधिसूचित फसलें उगाने वाले सभी किसान",
    benefit: "Low premium with government share of cost",
    benefitHi: "सरकार की हिस्सेदारी से कम प्रीमियम",
    link: "https://pmfby.gov.in/",
  },
  {
    id: "kcc",
    name: "Kisan Credit Card",
    nameHi: "किसान क्रेडिट कार्ड",
    category: "credit",
    summary: "Easy short-term credit for seeds, fertiliser, labour and more.",
    summaryHi: "बीज, खाद, मज़दूरी आदि के लिए आसान अल्पकालिक ऋण।",
    forWhom: "Farmers, tenant farmers and SHGs in agriculture",
    forWhomHi: "किसान, किरायेदार किसान और कृषि स्वयं सहायता समूह",
    benefit: "Flexible credit limit with simple interest",
    benefitHi: "सरल ब्याज के साथ लचीली ऋण सीमा",
    link: "https://www.india.gov.in/spotlight/kisan-credit-card-kcc-scheme",
  },
  {
    id: "soil-health",
    name: "Soil Health Card",
    nameHi: "मिट्टी स्वास्थ्य कार्ड",
    category: "training",
    summary: "Know your soil nutrients and get fertiliser advice for your field.",
    summaryHi: "मिट्टी के पोषक तत्व जानें और खाद सलाह पाएँ।",
    forWhom: "Every farmer with cultivated land",
    forWhomHi: "खेती योग्य ज़मीन वाले सभी किसान",
    benefit: "Free soil testing and crop-wise recommendations",
    benefitHi: "मुफ़्त मिट्टी जाँच और फसल-वार सलाह",
    link: "https://www.soilhealth.dac.gov.in/",
  },
  {
    id: "pmksy",
    name: "PM Krishi Sinchai Yojana",
    nameHi: "पीएम कृषि सिंचाई योजना",
    category: "irrigation",
    summary: "Support for micro-irrigation and better water use on farm.",
    summaryHi: "माइक्रो-सिंचाई और बेहतर जल उपयोग के लिए सहायता।",
    forWhom: "Farmers adopting drip or sprinkler systems",
    forWhomHi: "ड्रिप या स्प्रिंकलर अपनाने वाले किसान",
    benefit: "Subsidy on drip/sprinkler installation",
    benefitHi: "ड्रिप/स्प्रिंकलर लगाने पर सब्सिडी",
    link: "https://pmksy.gov.in/",
  },
  {
    id: "smam",
    name: "Sub-Mission on Agricultural Mechanisation",
    nameHi: "कृषि यंत्रीकरण उप-मिशन",
    category: "equipment",
    summary: "Subsidy help to buy or hire farm machinery.",
    summaryHi: "कृषि मशीनरी खरीदने या किराए पर लेने में सब्सिडी सहायता।",
    forWhom: "Individual farmers and custom hiring centres",
    forWhomHi: "व्यक्तिगत किसान और कस्टम हायरिंग केंद्र",
    benefit: "Financial assistance on tractors, implements and tools",
    benefitHi: "ट्रैक्टर, औज़ार और उपकरणों पर वित्तीय सहायता",
    link: "https://agrimachinery.nic.in/",
  },
  {
    id: "e-nam",
    name: "e-NAM",
    nameHi: "ई-नाम",
    category: "income",
    summary: "Online national mandi network for better crop prices.",
    summaryHi: "बेहतर भाव के लिए ऑनलाइन राष्ट्रीय मंडी नेटवर्क।",
    forWhom: "Farmers selling notified commodities",
    forWhomHi: "अधिसूचित वस्तुएँ बेचने वाले किसान",
    benefit: "Transparent bidding across connected mandis",
    benefitHi: "जुड़ी मंडियों में पारदर्शी बोली",
    link: "https://www.enam.gov.in/",
  },
  {
    id: "pkvy",
    name: "Paramparagat Krishi Vikas Yojana",
    nameHi: "परंपरागत कृषि विकास योजना",
    category: "training",
    summary: "Support to adopt organic farming in clusters.",
    summaryHi: "क्लस्टर में जैविक खेती अपनाने के लिए सहायता।",
    forWhom: "Farmers ready to shift to organic practices",
    forWhomHi: "जैविक तरीकों पर जाने को तैयार किसान",
    benefit: "Training, certification support and input help",
    benefitHi: "प्रशिक्षण, प्रमाणन सहायता और इनपुट मदद",
    link: "https://pgsindia-ncof.gov.in/",
  },
];
