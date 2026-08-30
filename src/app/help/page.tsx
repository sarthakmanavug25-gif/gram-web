"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, MessageCircle, Phone, Sprout } from "lucide-react";
import AppShell from "@/components/AppShell";
import { Card, IconTile, SectionLabel } from "@/components/ui/primitives";

const FAQS = [
  {
    q: "How do I scan a crop?",
    a: "Open Crop Doctor, stay on the Scan tab and tap Camera to take a leaf photo, or Library to pick an existing one. You get the closest disease match with treatment steps.",
  },
  {
    q: "Where does the weather come from?",
    a: "Live readings come from Open-Meteo for your saved location, refined by browser geolocation when you allow it.",
  },
  {
    q: "How is auto sprinkler calculated?",
    a: "Temperature, humidity, wind and rain chance are combined into a runtime demand percentage. Switch the AUTOMATIC pill off on the Advisor page to set it yourself.",
  },
  {
    q: "Is my expense data private?",
    a: "Without Supabase keys everything stays in this browser. With Supabase connected, row level security limits every row to your own account.",
  },
];

export default function HelpPage() {
  return (
    <AppShell>
      <HelpContent />
    </AppShell>
  );
}

function HelpContent() {
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
        <h1 className="text-[26px] font-bold">Help & Support</h1>
      </div>

      <Card className="flex items-center gap-3">
        <IconTile color="var(--green-primary)" tint="rgba(34,197,94,0.14)" size={42}>
          <Phone size={20} />
        </IconTile>
        <div className="flex-1">
          <p className="text-[14px] font-semibold">Kisan Call Centre</p>
          <p className="text-[12px] text-text-secondary">
            Free farm advice in your language, 6 am - 10 pm
          </p>
        </div>
        <a
          href="tel:18001801551"
          className="rounded-full bg-green-primary px-3 py-1.5 text-[12px] font-bold text-white"
        >
          1800-180-1551
        </a>
      </Card>

      <Card className="flex items-center gap-3">
        <IconTile color="var(--blue-info)" tint="rgba(59,130,246,0.14)" size={42}>
          <MessageCircle size={20} />
        </IconTile>
        <p className="text-[13px] text-text-secondary">
          Tap the green chat bubble on any screen to ask the in-app assistant in
          English, हिंदी or Hinglish.
        </p>
      </Card>

      <SectionLabel icon={<Sprout size={14} />}>Common questions</SectionLabel>
      <div className="space-y-2.5">
        {FAQS.map((f) => (
          <Card key={f.q}>
            <p className="text-[14px] font-semibold">{f.q}</p>
            <p className="mt-1 text-[13px] leading-snug text-text-secondary">{f.a}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
