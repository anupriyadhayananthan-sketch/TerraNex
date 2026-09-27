# TerraNex AI — API Backend Layer

This is the Node.js + Express API layer for TerraNex AI (PS 26017 MVP).

> **Storage Architecture:** Data layer uses **Supabase (PostgreSQL)** as the primary source, with automatic fallback to static JSON files. No SQLite is used.

## Data Layer Architecture

```
Request → Express Route
              │
              ├─► Supabase (primary, if configured)
              │         └─► Returns data from PostgreSQL
              │
              └─► Static JSON files (fallback / resilience)
                        └─► Reads from src/data/*.json
```

The fallback is a documented "honesty framing" resilience feature — the app works fully offline from static files.

## Environment Setup

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # server-side only
```

If env vars are absent, the app automatically uses the static JSON fallback. **No crash, no manual switch needed.**

## Seeding Supabase

1. Run the migration SQL in `supabase/migrations/0001_init.sql` in the Supabase SQL editor.
2. Set env vars and run the seed script:

```bash
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-supabase.js
```

## API Endpoints

| Method | Route | Response | Source |
|--------|-------|----------|--------|
| GET | `/api/projects` | `{ projects: Project[] }` (52) | Supabase → JSON |
| GET | `/api/projects/:id` | `Project` or 404 | Supabase → JSON |
| GET | `/api/alerts` | `{ alerts: Project[] }` (11 High-risk) | Supabase → JSON |
| POST | `/api/interventions` | `{ message, intervention }` 201 | Supabase write → in-memory |
| GET | `/api/ingestion-feed` | `{ feed: FeedItem[] }` (22) | Supabase → JSON |
| POST | `/api/simulate-refresh` | `{ message, project }` | Supabase write → in-memory |

## Key Files

| File | Purpose |
|------|---------|
| `server/app.js` | Express server — Supabase-first routes with JSON fallback |
| `server/dataAccess/supabaseClient.js` | Supabase query functions (service role, server-only) |
| `supabase/migrations/0001_init.sql` | PostgreSQL schema with RLS policies |
| `scripts/seed-supabase.js` | Idempotent data seed from static JSON |
| `.env.example` | Environment variable template |
| `src/data/*.json` | Static fallback datasets |

## Running

```bash
# From project root:
node server/server.js
```

Runs on `http://localhost:5000`. If the backend is not running, the frontend gracefully degrades to local static JSON files without crashing.
