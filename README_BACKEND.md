# TerraNex AI — API Backend Layer

This is the Node.js + Express API layer for TerraNex AI (PS 26017 MVP).

> **Storage Architecture Note:** SQLite/better-sqlite3 is used for zero-config local demo storage; PostgreSQL + PostGIS is the planned production deployment target.

## Endpoints

- `GET /api/projects` — Fetch all 52 projects
- `GET /api/projects/:id` — Fetch single project detail
- `GET /api/alerts` — Fetch high-risk alerts sorted by risk score
- `POST /api/interventions` — Log a new intervention workflow
- `GET /api/ingestion-feed` — Fetch simulated auto-ingestion timeline feed

## Running the Backend

```bash
# From project root:
cd server
npm install
npm start
```

Runs on `http://localhost:5000`. If the backend is not running, the frontend gracefully degrades to local static JSON files without crashing.
