"use client";

import { getSupabase, phoneToEmail, supabaseConfigured } from "./supabase/client";
import { useApp, type Expense, type Profile } from "./store";

export type Result = { ok: true } | { ok: false; error: string };

const store = () => useApp.getState();

function friendlyAuthError(message: string) {
  if (/already registered|already exists/i.test(message))
    return "An account with this number already exists.";
  if (/invalid login credentials/i.test(message))
    return "Incorrect phone number or password.";
  return message;
}

export async function signUp(
  name: string,
  phone: string,
  password: string
): Promise<Result> {
  const sb = getSupabase();
  if (!sb) return store().signUp(name, phone, password);

  const { data, error } = await sb.auth.signUp({
    email: phoneToEmail(phone),
    password,
    options: { data: { name, phone } },
  });
  if (error) return { ok: false, error: friendlyAuthError(error.message) };
  if (data.user) {
    store().setSession({ id: data.user.id, name, phone });
    store().updateProfile({ name, phone });
    await sb
      .from("profiles")
      .upsert({ id: data.user.id, name, phone }, { onConflict: "id" });
  }
  return { ok: true };
}

export async function signIn(phone: string, password: string): Promise<Result> {
  const sb = getSupabase();
  if (!sb) return store().signIn(phone, password);

  const { data, error } = await sb.auth.signInWithPassword({
    email: phoneToEmail(phone),
    password,
  });
  if (error) return { ok: false, error: friendlyAuthError(error.message) };
  const name = (data.user?.user_metadata?.name as string) || "Farmer";
  store().setSession({ id: data.user!.id, name, phone });
  await loadRemoteData();
  return { ok: true };
}

export async function signOut() {
  const sb = getSupabase();
  if (sb) await sb.auth.signOut();
  store().signOut();
}

/** Restores an existing Supabase session on app boot. No-op in local mode. */
export async function restoreSession() {
  const sb = getSupabase();
  if (!sb) return;
  const { data } = await sb.auth.getSession();
  const user = data.session?.user;
  if (!user) return;
  store().setSession({
    id: user.id,
    name: (user.user_metadata?.name as string) || "Farmer",
    phone: (user.user_metadata?.phone as string) || "",
  });
  await loadRemoteData();
}

async function loadRemoteData() {
  const sb = getSupabase();
  const session = store().session;
  if (!sb || !session) return;

  const [{ data: profile }, { data: expenses }, { data: status }] =
    await Promise.all([
      sb.from("profiles").select("*").eq("id", session.id).maybeSingle(),
      sb
        .from("expenses")
        .select("*")
        .eq("user_id", session.id)
        .order("date", { ascending: false }),
      sb.from("farm_status").select("*").eq("user_id", session.id).maybeSingle(),
    ]);

  if (profile) {
    store().updateProfile({
      name: profile.name ?? undefined,
      phone: profile.phone ?? undefined,
      farmSizeAcres: profile.farm_size_acres ?? undefined,
      season: profile.season ?? undefined,
      crops: profile.crops ?? undefined,
      locationName: profile.location_name ?? undefined,
      latitude: profile.latitude ?? undefined,
      longitude: profile.longitude ?? undefined,
      monthlyBudget: profile.monthly_budget ?? undefined,
    });
  }
  if (expenses) {
    store().setExpenses(
      expenses.map((row: Record<string, unknown>) => ({
        id: String(row.id),
        crop: String(row.crop),
        category: String(row.category),
        amount: Number(row.amount),
        paymentMethod: String(row.payment_method ?? "Cash"),
        date: String(row.date),
        notes: String(row.notes ?? ""),
      }))
    );
  }
  if (status) {
    store().setSprinkler(Number(status.sprinkler_percent ?? 74));
    if (status.sprinkler_auto === false) store().toggleSprinklerAuto();
  }
}

export async function addExpense(expense: Omit<Expense, "id">) {
  const sb = getSupabase();
  const session = store().session;
  if (sb && session) {
    const { data, error } = await sb
      .from("expenses")
      .insert({
        user_id: session.id,
        crop: expense.crop,
        category: expense.category,
        amount: expense.amount,
        payment_method: expense.paymentMethod,
        date: expense.date,
        notes: expense.notes,
      })
      .select()
      .single();
    if (!error && data) {
      store().setExpenses([
        { ...expense, id: String(data.id) },
        ...store().expenses,
      ]);
      return;
    }
  }
  store().addExpense(expense);
}

export async function deleteExpense(id: string) {
  const sb = getSupabase();
  const session = store().session;
  if (sb && session) await sb.from("expenses").delete().eq("id", id);
  store().deleteExpense(id);
}

export async function saveProfile(patch: Partial<Profile>) {
  store().updateProfile(patch);
  const sb = getSupabase();
  const session = store().session;
  if (!sb || !session) return;
  const p = store().profile;
  await sb.from("profiles").upsert({
    id: session.id,
    name: p.name,
    phone: p.phone,
    farm_size_acres: p.farmSizeAcres,
    season: p.season,
    crops: p.crops,
    location_name: p.locationName,
    latitude: p.latitude,
    longitude: p.longitude,
    monthly_budget: p.monthlyBudget,
  });
}

export async function saveFarmStatus(percent: number, auto: boolean) {
  const sb = getSupabase();
  const session = store().session;
  if (!sb || !session) return;
  await sb.from("farm_status").upsert({
    user_id: session.id,
    sprinkler_percent: percent,
    sprinkler_auto: auto,
  });
}

export const usingSupabase = supabaseConfigured;
