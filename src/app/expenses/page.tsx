"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  CircleDollarSign,
  Lightbulb,
  Minus,
  Plus,
  Search,
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
    if (byCategory.length === 0)
      return "Add a few entries and this box will show where your money is going.";
    const top = byCategory[0];
    if (top.key === "Fertilizer")
      return `Fertilizer is ${Math.round(top.pct)}% of spend — consider soil testing to optimize urea usage.`;
    if (top.key === "Labor")
      return `Labor is ${Math.round(top.pct)}% of spend — machine hire for one operation could bring this down.`;
    if (top.key === "Diesel & Fuel")
      return `Diesel & Fuel is ${Math.round(top.pct)}% of spend — check pump efficiency and irrigation timing.`;
    return `${top.key} is ${Math.round(top.pct)}% of spend — review whether that share fits your plan for this season.`;
  }, [byCategory]);

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
        title="Farm Expenses"
        action={
          <button
            type="button"
            aria-label="Add expense"
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
          placeholder="Search crop, category, or notes"
          className="h-[46px] w-full rounded-full border border-white/8 bg-white/[0.05] pl-10 pr-4 text-[14px] outline-none focus:border-green-primary/50"
        />
      </div>

      <Card>
        <div className="flex items-start justify-between">
          <div>
            <SectionLabel icon={<CircleDollarSign size={14} />}>
              Farm Ledger
            </SectionLabel>
            <p className="text-[32px] font-bold leading-none">
              {rupees(monthTotal)}
            </p>
            <p className="mt-1 text-[13px] text-text-secondary">Spent this month</p>
            <div className="mt-3 flex gap-2">
              <Tag color="#4ade80" tint="rgba(34,197,94,0.16)">
                {profile.farmSizeAcres.toFixed(1)} acres
              </Tag>
              <Tag color="#93c5fd" tint="rgba(59,130,246,0.16)">
                {profile.season}
              </Tag>
            </div>
          </div>
          <BudgetRing percent={budgetPct} over={overBudget} />
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-2.5">
        <MiniStat value={rupees(perAcre)} label="Per acre" />
        <MiniStat value={rupees(budget)} label="Budget" />
        <MiniStat value={String(expenses.length)} label="Entries" />
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <SectionLabel icon={<BarChart3 size={14} />}>Season Budget</SectionLabel>
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
              overBudget
                ? "bg-red-500/15 text-red-300"
                : budgetPct > 80
                  ? "bg-amber/15 text-amber"
                  : "bg-green-primary/15 text-green-bright"
            }`}
          >
            {overBudget ? "Over budget" : budgetPct > 80 ? "Watch spend" : "On track"}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.08]">
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
            ? `You are ${rupees(monthTotal - budget)} over the seasonal budget.`
            : `Spending is well within your seasonal budget. ${rupees(budget - monthTotal)} left.`}
        </p>
        <div className="mt-3 flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.04] px-3 py-2">
          <span className="text-[13px] text-text-secondary">
            Farm size: {profile.farmSizeAcres.toFixed(1)} acres
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

      <div className="rounded-2xl border border-white/[0.06] border-l-4 border-l-amber bg-amber/[0.08] px-4 py-3">
        <div className="flex gap-2.5">
          <Lightbulb size={17} className="mt-0.5 shrink-0 text-amber" />
          <p className="text-[13px] leading-snug text-text-secondary">{insight}</p>
        </div>
      </div>

      <Card>
        <SectionLabel icon={<BarChart3 size={14} />}>Spend by Category</SectionLabel>
        {byCategory.length === 0 ? (
          <p className="py-4 text-center text-[13px] text-text-secondary">
            No spending recorded yet.
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
                        {row.key}
                      </span>
                      <span className="shrink-0 text-[13px] font-bold">
                        {rupees(row.amount)}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
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
          All
        </Chip>
        {CATEGORY_KEYS.map((c) => (
          <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
            {c}
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
            {c}
          </Chip>
        ))}
      </div>

      <p className="text-[13px] text-text-secondary">
        {filtered.length} entr{filtered.length === 1 ? "y" : "ies"}
      </p>

      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <Card>
            <EmptyState
              icon={<CircleDollarSign size={28} />}
              title={expenses.length === 0 ? "No expenses yet" : "Nothing matches"}
              body={
                expenses.length === 0
                  ? "Tap the green + button to record your first farm expense."
                  : "Clear the search or pick a different filter to see your entries."
              }
              action={
                expenses.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => setShowAdd(true)}
                    className="mt-2 rounded-full bg-green-primary px-4 py-2 text-[13px] font-bold text-white"
                  >
                    Add expense
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
                  <p className="text-[14px] font-bold">{e.category}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <Tag color="#4ade80" tint="rgba(34,197,94,0.14)">
                      {e.crop}
                    </Tag>
                    <Tag color="#9ca3af" tint="rgba(156,163,175,0.14)">
                      {e.paymentMethod}
                    </Tag>
                  </div>
                  <p className="mt-1 truncate text-[12px] text-text-muted">
                    {shortDate(e.date)}
                    {e.notes ? ` · ${e.notes}` : ""}
                  </p>
                </div>
                <span className="text-[15px] font-bold">{rupees(e.amount)}</span>
                <button
                  type="button"
                  aria-label={`Delete ${e.category} expense`}
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
      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] text-text-primary transition hover:bg-white/12"
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
      setError("Enter an amount greater than zero.");
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
        className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 280 }}
        className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[88dvh] w-full max-w-phone overflow-y-auto rounded-t-[26px] border border-white/10 bg-[rgba(16,19,16,0.98)] px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-4"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[19px] font-bold">Add expense</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-full p-1.5 text-text-secondary hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3.5">
          <FieldWrap label="Amount (₹)">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
              inputMode="decimal"
              placeholder="0"
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-[16px] font-semibold outline-none focus:border-green-primary/50"
            />
          </FieldWrap>

          <FieldWrap label="Category">
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map((c) => (
                <Chip
                  key={c.key}
                  active={category === c.key}
                  onClick={() => setCategory(c.key)}
                  color={c.color}
                >
                  {c.key}
                </Chip>
              ))}
            </div>
          </FieldWrap>

          <FieldWrap label="Crop">
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
              {EXPENSE_CROPS.map((c) => (
                <Chip key={c} active={crop === c} onClick={() => setCrop(c)}>
                  {c}
                </Chip>
              ))}
            </div>
          </FieldWrap>

          <FieldWrap label="Payment method">
            <div className="flex gap-2">
              {PAYMENT_METHODS.map((m) => (
                <Chip key={m} active={method === m} onClick={() => setMethod(m)}>
                  {m}
                </Chip>
              ))}
            </div>
          </FieldWrap>

          <FieldWrap label="Date">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-[14px] outline-none focus:border-green-primary/50"
            />
          </FieldWrap>

          <FieldWrap label="Notes">
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Urea top-dress, 2 bags"
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-[14px] outline-none focus:border-green-primary/50"
            />
          </FieldWrap>

          {error && (
            <p className="rounded-xl border border-red-400/30 bg-red-500/15 px-3 py-2 text-[13px] text-red-200">
              {error}
            </p>
          )}

          <PrimaryButton type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save expense"}
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
