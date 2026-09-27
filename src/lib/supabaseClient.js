/**
 * src/lib/supabaseClient.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Browser-safe Supabase client for the TerraNex AI frontend.
 *
 * SECURITY:
 *   - Uses VITE_SUPABASE_ANON_KEY only — this key is safe for the browser.
 *   - The service-role key is NEVER used here.
 *   - RLS on the Supabase side ensures anon users can only SELECT (read) data.
 *
 * USAGE:
 *   import { supabase, isSupabaseReady } from '../lib/supabaseClient';
 *
 * ENVIRONMENT (add to .env):
 *   VITE_SUPABASE_URL=https://<your-project>.supabase.co
 *   VITE_SUPABASE_ANON_KEY=<your-anon-key>
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseReady = Boolean(supabaseUrl) && Boolean(supabaseAnonKey);

export const supabase = isSupabaseReady
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    })
  : null;
