"use client";

import { useApp } from "./store";

const STRINGS = {
  en: {
    "nav.home": "Home",
    "nav.cropDoctor": "Crop Doctor",
    "nav.advisor": "Advisor",
    "nav.expenses": "Expenses",
    "nav.more": "More",
    "home.priorities": "Today's Priorities",
    "home.quickActions": "Quick Actions",
    "home.recentExpenses": "Recent Expenses",
    "home.seeAll": "See all",
    "home.fieldTip": "Today's Field Tip",
    "home.thisMonth": "This month",
    "home.autoSprinkler": "Auto sprinkler",
    "home.buyers": "Buyers",
  },
  hi: {
    "nav.home": "होम",
    "nav.cropDoctor": "फसल डॉक्टर",
    "nav.advisor": "सलाह",
    "nav.expenses": "खर्च",
    "nav.more": "और",
    "home.priorities": "आज की प्राथमिकताएँ",
    "home.quickActions": "तुरंत कार्य",
    "home.recentExpenses": "हाल के खर्च",
    "home.seeAll": "सभी देखें",
    "home.fieldTip": "आज की खेती सलाह",
    "home.thisMonth": "इस महीने",
    "home.autoSprinkler": "ऑटो स्प्रिंकलर",
    "home.buyers": "खरीदार",
  },
} as const;

export type StringKey = keyof (typeof STRINGS)["en"];

export function useT() {
  const language = useApp((s) => s.language);
  return (key: StringKey) => STRINGS[language][key] ?? STRINGS.en[key];
}
