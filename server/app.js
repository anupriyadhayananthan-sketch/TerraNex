import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
app.use(cors());
app.use(express.json());

// Note: SQLite/better-sqlite3 is the intended zero-config local storage;
// PostgreSQL + PostGIS is the planned production upgrade.
// Here we load the static seed and ingestion datasets into in-memory store.

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
  console.error("Error loading server dataset files:", e);
}

const interventionsStore = [];

// GET /api/projects
app.get('/api/projects', (req, res) => {
  res.json({ projects: seedData.projects || [] });
});

// GET /api/projects/:id
app.get('/api/projects/:id', (req, res) => {
  const project = (seedData.projects || []).find(p => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(project);
});

// GET /api/alerts
app.get('/api/alerts', (req, res) => {
  const highRisk = (seedData.projects || [])
    .filter(p => p.risk_category === 'High')
    .sort((a, b) => b.overall_risk_score - a.overall_risk_score);
  res.json({ alerts: highRisk });
});

// POST /api/interventions
app.post('/api/interventions', (req, res) => {
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

  interventionsStore.push(newIntervention);
  res.status(201).json({
    message: 'Intervention logged successfully',
    intervention: newIntervention
  });
});

// GET /api/ingestion-feed
app.get('/api/ingestion-feed', (req, res) => {
  res.json({ feed: feedData.feed || [] });
});
