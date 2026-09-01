# GramConnect Website

Official companion website for the GramConnect iOS and Android apps.

This site is an **app showcase / guide**, plus practical hubs for farmers:

1. **Government schemes** — simple directory of farmer subsidies with official links  
2. **Farm tool marketplace** — browse tools, **add to cart**, demo pay (UPI / card / COD), enquire sellers, earn Gram Points  
3. **Drone pesticide spraying** — pick operator, acres, date & slot, see cost estimate, then **continue in the app** for enquiry  
4. **Disease library** and **help desk** for field guidance

The full interactive farming tools live in the mobile apps. This website stays light and readable on phone, tablet and laptop.

## Run locally

```bash
npm install
npm run build
npm start
# or for development:
npm run dev -- -H 0.0.0.0 -p 43117
```

Open http://localhost:43117 (or the port you choose).

## Main routes

| Route | Purpose |
| --- | --- |
| `/` | App showcase homepage + guide |
| `/schemes` | Government schemes connector |
| `/marketplace` | Farm tools marketplace + cart checkout |
| `/drone` | Drone spray planning (slots + cost → app) |
| `/diseases` | Crop disease library |
| `/help` | Farmer help desk |
| `/about` | About GramConnect |

## Notes

- Marketplace checkout is a **demo payment** flow (orders saved on this device). No real money is charged until a payment gateway is connected.
- Drone web page estimates cost; booking enquiry continues via `/#get-app` (mobile apps).

## Optional env

See `.env.example` for Supabase / Anthropic / data.gov keys if you also run the older interactive demo routes.
