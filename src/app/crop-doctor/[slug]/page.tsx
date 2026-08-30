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
  const disease = getDisease(params.slug);

  if (!disease) notFound();

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
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-text-primary"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-[22px] font-bold leading-tight">{disease.name}</h1>
      </div>

      <Card>
        <div className="flex items-start gap-3">
          <IconTile color={s.color} tint={s.bg} size={48}>
            <TriangleAlert size={22} />
          </IconTile>
          <div>
            <div className="flex flex-wrap gap-1.5">
              <Tag color="#4ade80" tint="rgba(34,197,94,0.16)">
                {disease.crop}
              </Tag>
              <Tag color={s.text} tint={s.bg}>
                {disease.severity}
              </Tag>
              <Tag color="#93c5fd" tint="rgba(59,130,246,0.16)">
                {disease.season}
              </Tag>
            </div>
            <p className="mt-2 text-[13px] text-text-secondary">
              Affects: {disease.affectedPart}
            </p>
          </div>
        </div>
        <p className="mt-3 text-[13.5px] leading-relaxed text-text-secondary">
          {disease.description}
        </p>
      </Card>

      <Card>
        <SectionLabel icon={<Stethoscope size={14} />} color="var(--orange)">
          Why it happens
        </SectionLabel>
        <ul className="space-y-2">
          {disease.causes.map((c) => (
            <Bullet key={c} color="var(--orange)">
              {c}
            </Bullet>
          ))}
        </ul>
      </Card>

      <Card>
        <SectionLabel icon={<Sprout size={14} />}>Treatment</SectionLabel>
        <ol className="space-y-2.5">
          {disease.treatment.map((t, i) => (
            <li key={t} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-primary/15 text-[12px] font-bold text-green-bright">
                {i + 1}
              </span>
              <span className="text-[13.5px] leading-snug text-text-secondary">
                {t}
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-3 rounded-xl border border-amber/25 bg-amber/10 px-3 py-2 text-[12px] text-amber">
          Always confirm the dose with your local agri officer before spraying.
        </p>
      </Card>

      <Card>
        <SectionLabel icon={<ShieldCheck size={14} />} color="var(--blue-info)">
          Prevention
        </SectionLabel>
        <ul className="space-y-2">
          {disease.prevention.map((p) => (
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
          Most active in the <b className="text-text-primary">{disease.season}</b>{" "}
          season — scout this crop weekly during that window.
        </p>
      </Card>

      {related.length > 0 && (
        <section>
          <SectionLabel>Other {disease.crop} problems</SectionLabel>
          <Card className="p-0">
            {related.map((r, i) => {
              const rs = severityStyle[r.severity];
              return (
                <Link
                  key={r.slug}
                  href={`/crop-doctor/${r.slug}`}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    i > 0 ? "border-t border-white/[0.06]" : ""
                  }`}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: rs.color }}
                  />
                  <span className="flex-1 text-[14px] font-medium">{r.name}</span>
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
