"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  ShieldCheck,
  Sprout,
  TriangleAlert,
} from "lucide-react";
import MarketingShell from "@/components/MarketingShell";
import { Tag } from "@/components/ui/primitives";
import { DISEASES, getDisease, severityStyle } from "@/lib/seed/diseases";
import { DISEASES_HI } from "@/lib/seed/diseases.hi";
import { useT } from "@/lib/i18n";

export default function DiseaseDetailWebsitePage() {
  const params = useParams<{ slug: string }>();
  const { t, lang, tSeverity, tSeason, tCrop } = useT();
  const disease = getDisease(params.slug);

  if (!disease) notFound();

  const view =
    lang === "hi" && DISEASES_HI[disease.slug]
      ? { ...disease, ...DISEASES_HI[disease.slug], crop: tCrop(disease.crop) }
      : { ...disease, crop: tCrop(disease.crop) };
  const s = severityStyle[disease.severity];
  const related = DISEASES.filter(
    (d) => d.crop === disease.crop && d.slug !== disease.slug
  ).slice(0, 3);

  return (
    <MarketingShell>
      <div className="mx-auto w-full max-w-site px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/diseases"
          className="inline-flex items-center gap-2 rounded-full glass px-3 py-2 text-[13px] font-semibold text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft size={16} />
          {t("diseasesLib.back")}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"
        >
          <article className="glass p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ backgroundColor: s.bg, color: s.color }}
              >
                <TriangleAlert size={22} />
              </span>
              <div>
                <h1 className="font-display text-3xl font-semibold tracking-tight">
                  {view.name}
                </h1>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Tag color="var(--green-bright)" tint="rgba(34,197,94,0.16)">
                    {view.crop}
                  </Tag>
                  <Tag color={s.text} tint={s.bg}>
                    {tSeverity(disease.severity)}
                  </Tag>
                  <Tag color="#1d4ed8" tint="rgba(59,130,246,0.16)">
                    {tSeason(disease.season)}
                  </Tag>
                </div>
              </div>
            </div>

            <p className="mt-5 text-[15px] leading-relaxed text-text-secondary">
              {view.description}
            </p>

            <p className="mt-4 text-[13px] text-text-muted">
              {t("disease.affects", { part: view.affectedPart })}
            </p>
            <p className="mt-1 text-[14px] font-medium">{view.symptom}</p>

            <Section
              title={t("disease.why")}
              icon={<Sprout size={16} />}
              items={view.causes}
            />
            <Section
              title={t("disease.treatment")}
              icon={<ShieldCheck size={16} />}
              items={view.treatment}
            />
            <Section
              title={t("disease.prevention")}
              icon={<CalendarDays size={16} />}
              items={view.prevention}
            />

            <p className="mt-6 rounded-2xl bg-amber/10 px-4 py-3 text-[12px] leading-relaxed text-amber">
              {t("disease.confirmNote")}
            </p>
          </article>

          <aside className="space-y-4">
            <div className="glass p-5">
              <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-text-muted">
                {t("diseasesLib.fromModel")}
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">
                {t("diseasesLib.fromModelBody")}
              </p>
            </div>

            {related.length > 0 && (
              <div className="glass p-5">
                <p className="text-[14px] font-bold">
                  {t("disease.other", { crop: view.crop })}
                </p>
                <div className="mt-3 space-y-2">
                  {related.map((r) => {
                    const name =
                      lang === "hi" && DISEASES_HI[r.slug]
                        ? DISEASES_HI[r.slug].name
                        : r.name;
                    return (
                      <Link
                        key={r.slug}
                        href={`/diseases/${r.slug}`}
                        className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-semibold hover-surface"
                      >
                        <span>{name}</span>
                        <ChevronRight size={15} className="text-text-muted" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>
        </motion.div>
      </div>
    </MarketingShell>
  );
}

function Section({
  title,
  icon,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
}) {
  return (
    <section className="mt-7">
      <h2 className="flex items-center gap-2 text-[14px] font-bold text-green-bright">
        {icon}
        {title}
      </h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-xl surface px-3.5 py-2.5 text-[13.5px] leading-relaxed text-text-secondary"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
