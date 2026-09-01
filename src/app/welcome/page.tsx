"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Camera,
  CloudSun,
  IndianRupee,
  Plane,
  Smartphone,
  Store,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";

const FEATURES = [
  { key: "crop", href: "/crop-doctor", icon: Camera },
  { key: "weather", href: "/advisor", icon: CloudSun },
  { key: "expense", href: "/expenses", icon: IndianRupee },
  { key: "market", href: "/market", icon: Store },
  { key: "drone", href: "/drone-spray", icon: Plane },
  { key: "calendar", href: "/crop-calendar", icon: CalendarDays },
] as const;

export default function WelcomePage() {
  const router = useRouter();
  const setSession = useApp((s) => s.setSession);
  const markWelcomeSeen = useApp((s) => s.markWelcomeSeen);
  const theme = useApp((s) => s.theme);
  const { t } = useT();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function ensureSession() {
    const { profile, session } = useApp.getState();
    if (!session) {
      setSession({ id: "guest", name: profile.name, phone: profile.phone });
      markWelcomeSeen();
    }
  }

  function openDashboard() {
    ensureSession();
    router.replace("/");
  }

  function openTool(href: string) {
    ensureSession();
    router.push(href);
  }

  return (
    <div className="welcome-bg flex min-h-dvh flex-col">
      <SiteHeader variant="marketing" />

      <section className="hero-panel relative min-h-[78vh] w-full">
        <div className="hero-field" aria-hidden />
        <div className="relative z-10 mx-auto flex min-h-[78vh] w-full max-w-site flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {t("site.hero.brand")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-5 max-w-3xl text-xl font-medium leading-snug text-white/92 sm:text-2xl md:text-[1.75rem]"
          >
            {t("site.hero.headline")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/75 sm:text-base"
          >
            {t("site.hero.sub")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <button
              type="button"
              onClick={openDashboard}
              className="rounded-full bg-white px-6 py-3 text-[15px] font-semibold text-[#102318] transition hover:bg-[#e8f2eb]"
            >
              {t("site.hero.cta")}
            </button>
            <Link
              href="/login"
              className="rounded-full border border-white/35 bg-white/10 px-6 py-3 text-[15px] font-semibold text-white backdrop-blur transition hover:bg-white/18"
            >
              {t("site.hero.ctaSecondary")}
            </Link>
          </motion.div>
          <p className="relative z-10 mt-6 max-w-xl text-[13px] text-white/60">
            {t("site.hero.note")}
          </p>
        </div>
      </section>

      <section id="features" className="mx-auto w-full max-w-site px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("site.features.title")}
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-text-secondary sm:text-base">
            {t("site.features.sub")}
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ key, href, icon: Icon }) => (
            <Link
              key={key}
              href={href}
              onClick={(e) => {
                e.preventDefault();
                openTool(href);
              }}
              className="group card p-5 transition hover:-translate-y-0.5 hover:border-green-primary/30"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-primary/10 text-green-bright">
                <Icon size={20} />
              </span>
              <h3 className="mt-4 text-[17px] font-bold">
                {t(`site.feat.${key}.title` as "site.feat.crop.title")}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">
                {t(`site.feat.${key}.body` as "site.feat.crop.body")}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section id="tools" className="border-y border-[var(--hairline)] bg-[var(--surface)] py-16">
        <div className="mx-auto w-full max-w-site px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("site.tools.title")}
            </h2>
            <p className="mt-3 text-[15px] text-text-secondary">{t("site.tools.sub")}</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {FEATURES.map(({ key, href }) => (
              <button
                key={key}
                type="button"
                onClick={() => openTool(href)}
                className="rounded-full border border-[var(--hairline)] bg-[var(--page-bg)] px-4 py-2.5 text-[13.5px] font-semibold text-text-primary transition hover:border-green-primary/40 hover:text-green-bright"
              >
                {t(`site.feat.${key}.title` as "site.feat.crop.title")}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="apps" className="mx-auto w-full max-w-site px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[28px] border border-[var(--hairline)] bg-[linear-gradient(135deg,#143526_0%,#1f5a38_55%,#2a6b44_100%)] px-6 py-10 text-white sm:px-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <div className="float-soft inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12">
                <Smartphone size={22} />
              </div>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                {t("site.apps.title")}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-white/75">
                {t("site.apps.sub")}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full bg-white/12 px-4 py-2 text-[13px] font-semibold">
                {t("site.apps.ios")}
              </span>
              <span className="rounded-full bg-white/12 px-4 py-2 text-[13px] font-semibold">
                {t("site.apps.android")}
              </span>
              <button
                type="button"
                onClick={openDashboard}
                className="rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-[#102318]"
              >
                {t("site.apps.web")}
              </button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
