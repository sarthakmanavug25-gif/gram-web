"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, CloudSun, IndianRupee, Sprout } from "lucide-react";
import AppShell from "@/components/AppShell";
import { Card, IconTile } from "@/components/ui/primitives";
import { DISEASES, CROPS } from "@/lib/seed/diseases";
import { useT } from "@/lib/i18n";

export default function AboutPage() {
  return (
    <AppShell>
      <AboutContent />
    </AppShell>
  );
}

function AboutContent() {
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
        <h1 className="text-[26px] font-bold">{t("about.title")}</h1>
      </div>

      <Card className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-primary/15 text-green-bright">
          <Sprout size={28} />
        </div>
        <p className="text-[20px] font-bold">{t("app.name")}</p>
        <p className="mt-1 text-[13px] text-text-secondary">{t("about.tagline")}</p>
        <p className="mt-3 text-[12px] text-text-muted">{t("about.version")}</p>
      </Card>

      <Card className="space-y-3">
        <Feature
          icon={<Camera size={18} />}
          title={t("nav.cropDoctor")}
          body={t("about.cropDoctorBody", {
            n: DISEASES.length,
            crops: CROPS.length,
          })}
        />
        <Feature
          icon={<CloudSun size={18} />}
          title={t("advisor.title")}
          body={t("about.advisorBody")}
        />
        <Feature
          icon={<IndianRupee size={18} />}
          title={t("expenses.title")}
          body={t("about.expensesBody")}
        />
      </Card>

      <Card>
        <p className="text-[13px] leading-relaxed text-text-secondary">
          {t("about.dataNote")}
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
