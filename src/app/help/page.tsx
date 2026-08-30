"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, MessageCircle, Phone, Sprout } from "lucide-react";
import AppShell from "@/components/AppShell";
import { Card, IconTile, SectionLabel } from "@/components/ui/primitives";
import { useT, type StringKey } from "@/lib/i18n";

const FAQS: { q: StringKey; a: StringKey }[] = [
  { q: "help.q1", a: "help.a1" },
  { q: "help.q2", a: "help.a2" },
  { q: "help.q3", a: "help.a3" },
  { q: "help.q4", a: "help.a4" },
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
  const { t } = useT();
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
        <h1 className="text-[26px] font-bold">{t("help.title")}</h1>
      </div>

      <Card className="flex items-center gap-3">
        <IconTile color="var(--green-primary)" tint="rgba(34,197,94,0.14)" size={42}>
          <Phone size={20} />
        </IconTile>
        <div className="flex-1">
          <p className="text-[14px] font-semibold">{t("help.kisanCall")}</p>
          <p className="text-[12px] text-text-secondary">{t("help.kisanCallSub")}</p>
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
          {t("help.chatNote")}
        </p>
      </Card>

      <SectionLabel icon={<Sprout size={14} />}>{t("help.faq")}</SectionLabel>
      <div className="space-y-2.5">
        {FAQS.map((f) => (
          <Card key={f.q}>
            <p className="text-[14px] font-semibold">{t(f.q)}</p>
            <p className="mt-1 text-[13px] leading-snug text-text-secondary">
              {t(f.a)}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
