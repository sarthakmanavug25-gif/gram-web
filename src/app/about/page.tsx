"use client";

import Link from "next/link";
import { Camera, CloudSun, IndianRupee, Sprout } from "lucide-react";
import MarketingShell from "@/components/MarketingShell";
import { Card, IconTile } from "@/components/ui/primitives";
import { DISEASES, CROPS } from "@/lib/seed/diseases";
import { useT } from "@/lib/i18n";

export default function AboutPage() {
  const { t } = useT();
  return (
    <MarketingShell>
      <div className="mx-auto w-full max-w-site space-y-6 px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("about.title")}
        </h1>

        <Card className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-primary/15 text-green-bright">
            <Sprout size={28} />
          </div>
          <p className="text-[20px] font-bold">{t("app.name")}</p>
          <p className="mt-1 text-[13px] text-text-secondary">{t("about.tagline")}</p>
        </Card>

        <div className="grid gap-3 sm:grid-cols-3">
          <Card className="flex items-center gap-3">
            <IconTile color="var(--green-primary)" tint="rgba(34,197,94,0.14)" size={40}>
              <Camera size={18} />
            </IconTile>
            <div>
              <p className="text-[18px] font-bold">{DISEASES.length}</p>
              <p className="text-[12px] text-text-secondary">{t("about.diseases")}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3">
            <IconTile color="var(--amber)" tint="rgba(245,158,11,0.14)" size={40}>
              <CloudSun size={18} />
            </IconTile>
            <div>
              <p className="text-[18px] font-bold">{CROPS.length}</p>
              <p className="text-[12px] text-text-secondary">{t("about.crops")}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3">
            <IconTile color="var(--blue-info)" tint="rgba(59,130,246,0.14)" size={40}>
              <IndianRupee size={18} />
            </IconTile>
            <div>
              <p className="text-[18px] font-bold">2</p>
              <p className="text-[12px] text-text-secondary">{t("about.langs")}</p>
            </div>
          </Card>
        </div>

        <p className="max-w-2xl text-[14px] leading-relaxed text-text-secondary">
          {t("about.body")}
        </p>

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
