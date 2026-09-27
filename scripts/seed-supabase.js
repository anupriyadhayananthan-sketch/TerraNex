/**
 * scripts/seed-supabase.js
 * ─────────────────────────────────────────────────────────────────────────────
 * One-time data migration script: seeds the Supabase database from the existing
 * static JSON datasets. Idempotent — uses upsert on primary key so it is safe
 * to run multiple times.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-supabase.js
 *
 * Prerequisites:
 *   1. Run the SQL in supabase/migrations/0001_init.sql in the Supabase SQL editor
 *      (or via `supabase db push` if using Supabase CLI).
 *   2. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Auto-load .env from project root if present ────────────────────────────────
const envPath = path.join(__dirname, '../.env');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

// ── Validate env ───────────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY || SUPABASE_URL.includes('your-project')) {
  console.error('ERROR: Set valid SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file or environment.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false }
});

// ── Load source JSON ───────────────────────────────────────────────────────────
const dataDir = path.join(__dirname, '../src/data');

const seedProjects = JSON.parse(
  readFileSync(path.join(dataDir, 'seed_projects_dataset.json'), 'utf8')
).projects;

const feedItems = JSON.parse(
  readFileSync(path.join(dataDir, 'ingestion_feed_dataset.json'), 'utf8')
).feed;

// ── Seed projects ──────────────────────────────────────────────────────────────
async function seedProjects_() {
  console.log(`\nSeeding ${seedProjects.length} projects...`);

  // Batch upsert (idempotent)
  const { data, error } = await supabase
    .from('projects')
    .upsert(seedProjects, { onConflict: 'id' });

  if (error) {
    console.error('ERROR seeding projects:', error.message);
    return false;
  }
  console.log(`  ✅ Upserted ${seedProjects.length} projects.`);
  return true;
}

// ── Seed ingestion feed ────────────────────────────────────────────────────────
async function seedFeed() {
  console.log(`\nSeeding ${feedItems.length} ingestion feed items...`);

  const { data, error } = await supabase
    .from('ingestion_feed')
    .upsert(feedItems, { onConflict: 'id' });

  if (error) {
    console.error('ERROR seeding ingestion_feed:', error.message);
    return false;
  }
  console.log(`  ✅ Upserted ${feedItems.length} feed items.`);
  return true;
}

// ── Verify row counts ──────────────────────────────────────────────────────────
async function verifyRowCounts() {
  console.log('\nVerifying row counts...');

  const { count: projCount, error: pe } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true });

  const { count: feedCount, error: fe } = await supabase
    .from('ingestion_feed')
    .select('*', { count: 'exact', head: true });

  if (pe || fe) {
    console.error('Verification query error:', pe?.message || fe?.message);
    return false;
  }

  const projOk = projCount === 52;
  const feedOk = feedCount === 22;

  console.log(`  projects:        ${projCount}/52 ${projOk ? '✅' : '❌'}`);
  console.log(`  ingestion_feed:  ${feedCount}/22 ${feedOk ? '✅' : '❌'}`);

  // Spot check: PRJ-001 overall_risk_score
  const { data: prj001, error: prjErr } = await supabase
    .from('projects')
    .select('id, name, overall_risk_score')
    .eq('id', 'PRJ-001')
    .single();

  if (prjErr || !prj001) {
    console.error('  ❌ Could not fetch PRJ-001 for spot-check.');
    return false;
  }

  const expectedScore = seedProjects.find(p => p.id === 'PRJ-001').overall_risk_score;
  const scoreOk = Math.abs(prj001.overall_risk_score - expectedScore) <= 0.5;
  console.log(`  PRJ-001 risk_score: ${prj001.overall_risk_score} (expected ${expectedScore}) ${scoreOk ? '✅' : '❌'}`);

  return projOk && feedOk && scoreOk;
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  console.log('=== TerraNex AI — Supabase Seed Script ===');
  console.log(`Target: ${SUPABASE_URL}`);

  const p = await seedProjects_();
  const f = await seedFeed();

  if (!p || !f) {
    console.error('\n❌ Seeding failed. See errors above.');
    process.exit(1);
  }

  const verified = await verifyRowCounts();

  if (verified) {
    console.log('\n✅ All data seeded and verified successfully.');
    console.log('   Supabase is ready as the primary data source for TerraNex AI.');
  } else {
    console.error('\n❌ Verification failed. Check data and re-run.');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
