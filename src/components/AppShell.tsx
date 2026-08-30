"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import BottomNav from "./BottomNav";
import ChatAssistant from "./ChatAssistant";
import { useApp } from "@/lib/store";
import { restoreSession } from "@/lib/repo";
import { Skeleton } from "./ui/primitives";

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
      <main className="app-bg min-h-dvh">
        <div className="mx-auto w-full max-w-phone space-y-4 px-4 pt-8">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </main>
    );
  }

  return (
    <div className="app-bg min-h-dvh">
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="mx-auto w-full max-w-phone px-4 pb-32 pt-3"
      >
        {children}
      </motion.main>
      <ChatAssistant />
      <BottomNav />
    </div>
  );
}
