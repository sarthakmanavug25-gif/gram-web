"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Loader2, ShieldCheck, Smartphone, Sprout } from "lucide-react";
import {
  saveProfile,
  sendPhoneOtp,
  signIn,
  signUp,
  verifyPhoneOtp,
} from "@/lib/repo";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { supabaseConfigured } from "@/lib/supabase/client";
import FarmIllustration from "@/components/FarmIllustration";
import OtpInput from "@/components/OtpInput";

type Method = "password" | "otp";
type Mode = "login" | "signup";
type OtpStep = "phone" | "code" | "name";

const RESEND_SECONDS = 30;

export default function LoginPage() {
  const { t } = useT();
  const [method, setMethod] = useState<Method>("otp");

  return (
    <main className="auth-bg flex min-h-dvh flex-col items-center px-5 pb-10 pt-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <FarmIllustration />

        <div className="mb-1 mt-3 flex items-center justify-center gap-2">
          <Sprout size={26} className="text-green-bright" />
          <span className="text-[26px] font-bold text-white drop-shadow">
            {t("app.name")}
          </span>
        </div>
        <p className="mb-5 text-center text-[13px] text-white/70">
          {t("login.tagline")}
        </p>

        <div className="mb-4 flex rounded-full border border-white/15 bg-black/25 p-1">
          {(["otp", "password"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMethod(m)}
              className={`flex-1 rounded-full py-2 text-[13.5px] font-semibold transition ${
                method === m
                  ? "bg-green-primary text-white shadow-glow"
                  : "text-white/70"
              }`}
            >
              {m === "otp" ? t("login.tabOtp") : t("login.tabPassword")}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={method}
            initial={{ opacity: 0, x: method === "otp" ? -12 : 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {method === "otp" ? <OtpFlow /> : <PasswordFlow />}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </main>
  );
}

function OtpFlow() {
  const router = useRouter();
  const { t } = useT();
  const markWelcomeSeen = useApp((s) => s.markWelcomeSeen);

  const [step, setStep] = useState<OtpStep>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [demoCode, setDemoCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  function startCountdown() {
    setSeconds(RESEND_SECONDS);
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1 && timer.current) clearInterval(timer.current);
        return Math.max(0, s - 1);
      });
    }, 1000);
  }

  async function sendOtp() {
    if (!/^\d{10}$/.test(phone)) {
      setError(t("login.err.phone"));
      return;
    }
    setError("");
    setBusy(true);
    if (!supabaseConfigured) {
      const generated = String(Math.floor(100000 + Math.random() * 900000));
      window.setTimeout(() => {
        setDemoCode(generated);
        setCode("");
        setStep("code");
        setBusy(false);
        startCountdown();
      }, 450);
      return;
    }
    const result = await sendPhoneOtp(phone);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setDemoCode("");
    setCode("");
    setStep("code");
    startCountdown();
  }

  async function verify(entered: string) {
    if (entered.length < 6) {
      setError(t("login.err.otpShort"));
      return;
    }
    if (!supabaseConfigured) {
      if (entered !== demoCode) {
        setError(t("login.err.otpWrong"));
        return;
      }
      setError("");
      setStep("name");
      return;
    }
    setError("");
    setBusy(true);
    const result = await verifyPhoneOtp(phone, entered);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    if (result.requiresName) {
      setStep("name");
      return;
    }
    markWelcomeSeen();
    router.replace("/");
  }

  async function finishSignup() {
    if (name.trim().length < 2) {
      setError(t("login.err.name"));
      return;
    }
    setBusy(true);
    if (supabaseConfigured) {
      await saveProfile({ name: name.trim(), phone });
    } else {
      useApp.getState().demoOtpSignIn(phone, name.trim());
    }
    setBusy(false);
    markWelcomeSeen();
    router.replace("/");
  }

  return (
    <div className="space-y-3">
      {step === "phone" && (
        <>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0d100d] px-3">
            <span className="text-[15px] font-semibold text-white/60">+91</span>
            <span className="h-6 w-px bg-white/15" />
            <input
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/[^\d]/g, "").slice(0, 10))
              }
              placeholder={t("login.phone")}
              inputMode="numeric"
              autoComplete="tel"
              className="h-[52px] flex-1 bg-transparent text-[15px] text-white outline-none"
            />
            <Smartphone size={17} className="text-white/35" />
          </div>

          {error && <ErrorNote>{error}</ErrorNote>}

          <button
            type="button"
            onClick={sendOtp}
            disabled={busy}
            className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-green-primary text-[16px] font-bold text-white shadow-glow transition hover:bg-green-dark disabled:opacity-60"
          >
            {busy && <Loader2 size={18} className="animate-spin" />}
            {t("login.sendOtp")}
          </button>
          <p className="text-center text-[12px] text-white/55">
            {t("login.otpHint")}
          </p>
        </>
      )}

      {step === "code" && (
        <>
          <button
            type="button"
            onClick={() => {
              setStep("phone");
              setError("");
            }}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-white/75"
          >
            <ArrowLeft size={15} /> {t("login.changeNumber")}
          </button>

          <div className="flex items-center gap-2 rounded-xl border border-green-primary/30 bg-green-primary/10 px-3 py-2.5">
            <ShieldCheck size={17} className="shrink-0 text-green-bright" />
            <p className="text-[12.5px] text-white/85">
              {t("login.otpSentTo", { phone: `+91 ${phone}` })}
            </p>
          </div>

          <OtpInput value={code} onChange={setCode} onComplete={verify} />

          {!supabaseConfigured && (
            <p className="rounded-xl border border-amber/30 bg-amber/10 px-3 py-2 text-center text-[12.5px] text-amber">
              {t("login.demoOtp", { code: demoCode })}
            </p>
          )}

          {error && <ErrorNote>{error}</ErrorNote>}

          <button
            type="button"
            onClick={() => verify(code)}
            disabled={busy || code.length !== 6}
            className="flex h-[52px] w-full items-center justify-center rounded-xl bg-green-primary text-[16px] font-bold text-white shadow-glow transition hover:bg-green-dark"
          >
            {busy && <Loader2 size={18} className="animate-spin" />}
            {t("login.verify")}
          </button>

          <button
            type="button"
            disabled={seconds > 0}
            onClick={sendOtp}
            className="w-full text-center text-[13px] font-medium text-white/70 disabled:text-white/40"
          >
            {seconds > 0
              ? t("login.resendIn", { seconds })
              : t("login.resend")}
          </button>
        </>
      )}

      {step === "name" && (
        <>
          <div className="flex items-center gap-2 rounded-xl border border-green-primary/30 bg-green-primary/10 px-3 py-2.5">
            <ShieldCheck size={17} className="shrink-0 text-green-bright" />
            <p className="text-[12.5px] text-white/85">{t("login.otpVerified")}</p>
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("login.name")}
            autoComplete="name"
            className="h-[52px] w-full rounded-xl border border-white/10 bg-[#0d100d] px-4 text-[15px] text-white outline-none focus:border-green-primary/60"
          />
          {error && <ErrorNote>{error}</ErrorNote>}
          <button
            type="button"
            onClick={() => void finishSignup()}
            disabled={busy}
            className="flex h-[52px] w-full items-center justify-center rounded-xl bg-green-primary text-[16px] font-bold text-white shadow-glow transition hover:bg-green-dark"
          >
            {busy && <Loader2 size={18} className="animate-spin" />}
            {t("login.continue")}
          </button>
        </>
      )}
    </div>
  );
}

function PasswordFlow() {
  const router = useRouter();
  const { t } = useT();
  const markWelcomeSeen = useApp((s) => s.markWelcomeSeen);
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
    <>
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

        {error && <ErrorNote>{error}</ErrorNote>}

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

      <p className="mt-5 text-center text-[12px] text-white/50">
        {t("login.note")}
      </p>
    </>
  );
}

function ErrorNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl border border-red-400/30 bg-red-500/15 px-3 py-2 text-[13px] font-medium text-red-200">
      {children}
    </p>
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
        className="h-[52px] w-full rounded-xl border border-white/10 bg-[#0d100d] px-4 text-[15px] text-white outline-none transition focus:border-green-primary/60"
      />
    </label>
  );
}
