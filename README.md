# Vahan Meeting Dashboard

A meeting-intelligence dashboard prototype: upload meeting transcripts, get an AI summary and action items for each one, browse meetings by team, and ask questions across everything that's been discussed.

Built as a companion to [vahan-chatbot](https://github.com/natru-nyx/vahan-chatbot), the company-policy assistant.

## What it does

- **Transcript upload** – drop in a `.txt` / `.doc` / `.docx` transcript; Gemini generates a title, summary and action items.
- **Meetings by team** – every meeting is tagged to a team (Sales, Engineering, Marketing, Product) with a per-team view.
- **AI assistant** – chat that answers questions using your meeting history and uploaded company documents as context.
- **Admin panel** – upload FAQ / policy documents that feed the assistant, plus usage stats.

## Stack

| Layer | Tech |
| --- | --- |
| Frontend | React 18, TypeScript, Vite, Tailwind, shadcn/ui, TanStack Query, Wouter |
| Backend | Express, Drizzle ORM, PostgreSQL (Neon) |
| AI | Google Gemini (`gemini-2.5-flash`) |
| Auth | Replit OpenID Connect |

## Running it

The app uses Replit's login, so it runs as-is on [Replit](https://replit.com) (import this repo, add the secrets below, press Run). To run it elsewhere you'd need to swap `server/replitAuth.ts` for another auth provider.

Required environment variables:

```
DATABASE_URL=      # Postgres connection string
GEMINI_API_KEY=    # Google AI Studio key
SESSION_SECRET=    # any long random string
REPL_ID=           # provided automatically on Replit
REPLIT_DOMAINS=    # provided automatically on Replit
```

```bash
npm install
npm run db:push   # create tables
npm run dev       # http://localhost:5000
```

## Project layout

```
client/   React app (pages in client/src/pages)
server/   Express API, Gemini calls, storage layer
shared/   Drizzle schema + types shared by client and server
```

## Status

Prototype, not deployed. Built in August 2025.
