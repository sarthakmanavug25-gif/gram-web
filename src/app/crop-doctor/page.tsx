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
      <ScreenHeader title="Crop Doctor" />

      {tab === "Diseases" && (
        <div className="relative">
          <Search
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search disease, crop, or symptoms"
            className="h-[46px] w-full rounded-full border border-white/8 bg-white/[0.05] pl-10 pr-4 text-[14px] outline-none focus:border-green-primary/50"
          />
        </div>
      )}

      <SegmentedControl options={TABS} value={tab} onChange={setTab} />

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
                      Disease Library
                    </SectionLabel>
                    <h2 className="max-w-[220px] text-[20px] font-bold leading-tight">
                      Identify symptoms and act early
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
                  <MiniStat value={DISEASES.length} label="Diseases" />
                  <MiniStat value={CROPS.length} label="Crops" />
                  <MiniStat value={highRisk} label="High Risk" />
                </div>
              </Card>

              <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
                <Chip active={crop === "All Crops"} onClick={() => setCrop("All Crops")}>
                  All Crops
                </Chip>
                {CROPS.map((c) => (
                  <Chip key={c} active={crop === c} onClick={() => setCrop(c)}>
                    {c}
                  </Chip>
                ))}
              </div>

              <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
                <Chip
                  active={severity === "All Levels"}
                  onClick={() => setSeverity("All Levels")}
                >
                  All Levels
                </Chip>
                {SEVERITIES.map((s) => (
                  <Chip
                    key={s}
                    active={severity === s}
                    onClick={() => setSeverity(s)}
                    color={severityStyle[s].color}
                  >
                    {s}
                  </Chip>
                ))}
              </div>

              <p className="text-[13px] text-text-secondary">
                {filtered.length} disease{filtered.length === 1 ? "" : "s"}
              </p>

              <div className="space-y-2.5">
                {filtered.length === 0 ? (
                  <Card>
                    <EmptyState
                      icon={<Search size={28} />}
                      title="No matching disease"
                      body="Try a different crop, severity level or search word — for example “blight” or “curl”."
                    />
                  </Card>
                ) : (
                  filtered.map((d) => <DiseaseRow key={d.slug} disease={d} />)
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
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.05] px-3 py-3 text-center">
      <p className="text-[20px] font-bold leading-none">{value}</p>
      <p className="mt-1 text-[11px] text-text-muted">{label}</p>
    </div>
  );
}

function DiseaseRow({ disease }: { disease: Disease }) {
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
    <Link href={`/crop-doctor/${disease.slug}`} className="card flex items-center gap-3 p-3.5 transition hover:bg-white/[0.04]">
      <IconTile color={s.color} tint={s.bg} size={44}>
        <Icon size={21} />
      </IconTile>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-bold leading-tight">{disease.name}</p>
        <div className="mt-1.5 flex gap-1.5">
          <Tag color="#4ade80" tint="rgba(34,197,94,0.16)">
            {disease.crop}
          </Tag>
          <Tag color={s.text} tint={s.bg}>
            {disease.severity}
          </Tag>
        </div>
        <p className="mt-1.5 text-[12px] text-text-secondary">
          {disease.affectedPart}
        </p>
        <p className="truncate text-[12px] text-text-muted">{disease.symptom}</p>
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
            Scan a leaf to check crop health
          </p>
        </div>
      )}

      {state.status === "error" && (
        <Card className="border-red-400/30 bg-red-500/10">
          <p className="text-[14px] font-semibold text-red-300">Scan failed</p>
          <p className="mt-1 text-[13px] text-text-secondary">{state.message}</p>
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
                Analyzing leaf…
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
                      <Tag color="#4ade80" tint="rgba(34,197,94,0.16)">
                        {state.result.crop}
                      </Tag>
                      <Tag color="#fdba74" tint="rgba(251,146,60,0.16)">
                        {state.result.confidence}% match
                      </Tag>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-[13px] leading-snug text-text-secondary">
                  {state.result.note}
                </p>
                <p className="mt-2 text-[12px] text-text-muted">
                  AI estimate — confirm with local agri officer.
                </p>
                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/crop-doctor/${state.result.slug}`}
                    className="flex-1 rounded-full bg-green-primary py-2.5 text-center text-[13px] font-bold text-white"
                  >
                    View treatment
                  </Link>
                  <button
                    type="button"
                    onClick={() => setState({ status: "idle" })}
                    className="flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.06] px-4 text-[13px] font-semibold"
                  >
                    <RotateCcw size={14} /> Rescan
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
          <Camera size={18} /> Camera
        </button>
        <button
          type="button"
          onClick={() => libraryRef.current?.click()}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.06] py-3.5 text-[15px] font-semibold transition hover:bg-white/10"
        >
          <ImageIcon size={18} /> Library
        </button>
      </div>

      {scans.length > 0 && (
        <section>
          <SectionLabel icon={<Stethoscope size={14} />}>Recent scans</SectionLabel>
          <Card className="p-0">
            {scans.slice(0, 4).map((s, i) => (
              <Link
                key={s.id}
                href={`/crop-doctor/${s.diseaseSlug}`}
                className={`flex items-center justify-between px-4 py-3 ${
                  i > 0 ? "border-t border-white/[0.06]" : ""
                }`}
              >
                <div>
                  <p className="text-[14px] font-semibold">{s.diseaseName}</p>
                  <p className="text-[12px] text-text-muted">
                    {s.crop} · {new Date(s.createdAt).toLocaleDateString("en-IN")}
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
