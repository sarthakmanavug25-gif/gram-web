/**
 * Seeds the public reference tables (diseases, MSP, season crops, priorities)
 * into Supabase. Run once after applying the migration:
 *
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run db:seed
 */
import { createClient } from "@supabase/supabase-js";
import { DISEASES } from "../src/lib/seed/diseases";
import {
  MSP_PRICES,
  PRIORITIES,
  SEASON_CROPS,
} from "../src/lib/seed/reference";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. See README."
  );
  process.exit(1);
}

const db = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

async function main() {
  const diseases = DISEASES.map((d) => ({
    slug: d.slug,
    name: d.name,
    crop: d.crop,
    severity: d.severity,
    affected_part: d.affectedPart,
    symptom: d.symptom,
    description: d.description,
    causes: d.causes,
    treatment: d.treatment,
    prevention: d.prevention,
    season: d.season,
  }));

  const seasonCrops = SEASON_CROPS.map((c) => ({
    name: c.name,
    season: c.season,
    avg_temp: c.avgTemp,
    rainfall: c.rainfall,
    window_text: c.window,
    note: c.note,
    emoji: c.emoji,
  }));

  const steps: [string, Promise<{ error: { message: string } | null }>][] = [
    ["diseases", db.from("diseases").upsert(diseases) as never],
    ["msp_prices", db.from("msp_prices").upsert(MSP_PRICES) as never],
    ["season_crops", db.from("season_crops").upsert(seasonCrops) as never],
    ["priorities", db.from("priorities").upsert(PRIORITIES) as never],
  ];

  for (const [table, query] of steps) {
    const { error } = await query;
    if (error) {
      console.error(`✗ ${table}: ${error.message}`);
      process.exitCode = 1;
    } else {
      console.log(`✓ ${table} seeded`);
    }
  }
}

main();
