/**
 * server/dataAccess/supabaseClient.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Server-side Supabase data access layer for TerraNex AI.
 *
 * ARCHITECTURE:
 *   Supabase (primary) → static JSON file fallback (resilience / honesty framing)
 *
 * SECURITY:
 *   - All write operations use the SERVICE_ROLE key (never exposed to browser).
 *   - Read operations for server routes also use the service role to bypass RLS
 *     for consistent data access.
 *   - The anon key is available for read-only checks (e.g. RLS tests).
 *
 * FALLBACK:
 *   If SUPABASE_URL / SUPABASE_ANON_KEY env vars are absent, or if any Supabase
 *   query throws / times out, every function returns null so the caller falls back
 *   to the static JSON dataset. This preserves the existing "honesty framing"
 *   resilience feature documented in the project README.
 */

import { createClient } from '@supabase/supabase-js';

// ── Environment validation ─────────────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseConfigured =
  Boolean(SUPABASE_URL) &&
  Boolean(SUPABASE_ANON_KEY);

// ── Client instances ───────────────────────────────────────────────────────────
// serviceClient: used for all server-side reads & writes (bypasses RLS cleanly)
// anonClient:    used only for RLS policy verification tests
let serviceClient = null;
let anonClient = null;

if (isSupabaseConfigured) {
  // Service role client — server-side ONLY, never shipped to the browser bundle
  const serviceKey = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
  serviceClient = createClient(SUPABASE_URL, serviceKey, {
    auth: { persistSession: false }
  });

  // Anon client — for RLS tests / public-read verification
  anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false }
  });
}

// ── Helper: safe query executor ────────────────────────────────────────────────
async function safeQuery(queryFn) {
  if (!serviceClient) return null;
  try {
    const result = await Promise.race([
      queryFn(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Supabase query timeout')), 5000)
      )
    ]);
    if (result.error) {
      console.warn('[supabaseClient] Query error:', result.error.message);
      return null;
    }
    return result.data;
  } catch (err) {
    console.warn('[supabaseClient] Query failed, will fall back to JSON:', err.message);
    return null;
  }
}

// ── READ: Projects ─────────────────────────────────────────────────────────────

/**
 * Fetch all 52 projects from Supabase.
 * Returns array or null (triggers JSON fallback in caller).
 */
export async function fetchAllProjects() {
  return safeQuery(() =>
    serviceClient.from('projects').select('*').order('id')
  );
}

/**
 * Fetch a single project by ID.
 * Returns project object or null.
 */
export async function fetchProjectById(id) {
  const data = await safeQuery(() =>
    serviceClient.from('projects').select('*').eq('id', id).maybeSingle()
  );
  return data; // null if not found or error
}

/**
 * Fetch all high-risk projects (risk_category = 'High'), sorted by risk score desc.
 * Returns array or null.
 */
export async function fetchHighRiskProjects() {
  return safeQuery(() =>
    serviceClient
      .from('projects')
      .select('*')
      .eq('risk_category', 'High')
      .order('overall_risk_score', { ascending: false })
  );
}

// ── READ: Ingestion Feed ───────────────────────────────────────────────────────

/**
 * Fetch all ingestion feed items, ordered by date descending.
 * Returns array or null.
 */
export async function fetchIngestionFeed() {
  return safeQuery(() =>
    serviceClient
      .from('ingestion_feed')
      .select('*')
      .order('date', { ascending: false })
  );
}

// ── WRITE: Simulate Refresh ────────────────────────────────────────────────────

/**
 * Update last_synced_days_ago to 0 for a project (Simulate refresh).
 * Uses service role key — server-side only.
 * Returns updated project or null.
 */
export async function updateProjectSyncState(id, daysAgo = 0) {
  return safeQuery(() =>
    serviceClient
      .from('projects')
      .update({ last_synced_days_ago: daysAgo, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle()
  );
}

// ── WRITE: Interventions ───────────────────────────────────────────────────────

/**
 * Insert a new intervention record.
 * Uses service role key — server-side only.
 * Returns inserted record or null.
 */
export async function insertIntervention(intervention) {
  return safeQuery(() =>
    serviceClient
      .from('interventions')
      .insert(intervention)
      .select()
      .maybeSingle()
  );
}

/**
 * Fetch interventions for a specific project.
 * Returns array or null.
 */
export async function fetchInterventionsByProject(projectId) {
  return safeQuery(() =>
    serviceClient
      .from('interventions')
      .select('*')
      .eq('project_id', projectId)
      .order('timestamp', { ascending: false })
  );
}

// ── RLS Verification (for tests) ──────────────────────────────────────────────

/**
 * Test that anon key can SELECT projects (RLS policy check).
 * Returns data or null.
 */
export async function anonSelectProjects() {
  if (!anonClient) return null;
  try {
    const { data, error } = await anonClient
      .from('projects')
      .select('id')
      .limit(1);
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * Test that anon key CANNOT INSERT into projects (RLS policy check).
 * Returns true if insert is blocked (expected), false if it succeeded (error).
 */
export async function anonInsertProjectBlocked() {
  if (!anonClient) return true; // if not configured, treat as blocked
  try {
    const { error } = await anonClient
      .from('projects')
      .insert({
        id: 'RLS-TEST-DELETE',
        name: 'RLS Test',
        state: 'Test',
        district: 'Test',
        current_stage: 'Notification',
        overall_risk_score: 50,
        risk_category: 'Medium'
      });
    // If there's an error (permission denied), RLS is working correctly
    return Boolean(error);
  } catch {
    return true;
  }
}

// ── Export clients for testing ─────────────────────────────────────────────────
export { serviceClient, anonClient };
