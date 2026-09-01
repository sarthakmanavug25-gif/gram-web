"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Cloud,
  Headphones,
  Landmark,
  Leaf,
  Phone,
  RotateCcw,
  Smartphone,
  Sparkles,
  ShoppingCart,
  Wrench,
} from "lucide-react";
import {
  HELP_DESK,
  type HelpCategory,
  type HelpChoice,
} from "@/lib/seed/helpdesk";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { MotionButton, MotionLink } from "@/components/MotionButton";

type Result = NonNullable<HelpChoice["result"]>;

const ICONS: Record<HelpCategory["icon"], typeof Leaf> = {
  leaf: Leaf,
  cloud: Cloud,
  landmark: Landmark,
  wrench: Wrench,
  cart: ShoppingCart,
  phone: Phone,
  app: Smartphone,
};

export default function HelpDeskWizard() {
  const { t } = useT();
  const language = useApp((s) => s.language);
  const hi = language === "hi";

  const [category, setCategory] = useState<HelpCategory | null>(null);
  const [trail, setTrail] = useState<HelpChoice[]>([]);
  const [result, setResult] = useState<Result | null>(null);

  const currentChoices: HelpChoice[] =
    category === null
      ? []
      : trail.length === 0
        ? category.choices
        : (trail[trail.length - 1].next ?? []);

  function selectCategory(cat: HelpCategory) {
    setCategory(cat);
    setTrail([]);
    setResult(null);
  }

  function pick(choice: HelpChoice) {
    if (choice.next && choice.next.length > 0) {
      setTrail((prev) => [...prev, choice]);
      setResult(null);
      return;
    }
    if (choice.result) {
      setTrail((prev) => [...prev, choice]);
      setResult(choice.result);
    }
  }

  function goBack() {
    if (result) {
      setResult(null);
      setTrail((prev) => prev.slice(0, -1));
      return;
    }
    if (trail.length > 0) {
      setTrail((prev) => prev.slice(0, -1));
      return;
    }
    setCategory(null);
  }

  function restart() {
    setCategory(null);
    setTrail([]);
    setResult(null);
  }

  const crumbs = [
    ...(category ? [hi ? category.titleHi : category.title] : []),
    ...trail.map((c) => (hi ? c.labelHi : c.label)),
  ];

  return (
    <div className="mx-auto max-w-2xl">
      <div className="glass overflow-hidden rounded-[28px] p-5 sm:p-7">
        <div className="mb-5 flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-primary/12 text-green-bright">
            <Headphones className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-green-bright">
              {t("help.desk.badge")}
            </p>
            <h2 className="font-display text-2xl font-bold text-text-primary">
              {t("help.desk.title")}
            </h2>
            <p className="mt-1 text-sm text-text-secondary">{t("help.desk.sub")}</p>
          </div>
        </div>

        {crumbs.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {crumbs.map((label, i) => (
              <span
                key={`${label}-${i}`}
                className="rounded-full bg-green-primary/10 px-3 py-1 text-xs font-medium text-green-dark"
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {category === null && !result && (
          <>
            <p className="mb-4 text-base font-semibold text-text-primary sm:text-lg">
              {t("help.desk.pickTopic")}
            </p>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {HELP_DESK.map((cat) => {
                const Icon = ICONS[cat.icon];
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => selectCategory(cat)}
                    className="rounded-2xl border border-[var(--hairline-edge)] bg-[var(--surface-2)] px-4 py-3.5 text-left transition hover:border-green-primary/40 hover:bg-green-primary/8"
                  >
                    <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-green-primary/12 text-green-bright">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="block text-sm font-semibold text-text-primary">
                      {hi ? cat.titleHi : cat.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-text-muted">
                      {hi ? cat.subtitleHi : cat.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {category !== null && !result && (
          <>
            <p className="mb-4 text-base font-semibold text-text-primary sm:text-lg">
              {hi ? category.titleHi : category.title}
            </p>
            <div className="grid gap-2.5">
              {currentChoices.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => pick(opt)}
                  className="rounded-2xl border border-[var(--hairline-edge)] bg-[var(--surface-2)] px-4 py-3.5 text-left transition hover:border-green-primary/40 hover:bg-green-primary/8"
                >
                  <span className="block text-sm font-medium text-text-primary">
                    {hi ? opt.labelHi : opt.label}
                  </span>
                  {(opt.hint || opt.hintHi) && (
                    <span className="mt-0.5 block text-xs text-text-muted">
                      {hi ? opt.hintHi : opt.hint}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </>
        )}

        {result && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-2xl bg-green-primary/10 p-4">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-green-bright" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-green-bright">
                  {t("help.desk.detected")}
                </p>
                <p className="mt-1 font-display text-xl font-bold text-text-primary">
                  {hi ? result.problemHi : result.problem}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--hairline-edge)] bg-[var(--surface-2)] p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
                <CheckCircle2 className="h-4 w-4 text-green-bright" />
                {t("help.desk.advice")}
              </div>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-text-secondary">
                {(hi ? result.adviceHi : result.advice).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>

            {result.links && result.links.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {result.links.map((link) => (
                  <MotionLink
                    key={link.href}
                    href={link.href}
                    className="rounded-full bg-green-primary px-4 py-2 text-sm font-semibold text-white"
                  >
                    {hi ? link.labelHi : link.label}
                  </MotionLink>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2 border-t border-[var(--hairline-edge)] pt-4">
          {(category !== null || result) && (
            <MotionButton
              type="button"
              variant="ghost"
              onClick={goBack}
              className="inline-flex items-center gap-1.5 !px-4 !py-2 text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("help.desk.back")}
            </MotionButton>
          )}
          {(category !== null || result) && (
            <MotionButton
              type="button"
              variant="ghost"
              onClick={restart}
              className="inline-flex items-center gap-1.5 !px-4 !py-2 text-sm"
            >
              <RotateCcw className="h-4 w-4" />
              {t("help.desk.restart")}
            </MotionButton>
          )}
          <a
            href="tel:18001801551"
            className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-text-primary px-4 py-2 text-sm font-semibold text-white"
          >
            <Phone className="h-4 w-4" />
            1800-180-1551
          </a>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-text-muted">
        {t("help.desk.hint")}{" "}
        <Link
          href="/diseases"
          className="font-medium text-green-bright underline"
        >
          {t("help.desk.library")}
        </Link>
      </p>
    </div>
  );
}
