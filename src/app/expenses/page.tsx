"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  CircleDollarSign,
  CloudRain,
  Lightbulb,
  Minus,
  Plus,
  Search,
  Sprout,
  Trash2,
  X,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import ScreenHeader from "@/components/ScreenHeader";
import CategoryIcon from "@/components/CategoryIcon";
import {
  Card,
  Chip,
  EmptyState,
  IconTile,
  PrimaryButton,
  SectionLabel,
  Tag,
} from "@/components/ui/primitives";
import { useApp } from "@/lib/store";
import { addExpense, deleteExpense, saveProfile } from "@/lib/repo";
import {
  CATEGORIES,
  CATEGORY_KEYS,
  EXPENSE_CROPS,
  PAYMENT_METHODS,
  categoryMeta,
} from "@/lib/seed/categories";
import { isThisMonth, rupees, shortDate } from "@/lib/format";
import { useT } from "@/lib/i18n";

export default function ExpensesPage() {
  return (
    <AppShell>
      <ExpensesContent />
    </AppShell>
  );
}

function ExpensesContent() {
  const expenses = useApp((s) => s.expenses);
  const profile = useApp((s) => s.profile);
  const { t, lang, tCrop, tCategory, tPayment, tSeason } = useT();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [crop, setCrop] = useState("All crops");
  const [showAdd, setShowAdd] = useState(false);

  const monthExpenses = useMemo(
    () => expenses.filter((e) => isThisMonth(e.date)),
    [expenses]
  );
  const monthTotal = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const budget = profile.monthlyBudget;
  const budgetPct = budget > 0 ? Math.min(100, (monthTotal / budget) * 100) : 0;
  const perAcre = profile.farmSizeAcres > 0 ? monthTotal / profile.farmSizeAcres : 0;

  const byCategory = useMemo(() => {
    const totals = new Map<string, number>();
    for (const e of expenses) {
      totals.set(e.category, (totals.get(e.category) ?? 0) + e.amount);
    }
    const total = [...totals.values()].reduce((a, b) => a + b, 0) || 1;
    return [...totals.entries()]
      .map(([key, amount]) => ({
        key,
        amount,
        pct: (amount / total) * 100,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  const insight = useMemo(() => {
    if (byCategory.length === 0) return t("expenses.insight.empty");
    const top = byCategory[0];
    const pct = Math.round(top.pct);
    if (top.key === "Fertilizer") return t("expenses.insight.fertilizer", { pct });
    if (top.key === "Labor") return t("expenses.insight.labor", { pct });
    if (top.key === "Diesel & Fuel") return t("expenses.insight.fuel", { pct });
    return t("expenses.insight.generic", { pct, category: tCategory(top.key) });
  }, [byCategory, t, tCategory]);

  const cropOptions = useMemo(
    () => ["All crops", ...Array.from(new Set(expenses.map((e) => e.crop)))],
    [expenses]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return expenses.filter((e) => {
      const matchQuery =
        !q ||
        e.crop.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.notes.toLowerCase().includes(q);
      const matchCategory = category === "All" || e.category === category;
      const matchCrop = crop === "All crops" || e.crop === crop;
      return matchQuery && matchCategory && matchCrop;
    });
  }, [expenses, query, category, crop]);

  const overBudget = monthTotal > budget;

  function adjustFarmSize(delta: number) {
    const next = Math.max(0.5, Number((profile.farmSizeAcres + delta).toFixed(1)));
    void saveProfile({ farmSizeAcres: next });
  }

  return (
    <div className="space-y-4">
      <ScreenHeader
        title={t("expenses.title")}
        action={
          <button
            type="button"
            aria-label={t("expenses.add")}
            onClick={() => setShowAdd(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-green-primary text-white shadow-glow transition hover:bg-green-dark"
          >
            <Plus size={20} />
          </button>
        }
      />

      <div className="relative">
        <Search
          size={17}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("expenses.search")}
          className="h-[46px] w-full rounded-full hairline surface pl-10 pr-4 text-[14px] outline-none focus:border-green-primary/50"
        />
      </div>

      <Card>
        <div className="flex items-start justify-between">
          <div>
            <SectionLabel icon={<CircleDollarSign size={14} />}>
              {t("expenses.ledger")}
            </SectionLabel>
            <p className="text-[32px] font-bold leading-none">
              {rupees(monthTotal)}
            </p>
            <p className="mt-1 text-[13px] text-text-secondary">
              {t("expenses.spentThisMonth")}
            </p>
            <div className="mt-3 flex items-center gap-2 text-[12.5px] font-semibold">
              <span className="flex items-center gap-1.5 text-green-bright">
                <Sprout size={13} />
                {t("common.acres", { n: profile.farmSizeAcres.toFixed(1) })}
              </span>
              <span className="text-text-muted">·</span>
              <span className="flex items-center gap-1.5 text-info">
                <CloudRain size={13} />
                {tSeason(profile.season)}
              </span>
            </div>
          </div>
          <BudgetRing percent={budgetPct} over={overBudget} />
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-2.5">
        <MiniStat value={rupees(perAcre)} label={t("expenses.perAcre")} />
        <MiniStat value={rupees(budget)} label={t("expenses.budget")} />
        <MiniStat value={String(expenses.length)} label={t("expenses.entries")} />
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <SectionLabel icon={<BarChart3 size={14} />}>
            {t("expenses.seasonBudget")}
          </SectionLabel>
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
              overBudget
                ? "bg-red-500/15 text-red-300"
                : budgetPct > 80
                  ? "bg-amber/15 text-amber"
                  : "bg-green-primary/15 text-green-bright"
            }`}
          >
            {overBudget
              ? t("expenses.overBudget")
              : budgetPct > 80
                ? t("expenses.watchSpend")
                : t("expenses.onTrack")}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full surface-2">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.max(3, budgetPct)}%`,
              backgroundColor: overBudget
                ? "var(--red-critical)"
                : budgetPct > 80
                  ? "var(--amber)"
                  : "var(--green-primary)",
            }}
          />
        </div>
        <p className="mt-2.5 text-[13px] text-text-secondary">
          {overBudget
            ? t("expenses.over", { amount: rupees(monthTotal - budget) })
            : t("expenses.within", { left: rupees(budget - monthTotal) })}
        </p>
        <div className="mt-3 flex items-center justify-between rounded-2xl hairline surface px-3 py-2">
          <span className="text-[13px] text-text-secondary">
            {t("expenses.farmSize", { n: profile.farmSizeAcres.toFixed(1) })}
          </span>
          <div className="flex items-center gap-2">
            <StepperButton label="Decrease farm size" onClick={() => adjustFarmSize(-0.5)}>
              <Minus size={15} />
            </StepperButton>
            <StepperButton label="Increase farm size" onClick={() => adjustFarmSize(0.5)}>
              <Plus size={15} />
            </StepperButton>
          </div>
        </div>
      </Card>

      <div className="rounded-2xl hairline border-l-4 border-l-amber bg-amber/[0.08] px-4 py-3">
        <div className="flex gap-2.5">
          <Lightbulb size={17} className="mt-0.5 shrink-0 text-amber" />
          <p className="text-[13px] leading-snug text-text-secondary">{insight}</p>
        </div>
      </div>

      <Card>
        <SectionLabel icon={<BarChart3 size={14} />}>
          {t("expenses.byCategory")}
        </SectionLabel>
        {byCategory.length === 0 ? (
          <p className="py-4 text-center text-[13px] text-text-secondary">
            {t("expenses.noSpend")}
          </p>
        ) : (
          <div className="space-y-3">
            {byCategory.map((row) => {
              const meta = categoryMeta(row.key);
              return (
                <div key={row.key} className="flex items-center gap-3">
                  <IconTile color={meta.color} tint={meta.tint} size={34}>
                    <CategoryIcon name={meta.icon} size={16} />
                  </IconTile>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[13px] font-semibold">
                        {tCategory(row.key)}
                      </span>
                      <span className="shrink-0 text-[13px] font-bold">
                        {rupees(row.amount)}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full surface-2">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${row.pct}%`,
                            backgroundColor: meta.color,
                          }}
                        />
                      </div>
                      <span className="w-9 text-right text-[11px] text-text-muted">
                        {Math.round(row.pct)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        <Chip active={category === "All"} onClick={() => setCategory("All")}>
          {t("expenses.all")}
        </Chip>
        {CATEGORY_KEYS.map((c) => (
          <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
            {tCategory(c)}
          </Chip>
        ))}
      </div>

      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {cropOptions.map((c) => (
          <Chip
            key={c}
            active={crop === c}
            onClick={() => setCrop(c)}
            color="var(--blue-info)"
          >
            {c === "All crops" ? t("expenses.allCrops") : tCrop(c)}
          </Chip>
        ))}
      </div>

      <p className="text-[13px] text-text-secondary">
        {filtered.length === 1
          ? t("expenses.count_one")
          : t("expenses.count", { n: filtered.length })}
      </p>

      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <Card>
            <EmptyState
              icon={<CircleDollarSign size={28} />}
              title={
                expenses.length === 0
                  ? t("expenses.emptyTitle")
                  : t("expenses.noMatchTitle")
              }
              body={
                expenses.length === 0
                  ? t("expenses.emptyBody")
                  : t("expenses.noMatchBody")
              }
              action={
                expenses.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => setShowAdd(true)}
                    className="mt-2 rounded-full bg-green-primary px-4 py-2 text-[13px] font-bold text-white"
                  >
                    {t("expenses.add")}
                  </button>
                ) : undefined
              }
            />
          </Card>
        ) : (
          filtered.map((e) => {
            const meta = categoryMeta(e.category);
            return (
              <motion.div
                key={e.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="card flex items-center gap-3 p-3.5"
              >
                <IconTile color={meta.color} tint={meta.tint} size={40}>
                  <CategoryIcon name={meta.icon} size={18} />
                </IconTile>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold">{tCategory(e.category)}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <Tag color="var(--green-bright)" tint="rgba(34,197,94,0.14)">
                      {tCrop(e.crop)}
                    </Tag>
                    <Tag color="var(--text-secondary)" tint="rgba(156,163,175,0.16)">
                      {tPayment(e.paymentMethod)}
                    </Tag>
                  </div>
                  <p className="mt-1 truncate text-[12px] text-text-muted">
                    {shortDate(e.date, lang)}
                    {e.notes ? ` · ${e.notes}` : ""}
                  </p>
                </div>
                <span className="text-[15px] font-bold">{rupees(e.amount)}</span>
                <button
                  type="button"
                  aria-label={`${t("expenses.title")} — ${tCategory(e.category)}`}
                  onClick={() => void deleteExpense(e.id)}
                  className="rounded-full p-2 text-text-muted transition hover:bg-red-500/15 hover:text-red-300"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            );
          })
        )}
      </div>

      <AnimatePresence>
        {showAdd && <AddExpenseSheet onClose={() => setShowAdd(false)} />}
      </AnimatePresence>
    </div>
  );
}

function StepperButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-full hairline surface text-text-primary transition hover:surface-2"
    >
      {children}
    </button>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="card px-3 py-3 text-center">
      <p className="text-[16px] font-bold leading-none">{value}</p>
      <p className="mt-1.5 text-[11px] text-text-muted">{label}</p>
    </div>
  );
}

function BudgetRing({ percent, over }: { percent: number; over: boolean }) {
  const size = 74;
  const stroke = 7;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const color = over ? "var(--red-critical)" : "var(--green-primary)";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (Math.min(100, percent) / 100) * c}
          className="transition-all duration-700"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[13px] font-bold">
        {Math.round(percent)}%
      </span>
    </div>
  );
}

function AddExpenseSheet({ onClose }: { onClose: () => void }) {
  const { t, tCrop, tCategory, tPayment } = useT();
  const [crop, setCrop] = useState(EXPENSE_CROPS[0]);
  const [category, setCategory] = useState<string>(CATEGORIES[0].key);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<string>(PAYMENT_METHODS[0]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) {
      setError(t("expenses.amountError"));
      return;
    }
    setSaving(true);
    await addExpense({
      crop,
      category,
      amount: value,
      paymentMethod: method,
      date,
      notes: notes.trim(),
    });
    setSaving(false);
    onClose();
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 overlay-bg backdrop-blur-sm"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 280 }}
        className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[88dvh] w-full max-w-phone overflow-y-auto rounded-t-[26px] hairline sheet-surface px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-4"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[19px] font-bold">{t("expenses.add")}</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-full p-1.5 text-text-secondary hover-surface"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3.5">
          <FieldWrap label={t("expenses.amount")}>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
              inputMode="decimal"
              placeholder="0"
              className="h-12 w-full rounded-2xl hairline surface px-4 text-[16px] font-semibold outline-none focus:border-green-primary/50"
            />
          </FieldWrap>

          <FieldWrap label={t("expenses.category")}>
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map((c) => (
                <Chip
                  key={c.key}
                  active={category === c.key}
                  onClick={() => setCategory(c.key)}
                  color={c.color}
                >
                  {tCategory(c.key)}
                </Chip>
              ))}
            </div>
          </FieldWrap>

          <FieldWrap label={t("expenses.crop")}>
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
              {EXPENSE_CROPS.map((c) => (
                <Chip key={c} active={crop === c} onClick={() => setCrop(c)}>
                  {tCrop(c)}
                </Chip>
              ))}
            </div>
          </FieldWrap>

          <FieldWrap label={t("expenses.payment")}>
            <div className="flex gap-2">
              {PAYMENT_METHODS.map((m) => (
                <Chip key={m} active={method === m} onClick={() => setMethod(m)}>
                  {tPayment(m)}
                </Chip>
              ))}
            </div>
          </FieldWrap>

          <FieldWrap label={t("expenses.date")}>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-12 w-full rounded-2xl hairline surface px-4 text-[14px] outline-none focus:border-green-primary/50"
            />
          </FieldWrap>

          <FieldWrap label={t("expenses.notes")}>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("expenses.notesHint")}
              className="h-12 w-full rounded-2xl hairline surface px-4 text-[14px] outline-none focus:border-green-primary/50"
            />
          </FieldWrap>

          {error && (
            <p className="rounded-xl border border-red-400/30 bg-red-500/15 px-3 py-2 text-[13px] text-red-200">
              {error}
            </p>
          )}

          <PrimaryButton type="submit" disabled={saving}>
            {saving ? t("common.saving") : t("expenses.saveExpense")}
          </PrimaryButton>
        </form>
      </motion.div>
    </>
  );
}

function FieldWrap({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1.5 text-[12px] font-semibold text-text-secondary">
        {label}
      </p>
      {children}
    </div>
  );
}
