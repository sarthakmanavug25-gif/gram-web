"use client";

import Link from "next/link";
import { MessageCircle, Phone, Sprout } from "lucide-react";
import MarketingShell from "@/components/MarketingShell";
import { Card, IconTile, SectionLabel } from "@/components/ui/primitives";
import { useT, type StringKey } from "@/lib/i18n";

const FAQS: { q: StringKey; a: StringKey }[] = [
  { q: "help.q1", a: "help.a1" },
  { q: "help.q2", a: "help.a2" },
  { q: "help.q3", a: "help.a3" },
  { q: "help.q4", a: "help.a4" },
];

export default function HelpPage() {
  const { t } = useT();
  return (
    <MarketingShell>
      <div className="mx-auto w-full max-w-site space-y-6 px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("help.title")}
        </h1>

        <section>
          <SectionLabel icon={<Sprout size={14} />}>{t("help.faq")}</SectionLabel>
          <div className="space-y-3">
            {FAQS.map((item) => (
              <Card key={item.q}>
                <p className="text-[14px] font-semibold">{t(item.q)}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-text-secondary">
                  {t(item.a)}
                </p>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="flex items-center gap-3">
            <IconTile color="var(--green-primary)" tint="rgba(34,197,94,0.14)" size={40}>
              <MessageCircle size={18} />
            </IconTile>
            <div>
              <p className="text-[14px] font-semibold">{t("help.chat")}</p>
              <p className="text-[12px] text-text-secondary">{t("help.chatBody")}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3">
            <IconTile color="var(--blue-info)" tint="rgba(59,130,246,0.14)" size={40}>
              <Phone size={18} />
            </IconTile>
            <div>
              <p className="text-[14px] font-semibold">{t("help.phone")}</p>
              <p className="text-[12px] text-text-secondary">{t("help.phoneBody")}</p>
            </div>
          </Card>
        </div>

        <Link
          href="/"
          className="inline-flex rounded-full bg-green-primary px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-green-dark"
        >
          {t("common.back")}
        </Link>
      </div>
    </MarketingShell>
  );
}
