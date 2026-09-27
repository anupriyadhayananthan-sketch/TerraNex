import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../src/data');
const projects = JSON.parse(fs.readFileSync(path.join(dataDir, 'seed_projects_dataset.json'), 'utf8')).projects;
const feed = JSON.parse(fs.readFileSync(path.join(dataDir, 'ingestion_feed_dataset.json'), 'utf8')).feed;

let sql = `-- ============================================================
-- TerraNex AI — Supabase Direct SQL Seed
-- 52 Projects & 22 Ingestion Feed Items
-- ============================================================

`;

for (const p of projects) {
  const stageRisks = JSON.stringify(p.stage_risks || {}).replace(/'/g, "''");
  const topDrivers = JSON.stringify(p.top_drivers || []).replace(/'/g, "''");
  const recommendation = JSON.stringify(p.recommendation || {}).replace(/'/g, "''");
  const coordinates = JSON.stringify(p.coordinates || {}).replace(/'/g, "''");
  const name = (p.name || '').replace(/'/g, "''");
  const state = (p.state || '').replace(/'/g, "''");
  const district = (p.district || '').replace(/'/g, "''");
  const ptype = (p.project_type || '').replace(/'/g, "''");
  const cstage = (p.current_stage || '').replace(/'/g, "''");

  sql += `INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  '${p.id}', '${name}', '${ptype}', '${state}', '${district}', '${cstage}',
  ${p.land_area_hectares ?? 'NULL'}, ${p.families_affected ?? 'NULL'}, ${p.compensation_disbursed_pct ?? 'NULL'},
  ${p.legal_disputes_count ?? 0}, ${p.documentation_completeness_pct ?? 'NULL'}, ${p.rr_progress_pct ?? 'NULL'},
  ${p.stakeholder_responsiveness_score ?? 'NULL'}, ${p.months_since_notification ?? 'NULL'},
  ${p.statutory_deadline_months ?? 'NULL'}, ${p.overall_risk_score}, '${p.risk_category}',
  '${stageRisks}'::jsonb, '${topDrivers}'::jsonb, '${recommendation}'::jsonb, ${p.data_confidence_pct ?? 'NULL'},
  ${p.last_synced_days_ago ?? 0}, '${coordinates}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

`;
}

for (const f of feed) {
  const headline = (f.headline || '').replace(/'/g, "''");
  const source = (f.source || '').replace(/'/g, "''");
  const linked = f.linked_project_id ? `'${f.linked_project_id}'` : 'NULL';

  sql += `INSERT INTO public.ingestion_feed (id, date, days_ago, source, headline, linked_project_id, dispute_related)
VALUES ('${f.id}', '${f.date}', ${f.days_ago || 0}, '${source}', '${headline}', ${linked}, ${Boolean(f.dispute_related)})
ON CONFLICT (id) DO NOTHING;
`;
}

const outPath = path.join(__dirname, '../supabase/seed.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log(`Generated ${outPath} with ${projects.length} projects and ${feed.length} feed records.`);
