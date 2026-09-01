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
import { useT } from "@/lib/i18n";

const GUIDE_STEPS = ["scan", "weather", "spend", "ask"] as const;
const ease = [0.22, 1, 0.36, 1] as const;

export default function HomePage() {
  const { t } = useT();

  return (
    <MarketingShell>
      <section className="hero-panel relative min-h-[86vh] w-full overflow-hidden pb-8">
        <div className="hero-media" aria-hidden>
          <Image
            src="/farm-field.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="farm-wind-photo object-cover object-[center_40%]"
          />
          <div className="farm-wind-crop">
            <Image
              src="/farm-field.jpg"
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-[center_72%]"
            />
          </div>
          <div className="farm-wind-layer farm-wind-a" />
          <div className="farm-wind-layer farm-wind-b" />
          <div className="farm-wind-layer farm-wind-c" />
          <svg className="farm-grass" viewBox="0 0 1440 180" preserveAspectRatio="none" aria-hidden>
            <g className="farm-grass-row farm-grass-back">
              {Array.from({ length: 48 }).map((_, i) => {
                const x = i * 30 + 8;
                const h = 70 + ((i * 17) % 55);
                return (
                  <path
                    key={`b-${i}`}
                    d={`M${x} 180 Q${x - 6} ${180 - h / 2} ${x + ((i % 3) - 1) * 4} ${180 - h}`}
                    fill="none"
                    stroke="rgba(55,130,55,0.45)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                );
              })}
            </g>
            <g className="farm-grass-row farm-grass-mid">
              {Array.from({ length: 40 }).map((_, i) => {
                const x = i * 36 + 18;
                const h = 90 + ((i * 23) % 60);
                return (
                  <path
                    key={`m-${i}`}
                    d={`M${x} 180 Q${x + 8} ${180 - h / 2} ${x + ((i % 2) * 10 - 5)} ${180 - h}`}
                    fill="none"
                    stroke="rgba(70,150,60,0.55)"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                  />
                );
              })}
            </g>
            <g className="farm-grass-row farm-grass-front">
              {Array.from({ length: 36 }).map((_, i) => {
                const x = i * 40 + 4;
                const h = 110 + ((i * 19) % 50);
                return (
                  <path
                    key={`f-${i}`}
                    d={`M${x} 180 Q${x - 10} ${180 - h / 2} ${x + ((i % 3) - 1) * 8} ${180 - h}`}
                    fill="none"
                    stroke="rgba(95,170,70,0.62)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                );
              })}
            </g>
          </svg>
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
            className="mx-auto w-full max-w-[340px]"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="overflow-hidden rounded-[28px] border border-white/35 bg-white/18 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
            >
              <div className="bg-[linear-gradient(160deg,#163821_0%,#1f5a38_55%,#2a6b44_100%)] px-5 pb-4 pt-5 text-white">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">
                  GramConnect
                </p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">
                  {t("showcase.phone.title")}
                </p>
                <p className="mt-1 text-[13px] text-white/75">{t("showcase.phone.sub")}</p>
              </div>
              <div className="bg-white/55 p-3">
                <div className="relative overflow-hidden rounded-[18px] border border-white/50 shadow-sm">
                  <Image
                    src="/app-phone.jpg"
                    alt="GramConnect mobile app"
                    width={853}
                    height={1280}
                    priority
                    className="h-auto w-full object-cover object-top"
                  />
                </div>
              </div>
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
