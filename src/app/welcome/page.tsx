"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Apple, Phone } from "lucide-react";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";

export default function WelcomePage() {
  const router = useRouter();
  const setSession = useApp((s) => s.setSession);
  const { t } = useT();
  const markWelcomeSeen = useApp((s) => s.markWelcomeSeen);

  function continueAsGuest() {
    const { profile } = useApp.getState();
    setSession({ id: "guest", name: profile.name, phone: profile.phone });
    markWelcomeSeen();
    router.replace("/");
  }

  return (
    <main className="welcome-bg flex min-h-dvh flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-phone text-center"
      >
        <h1 className="text-[38px] font-bold leading-tight tracking-tight">
          {t("welcome.title")}
        </h1>
        <p className="mx-auto mt-3 max-w-[300px] text-[15px] leading-relaxed text-text-secondary">
          {t("welcome.subtitle")}
        </p>

        <button
          type="button"
          onClick={continueAsGuest}
          className="mx-auto mt-8 block h-[52px] w-[200px] rounded-full bg-[#dbe9f7] text-[16px] font-semibold text-[#0b1220] transition hover:bg-white"
        >
          {t("welcome.continue")}
        </button>

        <div className="my-6 flex items-center justify-center gap-3 text-[13px] text-text-muted">
          <span className="h-px w-16 bg-white/10" />
          {t("welcome.or")}
          <span className="h-px w-16 bg-white/10" />
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            disabled
            title={t("common.comingSoon")}
            className="flex h-11 cursor-not-allowed items-center gap-2 rounded-full bg-[#c9d7e6]/70 px-4 text-[14px] font-semibold text-[#0b1220]/70"
          >
            <Apple size={16} />
            {t("welcome.apple")}
          </button>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="flex h-11 items-center gap-2 rounded-full bg-[#c9d7e6] px-4 text-[14px] font-semibold text-[#0b1220] transition hover:bg-white"
          >
            <Phone size={16} />
            {t("welcome.phone")}
          </button>
        </div>

        <p className="mt-8 text-[12px] text-text-muted">
          {t("welcome.note")}
        </p>
      </motion.div>
    </main>
  );
}
