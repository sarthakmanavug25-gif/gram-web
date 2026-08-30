"use client";

import { useState } from "react";
import { ArrowLeft, CalendarDays, CheckCircle2, Sprout } from "lucide-react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { Card, Chip, IconTile, SectionLabel } from "@/components/ui/primitives";
import { CALENDAR_TASK_HI, CROP_CALENDAR } from "@/lib/seed/cropCalendar";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function CropCalendarPage() {
  const router = useRouter();
  const { t, lang, tCrop } = useT();
  const profile = useApp((s) => s.profile);
  const [crop, setCrop] = useState(profile.crops[0] ?? "Rice");
  const plan = CROP_CALENDAR.find((item) => item.crop === crop) ?? CROP_CALENDAR[0];
  const currentMonth = new Date().toLocaleString("en-US", { month: "short" });

  return (
    <AppShell>
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
          <h1 className="text-[26px] font-bold">{t("calendar.title")}</h1>
        </div>

        <Card className="flex items-center gap-3">
          <IconTile color="var(--green-primary)" tint="rgba(34,197,94,0.14)" size={44}>
            <CalendarDays size={21} />
          </IconTile>
          <div>
            <p className="text-[15px] font-bold">{t("calendar.plan")}</p>
            <p className="text-[12px] text-text-secondary">
              {t("calendar.planBody")}
            </p>
          </div>
        </Card>

        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
          {CROP_CALENDAR.map((item) => (
            <Chip
              key={item.crop}
              active={crop === item.crop}
              onClick={() => setCrop(item.crop)}
            >
              {item.emoji} {tCrop(item.crop)}
            </Chip>
          ))}
        </div>

        <Card>
          <SectionLabel icon={<Sprout size={14} />}>
            {plan.emoji} {tCrop(plan.crop)} · {plan.season}
          </SectionLabel>
          <div className="mt-4 grid grid-cols-6 gap-1">
            {MONTHS.map((month) => {
              const stage = plan.stages.find((item) => item.month === month);
              const isCurrent = month === currentMonth;
              return (
                <div key={month} className="text-center">
                  <span
                    className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${
                      isCurrent
                        ? "bg-green-primary text-white"
                        : stage
                          ? stage.kind === "harvest"
                            ? "bg-amber/20 text-amber"
                            : "bg-green-primary/15 text-green-bright"
                          : "surface text-text-muted"
                    }`}
                  >
                    {month[0]}
                  </span>
                  <p className="mt-1 text-[10px] text-text-muted">{month}</p>
                </div>
              );
            })}
          </div>
        </Card>

        <section>
          <SectionLabel>{t("calendar.checklist")}</SectionLabel>
          <div className="space-y-2.5">
            {plan.stages.map((stage) => {
              const active = stage.month === currentMonth;
              return (
                <Card key={`${stage.month}-${stage.task}`} className="flex items-center gap-3">
                  <IconTile
                    color={stage.kind === "harvest" ? "var(--amber)" : "var(--green-primary)"}
                    tint={stage.kind === "harvest" ? "rgba(245,158,11,0.14)" : "rgba(34,197,94,0.14)"}
                    size={38}
                  >
                    <CheckCircle2 size={18} />
                  </IconTile>
                  <div className="flex-1">
                    <p className="text-[14px] font-semibold">
                      {lang === "hi" ? CALENDAR_TASK_HI[stage.task] ?? stage.task : stage.task}
                    </p>
                    <p className="text-[12px] text-text-secondary">
                      {stage.month} {active ? `· ${t("calendar.now")}` : ""}
                    </p>
                  </div>
                  {active && (
                    <span className="rounded-full bg-green-primary/15 px-2 py-1 text-[11px] font-bold text-green-bright">
                      {t("calendar.thisMonth")}
                    </span>
                  )}
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
