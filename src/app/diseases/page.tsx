"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Leaf, Search, Stethoscope } from "lucide-react";
import MarketingShell from "@/components/MarketingShell";
import { Tag } from "@/components/ui/primitives";
import {
  CROPS,
  DISEASES,
  SEVERITIES,
  severityStyle,
} from "@/lib/seed/diseases";
import { DISEASES_HI } from "@/lib/seed/diseases.hi";
import { useT } from "@/lib/i18n";

export default function DiseasesPage() {
  const { t, lang, tCrop, tSeverity } = useT();
  const [query, setQuery] = useState("");
  const [crop, setCrop] = useState("all");
  const [severity, setSeverity] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DISEASES.filter((d) => {
      const hi = DISEASES_HI[d.slug];
      const hay = [
        d.name,
        d.crop,
        d.symptom,
        d.affectedPart,
        hi?.name,
        hi?.symptom,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesQuery = !q || hay.includes(q);
      const matchesCrop = crop === "all" || d.crop === crop;
      const matchesSeverity = severity === "all" || d.severity === severity;
      return matchesQuery && matchesCrop && matchesSeverity;
    });
  }, [query, crop, severity]);

  return (
    <MarketingShell>
      <div className="mx-auto w-full max-w-site px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl glass text-green-bright">
            <Stethoscope size={20} />
          </div>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("diseasesLib.title")}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">
            {t("diseasesLib.sub", { n: DISEASES.length })}
          </p>
        </motion.div>

        <div className="mt-8 grid gap-3 lg:grid-cols-[1.2fr_auto_auto]">
          <div className="relative">
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("diseasesLib.search")}
              className="field h-[48px] w-full rounded-full pl-10 pr-4 text-[14px]"
            />
          </div>
          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="field h-[48px] rounded-full px-4 text-[13px] font-semibold"
          >
            <option value="all">{t("diseasesLib.allCrops")}</option>
            {CROPS.map((c) => (
              <option key={c} value={c}>
                {tCrop(c)}
              </option>
            ))}
          </select>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="field h-[48px] rounded-full px-4 text-[13px] font-semibold"
          >
            <option value="all">{t("diseasesLib.allLevels")}</option>
            {SEVERITIES.map((s) => (
              <option key={s} value={s}>
                {tSeverity(s)}
              </option>
            ))}
          </select>
        </div>

        <p className="mt-4 text-[13px] text-text-muted">
          {t("diseasesLib.count", { n: filtered.length })}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((disease, i) => {
            const view =
              lang === "hi" && DISEASES_HI[disease.slug]
                ? { ...disease, ...DISEASES_HI[disease.slug] }
                : disease;
            const s = severityStyle[disease.severity];
            return (
              <motion.div
                key={disease.slug}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: Math.min(i * 0.03, 0.3),
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href={`/diseases/${disease.slug}`}
                  className="glass glass-hover group flex h-full flex-col overflow-hidden p-0"
                >
                  <div className="relative h-36 w-full overflow-hidden bg-[linear-gradient(145deg,rgba(31,122,69,0.14),rgba(31,122,69,0.04))]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/diseases/${disease.slug}.jpg`}
                      alt={view.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/45 to-transparent px-3 pb-2.5 pt-8">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-green-bright backdrop-blur-sm">
                        <Leaf size={15} />
                      </span>
                      <Tag color={s.text} tint={s.bg}>
                        {tSeverity(disease.severity)}
                      </Tag>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5 pt-4">
                    <h2 className="text-[17px] font-bold leading-snug">
                      {view.name}
                    </h2>
                    <p className="mt-1 text-[12px] font-semibold text-green-bright">
                      {tCrop(disease.crop)}
                    </p>
                    <p className="mt-2 flex-1 text-[13px] leading-relaxed text-text-secondary">
                      {view.symptom}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-green-bright">
                      {t("diseasesLib.view")}
                      <ChevronRight
                        size={15}
                        className="transition group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="glass mt-8 p-8 text-center text-[14px] text-text-secondary">
            {t("diseasesLib.empty")}
          </div>
        )}

        <p className="mt-8 text-[12px] text-text-muted">{t("diseasesLib.note")}</p>
      </div>
    </MarketingShell>
  );
}
