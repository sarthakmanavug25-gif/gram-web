"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  ChevronRight,
  Flame,
  Image as ImageIcon,
  Leaf,
  Loader2,
  RotateCcw,
  Search,
  ShieldAlert,
  Stethoscope,
  TriangleAlert,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import ScreenHeader from "@/components/ScreenHeader";
import SegmentedControl from "@/components/SegmentedControl";
import {
  Card,
  Chip,
  EmptyState,
  IconTile,
  SectionLabel,
  Tag,
} from "@/components/ui/primitives";
import {
  CROPS,
  DISEASES,
  SEVERITIES,
  severityStyle,
  type Disease,
} from "@/lib/seed/diseases";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";

const TABS = ["Scan", "Diseases"] as const;
type Tab = (typeof TABS)[number];

export default function CropDoctorPage() {
  return (
    <AppShell>
      <CropDoctorContent />
    </AppShell>
  );
}

function CropDoctorContent() {
  const { t, tCrop, tSeverity, tDisease } = useT();
  const [tab, setTab] = useState<Tab>("Scan");
  const [query, setQuery] = useState("");
  const [crop, setCrop] = useState("All Crops");
  const [severity, setSeverity] = useState("All Levels");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DISEASES.filter((d) => {
      const matchesQuery =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.crop.toLowerCase().includes(q) ||
        d.symptom.toLowerCase().includes(q) ||
        d.affectedPart.toLowerCase().includes(q);
      const matchesCrop = crop === "All Crops" || d.crop === crop;
      const matchesSeverity = severity === "All Levels" || d.severity === severity;
      return matchesQuery && matchesCrop && matchesSeverity;
    });
  }, [query, crop, severity]);

  const highRisk = DISEASES.filter(
    (d) => d.severity === "High" || d.severity === "Critical"
  ).length;

  return (
    <div className="space-y-4">
      <ScreenHeader title={t("cropDoctor.title")} />

      {tab === "Diseases" && (
        <div className="relative">
          <Search
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("cropDoctor.search")}
            className="h-[46px] w-full rounded-full hairline surface pl-10 pr-4 text-[14px] outline-none focus:border-green-primary/50"
          />
        </div>
      )}

      <SegmentedControl
        options={TABS}
        labels={{ Scan: t("cropDoctor.scan"), Diseases: t("cropDoctor.diseases") }}
        value={tab}
        onChange={setTab}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          {tab === "Scan" ? (
            <ScanTab />
          ) : (
            <div className="space-y-4">
              <Card>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <SectionLabel icon={<Camera size={14} />}>
                      {t("cropDoctor.libraryLabel")}
                    </SectionLabel>
                    <h2 className="max-w-[220px] text-[20px] font-bold leading-tight">
                      {t("cropDoctor.headline")}
                    </h2>
                  </div>
                  <IconTile
                    color="var(--orange)"
                    tint="rgba(251,146,60,0.16)"
                    size={44}
                  >
                    <Stethoscope size={22} />
                  </IconTile>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2.5">
                  <MiniStat value={DISEASES.length} label={t("cropDoctor.statDiseases")} />
                  <MiniStat value={CROPS.length} label={t("cropDoctor.statCrops")} />
                  <MiniStat value={highRisk} label={t("cropDoctor.statHighRisk")} />
                </div>
              </Card>

              <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
                <Chip active={crop === "All Crops"} onClick={() => setCrop("All Crops")}>
                  {t("cropDoctor.allCrops")}
                </Chip>
                {CROPS.map((c) => (
                  <Chip key={c} active={crop === c} onClick={() => setCrop(c)}>
                    {tCrop(c)}
                  </Chip>
                ))}
              </div>

              <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
                <Chip
                  active={severity === "All Levels"}
                  onClick={() => setSeverity("All Levels")}
                >
                  {t("cropDoctor.allLevels")}
                </Chip>
                {SEVERITIES.map((s) => (
                  <Chip
                    key={s}
                    active={severity === s}
                    onClick={() => setSeverity(s)}
                    color={severityStyle[s].color}
                  >
                    {tSeverity(s)}
                  </Chip>
                ))}
              </div>

              <p className="text-[13px] text-text-secondary">
                {t("cropDoctor.count", { n: filtered.length })}
              </p>

              <div className="space-y-2.5">
                {filtered.length === 0 ? (
                  <Card>
                    <EmptyState
                      icon={<Search size={28} />}
                      title={t("cropDoctor.noMatch")}
                      body={t("cropDoctor.noMatchBody")}
                    />
                  </Card>
                ) : (
                  filtered.map((d) => (
                    <DiseaseRow
                      key={d.slug}
                      disease={d}
                      view={tDisease(d)}
                      severityLabel={tSeverity(d.severity)}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function MiniStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl hairline surface px-3 py-3 text-center">
      <p className="text-[20px] font-bold leading-none">{value}</p>
      <p className="mt-1 text-[11px] text-text-muted">{label}</p>
    </div>
  );
}

function DiseaseRow({
  disease,
  view,
  severityLabel,
}: {
  disease: Disease;
  view: Disease;
  severityLabel: string;
}) {
  const s = severityStyle[disease.severity];
  const Icon =
    disease.severity === "Low"
      ? Leaf
      : disease.severity === "Medium"
        ? TriangleAlert
        : disease.severity === "High"
          ? Flame
          : ShieldAlert;

  return (
    <Link href={`/crop-doctor/${disease.slug}`} className="card flex items-center gap-3 p-3.5 transition hover:surface">
      <IconTile color={s.color} tint={s.bg} size={44}>
        <Icon size={21} />
      </IconTile>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-bold leading-tight">{view.name}</p>
        <div className="mt-1.5 flex gap-1.5">
          <Tag color="var(--green-bright)" tint="rgba(34,197,94,0.16)">
            {view.crop}
          </Tag>
          <Tag color={s.text} tint={s.bg}>
            {severityLabel}
          </Tag>
        </div>
        <p className="mt-1.5 text-[12px] text-text-secondary">
          {view.affectedPart}
        </p>
        <p className="truncate text-[12px] text-text-muted">{view.symptom}</p>
      </div>
      <ChevronRight size={18} className="shrink-0 text-text-muted" />
    </Link>
  );
}

type ScanState =
  | { status: "idle" }
  | { status: "analyzing"; image: string }
  | {
      status: "done";
      image: string;
      result: { slug: string; name: string; crop: string; severity: string; confidence: number; note: string };
    }
  | { status: "error"; message: string };

function ScanTab() {
  const { t, tCrop, lang } = useT();
  const cameraRef = useRef<HTMLInputElement>(null);
  const libraryRef = useRef<HTMLInputElement>(null);
  const addScan = useApp((s) => s.addScan);
  const scans = useApp((s) => s.scans);
  const [state, setState] = useState<ScanState>({ status: "idle" });

  async function handleFile(file: File | undefined) {
    if (!file) return;
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Could not read the image"));
      reader.readAsDataURL(file);
    });

    setState({ status: "analyzing", image: dataUrl });

    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });
      if (!res.ok) throw new Error("Analysis failed");
      const result = await res.json();
      setState({ status: "done", image: dataUrl, result });
      addScan({
        id: `scan-${Date.now()}`,
        diseaseSlug: result.slug,
        diseaseName: result.name,
        crop: result.crop,
        confidence: result.confidence,
        createdAt: new Date().toISOString(),
      });
    } catch {
      setState({
        status: "error",
        message: "Could not analyse this photo. Check your connection and try again.",
      });
    }
  }

  return (
    <div className="space-y-4">
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <input
        ref={libraryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {state.status === "idle" && (
        <div className="flex flex-col items-center justify-center py-16">
          <ScanFrame />
          <p className="mt-6 text-[14px] text-text-secondary">
            {t("cropDoctor.scanHint")}
          </p>
        </div>
      )}

      {state.status === "error" && (
        <Card className="border-red-400/30 bg-red-500/10">
          <p className="text-[14px] font-semibold text-red-400">
            {t("cropDoctor.scanFailed")}
          </p>
          <p className="mt-1 text-[13px] text-text-secondary">
            {t("cropDoctor.scanFailedBody")}
          </p>
        </Card>
      )}

      {(state.status === "analyzing" || state.status === "done") && (
        <Card className="p-0">
          <div className="relative h-56 w-full overflow-hidden rounded-t-[22px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={state.image}
              alt="Uploaded leaf"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-4">
            {state.status === "analyzing" ? (
              <div className="flex items-center gap-2 text-[14px] text-text-secondary">
                <Loader2 size={16} className="animate-spin text-green-bright" />
                {t("cropDoctor.analyzing")}
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <IconTile
                    color="var(--orange)"
                    tint="rgba(251,146,60,0.16)"
                    size={42}
                  >
                    <Flame size={20} />
                  </IconTile>
                  <div className="min-w-0 flex-1">
                    <p className="text-[16px] font-bold">{state.result.name}</p>
                    <div className="mt-1 flex gap-1.5">
                      <Tag color="var(--green-bright)" tint="rgba(34,197,94,0.16)">
                        {tCrop(state.result.crop)}
                      </Tag>
                      <Tag color="#c2410c" tint="rgba(251,146,60,0.16)">
                        {t("cropDoctor.match", { n: state.result.confidence })}
                      </Tag>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-[13px] leading-snug text-text-secondary">
                  {state.result.note}
                </p>
                <p className="mt-2 text-[12px] text-text-muted">
                  {t("cropDoctor.aiNote")}
                </p>
                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/crop-doctor/${state.result.slug}`}
                    className="flex-1 rounded-full bg-green-primary py-2.5 text-center text-[13px] font-bold text-white"
                  >
                    {t("cropDoctor.viewTreatment")}
                  </Link>
                  <button
                    type="button"
                    onClick={() => setState({ status: "idle" })}
                    className="flex items-center gap-1.5 rounded-full hairline surface px-4 text-[13px] font-semibold"
                  >
                    <RotateCcw size={14} /> {t("cropDoctor.rescan")}
                  </button>
                </div>
              </>
            )}
          </div>
        </Card>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => cameraRef.current?.click()}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-green-primary py-3.5 text-[15px] font-bold text-white shadow-glow transition hover:bg-green-dark"
        >
          <Camera size={18} /> {t("cropDoctor.camera")}
        </button>
        <button
          type="button"
          onClick={() => libraryRef.current?.click()}
          className="flex flex-1 items-center justify-center gap-2 rounded-full hairline surface py-3.5 text-[15px] font-semibold transition hover-surface"
        >
          <ImageIcon size={18} /> {t("cropDoctor.gallery")}
        </button>
      </div>

      {scans.length > 0 && (
        <section>
          <SectionLabel icon={<Stethoscope size={14} />}>
            {t("cropDoctor.recentScans")}
          </SectionLabel>
          <Card className="p-0">
            {scans.slice(0, 4).map((s, i) => (
              <Link
                key={s.id}
                href={`/crop-doctor/${s.diseaseSlug}`}
                className={`flex items-center justify-between px-4 py-3 ${
                  i > 0 ? "divider-t" : ""
                }`}
              >
                <div>
                  <p className="text-[14px] font-semibold">{s.diseaseName}</p>
                  <p className="text-[12px] text-text-muted">
                    {tCrop(s.crop)} ·{" "}
                    {new Date(s.createdAt).toLocaleDateString(
                      lang === "hi" ? "hi-IN" : "en-IN"
                    )}
                  </p>
                </div>
                <span className="text-[12px] font-semibold text-green-bright">
                  {s.confidence}%
                </span>
              </Link>
            ))}
          </Card>
        </section>
      )}
    </div>
  );
}

function ScanFrame() {
  const corner =
    "absolute h-8 w-8 border-green-primary";
  return (
    <div className="relative flex h-[120px] w-[120px] items-center justify-center">
      <span className={`${corner} left-0 top-0 rounded-tl-2xl border-l-[3px] border-t-[3px]`} />
      <span className={`${corner} right-0 top-0 rounded-tr-2xl border-r-[3px] border-t-[3px]`} />
      <span className={`${corner} bottom-0 left-0 rounded-bl-2xl border-b-[3px] border-l-[3px]`} />
      <span className={`${corner} bottom-0 right-0 rounded-br-2xl border-b-[3px] border-r-[3px]`} />
      <Camera size={44} className="text-green-primary" strokeWidth={2} />
    </div>
  );
}
