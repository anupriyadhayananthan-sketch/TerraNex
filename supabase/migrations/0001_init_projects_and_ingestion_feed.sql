-- ============================================================
-- TerraNex AI — Supabase Migration
-- 0001_init_projects_and_ingestion_feed.sql
-- ============================================================

-- 1. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
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

CREATE INDEX IF NOT EXISTS idx_projects_state ON public.projects(state);
CREATE INDEX IF NOT EXISTS idx_projects_risk_category ON public.projects(risk_category);
CREATE INDEX IF NOT EXISTS idx_projects_overall_risk_score ON public.projects(overall_risk_score DESC);

-- 2. INGESTION_FEED TABLE
CREATE TABLE IF NOT EXISTS public.ingestion_feed (
  id                  TEXT PRIMARY KEY,
  date                DATE,
  days_ago            INTEGER DEFAULT 0,
  source              TEXT,
  headline            TEXT,
  linked_project_id   TEXT REFERENCES public.projects(id) ON DELETE SET NULL,
  dispute_related     BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ingestion_feed_linked_project ON public.ingestion_feed(linked_project_id);
CREATE INDEX IF NOT EXISTS idx_ingestion_feed_dispute ON public.ingestion_feed(dispute_related);
CREATE INDEX IF NOT EXISTS idx_ingestion_feed_date ON public.ingestion_feed(date DESC);

-- 3. INTERVENTIONS TABLE
CREATE TABLE IF NOT EXISTS public.interventions (
  id          TEXT PRIMARY KEY,
  project_id  TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  owner       TEXT NOT NULL,
  action      TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'In Progress',
  timestamp   TIMESTAMPTZ DEFAULT NOW(),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interventions_project_id ON public.interventions(project_id);

-- 4. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.projects       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingestion_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interventions  ENABLE ROW LEVEL SECURITY;

-- Read-only policy for anon/public frontend
CREATE POLICY "anon_select_projects" ON public.projects
  FOR SELECT TO anon USING (true);

CREATE POLICY "anon_select_ingestion_feed" ON public.ingestion_feed
  FOR SELECT TO anon USING (true);

CREATE POLICY "anon_select_interventions" ON public.interventions
  FOR SELECT TO anon USING (true);

-- Full access for service_role (seed script & server routes)
CREATE POLICY "service_role_all_projects" ON public.projects
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_ingestion_feed" ON public.ingestion_feed
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_interventions" ON public.interventions
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
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
