"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  IndianRupee,
  MapPin,
  Phone,
  Plane,
  ShieldCheck,
  Star,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import { Card, Chip, IconTile, PrimaryButton, SectionLabel } from "@/components/ui/primitives";
import { useApp } from "@/lib/store";
import { DRONE_OPERATORS, sprayEstimate } from "@/lib/seed/droneOperators";
import { rupees } from "@/lib/format";

export default function DroneSprayPage() {
  const router = useRouter();
  const profile = useApp((s) => s.profile);
  const bookings = useApp((s) => s.droneBookings);
  const addDroneBooking = useApp((s) => s.addDroneBooking);
  const [operatorId, setOperatorId] = useState(DRONE_OPERATORS[0].id);
  const [crop, setCrop] = useState(profile.crops[0] ?? "Rice");
  const [acres, setAcres] = useState(profile.farmSizeAcres);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [slot, setSlot] = useState(DRONE_OPERATORS[0].availableSlots[0]);
  const [booked, setBooked] = useState(false);
  const operator = DRONE_OPERATORS.find((item) => item.id === operatorId) ?? DRONE_OPERATORS[0];
  const estimate = useMemo(() => sprayEstimate(operator, acres), [operator, acres]);

  function selectOperator(id: string) {
    const next = DRONE_OPERATORS.find((item) => item.id === id) ?? DRONE_OPERATORS[0];
    setOperatorId(next.id);
    setSlot(next.availableSlots[0]);
  }

  function requestBooking() {
    addDroneBooking({
      operatorName: operator.name,
      crop,
      acres,
      date,
      slot,
      estimate: estimate.total,
    });
    setBooked(true);
  }

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex h-10 w-10 items-center justify-center rounded-full hairline surface"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-[26px] font-bold">Drone Spray</h1>
        </div>

        <Card className="overflow-hidden bg-gradient-to-br from-green-primary/20 to-transparent">
          <div className="flex items-start gap-3">
            <IconTile color="var(--green-bright)" tint="rgba(34,197,94,0.16)" size={48}>
              <Plane size={23} />
            </IconTile>
            <div>
              <p className="text-[18px] font-bold">Book pesticide spraying</p>
              <p className="mt-1 text-[13px] leading-snug text-text-secondary">
                Pick a verified operator, timing and area. Spraying is safest in calm
                morning or evening conditions.
              </p>
            </div>
          </div>
        </Card>

        {booked && (
          <Card className="border-green-primary/35 bg-green-primary/10">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 shrink-0 text-green-bright" size={21} />
              <div>
                <p className="text-[15px] font-bold text-green-bright">Booking request sent</p>
                <p className="mt-1 text-[13px] text-text-secondary">
                  {operator.name} will confirm the slot by phone. Your estimate is{" "}
                  {rupees(estimate.total)}.
                </p>
              </div>
            </div>
          </Card>
        )}

        <section>
          <SectionLabel icon={<Plane size={14} />}>Choose an operator</SectionLabel>
          <div className="space-y-2.5">
            {DRONE_OPERATORS.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => selectOperator(item.id)}
                className={`card flex w-full items-center gap-3 p-3.5 text-left transition ${
                  item.id === operator.id ? "ring-1 ring-green-primary/70" : ""
                }`}
              >
                <IconTile color="var(--blue-info)" tint="rgba(59,130,246,0.14)" size={40}>
                  <Plane size={19} />
                </IconTile>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold">{item.name}</p>
                  <p className="flex items-center gap-1 text-[12px] text-text-secondary">
                    <MapPin size={11} /> {item.serviceArea}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-amber">
                    <Star size={11} fill="currentColor" /> {item.rating} · {item.jobs} jobs
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[14px] font-bold text-green-bright">
                    {rupees(item.basePricePerAcre)}/ac
                  </p>
                  <a
                    href={`tel:${item.phone}`}
                    onClick={(event) => event.stopPropagation()}
                    className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-text-secondary"
                  >
                    <Phone size={11} /> Call
                  </a>
                </div>
              </button>
            ))}
          </div>
        </section>

        <Card className="space-y-4">
          <SectionLabel icon={<CalendarDays size={14} />}>Spray details</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            <label>
              <span className="mb-1.5 block text-[12px] font-semibold text-text-secondary">Crop</span>
              <select
                value={crop}
                onChange={(event) => setCrop(event.target.value)}
                className="field h-11 w-full rounded-xl px-3 text-[13px]"
              >
                {["Rice", "Wheat", "Cotton", "Maize", "Tomato", "Chili", "Grapes"].map(
                  (item) => <option key={item}>{item}</option>
                )}
              </select>
            </label>
            <label>
              <span className="mb-1.5 block text-[12px] font-semibold text-text-secondary">Area (acres)</span>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={acres}
                onChange={(event) => setAcres(Math.max(0.5, Number(event.target.value) || 0.5))}
                className="field h-11 w-full rounded-xl px-3 text-[13px]"
              />
            </label>
          </div>
          <label>
            <span className="mb-1.5 block text-[12px] font-semibold text-text-secondary">Preferred date</span>
            <input
              type="date"
              min={new Date().toISOString().slice(0, 10)}
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="field h-11 w-full rounded-xl px-3 text-[13px]"
            />
          </label>
          <div>
            <span className="mb-1.5 flex items-center gap-1.5 text-[12px] font-semibold text-text-secondary">
              <Clock3 size={13} /> Available slots
            </span>
            <div className="flex flex-wrap gap-2">
              {operator.availableSlots.map((item) => (
                <Chip key={item} active={slot === item} onClick={() => setSlot(item)}>
                  {item}
                </Chip>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <SectionLabel icon={<IndianRupee size={14} />}>Estimated cost</SectionLabel>
          <div className="space-y-2 text-[13px] text-text-secondary">
            <div className="flex justify-between">
              <span>Spray service · {acres.toFixed(1)} acres</span>
              <span>{rupees(estimate.service)}</span>
            </div>
            <div className="flex justify-between">
              <span>Travel charge</span>
              <span>{rupees(estimate.travel)}</span>
            </div>
            <div className="flex justify-between divider-t pt-2 text-[16px] font-bold text-text-primary">
              <span>Estimated total</span>
              <span className="text-green-bright">{rupees(estimate.total)}</span>
            </div>
          </div>
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber/10 px-3 py-2 text-[11.5px] text-amber">
            <ShieldCheck size={15} className="mt-0.5 shrink-0" />
            Estimate only. Final price and pesticide suitability are confirmed by the operator
            after field inspection.
          </div>
        </Card>

        <PrimaryButton onClick={requestBooking}>
          Request {date} · {slot} <ChevronRight size={17} />
        </PrimaryButton>

        {bookings.length > 0 && (
          <p className="text-center text-[12px] text-text-muted">
            {bookings.length} spray request{bookings.length > 1 ? "s" : ""} saved on this device.
          </p>
        )}
      </div>
    </AppShell>
  );
}
