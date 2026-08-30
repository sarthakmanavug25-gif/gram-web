"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Phone, Store, TrendingUp } from "lucide-react";
import AppShell from "@/components/AppShell";
import { Card, Chip, IconTile, SectionLabel, Tag } from "@/components/ui/primitives";
import { MSP_PRICES } from "@/lib/seed/reference";
import { useT } from "@/lib/i18n";

type Buyer = {
  name: string;
  mandi: string;
  crop: string;
  price: number;
  distanceKm: number;
  phone: string;
};

const BUYERS: Buyer[] = [
  { name: "Shree Balaji Traders", mandi: "Nashik APMC", crop: "Paddy", price: 2410, distanceKm: 8, phone: "1800-180-1551" },
  { name: "Kisan Agro Mart", mandi: "Lasalgaon", crop: "Paddy", price: 2365, distanceKm: 21, phone: "1800-180-1551" },
  { name: "Annapurna Rice Mill", mandi: "Niphad", crop: "Paddy", price: 2340, distanceKm: 27, phone: "1800-180-1551" },
  { name: "Godavari Grain Co.", mandi: "Nashik APMC", crop: "Wheat", price: 2380, distanceKm: 8, phone: "1800-180-1551" },
  { name: "Maratha Cotton Ginning", mandi: "Yeola", crop: "Cotton", price: 7290, distanceKm: 45, phone: "1800-180-1551" },
  { name: "Sahyadri Feeds", mandi: "Sinnar", crop: "Maize", price: 2290, distanceKm: 30, phone: "1800-180-1551" },
];

export default function MarketPage() {
  return (
    <AppShell>
      <MarketContent />
    </AppShell>
  );
}

function MarketContent() {
  const router = useRouter();
  const { t, tCrop } = useT();
  const [crop, setCrop] = useState("All");
  const crops = ["All", ...Array.from(new Set(BUYERS.map((b) => b.crop)))];
  const rows = BUYERS.filter((b) => crop === "All" || b.crop === crop).sort(
    (a, b) => b.price - a.price
  );

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
        <h1 className="text-[26px] font-bold">{t("market.title")}</h1>
      </div>

      <Card>
        <SectionLabel icon={<Store size={14} />}>{t("home.msp")}</SectionLabel>
        <div className="space-y-2.5">
          {MSP_PRICES.map((m) => (
            <div key={m.crop} className="flex items-center justify-between">
              <span className="text-[14px]">{tCrop(m.crop)}</span>
              <span className="flex items-center gap-2">
                <span className="text-[14px] font-bold text-green-bright">
                  ₹{m.price.toLocaleString("en-IN")}/{m.unit}
                </span>
                <Tag color="var(--green-bright)" tint="rgba(34,197,94,0.14)">
                  +{m.change}%
                </Tag>
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[12px] text-text-muted">
          {t("market.mspNote")}
        </p>
      </Card>

      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {crops.map((c) => (
          <Chip key={c} active={crop === c} onClick={() => setCrop(c)}>
            {c === "All" ? t("expenses.all") : tCrop(c)}
          </Chip>
        ))}
      </div>

      <SectionLabel icon={<TrendingUp size={14} />} color="var(--blue-info)">
        {t("market.buyers")}
      </SectionLabel>

      <div className="space-y-2.5">
        {rows.map((b) => (
          <Card key={b.name} className="flex items-center gap-3">
            <IconTile color="var(--blue-info)" tint="rgba(59,130,246,0.14)" size={42}>
              <Store size={20} />
            </IconTile>
            <div className="min-w-0 flex-1">
              <p className="text-[14.5px] font-bold">{b.name}</p>
              <p className="flex items-center gap-1 text-[12px] text-text-secondary">
                <MapPin size={12} /> {b.mandi} · {b.distanceKm} km
              </p>
              <div className="mt-1.5 flex gap-1.5">
                <Tag color="var(--green-bright)" tint="rgba(34,197,94,0.14)">
                  {tCrop(b.crop)}
                </Tag>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[15px] font-bold text-green-bright">
                ₹{b.price.toLocaleString("en-IN")}
              </p>
              <a
                href={`tel:${b.phone}`}
                className="mt-1 inline-flex items-center gap-1 rounded-full hairline surface px-2.5 py-1 text-[11px] font-semibold"
              >
                <Phone size={11} /> {t("market.call")}
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
