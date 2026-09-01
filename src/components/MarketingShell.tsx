"use client";

import { ReactNode, useEffect } from "react";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import GramPointsRewardBubble from "./GramPointsRewardBubble";
import { useApp } from "@/lib/store";

export default function MarketingShell({ children }: { children: ReactNode }) {
  const theme = useApp((s) => s.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <div className="site-bg flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <GramPointsRewardBubble />
    </div>
  );
}
