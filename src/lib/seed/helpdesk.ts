export type HelpLink = {
  href: string;
  label: string;
  labelHi: string;
};

export type HelpChoice = {
  id: string;
  label: string;
  labelHi: string;
  hint?: string;
  hintHi?: string;
  /** Next step choices; omit when this choice ends in a result */
  next?: HelpChoice[];
  /** Auto-detected outcome when this is a leaf */
  result?: {
    problem: string;
    problemHi: string;
    advice: string[];
    adviceHi: string[];
    links?: HelpLink[];
  };
};

export type HelpCategory = {
  id: string;
  icon: "leaf" | "cloud" | "landmark" | "wrench" | "cart" | "phone" | "app";
  title: string;
  titleHi: string;
  subtitle: string;
  subtitleHi: string;
  choices: HelpChoice[];
};

/**
 * Choice-based farmer help desk.
 * Pick a topic → pick symptoms → auto-detect problem + next steps.
 */
export const HELP_DESK: HelpCategory[] = [
  {
    id: "crop",
    icon: "leaf",
    title: "Crop looks sick",
    titleHi: "फसल बीमार लग रही है",
    subtitle: "Spots, wilting, pests or yellow leaves",
    subtitleHi: "धब्बे, मुरझान, कीट या पीले पत्ते",
    choices: [
      {
        id: "spots",
        label: "Spots or patches on leaves",
        labelHi: "पत्तियों पर धब्बे या दाग",
        hint: "Brown, yellow or white marks",
        hintHi: "भूरे, पीले या सफेद निशान",
        next: [
          {
            id: "spots-yellow",
            label: "Yellow patches spreading",
            labelHi: "पीले धब्बे फैल रहे हैं",
            result: {
              problem: "Likely leaf blight or nutrient stress",
              problemHi: "संभावित पत्ती झुलसा या पोषक कमी",
              advice: [
                "Take a clear photo of the affected leaf in daylight.",
                "Open Crop Doctor / Disease library and match the pattern.",
                "Avoid heavy watering on already wet soil until you know the cause.",
                "If many plants are hit, isolate the worst ones and ask local agri officer.",
              ],
              adviceHi: [
                "दिन की रोशनी में प्रभावित पत्ते की साफ़ फ़ोटो लें।",
                "फसल डॉक्टर / रोग लाइब्रेरी खोलकर पैटर्न मिलाएँ।",
                "गीली मिट्टी पर ज़्यादा पानी न दें जब तक कारण पता न चले।",
                "कई पौधे प्रभावित हों तो सबसे खराब अलग रखें और कृषि अधिकारी से पूछें।",
              ],
              links: [
                { href: "/diseases", label: "Open disease library", labelHi: "रोग लाइब्रेरी खोलें" },
                { href: "/#get-app", label: "Scan in the app", labelHi: "ऐप में स्कैन करें" },
              ],
            },
          },
          {
            id: "spots-brown",
            label: "Brown / dry burnt edges",
            labelHi: "भूरे या जले किनारे",
            result: {
              problem: "Possible fungal burn or chemical scorch",
              problemHi: "संभावित फफूंद जलन या दवाई का असर",
              advice: [
                "Check if you sprayed recently — wrong mix can burn leaf edges.",
                "Compare with similar diseases in the library before buying new spray.",
                "Improve airflow between plants; remove heavily damaged leaves.",
              ],
              adviceHi: [
                "हाल ही में स्प्रे किया हो तो जाँचें — गलत घोल किनारे जला सकता है।",
                "नया स्प्रे खरीदने से पहले लाइब्रेरी में मिलते रोग देखें।",
                "पौधों के बीच हवा बढ़ाएँ; बहुत खराब पत्ते हटा दें।",
              ],
              links: [
                { href: "/diseases", label: "Browse diseases", labelHi: "रोग देखें" },
              ],
            },
          },
        ],
      },
      {
        id: "wilt",
        label: "Plant wilting even after watering",
        labelHi: "पानी देने पर भी पौधा मुरझा रहा है",
        result: {
          problem: "Root stress, stem rot or severe waterlogging",
          problemHi: "जड़ समस्या, तना सड़न या ज़्यादा पानी",
          advice: [
            "Check soil 5–10 cm deep — sticky wet soil means drain first, don’t water more.",
            "Look at the stem base for soft/rotten tissue.",
            "Use Disease library for wilt-type matches; seek local advice if whole field droops.",
          ],
          adviceHi: [
            "5–10 सेमी गहराई की मिट्टी देखें — चिपचिपी गीली हो तो पहले निकासी करें।",
            "तने के निचले हिस्से में नरम/सड़ा हिस्सा जाँचें।",
            "मुरझान जैसे रोग लाइब्रेरी में मिलाएँ; पूरा खेत झुके तो स्थानीय सलाह लें।",
          ],
          links: [
            { href: "/diseases", label: "Disease library", labelHi: "रोग लाइब्रेरी" },
          ],
        },
      },
      {
        id: "pest",
        label: "Insects / holes in leaves",
        labelHi: "कीट या पत्तों में छेद",
        result: {
          problem: "Pest damage detected from your choices",
          problemHi: "आपकी पसंद से कीट नुकसान पता चला",
          advice: [
            "Note time of day pests appear (morning/evening) — helps identify them.",
            "Prefer targeted spray only after matching the pest/disease pattern.",
            "For urgent advice, call Kisan Call Centre: 1800-180-1551.",
          ],
          adviceHi: [
            "कीट कब दिखते हैं नोट करें (सुबह/शाम) — पहचान आसान होती है।",
            "पैटर्न मिलाने के बाद ही लक्षित स्प्रे चुनें।",
            "तुरंत सलाह के लिए किसान कॉल सेंटर: 1800-180-1551।",
          ],
          links: [
            { href: "/diseases", label: "Match in library", labelHi: "लाइब्रेरी में मिलाएँ" },
          ],
        },
      },
    ],
  },
  {
    id: "weather",
    icon: "cloud",
    title: "Weather & irrigation",
    titleHi: "मौसम और सिंचाई",
    subtitle: "Rain, heat or when to water",
    subtitleHi: "बारिश, गर्मी या कब पानी दें",
    choices: [
      {
        id: "rain",
        label: "Rain is expected / already raining",
        labelHi: "बारिश आने वाली है / हो रही है",
        result: {
          problem: "Irrigation should pause; watch for waterlogging",
          problemHi: "सिंचाई रोकें; जलभराव पर नज़र रखें",
          advice: [
            "Skip sprinkler/irrigation until soil surface dries a bit.",
            "Clear field drains so water can leave low spots.",
            "After heavy rain, check for new leaf spots in the disease library.",
          ],
          adviceHi: [
            "मिट्टी थोड़ी सूखने तक स्प्रिंकलर/सिंचाई रोकें।",
            "निचले हिस्सों से पानी निकले — नालियाँ साफ़ रखें।",
            "तेज़ बारिश बाद नई पत्ती दागों के लिए रोग लाइब्रेरी देखें।",
          ],
          links: [
            { href: "/#get-app", label: "Check weather in app", labelHi: "ऐप में मौसम देखें" },
          ],
        },
      },
      {
        id: "heat",
        label: "Very hot / plants drying fast",
        labelHi: "बहुत गर्मी / पौधे जल्दी सूख रहे हैं",
        result: {
          problem: "Heat stress — light, timely irrigation needed",
          problemHi: "गर्मी तनाव — हल्की, समय पर सिंचाई चाहिए",
          advice: [
            "Water early morning or late evening, not in peak afternoon heat.",
            "Mulch or light shade can reduce soil heat if available.",
            "Yellowing from heat can look like disease — confirm before spraying.",
          ],
          adviceHi: [
            "सुबह जल्दी या शाम को पानी दें, दोपहर की चढ़ती धूप में नहीं।",
            "मल्च या हल्की छाया मिट्टी की गर्मी कम कर सकती है।",
            "गर्मी से पीलापन रोग जैसा लग सकता है — स्प्रे से पहले पुष्टि करें।",
          ],
          links: [
            { href: "/diseases", label: "Rule out disease", labelHi: "रोग नकारें" },
            { href: "/#get-app", label: "App weather advisor", labelHi: "ऐप मौसम सलाह" },
          ],
        },
      },
      {
        id: "when-water",
        label: "Not sure when to irrigate",
        labelHi: "पता नहीं कब सिंचाई करें",
        result: {
          problem: "Need a simple watering decision",
          problemHi: "आसान सिंचाई निर्णय चाहिए",
          advice: [
            "Press soil with finger: dry and crumbly → water; cool and sticky → wait.",
            "Use the mobile app advisor for local weather + sprinkler tip.",
            "Overwatering causes as much loss as underwatering in many crops.",
          ],
          adviceHi: [
            "उंगली से मिट्टी दबाएँ: सूखी-भुरभुरी → पानी; ठंडी-चिपचिपी → रुकें।",
            "स्थानीय मौसम + स्प्रिंकलर सुझाव के लिए मोबाइल ऐप सलाहकार देखें।",
            "कई फसलों में ज़्यादा पानी भी कम पानी जितना नुकसान करता है।",
          ],
          links: [
            { href: "/#get-app", label: "Get the app advisor", labelHi: "ऐप सलाहकार लें" },
          ],
        },
      },
    ],
  },
  {
    id: "schemes",
    icon: "landmark",
    title: "Govt schemes / subsidy",
    titleHi: "सरकारी योजना / सब्सिडी",
    subtitle: "Support you can apply for",
    subtitleHi: "जिसके लिए आवेदन कर सकते हैं",
    choices: [
      {
        id: "which-scheme",
        label: "I don’t know which scheme fits me",
        labelHi: "नहीं पता कौन सी योजना मुझ पर लागू है",
        result: {
          problem: "Need scheme matching by crop / need",
          problemHi: "फसल / ज़रूरत के हिसाब से योजना चुननी है",
          advice: [
            "Open Government schemes and filter by what you need (seeds, drip, insurance).",
            "Keep Aadhaar, land papers and bank passbook ready before applying.",
            "Prefer official portals linked from each scheme card.",
          ],
          adviceHi: [
            "सरकारी योजनाएँ खोलें और ज़रूरत से फ़िल्टर करें (बीज, ड्रिप, बीमा)।",
            "आवेदन से पहले आधार, ज़मीन कागज़ और बैंक पासबुक तैयार रखें।",
            "हर योजना कार्ड पर दिए आधिकारिक पोर्टल ही इस्तेमाल करें।",
          ],
          links: [
            { href: "/schemes", label: "Browse govt schemes", labelHi: "सरकारी योजनाएँ देखें" },
          ],
        },
      },
      {
        id: "apply-stuck",
        label: "Application is stuck / rejected",
        labelHi: "आवेदन अटका / रद्द हो गया",
        result: {
          problem: "Application follow-up needed",
          problemHi: "आवेदन का फॉलो-अप ज़रूरी है",
          advice: [
            "Note the application ID and reason shown on the portal.",
            "Visit the local agriculture / CSC centre with the same ID.",
            "Call Kisan Call Centre 1800-180-1551 for guided help in your language.",
          ],
          adviceHi: [
            "पोर्टल पर दिखा आवेदन नंबर और कारण लिख लें।",
            "उसी नंबर के साथ स्थानीय कृषि / CSC केंद्र जाएँ।",
            "अपनी भाषा में मदद के लिए 1800-180-1551 पर कॉल करें।",
          ],
          links: [
            { href: "/schemes", label: "Back to schemes", labelHi: "योजनाओं पर वापस" },
          ],
        },
      },
    ],
  },
  {
    id: "tools",
    icon: "wrench",
    title: "Need farm tools / machines",
    titleHi: "कृषि औज़ार / मशीन चाहिए",
    subtitle: "Buy or enquire about equipment",
    subtitleHi: "उपकरण खरीदें या पूछताछ करें",
    choices: [
      {
        id: "irrigation-kit",
        label: "Irrigation / drip / pump",
        labelHi: "सिंचाई / ड्रिप / पंप",
        result: {
          problem: "Looking for irrigation equipment",
          problemHi: "सिंचाई उपकरण खोज रहे हैं",
          advice: [
            "Open the marketplace and filter irrigation-related listings.",
            "Use Enquire on a listing — companies get your request.",
            "Check if a subsidy scheme covers drip before paying full price.",
          ],
          adviceHi: [
            "बाज़ार खोलकर सिंचाई से जुड़ी लिस्ट देखें।",
            "Enquire दबाएँ — कंपनी को आपका अनुरोध मिलता है।",
            "पूरा दाम देने से पहले ड्रिप पर सब्सिडी योजना जाँचें।",
          ],
          links: [
            { href: "/marketplace", label: "Open marketplace", labelHi: "बाज़ार खोलें" },
            { href: "/schemes", label: "Check subsidies", labelHi: "सब्सिडी देखें" },
          ],
        },
      },
      {
        id: "machinery",
        label: "Tractor implements / spray / other machines",
        labelHi: "ट्रैक्टर औज़ार / स्प्रे / अन्य मशीन",
        result: {
          problem: "Looking for farm machinery",
          problemHi: "कृषि मशीनरी खोज रहे हैं",
          advice: [
            "Browse Tool market listings and compare sellers.",
            "Ask for demo or local service support in your enquire message.",
            "Verify warranty and spare parts availability before buying.",
          ],
          adviceHi: [
            "औज़ार बाज़ार की लिस्ट देखकर विक्रेता मिलाएँ।",
            "Enquire में डेमो या स्थानीय सर्विस के बारे में पूछें।",
            "खरीद से पहले वारंटी और स्पेयर पार्ट्स पक्का करें।",
          ],
          links: [
            { href: "/marketplace", label: "Browse tools", labelHi: "औज़ार देखें" },
          ],
        },
      },
    ],
  },
  {
    id: "market",
    icon: "cart",
    title: "Mandi prices / selling crop",
    titleHi: "मंडी भाव / फसल बेचना",
    subtitle: "Price check and selling tips",
    subtitleHi: "भाव जाँच और बेचने के सुझाव",
    choices: [
      {
        id: "price",
        label: "I want today’s price idea",
        labelHi: "आज का भाव अंदाज़ा चाहिए",
        result: {
          problem: "Need mandi price guidance",
          problemHi: "मंडी भाव मार्गदर्शन चाहिए",
          advice: [
            "Use the mobile app Market section for live-style price checks.",
            "Compare nearby mandis before transporting harvest.",
            "Avoid middlemen pressure — write the offered rate before you agree.",
          ],
          adviceHi: [
            "लाइव-शैली भाव के लिए मोबाइल ऐप का बाज़ार सेक्शन देखें।",
            "फसल ले जाने से पहले आसपास की मंडियाँ मिलाएँ।",
            "बिचौलिये के दबाव से बचें — मानने से पहले रेट लिख लें।",
          ],
          links: [
            { href: "/#get-app", label: "Open market in app", labelHi: "ऐप में बाज़ार खोलें" },
          ],
        },
      },
      {
        id: "when-sell",
        label: "Should I sell now or wait?",
        labelHi: "अभी बेचूँ या रुकूँ?",
        result: {
          problem: "Sell timing decision",
          problemHi: "बेचने का समय तय करना है",
          advice: [
            "If storage is safe and dry, waiting a few days can help — if not, sell to avoid spoilage.",
            "Watch weather: rain after harvest hurts quality and price.",
            "Track rates for 2–3 days in the app before a big sale.",
          ],
          adviceHi: [
            "भंडारण सुरक्षित-सूखा हो तो कुछ दिन रुकना फायदा दे सकता है; नहीं तो खराब होने से पहले बेचें।",
            "मौसम देखें: कटाई बाद बारिश गुणवत्ता और भाव गिराती है।",
            "बड़ी बिक्री से पहले 2–3 दिन ऐप में रेट ट्रैक करें।",
          ],
          links: [
            { href: "/#get-app", label: "Get the app", labelHi: "ऐप लें" },
          ],
        },
      },
    ],
  },
  {
    id: "app",
    icon: "app",
    title: "App or website help",
    titleHi: "ऐप या वेबसाइट मदद",
    subtitle: "Login, language, how to use",
    subtitleHi: "लॉगिन, भाषा, कैसे इस्तेमाल करें",
    choices: [
      {
        id: "how-scan",
        label: "How do I scan a crop?",
        labelHi: "फसल कैसे स्कैन करें?",
        result: {
          problem: "Need Crop Doctor scan steps",
          problemHi: "फसल डॉक्टर स्कैन के चरण चाहिए",
          advice: [
            "Install the mobile app — full Crop Doctor scan works best there.",
            "On this website you can already browse the Disease library without scanning.",
            "Photograph one leaf clearly, fill the frame, avoid heavy shadow.",
          ],
          adviceHi: [
            "मोबाइल ऐप इंस्टॉल करें — पूरा फसल डॉक्टर स्कैन वहीं बेहतर चलता है।",
            "इस वेबसाइट पर बिना स्कैन रोग लाइब्रेरी देख सकते हैं।",
            "एक पत्ते की साफ़ फ़ोटो लें, फ्रेम भरें, तेज़ छाया से बचें।",
          ],
          links: [
            { href: "/#get-app", label: "Download app", labelHi: "ऐप डाउनलोड" },
            { href: "/diseases", label: "Disease library", labelHi: "रोग लाइब्रेरी" },
            { href: "/#app-guide", label: "App guide", labelHi: "ऐप गाइड" },
          ],
        },
      },
      {
        id: "language",
        label: "Change language to Hindi / English",
        labelHi: "भाषा हिंदी / अंग्रेज़ी करें",
        result: {
          problem: "Language switch",
          problemHi: "भाषा बदलना",
          advice: [
            "Use the भाषा / EN toggle in the top header on any page.",
            "Your choice is saved for the next visit on this device.",
          ],
          adviceHi: [
            "किसी भी पेज के ऊपर भाषा / EN टॉगल दबाएँ।",
            "आपकी पसंद इस डिवाइस पर अगली विज़िट के लिए सेव रहती है।",
          ],
        },
      },
    ],
  },
];
