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
  MSP_PRICES,
  PRIORITIES,
  SEASON_CROPS,
} from "@/lib/seed/reference";
import { DISEASES } from "@/lib/seed/diseases";
import { greeting, isThisMonth, rupees, shortDate, todayLong } from "@/lib/format";
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

  const tip = FIELD_TIPS[new Date().getDate() % FIELD_TIPS.length];
  const recent = expenses.slice(0, 3);

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="Home"
        action={
          <Link href="/settings" aria-label="Settings">
            <HeaderIconButton label="Settings">
              <Settings size={18} />
            </HeaderIconButton>
          </Link>
        }
      />

      <Card>
        <SectionLabel icon={<Sparkles size={14} />}>GramConnect</SectionLabel>
        <h2 className="text-[24px] font-bold leading-tight">
          {greeting()}, {profile.name}!
        </h2>
        <p className="mt-1 text-[13px] text-text-secondary">{todayLong()}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <MiniPill label={profile.season} tint="rgba(34,197,94,0.14)" color="#4ade80" />
          <MiniPill
            label={`${profile.farmSizeAcres.toFixed(1)} ac`}
            tint="rgba(59,130,246,0.14)"
            color="#93c5fd"
          />
          <MiniPill
            label={`${DISEASES.length} guides`}
            tint="rgba(245,158,11,0.14)"
            color="#fcd34d"
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
                {weather.condition}
              </p>
              <p className="mt-0.5 text-[12px] text-text-muted">
                Rain {weather.rainChance}% · Humidity {weather.humidity}%
              </p>
            </div>
            <Link
              href="/advisor"
              className="shrink-0 rounded-full bg-green-primary px-3.5 py-2 text-[13px] font-bold text-white transition hover:bg-green-dark"
            >
              Advisor
            </Link>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-2.5">
        <StatPill
          icon={<Droplets size={15} />}
          value={`${sprinklerPercent}%`}
          label="Auto sprinkler"
          color="var(--blue-info)"
        />
        <StatPill
          icon={<IndianRupee size={15} />}
          value={rupees(monthSpend, { compact: true })}
          label="This month"
          color="var(--green-primary)"
        />
        <StatPill
          icon={<Users size={15} />}
          value="12"
          label="Buyers"
          color="var(--purple-labor)"
        />
      </div>

      <section>
        <SectionLabel icon={<Bell size={14} />} color="var(--amber)">
          Today&apos;s Priorities
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
                    {p.title}
                  </p>
                  <p className="mt-0.5 text-[13px] leading-snug text-text-secondary">
                    {p.body}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <SectionLabel icon={<LayoutGrid size={14} />}>Quick Actions</SectionLabel>
        <div className="grid grid-cols-2 gap-2.5">
          <QuickAction
            href="/crop-doctor"
            icon={<Camera size={20} />}
            label="Crop Doctor"
            color="var(--green-primary)"
            tint="rgba(34,197,94,0.14)"
          />
          <QuickAction
            href="/advisor"
            icon={<CloudSun size={20} />}
            label="Weather"
            color="var(--orange)"
            tint="rgba(251,146,60,0.14)"
          />
          <QuickAction
            href="/expenses"
            icon={<IndianRupee size={20} />}
            label="Expenses"
            color="var(--amber)"
            tint="rgba(245,158,11,0.14)"
          />
          <QuickAction
            href="/market"
            icon={<ShoppingCart size={20} />}
            label="Market"
            color="var(--blue-info)"
            tint="rgba(59,130,246,0.14)"
          />
        </div>
      </section>

      <section>
        <SectionLabel icon={<Sparkles size={14} />} color="var(--blue-info)">
          {profile.season} crops to grow
        </SectionLabel>
        <div className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1">
          {SEASON_CROPS.map((c) => (
            <div
              key={c.name}
              className="card w-[190px] shrink-0 p-3.5"
            >
              <div className="flex items-center gap-2">
                <span className="text-[20px]">{c.emoji}</span>
                <p className="text-[15px] font-bold">{c.name}</p>
              </div>
              <p className="mt-1 text-[12px] text-text-secondary">{c.window}</p>
              <div className="mt-2.5 flex gap-1.5">
                <Tag color="#fdba74" tint="rgba(251,146,60,0.14)">
                  {c.avgTemp}
                </Tag>
                <Tag color="#93c5fd" tint="rgba(59,130,246,0.14)">
                  {c.rainfall}
                </Tag>
              </div>
              <p className="mt-2.5 text-[12px] leading-snug text-text-muted">
                {c.note}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-1.5 text-[12px] text-text-muted">
          Avg 31°C · 165 mm rain this month
        </p>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <SectionLabel icon={<Store size={14} />} color="var(--green-bright)">
            MSP Reference 2024-25
          </SectionLabel>
          <span className="pb-2 text-[11px] text-text-muted">Govt. of India</span>
        </div>
        <Card className="p-0">
          {MSP_PRICES.map((m, i) => (
            <div
              key={m.crop}
              className={`flex items-center justify-between px-4 py-3 ${
                i > 0 ? "border-t border-white/[0.06]" : ""
              }`}
            >
              <span className="text-[14px] font-medium">{m.crop}</span>
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
            className="flex items-center justify-center gap-1.5 border-t border-white/[0.06] py-3 text-[13px] font-semibold text-green-bright"
          >
            Compare mandi buyers <ArrowRight size={14} />
          </Link>
        </Card>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <SectionLabel icon={<IndianRupee size={14} />}>
            Recent Expenses
          </SectionLabel>
          <Link
            href="/expenses"
            className="pb-2 text-[12px] font-semibold text-green-bright"
          >
            See all
          </Link>
        </div>
        <Card className="p-0">
          {recent.length === 0 ? (
            <p className="px-4 py-6 text-center text-[13px] text-text-secondary">
              No expenses yet. Add your first entry from the Expenses tab.
            </p>
          ) : (
            recent.map((e, i) => {
              const meta = categoryMeta(e.category);
              return (
                <Link
                  href="/expenses"
                  key={e.id}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    i > 0 ? "border-t border-white/[0.06]" : ""
                  }`}
                >
                  <IconTile color={meta.color} tint={meta.tint} size={36}>
                    <CategoryIcon name={meta.icon} size={17} />
                  </IconTile>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold">
                      {e.category}
                    </p>
                    <p className="text-[12px] text-text-muted">
                      {e.crop} · {shortDate(e.date)}
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
            Today&apos;s Field Tip
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
    <Link href={href} className="card flex items-center gap-3 p-4 transition hover:bg-white/[0.04]">
      <IconTile color={color} tint={tint} size={40}>
        {icon}
      </IconTile>
      <span className="text-[14px] font-semibold">{label}</span>
    </Link>
  );
}
