-- ============================================================
-- TerraNex AI — Supabase Migration 0001_init.sql
-- Recreates the data schema 1:1 from the static JSON datasets.
-- JSONB is used for nested objects (stage_risks, top_drivers,
-- recommendation, coordinates) to match the JS object shapes
-- the frontend already consumes without transformation.
-- ============================================================

-- 1. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id                              TEXT PRIMARY KEY,
  name                            TEXT NOT NULL,
  project_type                    TEXT,
  state                           TEXT NOT NULL,
  district                        TEXT NOT NULL,
  current_stage                   TEXT NOT NULL,
  land_area_hectares              NUMERIC,
  families_affected               INTEGER,
  compensation_disbursed_pct      NUMERIC,
  legal_disputes_count            INTEGER DEFAULT 0,
  documentation_completeness_pct  NUMERIC,
  rr_progress_pct                 NUMERIC,
  stakeholder_responsiveness_score NUMERIC,
  months_since_notification       INTEGER,
  statutory_deadline_months       INTEGER,
  overall_risk_score              NUMERIC NOT NULL,
  risk_category                   TEXT NOT NULL CHECK (risk_category IN ('High', 'Medium', 'Low')),
  stage_risks                     JSONB,
  top_drivers                     JSONB,
  recommendation                  JSONB,
  data_confidence_pct             NUMERIC,
  last_synced_days_ago            INTEGER DEFAULT 0,
  coordinates                     JSONB,
  created_at                      TIMESTAMPTZ DEFAULT NOW(),
  updated_at                      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_state ON projects(state);
CREATE INDEX IF NOT EXISTS idx_projects_risk_category ON projects(risk_category);
CREATE INDEX IF NOT EXISTS idx_projects_overall_risk_score ON projects(overall_risk_score DESC);

-- 2. INGESTION_FEED TABLE
CREATE TABLE IF NOT EXISTS ingestion_feed (
  id                  TEXT PRIMARY KEY,
  date                DATE,
  days_ago            INTEGER DEFAULT 0,
  source              TEXT,
  headline            TEXT,
  linked_project_id   TEXT REFERENCES projects(id) ON DELETE SET NULL,
  dispute_related     BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ingestion_feed_linked_project ON ingestion_feed(linked_project_id);
CREATE INDEX IF NOT EXISTS idx_ingestion_feed_dispute ON ingestion_feed(dispute_related);
CREATE INDEX IF NOT EXISTS idx_ingestion_feed_date ON ingestion_feed(date DESC);

-- 3. INTERVENTIONS TABLE
CREATE TABLE IF NOT EXISTS interventions (
  id          TEXT PRIMARY KEY,
  project_id  TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  owner       TEXT NOT NULL,
  action      TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'In Progress',
  timestamp   TIMESTAMPTZ DEFAULT NOW(),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interventions_project_id ON interventions(project_id);

-- 4. ROW LEVEL SECURITY
ALTER TABLE projects       ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingestion_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE interventions  ENABLE ROW LEVEL SECURITY;

-- anon role: SELECT only
CREATE POLICY "anon_select_projects" ON projects
  FOR SELECT TO anon USING (true);

CREATE POLICY "anon_select_ingestion_feed" ON ingestion_feed
  FOR SELECT TO anon USING (true);

CREATE POLICY "anon_select_interventions" ON interventions
  FOR SELECT TO anon USING (true);

-- service_role: full access (server-side only, never in browser)
CREATE POLICY "service_role_all_projects" ON projects
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_ingestion_feed" ON ingestion_feed
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_interventions" ON interventions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 5. UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
