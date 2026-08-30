"use client";

import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  ShieldCheck,
  Sprout,
  Stethoscope,
  TriangleAlert,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import { Card, IconTile, SectionLabel, Tag } from "@/components/ui/primitives";
import { DISEASES, getDisease, severityStyle } from "@/lib/seed/diseases";
import { DISEASES_HI } from "@/lib/seed/diseases.hi";
import { useT } from "@/lib/i18n";

export default function DiseaseDetailPage() {
  return (
    <AppShell>
      <DiseaseDetail />
    </AppShell>
  );
}

function DiseaseDetail() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { t, lang, tSeverity, tSeason, tCrop } = useT();
  const disease = getDisease(params.slug);

  if (!disease) notFound();

  const view =
    lang === "hi" && DISEASES_HI[disease.slug]
      ? { ...disease, ...DISEASES_HI[disease.slug], crop: tCrop(disease.crop) }
      : disease;
  const s = severityStyle[disease.severity];
  const related = DISEASES.filter(
    (d) => d.crop === disease.crop && d.slug !== disease.slug
  ).slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex h-10 w-10 items-center justify-center rounded-full hairline surface text-text-primary"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-[22px] font-bold leading-tight">{view.name}</h1>
      </div>

      <Card>
        <div className="flex items-start gap-3">
          <IconTile color={s.color} tint={s.bg} size={48}>
            <TriangleAlert size={22} />
          </IconTile>
          <div>
            <div className="flex flex-wrap gap-1.5">
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
            <p className="mt-2 text-[13px] text-text-secondary">
              {t("disease.affects", { part: view.affectedPart })}
            </p>
          </div>
        </div>
        <p className="mt-3 text-[13.5px] leading-relaxed text-text-secondary">
          {view.description}
        </p>
      </Card>

      <Card>
        <SectionLabel icon={<Stethoscope size={14} />} color="var(--orange)">
          {t("disease.why")}
        </SectionLabel>
        <ul className="space-y-2">
          {view.causes.map((c) => (
            <Bullet key={c} color="var(--orange)">
              {c}
            </Bullet>
          ))}
        </ul>
      </Card>

      <Card>
        <SectionLabel icon={<Sprout size={14} />}>
          {t("disease.treatment")}
        </SectionLabel>
        <ol className="space-y-2.5">
          {view.treatment.map((step, i) => (
            <li key={step} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-primary/15 text-[12px] font-bold text-green-bright">
                {i + 1}
              </span>
              <span className="text-[13.5px] leading-snug text-text-secondary">
                {step}
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-3 rounded-xl border border-amber/25 bg-amber/10 px-3 py-2 text-[12px] text-amber">
          {t("disease.confirmNote")}
        </p>
      </Card>

      <Card>
        <SectionLabel icon={<ShieldCheck size={14} />} color="var(--blue-info)">
          {t("disease.prevention")}
        </SectionLabel>
        <ul className="space-y-2">
          {view.prevention.map((p) => (
            <Bullet key={p} color="var(--blue-info)">
              {p}
            </Bullet>
          ))}
        </ul>
      </Card>

      <Card className="flex items-center gap-3">
        <IconTile color="var(--green-primary)" tint="rgba(34,197,94,0.14)" size={38}>
          <CalendarDays size={18} />
        </IconTile>
        <p className="text-[13px] text-text-secondary">
          {t("disease.seasonNote", { season: tSeason(disease.season) })}
        </p>
      </Card>

      {related.length > 0 && (
        <section>
          <SectionLabel>{t("disease.other", { crop: view.crop })}</SectionLabel>
          <Card className="p-0">
            {related.map((r, i) => {
              const rs = severityStyle[r.severity];
              return (
                <Link
                  key={r.slug}
                  href={`/crop-doctor/${r.slug}`}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    i > 0 ? "divider-t" : ""
                  }`}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: rs.color }}
                  />
                  <span className="flex-1 text-[14px] font-medium">
                    {lang === "hi" && DISEASES_HI[r.slug]
                      ? DISEASES_HI[r.slug].name
                      : r.name}
                  </span>
                  <ChevronRight size={16} className="text-text-muted" />
                </Link>
              );
            })}
          </Card>
        </section>
      )}
    </div>
  );
}

function Bullet({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <li className="flex gap-2.5">
      <span
        className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-[13.5px] leading-snug text-text-secondary">
        {children}
      </span>
    </li>
  );
}
