"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  IndianRupee,
  Plane,
  Smartphone,
  Star,
} from "lucide-react";
import MarketingShell from "@/components/MarketingShell";
import { DRONE_OPERATORS, sprayEstimate } from "@/lib/seed/droneOperators";
import { useT } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import { rupees } from "@/lib/format";
import { MotionLink } from "@/components/MotionButton";

export default function DroneServicePage() {
  const { t } = useT();
  const profile = useApp((s) => s.profile);
  const [operatorId, setOperatorId] = useState(DRONE_OPERATORS[0].id);
  const [acres, setAcres] = useState(profile.farmSizeAcres || 2);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [slot, setSlot] = useState(DRONE_OPERATORS[0].availableSlots[0]);
  const [crop, setCrop] = useState(profile.crops[0] ?? "Rice");

  const operator =
    DRONE_OPERATORS.find((o) => o.id === operatorId) ?? DRONE_OPERATORS[0];
  const estimate = useMemo(
    () => sprayEstimate(operator, acres),
    [operator, acres]
  );

  function selectOperator(id: string) {
    const next = DRONE_OPERATORS.find((o) => o.id === id) ?? DRONE_OPERATORS[0];
    setOperatorId(next.id);
    setSlot(next.availableSlots[0]);
  }

  return (
    <MarketingShell>
      <div className="mx-auto w-full max-w-site px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-primary/12 text-green-bright">
            <Plane size={20} />
          </div>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("droneWeb.title")}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">
            {t("droneWeb.sub")}
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-3">
            <h2 className="text-[15px] font-bold text-text-primary">
              {t("droneWeb.pickOperator")}
            </h2>
            {DRONE_OPERATORS.map((op) => (
              <button
                key={op.id}
                type="button"
                onClick={() => selectOperator(op.id)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  operatorId === op.id
                    ? "border-green-primary bg-green-primary/8"
                    : "border-[var(--hairline-edge)] bg-[var(--surface-2)]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-text-primary">{op.name}</p>
                    <p className="mt-1 text-[12px] text-text-muted">
                      {op.serviceArea}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber/15 px-2 py-1 text-[12px] font-semibold text-amber">
                    <Star size={12} /> {op.rating}
                  </span>
                </div>
                <p className="mt-2 text-[13px] text-text-secondary">
                  {t("droneWeb.rate", {
                    rate: rupees(op.basePricePerAcre),
                    travel: rupees(op.travelFee),
                  })}
                </p>
              </button>
            ))}
          </section>

          <section className="glass rounded-[28px] p-5 sm:p-6">
            <h2 className="text-[16px] font-bold text-text-primary">
              {t("droneWeb.plan")}
            </h2>
            <p className="mt-1 text-[13px] text-text-secondary">
              {t("droneWeb.planSub")}
            </p>

            <label className="mt-4 block text-[12px] font-semibold text-text-muted">
              {t("droneWeb.crop")}
              <input
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[var(--hairline-edge)] bg-[var(--input-bg)] px-3 py-2.5 text-[14px] text-text-primary outline-none focus:border-green-primary"
              />
            </label>

            <label className="mt-3 block text-[12px] font-semibold text-text-muted">
              {t("droneWeb.acres")}
              <input
                type="number"
                min={0.5}
                step={0.5}
                value={acres}
                onChange={(e) => setAcres(Number(e.target.value) || 0.5)}
                className="mt-1.5 w-full rounded-xl border border-[var(--hairline-edge)] bg-[var(--input-bg)] px-3 py-2.5 text-[14px] text-text-primary outline-none focus:border-green-primary"
              />
            </label>

            <label className="mt-3 block text-[12px] font-semibold text-text-muted">
              <span className="inline-flex items-center gap-1">
                <CalendarDays size={13} /> {t("droneWeb.date")}
              </span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[var(--hairline-edge)] bg-[var(--input-bg)] px-3 py-2.5 text-[14px] text-text-primary outline-none focus:border-green-primary"
              />
            </label>

            <p className="mt-4 text-[12px] font-semibold text-text-muted">
              <span className="inline-flex items-center gap-1">
                <Clock3 size={13} /> {t("droneWeb.slot")}
              </span>
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {operator.availableSlots.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSlot(s)}
                  className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${
                    slot === s
                      ? "bg-green-primary text-white"
                      : "border border-[var(--hairline-edge)] text-text-secondary"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-green-primary/10 p-4">
              <p className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide text-green-bright">
                <IndianRupee size={13} /> {t("droneWeb.estimate")}
              </p>
              <p className="mt-2 font-display text-3xl font-bold text-text-primary">
                {rupees(estimate.total)}
              </p>
              <p className="mt-1 text-[12px] text-text-secondary">
                {t("droneWeb.estimateBreak", {
                  service: rupees(estimate.service),
                  travel: rupees(estimate.travel),
                })}
              </p>
              <p className="mt-2 text-[12px] text-text-muted">
                {operator.name} · {date} · {slot} · {crop} · {acres} ac
              </p>
            </div>

            <MotionLink
              href="/#get-app"
              className="mt-5 flex w-full items-center justify-center gap-2 !rounded-full bg-green-primary !px-5 !py-3.5 text-[15px] font-semibold text-white"
            >
              <Smartphone size={18} />
              {t("droneWeb.appCta")}
            </MotionLink>
            <p className="mt-3 text-center text-[12px] text-text-muted">
              {t("droneWeb.appNote")}{" "}
              <Link href="/drone-spray" className="font-medium text-green-bright underline">
                {t("droneWeb.appLink")}
              </Link>
            </p>
          </section>
        </div>
      </div>
    </MarketingShell>
  );
}
