"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Coins, Sparkles, X } from "lucide-react";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";

const BUBBLES = Array.from({ length: 10 }, (_, i) => i);

export default function GramPointsRewardBubble() {
  const { t } = useT();
  const reward = useApp((s) => s.pendingLoginReward);
  const clear = useApp((s) => s.clearLoginReward);

  useEffect(() => {
    if (!reward) return;
    const id = window.setTimeout(() => clear(), 6500);
    return () => window.clearTimeout(id);
  }, [reward, clear]);

  return (
    <AnimatePresence>
      {reward && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[80] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="pointer-events-auto absolute inset-0 bg-[rgba(8,20,12,0.45)] backdrop-blur-[2px]" onClick={clear} />

          {BUBBLES.map((i) => (
            <motion.span
              key={i}
              className="pointer-events-none absolute bottom-[18%] text-green-bright"
              style={{ left: `${10 + i * 8}%` }}
              initial={{ y: 40, opacity: 0, scale: 0.4 }}
              animate={{
                y: [-20, -180 - i * 18],
                opacity: [0, 1, 0],
                scale: [0.5, 1.15, 0.85],
              }}
              transition={{
                duration: 1.8 + (i % 3) * 0.25,
                delay: 0.08 * i,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Coins size={18 + (i % 4) * 3} />
            </motion.span>
          ))}

          <motion.div
            role="dialog"
            aria-live="polite"
            className="pointer-events-auto relative z-10 w-full max-w-sm overflow-hidden rounded-[28px] border border-white/40 bg-white/95 p-6 text-center shadow-[0_24px_60px_rgba(16,55,30,0.28)] dark:border-white/10 dark:bg-[#102318]/95"
            initial={{ y: 80, scale: 0.72, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -36, scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
          >
            <button
              type="button"
              onClick={clear}
              className="absolute right-3 top-3 rounded-full p-1.5 text-text-muted hover:bg-black/5"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <motion.div
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-primary text-white shadow-glow"
              initial={{ scale: 0.4, rotate: -20 }}
              animate={{ scale: [0.4, 1.18, 1], rotate: [-20, 8, 0] }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <Sparkles size={28} />
            </motion.div>

            <motion.p
              className="mt-4 font-display text-4xl font-bold text-green-bright"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              +{reward.amount} GP
            </motion.p>

            <motion.h2
              className="mt-2 text-lg font-bold text-text-primary"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.22 }}
            >
              {reward.firstTime
                ? t("points.login.firstTitle")
                : t("points.login.dailyTitle")}
            </motion.h2>

            <motion.p
              className="mt-2 text-[14px] leading-relaxed text-text-secondary"
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {reward.firstTime
                ? t("points.login.firstBody", { n: reward.amount })
                : t("points.login.dailyBody", { n: reward.amount })}
            </motion.p>

            <motion.button
              type="button"
              onClick={clear}
              className="mt-5 w-full rounded-full bg-green-primary px-5 py-3 text-[14px] font-semibold text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileTap={{ scale: 0.97 }}
            >
              {t("points.login.cta")}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
