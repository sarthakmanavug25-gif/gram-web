"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  HandCoins,
  Landmark,
  Smartphone,
  Stethoscope,
  Wrench,
} from "lucide-react";
import MarketingShell from "@/components/MarketingShell";
import { MotionLink } from "@/components/MotionButton";
import VectorFarmScene from "@/components/VectorFarmScene";
import { useT } from "@/lib/i18n";

const GUIDE_STEPS = ["scan", "weather", "spend", "ask"] as const;
const ease = [0.22, 1, 0.36, 1] as const;

export default function HomePage() {
  const { t } = useT();

  return (
    <MarketingShell>
      <section className="hero-panel relative min-h-[86vh] w-full overflow-hidden pb-8">
        <div className="hero-media" aria-hidden>
          <VectorFarmScene />
        </div>

        <div className="relative z-10 mx-auto grid min-h-[86vh] w-full max-w-site items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
              className="text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl"
            >
              {t("site.hero.brand")}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease }}
              className="mt-5 max-w-xl text-xl font-medium leading-snug text-white/93 sm:text-2xl"
            >
              {t("showcase.hero.headline")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.16, ease }}
              className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/78"
            >
              {t("showcase.hero.sub")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.24, ease }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <MotionLink href="#get-app" variant="solid-light">
                {t("showcase.hero.ctaApp")}
              </MotionLink>
              <MotionLink href="/schemes" variant="secondary">
                {t("showcase.hero.ctaSchemes")}
              </MotionLink>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.18, duration: 0.75, ease }}
            className="mx-auto w-full max-w-[280px] sm:max-w-[300px]"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <Image
                src="/phone-cutout.png"
                alt="GramConnect mobile app"
                width={853}
                height={1280}
                priority
                className="h-auto w-full drop-shadow-[0_28px_50px_rgba(0,0,0,0.38)]"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="app-guide" className="mx-auto w-full max-w-site px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("showcase.guide.title")}
          </h2>
          <p className="mt-3 text-[15px] text-text-secondary">{t("showcase.guide.sub")}</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GUIDE_STEPS.map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="glass glass-hover p-5"
            >
              <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-green-bright">
                {t("showcase.guide.step", { n: i + 1 })}
              </p>
              <h3 className="mt-3 text-[17px] font-bold">
                {t(`showcase.guide.${step}.title` as "showcase.guide.scan.title")}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">
                {t(`showcase.guide.${step}.body` as "showcase.guide.scan.body")}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-4">
        <div className="mx-auto w-full max-w-site px-4 sm:px-6 lg:px-8">
          <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.99 }} transition={{ type: "spring", stiffness: 380, damping: 28 }}>
            <Link
              href="/diseases"
              className="glass group flex flex-col gap-6 p-7 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="max-w-2xl">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-green-primary/12 text-green-bright">
                  <Stethoscope size={20} />
                </div>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                  {t("diseasesLib.homeTitle")}
                </h2>
                <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">
                  {t("diseasesLib.homeBody")}
                </p>
              </div>
              <span className="btn-apple inline-flex items-center gap-2 self-start rounded-full bg-green-primary px-5 py-3 text-[14px] font-semibold text-white sm:self-center">
                {t("diseasesLib.homeCta")} <ArrowRight size={16} />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-[var(--hairline-edge)] py-16">
        <div className="mx-auto grid w-full max-w-site gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.985 }} transition={{ type: "spring", stiffness: 380, damping: 28 }}>
            <Link
              href="/schemes"
              className="group block overflow-hidden rounded-[28px] bg-[linear-gradient(145deg,#143526_0%,#1f5a38_60%,#2a6b44_100%)] p-7 text-white shadow-[0_16px_40px_rgba(16,55,30,0.22)]"
            >
              <Landmark className="h-8 w-8 text-white/85" />
              <h2 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
                {t("showcase.schemes.title")}
              </h2>
              <p className="mt-3 max-w-md text-[14px] leading-relaxed text-white/75">
                {t("showcase.schemes.body")}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold">
                {t("showcase.schemes.cta")} <ArrowRight size={16} />
              </span>
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.985 }} transition={{ type: "spring", stiffness: 380, damping: 28 }}>
            <Link
              href="/marketplace"
              className="glass group block overflow-hidden rounded-[28px] p-7"
            >
              <Wrench className="h-8 w-8 text-green-bright" />
              <h2 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
                {t("showcase.market.title")}
              </h2>
              <p className="mt-3 max-w-md text-[14px] leading-relaxed text-text-secondary">
                {t("showcase.market.body")}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-green-bright">
                {t("showcase.market.cta")} <ArrowRight size={16} />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      <section id="get-app" className="mx-auto w-full max-w-site px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[28px] glass px-6 py-10 sm:px-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-green-primary/12 text-green-bright">
                <Smartphone size={22} />
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">
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
