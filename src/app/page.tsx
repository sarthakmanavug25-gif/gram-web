"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowRight,
  Bell,
  Bug,
  Camera,
  ChevronRight,
  CloudSun,
  Droplets,
  IndianRupee,
  LayoutGrid,
  Lightbulb,
  Settings,
  ShoppingCart,
  Sparkles,
  Store,
  Sun,
  Users,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import ScreenHeader, { HeaderIconButton } from "@/components/ScreenHeader";
import {
  Card,
  IconTile,
  SectionLabel,
  Skeleton,
  Tag,
} from "@/components/ui/primitives";
import { useApp } from "@/lib/store";
import { useWeather } from "@/lib/useWeather";
import { sprinklerAdvice } from "@/lib/weather";
import { categoryMeta } from "@/lib/seed/categories";
import {
  FIELD_TIPS,
  FIELD_TIPS_HI,
  MSP_PRICES,
  PRIORITIES,
  SEASON_CROPS,
} from "@/lib/seed/reference";
import { DISEASES } from "@/lib/seed/diseases";
import { greeting, isThisMonth, rupees, shortDate, todayLong } from "@/lib/format";
import { useT } from "@/lib/i18n";
import CategoryIcon from "@/components/CategoryIcon";

export default function HomePage() {
  return (
    <AppShell>
      <HomeContent />
    </AppShell>
  );
}

function HomeContent() {
  const profile = useApp((s) => s.profile);
  const expenses = useApp((s) => s.expenses);
  const sprinklerAuto = useApp((s) => s.sprinklerAuto);
  const storedSprinkler = useApp((s) => s.sprinklerPercent);
  const { weather, loading } = useWeather();
  const { t, lang, tCrop, tSeason, tCategory, tWeather } = useT();

  const monthSpend = useMemo(
    () =>
      expenses
        .filter((e) => isThisMonth(e.date))
        .reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  const sprinkler = weather ? sprinklerAdvice(weather) : null;
  const sprinklerPercent = sprinklerAuto
    ? (sprinkler?.percent ?? storedSprinkler)
    : storedSprinkler;

  const tips = lang === "hi" ? FIELD_TIPS_HI : FIELD_TIPS;
  const tip = tips[new Date().getDate() % tips.length];
  const recent = expenses.slice(0, 3);

  return (
    <div className="space-y-4">
      <ScreenHeader
        title={t("home.title")}
        action={
          <Link href="/settings" aria-label={t("common.settings")}>
            <HeaderIconButton label={t("common.settings")}>
              <Settings size={18} />
            </HeaderIconButton>
          </Link>
        }
      />

      <Card>
        <SectionLabel icon={<Sparkles size={14} />}>{t("app.name")}</SectionLabel>
        <h2 className="text-[24px] font-bold leading-tight">
          {greeting(t)}, {profile.name}!
        </h2>
        <p className="mt-1 text-[13px] text-text-secondary">
          {todayLong(new Date(), lang)}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <MiniPill
            label={tSeason(profile.season)}
            tint="rgba(34,197,94,0.14)"
            color="var(--green-bright)"
          />
          <MiniPill
            label={t("common.acres", { n: profile.farmSizeAcres.toFixed(1) })}
            tint="rgba(59,130,246,0.14)"
            color="#2563eb"
          />
          <MiniPill
            label={t("home.guides", { n: DISEASES.length })}
            tint="rgba(245,158,11,0.14)"
            color="#b45309"
          />
        </div>
      </Card>

      {loading || !weather ? (
        <Skeleton className="h-[104px] w-full" />
      ) : (
        <Card>
          <div className="flex items-center gap-3">
            <IconTile color="var(--amber)" tint="rgba(245,158,11,0.14)" size={46}>
              {weather.condition.toLowerCase().includes("clear") ? (
                <Sun size={24} />
              ) : (
                <CloudSun size={24} />
              )}
            </IconTile>
            <div className="min-w-0 flex-1">
              <p className="text-[26px] font-bold leading-none">
                {weather.temperature}°C
              </p>
              <p className="truncate text-[13px] text-text-secondary">
                {tWeather(weather.condition)}
              </p>
              <p className="mt-0.5 text-[12px] text-text-muted">
                {t("home.rainHumidity", {
                  rain: weather.rainChance,
                  humidity: weather.humidity,
                })}
              </p>
            </div>
            <Link
              href="/advisor"
              className="shrink-0 rounded-full bg-green-primary px-3.5 py-2 text-[13px] font-bold text-white transition hover:bg-green-dark"
            >
              {t("home.advisor")}
            </Link>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-2.5">
        <StatPill
          icon={<Droplets size={15} />}
          value={`${sprinklerPercent}%`}
          label={t("home.autoSprinkler")}
          color="var(--blue-info)"
        />
        <StatPill
          icon={<IndianRupee size={15} />}
          value={rupees(monthSpend, { compact: true })}
          label={t("home.thisMonth")}
          color="var(--green-primary)"
        />
        <StatPill
          icon={<Users size={15} />}
          value="12"
          label={t("home.buyers")}
          color="var(--purple-labor)"
        />
      </div>

      <section>
        <SectionLabel icon={<Bell size={14} />} color="var(--amber)">
          {t("home.priorities")}
        </SectionLabel>
        <div className="space-y-2.5">
          {PRIORITIES.map((p) => {
            const tone =
              p.tone === "warning"
                ? { color: "var(--amber)", tint: "rgba(245,158,11,0.14)" }
                : p.tone === "info"
                  ? { color: "var(--blue-info)", tint: "rgba(59,130,246,0.14)" }
                  : { color: "var(--green-primary)", tint: "rgba(34,197,94,0.14)" };
            const Icon = p.icon === "bug" ? Bug : p.icon === "droplet" ? Droplets : Sun;
            return (
              <Card key={p.id} className="flex items-start gap-3">
                <IconTile color={tone.color} tint={tone.tint} size={38}>
                  <Icon size={18} />
                </IconTile>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold" style={{ color: tone.color }}>
                    {lang === "hi" ? p.titleHi : p.title}
                  </p>
                  <p className="mt-0.5 text-[13px] leading-snug text-text-secondary">
                    {lang === "hi" ? p.bodyHi : p.body}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <SectionLabel icon={<LayoutGrid size={14} />}>
          {t("home.quickActions")}
        </SectionLabel>
        <div className="grid grid-cols-2 gap-2.5">
          <QuickAction
            href="/crop-doctor"
            icon={<Camera size={20} />}
            label={t("nav.cropDoctor")}
            color="var(--green-primary)"
            tint="rgba(34,197,94,0.14)"
          />
          <QuickAction
            href="/advisor"
            icon={<CloudSun size={20} />}
            label={t("home.weather")}
            color="var(--orange)"
            tint="rgba(251,146,60,0.14)"
          />
          <QuickAction
            href="/expenses"
            icon={<IndianRupee size={20} />}
            label={t("nav.expenses")}
            color="var(--amber)"
            tint="rgba(245,158,11,0.14)"
          />
          <QuickAction
            href="/market"
            icon={<ShoppingCart size={20} />}
            label={t("home.market")}
            color="var(--blue-info)"
            tint="rgba(59,130,246,0.14)"
          />
        </div>
      </section>

      <section>
        <SectionLabel icon={<Sparkles size={14} />} color="var(--blue-info)">
          {t("home.cropsToGrow", { season: tSeason(profile.season) })}
        </SectionLabel>
        <div className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1">
          {SEASON_CROPS.map((c) => (
            <div key={c.name} className="card w-[190px] shrink-0 p-3.5">
              <div className="flex items-center gap-2">
                <span className="text-[20px]">{c.emoji}</span>
                <p className="text-[15px] font-bold">{tCrop(c.name)}</p>
              </div>
              <p className="mt-1 text-[12px] text-text-secondary">
                {lang === "hi" ? c.windowHi : c.window}
              </p>
              <div className="mt-2.5 flex gap-1.5">
                <Tag color="#c2410c" tint="rgba(251,146,60,0.16)">
                  {c.avgTemp}
                </Tag>
                <Tag color="#1d4ed8" tint="rgba(59,130,246,0.16)">
                  {c.rainfall}
                </Tag>
              </div>
              <p className="mt-2.5 text-[12px] leading-snug text-text-muted">
                {lang === "hi" ? c.noteHi : c.note}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-1.5 text-[12px] text-text-muted">{t("home.climateLine")}</p>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <SectionLabel icon={<Store size={14} />} color="var(--green-bright)">
            {t("home.msp")}
          </SectionLabel>
          <span className="pb-2 text-[11px] text-text-muted">{t("home.govt")}</span>
        </div>
        <Card className="p-0">
          {MSP_PRICES.map((m, i) => (
            <div
              key={m.crop}
              className={`flex items-center justify-between px-4 py-3 ${
                i > 0 ? "divider-t" : ""
              }`}
            >
              <span className="text-[14px] font-medium">{tCrop(m.crop)}</span>
              <span className="flex items-baseline gap-2">
                <span className="text-[14px] font-bold text-green-bright">
                  ₹{m.price.toLocaleString("en-IN")}/{m.unit}
                </span>
                <span className="text-[11px] text-text-muted">+{m.change}%</span>
              </span>
            </div>
          ))}
          <Link
            href="/market"
            className="flex items-center justify-center gap-1.5 divider-t py-3 text-[13px] font-semibold text-green-bright"
          >
            {t("home.compareBuyers")} <ArrowRight size={14} />
          </Link>
        </Card>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <SectionLabel icon={<IndianRupee size={14} />}>
            {t("home.recentExpenses")}
          </SectionLabel>
          <Link
            href="/expenses"
            className="pb-2 text-[12px] font-semibold text-green-bright"
          >
            {t("common.seeAll")}
          </Link>
        </div>
        <Card className="p-0">
          {recent.length === 0 ? (
            <p className="px-4 py-6 text-center text-[13px] text-text-secondary">
              {t("home.noExpenses")}
            </p>
          ) : (
            recent.map((e, i) => {
              const meta = categoryMeta(e.category);
              return (
                <Link
                  href="/expenses"
                  key={e.id}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    i > 0 ? "divider-t" : ""
                  }`}
                >
                  <IconTile color={meta.color} tint={meta.tint} size={36}>
                    <CategoryIcon name={meta.icon} size={17} />
                  </IconTile>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold">
                      {tCategory(e.category)}
                    </p>
                    <p className="text-[12px] text-text-muted">
                      {tCrop(e.crop)} · {shortDate(e.date, lang)}
                    </p>
                  </div>
                  <span className="text-[14px] font-bold">{rupees(e.amount)}</span>
                  <ChevronRight size={16} className="text-text-muted" />
                </Link>
              );
            })
          )}
        </Card>
      </section>

      <Card className="flex items-start gap-3">
        <IconTile color="var(--amber)" tint="rgba(245,158,11,0.14)" size={38}>
          <Lightbulb size={18} />
        </IconTile>
        <div>
          <p className="text-[14px] font-semibold text-amber">
            {t("home.fieldTip")}
          </p>
          <p className="mt-0.5 text-[13px] leading-snug text-text-secondary">
            {tip}
          </p>
        </div>
      </Card>
    </div>
  );
}

function MiniPill({
  label,
  tint,
  color,
}: {
  label: string;
  tint: string;
  color: string;
}) {
  return (
    <span
      className="rounded-full px-2.5 py-1 text-[12px] font-semibold"
      style={{ backgroundColor: tint, color }}
    >
      {label}
    </span>
  );
}

function StatPill({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div className="card flex flex-col gap-1 p-3">
      <span style={{ color }}>{icon}</span>
      <span className="text-[17px] font-bold leading-none">{value}</span>
      <span className="text-[11px] text-text-muted">{label}</span>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  label,
  color,
  tint,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  color: string;
  tint: string;
}) {
  return (
    <Link href={href} className="card hover-surface flex items-center gap-3 p-4 transition">
      <IconTile color={color} tint={tint} size={40}>
        {icon}
      </IconTile>
      <span className="text-[14px] font-semibold">{label}</span>
    </Link>
  );
}
