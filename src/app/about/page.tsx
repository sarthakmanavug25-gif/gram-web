"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, CloudSun, IndianRupee, Sprout } from "lucide-react";
import AppShell from "@/components/AppShell";
import { Card, IconTile } from "@/components/ui/primitives";
import { DISEASES, CROPS } from "@/lib/seed/diseases";

export default function AboutPage() {
  return (
    <AppShell>
      <AboutContent />
    </AppShell>
  );
}

function AboutContent() {
  const router = useRouter();
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
        <h1 className="text-[26px] font-bold">About</h1>
      </div>

      <Card className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-primary/15 text-green-bright">
          <Sprout size={28} />
        </div>
        <p className="text-[20px] font-bold">GramConnect</p>
        <p className="mt-1 text-[13px] text-text-secondary">
          A smart farming assistant for Indian farmers — disease guides, live
          weather advisory and a simple farm ledger in one place.
        </p>
        <p className="mt-3 text-[12px] text-text-muted">Version 1.0.0</p>
      </Card>

      <Card className="space-y-3">
        <Feature
          icon={<Camera size={18} />}
          title="Crop Doctor"
          body={`${DISEASES.length} disease guides across ${CROPS.length} crops, plus photo-based scanning.`}
        />
        <Feature
          icon={<CloudSun size={18} />}
          title="Smart Advisory"
          body="Live weather, an auto sprinkler recommendation and season-wise field tips."
        />
        <Feature
          icon={<IndianRupee size={18} />}
          title="Farm Expenses"
          body="Track spend by category and crop against a seasonal budget."
        />
      </Card>

      <Card>
        <p className="text-[13px] leading-relaxed text-text-secondary">
          Weather data from Open-Meteo. MSP figures from the Government of India
          2024-25 announcement. Disease information is for guidance only —
          confirm dosage with your local agriculture officer before spraying.
        </p>
      </Card>
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-3">
      <IconTile color="var(--green-primary)" tint="rgba(34,197,94,0.14)" size={38}>
        {icon}
      </IconTile>
      <div>
        <p className="text-[14px] font-semibold">{title}</p>
        <p className="text-[12.5px] text-text-secondary">{body}</p>
      </div>
    </div>
  );
}
