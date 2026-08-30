"use client";

import {
  getSupabase,
  phoneToE164,
  phoneToEmail,
  supabaseConfigured,
} from "./supabase/client";
import { useApp, type Expense, type Profile } from "./store";

export type Result = { ok: true } | { ok: false; error: string };
export type PhoneOtpResult =
  | { ok: true; requiresName: boolean; name: string }
  | { ok: false; error: string };

const store = () => useApp.getState();

function friendlyAuthError(message: string) {
  if (/already registered|already exists/i.test(message))
    return "An account with this number already exists.";
  if (/invalid login credentials/i.test(message))
    return "Incorrect phone number or password.";
  return message;
}

function friendlyOtpError(message: string) {
  if (/sms.*not enabled|provider.*not enabled|unsupported phone provider/i.test(message))
    return "Phone login is not enabled yet. Ask the farm owner to enable Phone Auth in Supabase.";
  if (/invalid.*otp|token.*expired|otp.*expired/i.test(message))
    return "That OTP is incorrect or has expired. Request a new one and try again.";
  if (/rate limit|too many requests/i.test(message))
    return "Too many OTP attempts. Please wait a few minutes before trying again.";
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

/** Sends a real SMS through the configured Supabase Phone Auth provider. */
export async function sendPhoneOtp(phone: string): Promise<Result> {
  const sb = getSupabase();
  if (!sb) {
    return {
      ok: false,
      error:
        "Phone OTP is not configured in this deployment. Use Password login, or add Supabase credentials and enable Phone Auth.",
    };
  }

  const { error } = await sb.auth.signInWithOtp({
    phone: phoneToE164(phone),
    options: { shouldCreateUser: true },
  });
  if (error) return { ok: false, error: friendlyOtpError(error.message) };
  return { ok: true };
}

/** Verifies the SMS code and loads the farmer's cloud profile. */
export async function verifyPhoneOtp(
  phone: string,
  token: string
): Promise<PhoneOtpResult> {
  const sb = getSupabase();
  if (!sb) {
    return {
      ok: false,
      error:
        "Phone OTP is not configured in this deployment. Use Password login instead.",
    };
  }

  const { data, error } = await sb.auth.verifyOtp({
    phone: phoneToE164(phone),
    token,
    type: "sms",
  });
  if (error || !data.user) {
    return {
      ok: false,
      error: friendlyOtpError(error?.message ?? "Could not verify this OTP."),
    };
  }

  const { data: profile } = await sb
    .from("profiles")
    .select("name")
    .eq("id", data.user.id)
    .maybeSingle();
  const name =
    (profile?.name as string | undefined) ??
    (data.user.user_metadata?.name as string | undefined) ??
    "Farmer";

  store().setSession({ id: data.user.id, name, phone });
  store().updateProfile({ name, phone });
  await loadRemoteData();

  return { ok: true, requiresName: !name || name === "Farmer", name };
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
