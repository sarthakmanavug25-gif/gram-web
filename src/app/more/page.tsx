"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  BellRing,
  ChevronRight,
  CircleHelp,
  Database,
  Info,
  Map,
  Languages,
  LogOut,
  Moon,
  Store,
  Sun,
  User,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import ScreenHeader from "@/components/ScreenHeader";
import { Card, IconTile } from "@/components/ui/primitives";
import { useApp } from "@/lib/store";
import { signOut } from "@/lib/repo";
import { supabaseConfigured } from "@/lib/supabase/client";
import { useT } from "@/lib/i18n";

export default function MorePage() {
  return (
    <AppShell>
      <MoreContent />
    </AppShell>
  );
}

function MoreContent() {
  const router = useRouter();
  const profile = useApp((s) => s.profile);
  const language = useApp((s) => s.language);
  const setLanguage = useApp((s) => s.setLanguage);
  const theme = useApp((s) => s.theme);
  const setTheme = useApp((s) => s.setTheme);
  const seedDemoData = useApp((s) => s.seedDemoData);
  const replayGuide = useApp((s) => s.replayGuide);
  const { t } = useT();
  const [alerts, setAlerts] = useState(true);
  const [notifications, setNotifications] = useState(true);

  async function handleLogout() {
    await signOut();
    router.replace("/login");
  }

  return (
    <div className="space-y-4">
      <ScreenHeader title={t("more.title")} />

      <Card className="flex items-center gap-3">
        <IconTile color="var(--green-primary)" tint="rgba(34,197,94,0.14)" size={48}>
          <User size={22} />
        </IconTile>
        <div className="min-w-0 flex-1">
          <p className="text-[16px] font-bold">{profile.name}</p>
          <p className="text-[13px] text-text-secondary">
            {profile.phone || t("common.guest")} ·{" "}
            {t("common.acres", { n: profile.farmSizeAcres.toFixed(1) })}
          </p>
        </div>
        <Link
          href="/settings"
          className="rounded-full hairline surface px-3 py-1.5 text-[12px] font-semibold"
        >
          {t("common.edit")}
        </Link>
      </Card>

      <Card className="p-0">
        <Row href="/settings" icon={<User size={18} />} label={t("more.profile")} />
        <Row href="/market" icon={<Store size={18} />} label={t("more.marketPrices")} />
        <ToggleRow
          icon={<BellRing size={18} />}
          label={t("more.weatherAlerts")}
          value={alerts}
          onChange={setAlerts}
        />

        <div className="flex items-center gap-3 divider-t px-4 py-3.5">
          <IconTile color="var(--blue-info)" tint="rgba(59,130,246,0.14)" size={36}>
            <Languages size={18} />
          </IconTile>
          <span className="flex-1 text-[14px] font-medium">{t("more.language")}</span>
          <div className="flex rounded-full hairline surface p-0.5">
            {(["en", "hi"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLanguage(l)}
                className={`rounded-full px-3 py-1 text-[12px] font-semibold transition ${
                  language === l
                    ? "bg-green-primary text-white"
                    : "text-text-secondary"
                }`}
              >
                {l === "en" ? "English" : "हिंदी"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 divider-t px-4 py-3.5">
          <IconTile color="var(--amber)" tint="rgba(245,158,11,0.14)" size={36}>
            {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
          </IconTile>
          <span className="flex-1 text-[14px] font-medium">{t("more.theme")}</span>
          <div className="flex rounded-full hairline surface p-0.5">
            {(["light", "dark"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setTheme(mode)}
                className={`flex items-center gap-1 rounded-full px-3 py-1 text-[12px] font-semibold transition ${
                  theme === mode
                    ? "bg-green-primary text-white"
                    : "text-text-secondary"
                }`}
              >
                {mode === "light" ? <Sun size={13} /> : <Moon size={13} />}
                {mode === "light" ? t("more.themeLight") : t("more.themeDark")}
              </button>
            ))}
          </div>
        </div>

        <ToggleRow
          icon={<BellRing size={18} />}
          label={t("more.notifications")}
          value={notifications}
          onChange={setNotifications}
        />
        <Row href="/help" icon={<CircleHelp size={18} />} label={t("more.help")} />
        <Row href="/about" icon={<Info size={18} />} label={t("more.about")} />
      </Card>

      <Card className="flex items-center gap-3">
        <IconTile color="var(--blue-info)" tint="rgba(59,130,246,0.14)" size={36}>
          <Map size={18} />
        </IconTile>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold">{t("more.guide")}</p>
          <p className="text-[12px] text-text-secondary">{t("more.guideSub")}</p>
        </div>
        <button
          type="button"
          onClick={replayGuide}
          className="rounded-full hairline surface px-3 py-1.5 text-[12px] font-semibold"
        >
          {t("more.guideAction")}
        </button>
      </Card>

      <Card className="flex items-center gap-3">
        <IconTile color="var(--amber)" tint="rgba(245,158,11,0.14)" size={36}>
          <Database size={18} />
        </IconTile>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold">{t("more.demoData")}</p>
          <p className="text-[12px] text-text-secondary">
            {supabaseConfigured ? t("more.demoCloud") : t("more.demoLocal")}
          </p>
        </div>
        <button
          type="button"
          onClick={seedDemoData}
          className="rounded-full hairline surface px-3 py-1.5 text-[12px] font-semibold"
        >
          {t("more.reseed")}
        </button>
      </Card>

      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-red-400/25 bg-red-500/10 py-3.5 text-[15px] font-bold text-red-500 transition hover:bg-red-500/20"
      >
        <LogOut size={18} /> {t("more.logout")}
      </button>
    </div>
  );
}

function Row({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3.5 [&:not(:first-child)]:divider-t"
    >
      <IconTile color="var(--green-primary)" tint="rgba(34,197,94,0.14)" size={36}>
        {icon}
      </IconTile>
      <span className="flex-1 text-[14px] font-medium">{label}</span>
      <ChevronRight size={16} className="text-text-muted" />
    </Link>
  );
}

function ToggleRow({
  icon,
  label,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 divider-t px-4 py-3.5">
      <IconTile color="var(--amber)" tint="rgba(245,158,11,0.14)" size={36}>
        {icon}
      </IconTile>
      <span className="flex-1 text-[14px] font-medium">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={label}
        onClick={() => onChange(!value)}
        className={`h-6 w-11 rounded-full p-0.5 transition ${
          value ? "bg-green-primary" : "surface-2"
        }`}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-white shadow transition ${
            value ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}
