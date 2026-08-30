"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowLeft, Camera, Check, Loader2, MapPin } from "lucide-react";
import AppShell from "@/components/AppShell";
import { Card, Chip, PrimaryButton, SectionLabel } from "@/components/ui/primitives";
import { useApp } from "@/lib/store";
import { saveProfile } from "@/lib/repo";
import { SEASONS } from "@/lib/seed/reference";
import { EXPENSE_CROPS } from "@/lib/seed/categories";
import { useT } from "@/lib/i18n";

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
  const { t, tCrop, tSeason } = useT();
  const [name, setName] = useState(profile.name);
  const [acres, setAcres] = useState(String(profile.farmSizeAcres));
  const [budget, setBudget] = useState(String(profile.monthlyBudget));
  const [season, setSeason] = useState(profile.season);
  const [crops, setCrops] = useState<string[]>(profile.crops);
  const [location, setLocation] = useState(profile.locationName);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const profilePhotoRef = useRef<HTMLInputElement>(null);
  const farmPhotoRef = useRef<HTMLInputElement>(null);

  function toggleCrop(c: string) {
    setCrops((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  function readPhoto(file: File | undefined, field: "profilePhoto" | "farmPhoto") {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => useApp.getState().updateProfile({ [field]: String(reader.result) });
    reader.readAsDataURL(file);
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
          aria-label={t("common.back")}
          className="flex h-10 w-10 items-center justify-center rounded-full hairline surface"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-[26px] font-bold">{t("settings.title")}</h1>
      </div>

      <Card className="space-y-4">
        <div className="flex gap-3">
          <input
            ref={profilePhotoRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => readPhoto(e.target.files?.[0], "profilePhoto")}
          />
          <input
            ref={farmPhotoRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => readPhoto(e.target.files?.[0], "farmPhoto")}
          />
          <button
            type="button"
            onClick={() => profilePhotoRef.current?.click()}
            className="relative flex h-[70px] w-[70px] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-green-primary/15 text-green-bright"
          >
            {profile.profilePhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.profilePhoto} alt="Farmer profile" className="h-full w-full object-cover" />
            ) : (
              <Camera size={22} />
            )}
          </button>
          <button
            type="button"
            onClick={() => farmPhotoRef.current?.click()}
            className="relative flex h-[70px] flex-1 items-center justify-center overflow-hidden rounded-2xl hairline surface text-[12px] font-semibold text-text-secondary"
          >
            {profile.farmPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.farmPhoto} alt="Farm" className="h-full w-full object-cover" />
            ) : (
              <span className="flex items-center gap-2">
                <Camera size={16} /> {t("settings.addFarmPhoto")}
              </span>
            )}
          </button>
        </div>
        <Field label={t("settings.name")}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 w-full rounded-2xl hairline surface px-4 text-[15px] outline-none focus:border-green-primary/50"
          />
        </Field>

        <Field label={t("settings.phone")}>
          <input
            value={profile.phone || t("common.guest")}
            readOnly
            className="h-12 w-full cursor-not-allowed rounded-2xl hairline surface px-4 text-[15px] text-text-muted outline-none"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label={t("settings.farmSize")}>
            <input
              value={acres}
              onChange={(e) => setAcres(e.target.value.replace(/[^\d.]/g, ""))}
              inputMode="decimal"
              className="h-12 w-full rounded-2xl hairline surface px-4 text-[15px] outline-none focus:border-green-primary/50"
            />
          </Field>
          <Field label={t("settings.budget")}>
            <input
              value={budget}
              onChange={(e) => setBudget(e.target.value.replace(/[^\d]/g, ""))}
              inputMode="numeric"
              className="h-12 w-full rounded-2xl hairline surface px-4 text-[15px] outline-none focus:border-green-primary/50"
            />
          </Field>
        </div>
      </Card>

      <Card>
        <SectionLabel>{t("settings.primaryCrops")}</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {EXPENSE_CROPS.map((c) => (
            <Chip key={c} active={crops.includes(c)} onClick={() => toggleCrop(c)}>
              {tCrop(c)}
            </Chip>
          ))}
        </div>
      </Card>

      <Card>
        <SectionLabel>{t("settings.season")}</SectionLabel>
        <div className="flex gap-2">
          {SEASONS.map((s) => (
            <Chip key={s} active={season === s} onClick={() => setSeason(s)}>
              {tSeason(s)}
            </Chip>
          ))}
        </div>
      </Card>

      <Card>
        <SectionLabel icon={<MapPin size={14} />} color="var(--blue-info)">
          {t("settings.location")}
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
          {t("settings.geoNote")}
        </p>
      </Card>

      <PrimaryButton onClick={save} disabled={saving}>
        {saving ? (
          <Loader2 size={17} className="animate-spin" />
        ) : saved ? (
          <Check size={17} />
        ) : null}
        {saved ? t("common.saved") : t("common.save")}
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
