export type AssistantContext = {
  name?: string;
  farmSizeAcres?: number;
  season?: string;
  monthSpend?: number;
  monthlyBudget?: number;
  entries?: number;
  sprinklerPercent?: number;
  lastScan?: string | null;
  topCategory?: string | null;
  topCategoryAmount?: number | null;
  lang?: "en" | "hi";
};

const MOTIVATION_EN = [
  "Every good harvest started as one season of patient work. What you do in the field this week decides what the truck carries in three months.",
  "A farmer feeds people he will never meet. That is not a small job — it is the one everything else depends on.",
  "Bad weather passes, debt gets paid, soil recovers. Keep your records straight and your decisions get easier every season.",
  "The best fertiliser is the farmer's own footsteps. One walk through the field today can save a whole spray tomorrow.",
  "You are not just growing a crop, you are building a business. Small savings each week become the next borewell.",
];

const MOTIVATION_HI = [
  "हर अच्छी फसल एक मौसम की धीरज भरी मेहनत से शुरू होती है। इस हफ़्ते खेत में किया गया काम ही तीन महीने बाद गाड़ी में जाएगा।",
  "किसान उन लोगों का पेट भरता है जिनसे वह कभी मिलता भी नहीं। यह छोटा काम नहीं — बाकी सब इसी पर टिका है।",
  "खराब मौसम गुज़र जाता है, कर्ज़ चुक जाता है, मिट्टी फिर जान पकड़ लेती है। हिसाब साफ़ रखिए, हर मौसम फ़ैसले आसान होते जाएँगे।",
  "सबसे अच्छी खाद किसान के अपने कदम हैं। आज खेत का एक चक्कर कल का पूरा छिड़काव बचा सकता है।",
  "आप सिर्फ़ फसल नहीं उगा रहे, एक कारोबार खड़ा कर रहे हैं। हर हफ़्ते की छोटी बचत ही अगला बोरवेल बनती है।",
];

const CATEGORY_HI: Record<string, string> = {
  Fertilizer: "खाद",
  Seeds: "बीज",
  Labor: "मज़दूरी",
  Pesticides: "कीटनाशक",
  "Diesel & Fuel": "डीज़ल व ईंधन",
  Irrigation: "सिंचाई",
  Transport: "ढुलाई",
  Machinery: "मशीनरी",
  Other: "अन्य",
};

function rupee(n: number) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function pickQuote(list: string[]) {
  return list[Math.floor(Math.random() * list.length)];
}

const HINDI_RE = /[\u0900-\u097F]/;

const HINGLISH_HINTS =
  /\b(kharch|kitna|kaise|kya|batao|bata|mera|meri|paisa|paise|fasal|khet|pani|beej|khad|mandi|bhav|kab|kyun|hai|hoga)\b/i;

/** Chooses the reply language from the message, falling back to the app language. */
export function replyLanguage(
  message: string,
  appLang: "en" | "hi" = "en"
): "en" | "hi" {
  if (HINDI_RE.test(message)) return "hi";
  if (HINGLISH_HINTS.test(message)) return "hi";
  return appLang;
}

/**
 * Deterministic answers used when no Anthropic key is configured, and as the
 * fallback whenever the model call fails. Answers use the farmer's real data.
 */
export function offlineReply(question: string, ctx: AssistantContext): string {
  const q = question.toLowerCase().trim();
  const lang = replyLanguage(question, ctx.lang ?? "en");
  const hi = lang === "hi";

  const name = ctx.name && ctx.name !== "Farmer" ? ctx.name : hi ? "किसान भाई" : "farmer";
  const spend = rupee(ctx.monthSpend ?? 0);
  const budget = rupee(ctx.monthlyBudget ?? 0);
  const entries = ctx.entries ?? 0;
  const left = Math.max(0, (ctx.monthlyBudget ?? 0) - (ctx.monthSpend ?? 0));

  // Greetings and small talk
  if (
    /^(hi|hii+|hey|hello|helo|yo|namaste|namaskar|salaam|ram ram|jai kisan|good (morning|evening|afternoon))\b/.test(q) ||
    /^(नमस्ते|नमस्कार|हैलो|हाय|राम राम)/.test(question.trim())
  ) {
    return hi
      ? `नमस्ते ${name}! 🌾 मैं ग्रामकनेक्ट सहायक हूँ। आप मुझसे पूछ सकते हैं — इस महीने कितना खर्च हुआ, फसल में कौन सा रोग है, आज सिंचाई कितनी करनी है, या मंडी भाव क्या हैं।`
      : `Namaste ${name}! 🌾 I'm the GramConnect assistant. Ask me about this month's spending, a crop disease, today's irrigation need, or mandi prices.`;
  }

  if (/(thanks|thank you|dhanyavad|shukriya)/.test(q) || /धन्यवाद|शुक्रिया/.test(question)) {
    return hi
      ? "खुशी हुई मदद करके! कुछ और पूछना हो तो बेझिझक पूछिए। 🌱"
      : "Glad to help! Ask me anything else whenever you need. 🌱";
  }

  if (/(who are you|what can you do|^help|tum kaun|kya kar sakte)/.test(q) || /कौन हो|क्या कर सकते/.test(question)) {
    return hi
      ? "मैं इस ऐप का सहायक हूँ। मैं ये कर सकता हूँ:\n• आपका खर्च और बजट बताना\n• फसल के रोग और उपचार समझाना\n• मौसम और सिंचाई की सलाह देना\n• एमएसपी और मंडी भाव दिखाना"
      : "I'm this app's assistant. I can:\n• Tell you your spending and budget\n• Explain crop diseases and their treatment\n• Give weather and irrigation advice\n• Show MSP and mandi prices";
  }

  // Motivation
  if (
    /(motivat|inspir|quote|encourag|cheer|\bsad\b|\btired\b|thak|himmat|pareshan|tension|hopeless|give up)/.test(q) ||
    /प्रेरित|प्रेरणा|हिम्मत|थक|परेशान|उदास/.test(question)
  ) {
    const quote = pickQuote(hi ? MOTIVATION_HI : MOTIVATION_EN);
    return hi ? `🌾 ${quote}\n\nआप अकेले नहीं हैं — एक-एक कदम आगे बढ़ते रहिए।` : `🌾 ${quote}\n\nYou are not alone in this — keep taking one step at a time.`;
  }

  // Expenses
  if (
    /(spend|spent|expense|cost|budget|kharch|paisa|paise|money|hisab|hisaab)/.test(q) ||
    /खर्च|बजट|पैसा|हिसाब/.test(question)
  ) {
    const topName = ctx.topCategory
      ? hi
        ? (CATEGORY_HI[ctx.topCategory] ?? ctx.topCategory)
        : ctx.topCategory
      : "";
    const top =
      ctx.topCategory && ctx.topCategoryAmount
        ? hi
          ? `\n• सबसे ज़्यादा खर्च ${topName} पर — ${rupee(ctx.topCategoryAmount)}।`
          : `\n• Biggest head is ${topName} at ${rupee(ctx.topCategoryAmount)}.`
        : "";
    return hi
      ? `इस महीने आपने ${entries} एंट्री में कुल ${spend} खर्च किया है।\n• बजट ${budget}, बाकी ${rupee(left)}।${top}\n\nपूरा ब्यौरा खर्च टैब में “श्रेणी के हिसाब से खर्च” में देखें।`
      : `You have spent ${spend} this month across ${entries} entries.\n• Budget ${budget}, ${rupee(left)} still left.${top}\n\nSee the full split under Spend by Category on the Expenses tab.`;
  }

  // Scanning
  if (/(scan|photo|picture|camera|leaf|patti)/.test(q) || /स्कैन|फ़ोटो|फोटो|पत्ती|कैमरा/.test(question)) {
    return hi
      ? "नीचे की पट्टी से “फसल डॉक्टर” खोलें, स्कैन टैब पर रहें और कैमरा दबाकर पत्ती की फ़ोटो लें (या गैलरी से चुनें)। सबसे मिलता-जुलता रोग, उसका उपचार और बचाव दिख जाएगा। छिड़काव से पहले कृषि अधिकारी से पुष्टि ज़रूर करें।"
      : "Open Crop Doctor from the bottom bar, stay on the Scan tab and tap Camera to click a leaf photo (or Library to pick one). You get the closest disease match with treatment and prevention steps. Confirm with your agri officer before spraying.";
  }

  // Disease alerts
  if (/(disease|alert|blast|bollworm|pest|keeda|kida|\brog\b|bimari|bimaari)/.test(q) || /रोग|बीमारी|कीट|चेतावनी/.test(question)) {
    const last = ctx.lastScan
      ? hi
        ? `\n• आपका पिछला स्कैन: ${ctx.lastScan}।`
        : `\n• Your last scan: ${ctx.lastScan}.`
      : "";
    return hi
      ? `इस समय ध्यान रखने लायक:\n• नमी वाले दिनों में धान में ब्लास्ट देखें।\n• कपास में सुंडी की जाँच हर हफ़्ते करें।${last}\n\nफसल डॉक्टर की “रोग सूची” में सभी रोगों की पूरी जानकारी और उपचार मिलेगा।`
      : `Worth watching right now:\n• Scout rice for blast during humid spells.\n• Check cotton for bollworm every week.${last}\n\nThe Diseases tab in Crop Doctor has every guide with treatment steps.`;
  }

  // Irrigation
  if (/(sprinkler|irrigat|water|pani|sinchai)/.test(q) || /सिंचाई|पानी|स्प्रिंकलर/.test(question)) {
    const pct = ctx.sprinklerPercent ?? 0;
    const level = pct >= 65 ? (hi ? "अधिक" : "high") : pct >= 35 ? (hi ? "मध्यम" : "medium") : (hi ? "कम" : "low");
    return hi
      ? `अभी सिंचाई की ज़रूरत ${pct}% (${level}) है। यह तापमान, नमी, हवा और बारिश की संभावना से निकाली जाती है।\n• 65% से ऊपर = गर्म-सूखा, समय बढ़ाएँ।\n• 35% से नीचे = पानी बचाएँ।\nसलाह पेज पर स्लाइडर खिसकाकर आप खुद भी समय तय कर सकते हैं।`
      : `Irrigation demand is ${pct}% (${level}) right now, calculated from temperature, humidity, wind and rain chance.\n• Above 65% = hot and dry, increase runtime.\n• Below 35% = cut back and save water.\nDrag the slider on the Advisor page to set it yourself.`;
  }

  // Weather
  if (/(weather|rain|mausam|barish|baarish|temperature|garmi)/.test(q) || /मौसम|बारिश|तापमान/.test(question)) {
    return hi
      ? "सलाह पेज पर आपकी जगह का लाइव मौसम मिलता है — तापमान, नमी, बारिश की संभावना, हवा और आज का अधिकतम/न्यूनतम। साथ में मौसमी सलाह और भारत का मौसम कैलेंडर भी है।"
      : "The Advisor page shows live weather for your location — temperature, humidity, rain chance, wind and today's high/low — plus the season advisory and India climate calendar.";
  }

  // Market
  if (/(msp|price|mandi|rate|market|bhav|bhaav|bech)/.test(q) || /भाव|मंडी|दाम|बिक्री/.test(question)) {
    return hi
      ? "होम पेज पर एमएसपी सूची 2024-25 है — धान ₹2,300/क्विंटल, गेहूँ ₹2,275, मक्का ₹2,225। “मंडी खरीदार देखें” पर टैप करके पास के खरीदार और उनके भाव देखें।"
      : "Home has the MSP Reference 2024-25 — paddy ₹2,300/quintal, wheat ₹2,275, maize ₹2,225. Tap Compare mandi buyers to see nearby buyers and their rates.";
  }

  // Fallback
  return hi
    ? `${name}, मैं फसल के रोग, खर्च का हिसाब, मौसम और सिंचाई में मदद कर सकता हूँ। आप इस ${ctx.season ?? "मौसम"} में ${ctx.farmSizeAcres ?? 2} एकड़ खेती कर रहे हैं — इनमें से कुछ भी पूछिए।`
    : `${name}, I can help with crop diseases, your expenses, weather and irrigation. You are farming ${ctx.farmSizeAcres ?? 2} acres this ${ctx.season ?? "season"} — ask me about any of those.`;
}
