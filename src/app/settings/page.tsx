"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Check, Loader2, MapPin } from "lucide-react";
import AppShell from "@/components/AppShell";
import { Card, Chip, PrimaryButton, SectionLabel } from "@/components/ui/primitives";
import { useApp } from "@/lib/store";
import { saveProfile } from "@/lib/repo";
import { SEASONS } from "@/lib/seed/reference";
import { EXPENSE_CROPS } from "@/lib/seed/categories";

const LOCATIONS = [
  { name: "Nashik, Maharashtra", latitude: 19.9975, longitude: 73.7898 },
  { name: "Ludhiana, Punjab", latitude: 30.901, longitude: 75.8573 },
  { name: "Guntur, Andhra Pradesh", latitude: 16.3067, longitude: 80.4365 },
  { name: "Indore, Madhya Pradesh", latitude: 22.7196, longitude: 75.8577 },
  { name: "Hisar, Haryana", latitude: 29.1492, longitude: 75.7217 },
  { name: "Coimbatore, Tamil Nadu", latitude: 11.0168, longitude: 76.9558 },
];

export default function SettingsPage() {
  return (
    <AppShell>
      <SettingsContent />
    </AppShell>
  );
}

function SettingsContent() {
  const router = useRouter();
  const profile = useApp((s) => s.profile);
  const [name, setName] = useState(profile.name);
  const [acres, setAcres] = useState(String(profile.farmSizeAcres));
  const [budget, setBudget] = useState(String(profile.monthlyBudget));
  const [season, setSeason] = useState(profile.season);
  const [crops, setCrops] = useState<string[]>(profile.crops);
  const [location, setLocation] = useState(profile.locationName);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function toggleCrop(c: string) {
    setCrops((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  async function save() {
    setSaving(true);
    const loc = LOCATIONS.find((l) => l.name === location) ?? LOCATIONS[0];
    await saveProfile({
      name: name.trim() || "Farmer",
      farmSizeAcres: Math.max(0.1, Number(acres) || 1),
      monthlyBudget: Math.max(0, Number(budget) || 0),
      season,
      crops,
      locationName: loc.name,
      latitude: loc.latitude,
      longitude: loc.longitude,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06]"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-[26px] font-bold">Settings</h1>
      </div>

      <Card className="space-y-4">
        <Field label="Name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-[15px] outline-none focus:border-green-primary/50"
          />
        </Field>

        <Field label="Phone (read-only)">
          <input
            value={profile.phone || "Guest session"}
            readOnly
            className="h-12 w-full cursor-not-allowed rounded-2xl border border-white/8 bg-white/[0.03] px-4 text-[15px] text-text-muted outline-none"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Farm size (acres)">
            <input
              value={acres}
              onChange={(e) => setAcres(e.target.value.replace(/[^\d.]/g, ""))}
              inputMode="decimal"
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-[15px] outline-none focus:border-green-primary/50"
            />
          </Field>
          <Field label="Monthly budget (₹)">
            <input
              value={budget}
              onChange={(e) => setBudget(e.target.value.replace(/[^\d]/g, ""))}
              inputMode="numeric"
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-[15px] outline-none focus:border-green-primary/50"
            />
          </Field>
        </div>
      </Card>

      <Card>
        <SectionLabel>Primary crops</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {EXPENSE_CROPS.map((c) => (
            <Chip key={c} active={crops.includes(c)} onClick={() => toggleCrop(c)}>
              {c}
            </Chip>
          ))}
        </div>
      </Card>

      <Card>
        <SectionLabel>Season</SectionLabel>
        <div className="flex gap-2">
          {SEASONS.map((s) => (
            <Chip key={s} active={season === s} onClick={() => setSeason(s)}>
              {s}
            </Chip>
          ))}
        </div>
      </Card>

      <Card>
        <SectionLabel icon={<MapPin size={14} />} color="var(--blue-info)">
          Location for weather
        </SectionLabel>
        <div className="flex flex-wrap gap-2">
          {LOCATIONS.map((l) => (
            <Chip
              key={l.name}
              active={location === l.name}
              onClick={() => setLocation(l.name)}
              color="var(--blue-info)"
            >
              {l.name.split(",")[0]}
            </Chip>
          ))}
        </div>
        <p className="mt-2 text-[12px] text-text-muted">
          The advisor also uses browser geolocation when you allow it.
        </p>
      </Card>

      <PrimaryButton onClick={save} disabled={saving}>
        {saving ? (
          <Loader2 size={17} className="animate-spin" />
        ) : saved ? (
          <Check size={17} />
        ) : null}
        {saved ? "Saved" : "Save changes"}
      </PrimaryButton>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1.5 text-[12px] font-semibold text-text-secondary">{label}</p>
      {children}
    </div>
  );
}
