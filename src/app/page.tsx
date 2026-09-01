"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeIndianRupee,
  Camera,
  CloudSun,
  HandCoins,
  Landmark,
  Smartphone,
  Store,
  Wrench,
} from "lucide-react";
import MarketingShell from "@/components/MarketingShell";
import { useT } from "@/lib/i18n";

const APP_FEATURES = [
  { key: "crop", icon: Camera },
  { key: "weather", icon: CloudSun },
  { key: "expense", icon: BadgeIndianRupee },
  { key: "market", icon: Store },
] as const;

const GUIDE_STEPS = ["scan", "weather", "spend", "ask"] as const;

export default function HomePage() {
  const { t } = useT();

  return (
    <MarketingShell>
      <section className="hero-panel relative min-h-[78vh] w-full">
        <div className="hero-field" aria-hidden />
        <div className="relative z-10 mx-auto grid min-h-[78vh] w-full max-w-site items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl"
            >
              {t("site.hero.brand")}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="mt-5 max-w-xl text-xl font-medium leading-snug text-white/92 sm:text-2xl"
            >
              {t("showcase.hero.headline")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/75"
            >
              {t("showcase.hero.sub")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <a
                href="#get-app"
                className="rounded-full bg-white px-6 py-3 text-[15px] font-semibold text-[#102318] transition hover:bg-[#e8f2eb]"
              >
                {t("showcase.hero.ctaApp")}
              </a>
              <Link
                href="/schemes"
                className="rounded-full border border-white/35 bg-white/10 px-6 py-3 text-[15px] font-semibold text-white backdrop-blur transition hover:bg-white/18"
              >
                {t("showcase.hero.ctaSchemes")}
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.55 }}
            className="float-soft mx-auto w-full max-w-[280px]"
          >
            <div className="rounded-[2rem] border border-white/20 bg-[#0c1f15]/70 p-3 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur">
              <div className="overflow-hidden rounded-[1.55rem] bg-[#f4faf5] text-[#102318]">
                <div className="bg-[#1f7a45] px-4 py-5 text-white">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                    {t("app.name")}
                  </p>
                  <p className="mt-2 font-display text-2xl font-semibold">
                    {t("showcase.phone.title")}
                  </p>
                  <p className="mt-1 text-[12px] text-white/75">
                    {t("showcase.phone.sub")}
                  </p>
                </div>
                <div className="space-y-2.5 p-4">
                  {APP_FEATURES.map(({ key, icon: Icon }) => (
                    <div
                      key={key}
                      className="flex items-center gap-3 rounded-xl bg-[#e8f2eb] px-3 py-2.5"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#1f7a45]">
                        <Icon size={16} />
                      </span>
                      <span className="text-[13px] font-semibold">
                        {t(`showcase.feature.${key}` as "showcase.feature.crop")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="app-guide" className="mx-auto w-full max-w-site px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("showcase.guide.title")}
          </h2>
          <p className="mt-3 text-[15px] text-text-secondary">{t("showcase.guide.sub")}</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GUIDE_STEPS.map((step, i) => (
            <div key={step} className="rounded-2xl border border-[var(--hairline)] bg-[var(--card-bg)] p-5">
              <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-green-bright">
                {t("showcase.guide.step", { n: i + 1 })}
              </p>
              <h3 className="mt-3 text-[17px] font-bold">
                {t(`showcase.guide.${step}.title` as "showcase.guide.scan.title")}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">
                {t(`showcase.guide.${step}.body` as "showcase.guide.scan.body")}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--hairline)] bg-[var(--surface)] py-16">
        <div className="mx-auto grid w-full max-w-site gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Link
            href="/schemes"
            className="group overflow-hidden rounded-[28px] bg-[linear-gradient(145deg,#143526_0%,#1f5a38_60%,#2a6b44_100%)] p-7 text-white transition hover:-translate-y-0.5"
          >
            <Landmark className="h-8 w-8 text-white/85" />
            <h2 className="mt-5 font-display text-2xl font-semibold sm:text-3xl">
              {t("showcase.schemes.title")}
            </h2>
            <p className="mt-3 max-w-md text-[14px] leading-relaxed text-white/75">
              {t("showcase.schemes.body")}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold">
              {t("showcase.schemes.cta")} <ArrowRight size={16} />
            </span>
          </Link>

          <Link
            href="/marketplace"
            className="group overflow-hidden rounded-[28px] border border-[var(--hairline)] bg-[var(--card-bg)] p-7 transition hover:-translate-y-0.5"
          >
            <Wrench className="h-8 w-8 text-green-bright" />
            <h2 className="mt-5 font-display text-2xl font-semibold sm:text-3xl">
              {t("showcase.market.title")}
            </h2>
            <p className="mt-3 max-w-md text-[14px] leading-relaxed text-text-secondary">
              {t("showcase.market.body")}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-green-bright">
              {t("showcase.market.cta")} <ArrowRight size={16} />
            </span>
          </Link>
        </div>
      </section>

      <section id="get-app" className="mx-auto w-full max-w-site px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-[var(--hairline)] bg-[var(--card-bg)] px-6 py-10 sm:px-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-green-primary/12 text-green-bright">
                <Smartphone size={22} />
              </div>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight">
                {t("showcase.apps.title")}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">
                {t("showcase.apps.sub")}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-[var(--hairline)] px-5 py-3 text-[14px] font-semibold">
                {t("site.apps.ios")}
              </span>
              <span className="rounded-full border border-[var(--hairline)] px-5 py-3 text-[14px] font-semibold">
                {t("site.apps.android")}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-green-primary px-5 py-3 text-[14px] font-semibold text-white">
                <HandCoins size={16} />
                {t("showcase.apps.webNote")}
              </span>
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
