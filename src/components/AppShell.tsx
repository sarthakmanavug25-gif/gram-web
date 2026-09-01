"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import ChatAssistant from "./ChatAssistant";
import { useApp } from "@/lib/store";
import { restoreSession } from "@/lib/repo";
import { Skeleton } from "./ui/primitives";
import OnboardingGuide from "./OnboardingGuide";

export default function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useApp((s) => s.hydrated);
  const session = useApp((s) => s.session);
  const theme = useApp((s) => s.theme);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    (async () => {
      if (!useApp.getState().session) await restoreSession();
      if (cancelled) return;
      if (!useApp.getState().session) router.replace("/welcome");
      setChecked(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [hydrated, router]);

  if (!hydrated || !checked || !session) {
    return (
      <main className="site-bg min-h-dvh">
        <div className="mx-auto w-full max-w-site space-y-4 px-4 pt-10 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-40 w-full" />
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="site-bg flex min-h-dvh flex-col">
      <SiteHeader variant="app" />
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="mx-auto w-full max-w-site flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-8"
      >
        {children}
      </motion.main>
      <SiteFooter />
      <ChatAssistant />
      <OnboardingGuide />
    </div>
  );
}
