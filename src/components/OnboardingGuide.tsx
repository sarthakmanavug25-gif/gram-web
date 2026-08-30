"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  CloudSun,
  IndianRupee,
  MessageCircle,
  Settings2,
  Sprout,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { useT, type StringKey } from "@/lib/i18n";

type Slide = {
  icon: React.ReactNode;
  title: StringKey;
  body: StringKey;
  color: string;
  tint: string;
};

const SLIDES: Slide[] = [
  {
    icon: <Sprout size={30} />,
    title: "guide.s1.title",
    body: "guide.s1.body",
    color: "var(--green-primary)",
    tint: "rgba(34,197,94,0.16)",
  },
  {
    icon: <Camera size={30} />,
    title: "guide.s2.title",
    body: "guide.s2.body",
    color: "var(--green-bright)",
    tint: "rgba(74,222,128,0.16)",
  },
  {
    icon: <CloudSun size={30} />,
    title: "guide.s3.title",
    body: "guide.s3.body",
    color: "var(--orange)",
    tint: "rgba(251,146,60,0.16)",
  },
  {
    icon: <IndianRupee size={30} />,
    title: "guide.s4.title",
    body: "guide.s4.body",
    color: "var(--amber)",
    tint: "rgba(245,158,11,0.16)",
  },
  {
    icon: <MessageCircle size={30} />,
    title: "guide.s5.title",
    body: "guide.s5.body",
    color: "var(--blue-info)",
    tint: "rgba(59,130,246,0.16)",
  },
  {
    icon: <Settings2 size={30} />,
    title: "guide.s6.title",
    body: "guide.s6.body",
    color: "var(--purple-labor)",
    tint: "rgba(129,140,248,0.16)",
  },
];

/** Feature tour shown once, right after a farmer first enters the dashboard. */
export default function OnboardingGuide() {
  const hasSeenGuide = useApp((s) => s.hasSeenGuide);
  const markGuideSeen = useApp((s) => s.markGuideSeen);
  const { t } = useT();
  const [index, setIndex] = useState(0);

  if (hasSeenGuide) return null;

  const slide = SLIDES[index];
  const last = index === SLIDES.length - 1;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center overlay-bg backdrop-blur-sm sm:items-center">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="sheet-surface hairline mx-auto w-full max-w-phone rounded-t-[26px] px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-6 sm:rounded-[26px]"
      >
        <div className="mb-5 flex justify-between">
          <span className="text-[12px] font-semibold text-text-muted">
            {index + 1} / {SLIDES.length}
          </span>
          <button
            type="button"
            onClick={markGuideSeen}
            className="text-[13px] font-semibold text-text-secondary"
          >
            {t("guide.skip")}
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.2 }}
            className="min-h-[196px]"
          >
            <span
              className="mb-4 flex h-[62px] w-[62px] items-center justify-center rounded-2xl"
              style={{ backgroundColor: slide.tint, color: slide.color }}
            >
              {slide.icon}
            </span>
            <h2 className="text-[22px] font-bold leading-tight">
              {t(slide.title)}
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">
              {t(slide.body)}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mb-5 mt-4 flex gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-green-primary" : "w-1.5 surface-2"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-2.5">
          {index > 0 && (
            <button
              type="button"
              onClick={() => setIndex(index - 1)}
              className="hairline surface flex-1 rounded-full py-3.5 text-[15px] font-semibold"
            >
              {t("guide.back")}
            </button>
          )}
          <button
            type="button"
            onClick={() => (last ? markGuideSeen() : setIndex(index + 1))}
            className="flex-[2] rounded-full bg-green-primary py-3.5 text-[15px] font-bold text-white shadow-glow transition hover:bg-green-dark"
          >
            {last ? t("guide.start") : t("guide.next")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
