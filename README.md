# GramConnect Website

Official companion website for the GramConnect iOS and Android apps.

This site is an **app showcase / guide**, plus two practical hubs:

1. **Government schemes** — simple directory of farmer subsidies and support programmes with official links  
2. **Farm tool marketplace** — companies list machinery and inputs; farmers can enquire

The full interactive farming tools live in the mobile apps. This website stays light and readable on phone, tablet and laptop.

## Run locally

```bash
npm install
npm run build
npm start
# or for development:
npm run dev
```

Open http://localhost:43117 (dev) or the production port you configure.

## Main routes

| Route | Purpose |
| --- | --- |
| `/` | App showcase homepage + guide |
| `/schemes` | Government schemes connector |
| `/marketplace` | Farm tools marketplace |
| `/about` | About GramConnect |
| `/help` | Help & FAQ |

## Optional env

See `.env.example` for Supabase / Anthropic / data.gov keys if you also run the older interactive demo routes.
