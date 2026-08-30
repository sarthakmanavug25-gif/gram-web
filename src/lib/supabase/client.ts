import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && anonKey);

let cached: SupabaseClient | null = null;

/**
 * Returns a Supabase browser client, or null when the project has no Supabase
 * credentials configured. Every caller must handle the null case: the app is
 * designed to run fully on local persisted state so the demo never blocks on
 * credentials.
 */
export function getSupabase(): SupabaseClient | null {
  if (!supabaseConfigured) return null;
  if (!cached) cached = createBrowserClient(url!, anonKey!);
  return cached;
}

/** Supabase Auth needs an email, so phone numbers map onto a reserved domain. */
export function phoneToEmail(phone: string) {
  return `${phone.replace(/\D/g, "")}@phone.gramconnect.app`;
}

/** Normalizes an Indian ten-digit number for Supabase Phone Auth. */
export function phoneToE164(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("91") && digits.length === 12
    ? `+${digits}`
    : `+91${digits}`;
}
