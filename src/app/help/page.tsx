"use client";

import MarketingShell from "@/components/MarketingShell";
import HelpDeskWizard from "@/components/HelpDeskWizard";
import { useT } from "@/lib/i18n";

const FAQ_KEYS = [
  ["help.q1", "help.a1"],
  ["help.q2", "help.a2"],
  ["help.q3", "help.a3"],
  ["help.q4", "help.a4"],
] as const;

export default function HelpPage() {
  const { t } = useT();

  return (
    <MarketingShell>
      <section className="border-b border-[var(--hairline-edge)] py-10 sm:py-12">
        <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-green-bright">
            {t("help.desk.badge")}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-text-primary sm:text-4xl">
            {t("help.title")}
          </h1>
          <p className="mt-2 max-w-2xl text-text-secondary">{t("help.desk.pageSub")}</p>
        </div>
      </section>

      <section className="py-8 sm:py-10">
        <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8">
          <HelpDeskWizard />
        </div>
      </section>

      <section className="border-t border-[var(--hairline-edge)] py-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-bold text-text-primary">
            {t("help.faq")}
          </h2>
          <div className="mt-5 space-y-3">
            {FAQ_KEYS.map(([q, a]) => (
              <details
                key={q}
                className="group rounded-2xl border border-[var(--hairline-edge)] bg-[var(--surface-2)] px-4 py-3 open:bg-green-primary/8"
              >
                <summary className="cursor-pointer list-none font-semibold text-text-primary marker:content-none [&::-webkit-details-marker]:hidden">
                  {t(q)}
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {t(a)}
                </p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-sm text-text-secondary">{t("help.chatNote")}</p>
          <div className="mt-4 rounded-2xl border border-[var(--hairline-edge)] bg-[var(--surface-2)] p-4">
            <p className="font-semibold text-text-primary">{t("help.kisanCall")}</p>
            <p className="mt-1 text-sm text-text-muted">{t("help.kisanCallSub")}</p>
            <a
              href="tel:18001801551"
              className="mt-3 inline-flex rounded-full bg-green-primary px-4 py-2 text-sm font-semibold text-white"
            >
              1800-180-1551
            </a>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
