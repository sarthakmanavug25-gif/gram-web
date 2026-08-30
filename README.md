# GramConnect

A smart farming assistant for Indian farmers, built as a mobile-first web app: crop
disease guides, live weather advisory with an auto-sprinkler recommendation, and a
farm expense ledger — plus an in-app assistant that answers in English, हिंदी or
Hinglish.

The app runs **with zero configuration**. Without any environment variables it uses
local device storage for accounts and expenses, and a rule-based assistant. Adding
Supabase and Anthropic keys upgrades it to real cloud auth, a real database and a
real LLM.

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
| `/welcome` | Entry screen — Continue as guest, or sign in with a phone number |
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

Phone numbers map onto Supabase email auth as `<digits>@phone.gramconnect.app`, so
no SMS provider is needed. Turn off "Confirm email" in Authentication → Providers →
Email so signup logs the farmer straight in.

## Optional: connect Anthropic

Add `ANTHROPIC_API_KEY` to `.env.local` (get one at
[console.anthropic.com](https://console.anthropic.com)). This enables:

- **Streaming chat** — `/api/chat` streams Claude token by token with the farmer's
  real spend, farm size and last scan passed in as context.
- **Leaf photo diagnosis** — `/api/diagnose` sends the uploaded photo to Claude and
  matches it against the 25-disease library.

Without the key both routes fall back to deterministic answers so the demo never
breaks.

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
