"use client";

import { useEffect, useMemo, useState } from "react";
import {

  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CalendarRange,
  CloudRain,
  CloudSun,
  Droplets,
  MapPin,
  RefreshCw,
  Sparkles,
  Thermometer,
  Wind,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import ScreenHeader, { HeaderIconButton } from "@/components/ScreenHeader";
import {
  Card,
  Chip,
  ProgressBar,
  SectionLabel,
  Skeleton,
  IconTile,
} from "@/components/ui/primitives";
import { useApp } from "@/lib/store";
import { useWeather } from "@/lib/useWeather";
import { sprinklerAdvice } from "@/lib/weather";
import { CLIMATE_CALENDAR, SEASON_ADVISORY } from "@/lib/seed/reference";
import { saveFarmStatus } from "@/lib/repo";
import { timeAgoLabel } from "@/lib/format";
import { useT } from "@/lib/i18n";

export default function AdvisorPage() {
  return (
    <AppShell>
      <AdvisorContent />
    </AppShell>
  );
}

function AdvisorContent() {
  const profile = useApp((s) => s.profile);
  const sprinklerAuto = useApp((s) => s.sprinklerAuto);
  const storedPercent = useApp((s) => s.sprinklerPercent);
  const setSprinkler = useApp((s) => s.setSprinkler);
  const toggleAuto = useApp((s) => s.toggleSprinklerAuto);
  const { weather, loading, updatedAt, refresh } = useWeather();
  const { t, lang, tCrop, tWeather } = useT();
  const [tipCrop, setTipCrop] = useState("All");

  const advice = useMemo(
    () => (weather ? sprinklerAdvice(weather) : null),
    [weather]
  );

  useEffect(() => {
    if (sprinklerAuto && advice) {
      setSprinkler(advice.percent);
      void saveFarmStatus(advice.percent, true);
    }
  }, [sprinklerAuto, advice, setSprinkler]);

  const percent = sprinklerAuto ? (advice?.percent ?? storedPercent) : storedPercent;
  const level = percent >= 65 ? "High" : percent >= 35 ? "Medium" : "Low";

  /** Dragging the slider hands control to the farmer. */
  function setManualPercent(value: number) {
    if (sprinklerAuto) toggleAuto();
    setSprinkler(value);
    void saveFarmStatus(value, false);
  }
  const levelColor =
    level === "High"
      ? "var(--orange)"
      : level === "Medium"
        ? "var(--amber)"
        : "var(--green-primary)";

  return (
    <div className="space-y-4">
      <ScreenHeader
        title={t("advisor.title")}
        action={
          <HeaderIconButton label={t("common.refresh")} onClick={() => refresh()}>
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
          </HeaderIconButton>
        }
      />

      <div>
        <SectionLabel icon={<Sparkles size={14} />}>
          {t("advisor.fieldWeather")}
        </SectionLabel>
        <p className="text-[17px] font-bold">{t("advisor.liveAdvisory")}</p>
        <div className="mt-1.5 flex items-center gap-1.5 text-[12px] text-text-secondary">
          <MapPin size={13} className="text-green-bright" />
          {profile.locationName}
          <span className="text-text-muted">
            ·{" "}
            {t("advisor.updated", {
              time: updatedAt ? timeAgoLabel(updatedAt, lang) : "—",
            })}
          </span>
        </div>
      </div>

      {loading || !weather ? (
        <Skeleton className="h-[190px] w-full" />
      ) : (
        <Card>
          <SectionLabel icon={<Thermometer size={14} />} color="var(--orange)">
            {t("advisor.liveWeather")}
          </SectionLabel>
          <div className="flex items-center gap-3">
            <IconTile color="var(--amber)" tint="rgba(245,158,11,0.14)" size={50}>
              <CloudSun size={26} />
            </IconTile>
            <div>
              <p className="text-[32px] font-bold leading-none">
                {weather.temperature}°C
              </p>
              <p className="mt-1 text-[13px] text-text-secondary">
                {tWeather(weather.condition)}
              </p>
            </div>
          </div>
          {weather.fallback && (
            <p className="mt-2 text-[11px] text-text-muted">
              {t("advisor.fallback")}
            </p>
          )}
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <WeatherStat
              icon={<Droplets size={15} />}
              label={t("advisor.humidity")}
              value={`${weather.humidity}%`}
              color="var(--blue-info)"
            />
            <WeatherStat
              icon={<CloudRain size={15} />}
              label={t("advisor.rainChance")}
              value={`${weather.rainChance}%`}
              color="#60a5fa"
            />
            <WeatherStat
              icon={<Wind size={15} />}
              label={t("advisor.wind")}
              value={`${weather.windKph} km/h`}
              color="var(--text-secondary)"
            />
            <WeatherStat
              icon={<Thermometer size={15} />}
              label={t("advisor.highLow")}
              value={`${weather.high}° / ${weather.low}°`}
              color="var(--orange)"
            />
          </div>
        </Card>
      )}

      <Card>
        <div className="flex items-start justify-between">
          <SectionLabel icon={<Droplets size={14} />}>
            {t("advisor.autoSprinkler")}
          </SectionLabel>
          <button
            type="button"
            onClick={() => {
              toggleAuto();
              void saveFarmStatus(percent, !sprinklerAuto);
            }}
            className={`rounded-full px-3 py-1 text-[11px] font-bold tracking-wide transition ${
              sprinklerAuto
                ? "bg-green-primary text-white"
                : "hairline surface text-text-secondary"
            }`}
          >
            {sprinklerAuto ? t("advisor.automatic") : t("advisor.manual")}
          </button>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-[38px] font-bold leading-none">{percent}%</span>
          <span className="text-[15px] font-semibold" style={{ color: levelColor }}>
            {t(`level.${level}` as "level.Low")}
          </span>
        </div>

        <div className="mt-3">
          <ProgressBar value={percent} color={levelColor} height={9} />
          <div className="mt-1 flex justify-between text-[11px] text-text-muted">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={percent}
          onChange={(e) => setManualPercent(Number(e.target.value))}
          className="mt-3 w-full accent-[var(--green-primary)]"
          aria-label={t("advisor.autoSprinkler")}
        />
        <p className="mt-1 text-[11px] text-text-muted">{t("advisor.sliderHint")}</p>

        <p className="mt-3 text-[13px] text-text-secondary">
          {t(
            percent >= 65
              ? "sprinkler.high"
              : percent >= 35
                ? "sprinkler.medium"
                : "sprinkler.low"
          )}
        </p>
        <ul className="mt-2 space-y-1.5">
          {(advice?.notes ?? []).map((n) => (
            <li
              key={n.key}
              className="flex items-center gap-2 text-[12.5px] text-text-secondary"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: n.color }}
              />
              {t(n.key, n.vars)}
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <SectionLabel icon={<CloudRain size={14} />} color="var(--blue-info)">
          {t("advisor.seasonAdvisory")}
        </SectionLabel>
        <p className="text-[15px] font-bold">{t("advisor.seasonHeadline")}</p>
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {SEASON_ADVISORY.crops.map((c) => (
            <Chip
              key={c}
              active={tipCrop === c}
              onClick={() => setTipCrop(c)}
              color="var(--blue-info)"
            >
              {c === "All" ? t("expenses.all") : tCrop(c)}
            </Chip>
          ))}
        </div>
        <ul className="mt-3 space-y-2">
          {(lang === "hi" ? SEASON_ADVISORY.tipsHi : SEASON_ADVISORY.tips)[
            tipCrop
          ].map((tip) => (
            <li key={tip} className="flex gap-2.5">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-info" />
              <span className="text-[13px] leading-snug text-text-secondary">
                {tip}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <SectionLabel icon={<CalendarRange size={14} />} color="var(--blue-info)">
          {t("advisor.climate")}
        </SectionLabel>
        <p className="mb-3 text-[12px] text-text-muted">{t("advisor.climateSub")}</p>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={CLIMATE_CALENDAR}
              margin={{ top: 4, right: 4, bottom: 0, left: -22 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#6b7280", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval={0}
              />
              <YAxis
                yAxisId="rain"
                tick={{ fill: "#6b7280", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="temp"
                orientation="right"
                tick={{ fill: "#6b7280", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip
                contentStyle={{
                  background: "#141714",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
                labelStyle={{ color: "#fff" }}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, color: "#9ca3af" }}
                iconType="circle"
              />
              <Bar
                yAxisId="rain"
                dataKey="rain"
                name={t("advisor.rainfall")}
                fill="var(--blue-info)"
                radius={[4, 4, 0, 0]}
                barSize={12}
              />
              <Line
                yAxisId="temp"
                type="monotone"
                dataKey="temp"
                name={t("advisor.avgTemp")}
                stroke="var(--orange)"
                strokeWidth={2.5}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 space-y-1.5">
          {CLIMATE_CALENDAR.map((m) => (
            <div key={m.month} className="flex items-center gap-3">
              <span className="w-8 text-[12px] text-text-muted">{m.month}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full surface-2">
                <div
                  className="h-full rounded-full bg-info"
                  style={{ width: `${(m.rain / 285) * 100}%` }}
                />
              </div>
              <span className="w-12 text-right text-[12px] font-semibold">
                {m.temp}°C
              </span>
              <span className="w-14 text-right text-[12px] text-text-muted">
                {m.rain} mm
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function WeatherStat({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl hairline surface px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
        <span style={{ color }}>{icon}</span>
        {label}
      </div>
      <p className="mt-1 text-[16px] font-bold">{value}</p>
    </div>
  );
}
