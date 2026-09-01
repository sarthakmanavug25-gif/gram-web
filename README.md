# GramConnect

Official GramConnect website for Indian farmers — crop disease guides, live weather
advisory, mandi prices, farm expenses, crop calendar and drone spray booking.
Companion to the existing iOS and Android apps, built for phone, tablet and laptop.

The site runs **with zero configuration**. Without environment variables it uses
local device storage and a rule-based assistant. Adding Supabase and Anthropic keys
upgrades auth, sync and chat.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:43117. The dev server runs on port 43117 so it does not clash
with other projects.

## Screens

| Route | What it does |
| --- | --- |
| `/welcome` | Official marketing homepage — features, tools and dashboard entry |
| `/login` | Phone + password login and signup with validation and error states |
| `/` | Home dashboard: greeting, live weather, priorities, quick actions, season crops, MSP table, recent expenses, field tip |
| `/crop-doctor` | Scan tab (camera/library upload → disease estimate) and a searchable, filterable library of 25 diseases |
| `/crop-doctor/[slug]` | Full disease guide: description, causes, treatment steps, prevention |
| `/advisor` | Live weather, auto sprinkler demand, season advisory tips, India climate calendar chart |
| `/expenses` | Farm ledger, budget ring, spend-by-category breakdown, filters, add/delete entries |
| `/market` | MSP reference and nearby mandi buyers |
| `/more` | Profile, market, alerts, language toggle, help, about, logout |
| `/settings` | Editable profile — name, farm size, budget, crops, season, weather location |

The floating green chat button on every protected screen opens the GramConnect
Assistant.

## Optional: connect Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL editor, run `supabase/migrations/0001_init.sql`. It creates
   `profiles`, `expenses`, `farm_status`, `chat_messages` and the public reference
   tables, enables row level security on every user table, and adds a trigger that
   creates a profile row for each new auth user.
3. Copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Project Settings → API.
4. Seed the reference tables:

```bash
SUPABASE_SERVICE_ROLE_KEY=<service-role-key> npm run db:seed
```

### Enable real SMS OTP

The **Login with OTP** tab uses Supabase Phone Auth and sends a real six-digit
SMS when the Supabase environment variables and phone provider are configured.
For a hackathon/local demo without those credentials, it visibly shows a
device-only **Demo OTP** instead, so the complete login flow remains usable.
The demo code is not sent as an SMS and must never be used for a production
deployment.

1. In Supabase, open **Authentication → Providers → Phone** and enable it.
2. Add an SMS provider. For development, configure a Twilio account; for
   production, use a provider supported in your region and approved sender
   details. Add the provider credentials in the Phone provider configuration.
3. In **Authentication → URL Configuration**, add your local URL and Vercel
   deployment URL to the redirect allow list.
4. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to
   `.env.local`, restart `npm run dev`, then request an OTP with a real
   phone number in international format (the UI adds India's `+91`).
5. Add those same public variables in Vercel before deploying.

The Password tab remains available for existing accounts created with the
email-backed password flow. New SMS users are created by Supabase after they
verify the OTP; the migration trigger creates their profile and farm status.

## Optional: connect Anthropic

Add `ANTHROPIC_API_KEY` to `.env.local` (get one at
[console.anthropic.com](https://console.anthropic.com)). This enables:

- **Streaming chat** — `/api/chat` streams Claude token by token with the farmer's
  real spend, farm size and last scan passed in as context.
- **Leaf photo diagnosis** — `/api/diagnose` sends the uploaded photo to Claude and
  matches it against the 25-disease library.

Without the key both routes fall back to deterministic answers so the demo never
breaks.

## Optional: live mandi prices

The Market page reads daily rates from the official AGMARKNET dataset through
India's Open Government Data platform. Create a free account at
[data.gov.in](https://data.gov.in), generate an API key from **My Account**, then
add this server-only value to `.env.local`:

```bash
DATA_GOV_API_KEY=your-data-gov-in-key
```

Add the same value to Vercel's Environment Variables before deploying. Requests
are made through `/api/mandi`, so this key is never exposed in browser code.
Without it—or if the government feed is slow—the Market page clearly labels and
uses its built-in reference-rate fallback.

## Deploy to Vercel

1. Push this repository to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new) — Next.js is detected
   automatically.
3. In Project Settings → Environment Variables add the same three variables for the
   Production environment:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ANTHROPIC_API_KEY`
4. Deploy. The live URL stays online permanently; redeploy after changing any
   environment variable so the new value is picked up.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Zustand · framer-motion ·
recharts · lucide-react · Supabase · Anthropic SDK · Open-Meteo for weather.

## Data notes

Disease guides, MSP figures (2024-25) and the climate calendar are real reference
data kept in `src/lib/seed/`. Disease information is guidance only — confirm dosage
with a local agriculture officer before spraying.
