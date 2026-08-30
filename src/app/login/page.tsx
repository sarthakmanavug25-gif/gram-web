"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Sprout } from "lucide-react";
import { signIn, signUp } from "@/lib/repo";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";

type Mode = "login" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const markWelcomeSeen = useApp((s) => s.markWelcomeSeen);
  const { t } = useT();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
      setError(t("login.err.phone"));
      return;
    }
    if (password.length < 6) {
      setError(t("login.err.password"));
      return;
    }
    if (mode === "signup") {
      if (name.trim().length < 2) {
        setError(t("login.err.name"));
        return;
      }
      if (password !== confirm) {
        setError(t("login.err.mismatch"));
        return;
      }
    }

    setBusy(true);
    const result =
      mode === "login"
        ? await signIn(phone, password)
        : await signUp(name.trim(), phone, password);
    setBusy(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    markWelcomeSeen();
    router.replace("/");
  }

  return (
    <main className="auth-bg flex min-h-dvh flex-col items-center px-5 pb-10 pt-14">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-phone"
      >
        <div className="mb-8 flex items-center justify-center gap-2">
          <Sprout size={26} className="text-green-bright" />
          <span className="text-[26px] font-bold text-white drop-shadow">
            GramConnect
          </span>
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <Field
              label={t("login.name")}
              value={name}
              onChange={setName}
              placeholder={t("login.name")}
              autoComplete="name"
            />
          )}
          <Field
            label={t("login.phone")}
            value={phone}
            onChange={(v) => setPhone(v.replace(/[^\d]/g, "").slice(0, 10))}
            placeholder={t("login.phone")}
            inputMode="numeric"
            autoComplete="tel"
          />
          <Field
            label={t("login.password")}
            value={password}
            onChange={setPassword}
            placeholder={t("login.password")}
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
          {mode === "signup" && (
            <Field
              label={t("login.confirm")}
              value={confirm}
              onChange={setConfirm}
              placeholder={t("login.confirm")}
              type="password"
              autoComplete="new-password"
            />
          )}

          {error && (
            <p className="rounded-xl border border-red-400/30 bg-red-500/15 px-3 py-2 text-[13px] font-medium text-red-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-1 flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-green-primary text-[16px] font-bold text-white shadow-glow transition hover:bg-green-dark disabled:opacity-60"
          >
            {busy && <Loader2 size={18} className="animate-spin" />}
            {mode === "login" ? t("login.login") : t("login.create")}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError("");
          }}
          className="mt-4 w-full text-center text-[13px] font-medium text-[#4a9bff] underline-offset-2 hover:underline"
        >
          {mode === "login" ? t("login.toSignup") : t("login.toLogin")}
        </button>

        <p className="mt-6 text-center text-[12px] text-white/45">
          {t("login.note")}
        </p>
      </motion.div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  inputMode?: "numeric" | "text";
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        className="h-[52px] w-full rounded-xl hairline bg-[#0d100d] px-4 text-[15px] text-white outline-none transition focus:border-green-primary/60"
      />
    </label>
  );
}
