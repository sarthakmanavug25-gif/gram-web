"use client";

import { useEffect, useRef } from "react";

/** Six single-digit boxes that behave like the native OTP field on phones. */
export default function OtpInput({
  value,
  onChange,
  onComplete,
  autoFocus = true,
}: {
  value: string;
  onChange: (v: string) => void;
  onComplete?: (v: string) => void;
  autoFocus?: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  function setDigit(index: number, digit: string) {
    const clean = digit.replace(/\D/g, "");
    const next = value.split("");
    if (clean.length > 1) {
      const pasted = clean.slice(0, 6 - index).split("");
      pasted.forEach((d, i) => (next[index + i] = d));
      const joined = next.join("").slice(0, 6);
      onChange(joined);
      const focus = Math.min(index + pasted.length, 5);
      refs.current[focus]?.focus();
      if (joined.length === 6) onComplete?.(joined);
      return;
    }
    next[index] = clean;
    const joined = next.join("").slice(0, 6);
    onChange(joined);
    if (clean && index < 5) refs.current[index + 1]?.focus();
    if (joined.replace(/\s/g, "").length === 6) onComplete?.(joined);
  }

  return (
    <div className="flex justify-between gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={value[i] ?? ""}
          onChange={(e) => setDigit(i, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !value[i] && i > 0) {
              refs.current[i - 1]?.focus();
              const next = value.split("");
              next[i - 1] = "";
              onChange(next.join(""));
            }
          }}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          aria-label={`OTP digit ${i + 1}`}
          className="h-[54px] w-full rounded-xl border border-white/15 bg-[#0d100d] text-center text-[22px] font-bold text-white outline-none transition focus:border-green-primary focus:ring-2 focus:ring-green-primary/30"
        />
      ))}
    </div>
  );
}
