import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  isSupabaseConfigured,
  fetchAllProjects,
  fetchProjectById,
  fetchHighRiskProjects,
  fetchIngestionFeed,
  updateProjectSyncState as supabaseUpdateSyncState,
  insertIntervention,
} from './dataAccess/supabaseClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
app.use(cors());
app.use(express.json());

// ── Static JSON Fallback Datasets ─────────────────────────────────────────────
// These are the primary data source if Supabase is not configured or unavailable.
// This is a documented "honesty framing" / resilience feature — the fallback order
// is now: Supabase → static JSON file fallback.

const seedPath = path.join(__dirname, '../src/data/seed_projects_dataset.json');
const feedPath = path.join(__dirname, '../src/data/ingestion_feed_dataset.json');

let seedData = { projects: [] };
let feedData = { feed: [] };

try {
  if (fs.existsSync(seedPath)) {
    seedData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
  }
  if (fs.existsSync(feedPath)) {
    feedData = JSON.parse(fs.readFileSync(feedPath, 'utf8'));
  }
} catch (e) {
  console.error('Error loading server dataset files:', e);
}

// In-memory intervention store (fallback when Supabase unavailable)
const interventionsStore = [];

if (isSupabaseConfigured) {
  console.log('[TerraNex] Supabase configured — using Supabase as primary data source.');
} else {
  console.log('[TerraNex] Supabase not configured — using static JSON fallback (set SUPABASE_URL + SUPABASE_ANON_KEY to enable).');
}

// ── GET /api/projects ──────────────────────────────────────────────────────────
app.get('/api/projects', async (req, res) => {
  // Try Supabase first
  const supabaseProjects = await fetchAllProjects();
  if (supabaseProjects && supabaseProjects.length > 0) {
    return res.json({ projects: supabaseProjects });
  }
  // Fall back to static JSON
  res.json({ projects: seedData.projects || [] });
});

// ── GET /api/projects/:id ──────────────────────────────────────────────────────
app.get('/api/projects/:id', async (req, res) => {
  // Try Supabase first
  const supabaseProject = await fetchProjectById(req.params.id);
  if (supabaseProject) {
    return res.json(supabaseProject);
  }
  // If Supabase returned null (not configured, error, or genuinely not found)
  // try static JSON fallback
  const fallbackProject = (seedData.projects || []).find(p => p.id === req.params.id);
  if (!fallbackProject) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(fallbackProject);
});

// ── GET /api/alerts ────────────────────────────────────────────────────────────
app.get('/api/alerts', async (req, res) => {
  // Try Supabase first
  const supabaseHighRisk = await fetchHighRiskProjects();
  if (supabaseHighRisk && supabaseHighRisk.length > 0) {
    return res.json({ alerts: supabaseHighRisk });
  }
  // Fall back to static JSON
  const highRisk = (seedData.projects || [])
    .filter(p => p.risk_category === 'High')
    .sort((a, b) => b.overall_risk_score - a.overall_risk_score);
  res.json({ alerts: highRisk });
});

// ── POST /api/interventions ────────────────────────────────────────────────────
app.post('/api/interventions', async (req, res) => {
  const { project_id, owner, action } = req.body;
  if (!project_id || !owner || !action) {
    return res.status(400).json({ error: 'Missing required fields: project_id, owner, action' });
  }

  const newIntervention = {
    id: `INT-${Date.now()}`,
    project_id,
    owner,
    action,
    timestamp: new Date().toISOString(),
    status: 'In Progress'
  };

  // Try to persist to Supabase (service role — server-side only)
  const saved = await insertIntervention(newIntervention);
  if (!saved) {
    // Fall back to in-memory store (honesty framing: still works without Supabase)
    interventionsStore.push(newIntervention);
  }

  res.status(201).json({
    message: 'Intervention logged successfully',
    intervention: newIntervention
  });
});

// ── GET /api/ingestion-feed ────────────────────────────────────────────────────
app.get('/api/ingestion-feed', async (req, res) => {
  // Try Supabase first
  const supabaseFeed = await fetchIngestionFeed();
  if (supabaseFeed && supabaseFeed.length > 0) {
    return res.json({ feed: supabaseFeed });
  }
  // Fall back to static JSON
  res.json({ feed: feedData.feed || [] });
});

// ── POST /api/simulate-refresh ─────────────────────────────────────────────────
// Called by DataSources.jsx "Simulate refresh" button.
// Updates last_synced_days_ago to 0 for the given project_id.
app.post('/api/simulate-refresh', async (req, res) => {
  const { project_id } = req.body;
  if (!project_id) {
    return res.status(400).json({ error: 'Missing required field: project_id' });
  }

  // Try Supabase write first
  const updated = await supabaseUpdateSyncState(project_id, 0);
  if (updated) {
    return res.json({ message: 'Sync state updated', project: updated });
  }

  // Fall back: update in-memory seedData (existing behavior)
  const idx = (seedData.projects || []).findIndex(p => p.id === project_id);
  if (idx !== -1) {
    seedData.projects[idx] = { ...seedData.projects[idx], last_synced_days_ago: 0 };
    return res.json({ message: 'Sync state updated (in-memory)', project: seedData.projects[idx] });
  }

  res.status(404).json({ error: 'Project not found' });
});
