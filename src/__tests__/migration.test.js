/**
 * src/__tests__/migration.test.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Data parity test: verifies that the static JSON source files and the
 * Supabase database contain consistent data.
 *
 * When Supabase is NOT configured: tests verify the static JSON files are
 * internally consistent and ready to be migrated (row counts, schema shape).
 *
 * When Supabase IS configured: tests assert row counts and spot-check values
 * match between static JSON and the live Supabase tables.
 */

import { describe, it, expect } from 'vitest';
import rawProjectsData from '../data/seed_projects_dataset.json';
import rawFeedData from '../data/ingestion_feed_dataset.json';

describe('migration.test.js — Data Parity & Migration Verification Suite', () => {
  const seedProjects = rawProjectsData.projects;
  const feedItems = rawFeedData.feed;

  // ── Static JSON integrity (always runs) ─────────────────────────────────────

  it('1. static JSON: seed_projects_dataset.json contains exactly 52 projects', () => {
    expect(seedProjects.length).toBe(52);
  });

  it('2. static JSON: ingestion_feed_dataset.json contains exactly 22 feed items', () => {
    expect(feedItems.length).toBe(22);
  });

  it('3. static JSON: every project has a valid primary key (non-empty string)', () => {
    seedProjects.forEach(p => {
      expect(typeof p.id).toBe('string');
      expect(p.id.length).toBeGreaterThan(0);
    });
  });

  it('4. static JSON: no duplicate project IDs across all 52 projects', () => {
    const ids = seedProjects.map(p => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(52);
  });

  it('5. static JSON: every feed item has a valid id and matches FK constraint (linked_project_id in projects or null)', () => {
    const projectIds = new Set(seedProjects.map(p => p.id));
    feedItems.forEach(item => {
      expect(typeof item.id).toBe('string');
      if (item.linked_project_id !== null) {
        expect(projectIds.has(item.linked_project_id)).toBe(true);
      }
    });
  });

  it('6. static JSON: PRJ-001 overall_risk_score matches expected value (22.7) within ±0.5', () => {
    const prj001 = seedProjects.find(p => p.id === 'PRJ-001');
    expect(prj001).toBeDefined();
    expect(Math.abs(prj001.overall_risk_score - 22.7)).toBeLessThanOrEqual(0.5);
  });

  it('7. static JSON: all 52 projects have coordinates within India bounding box', () => {
    seedProjects.forEach(p => {
      expect(p.coordinates).toBeDefined();
      expect(p.coordinates.lat).toBeGreaterThanOrEqual(6);
      expect(p.coordinates.lat).toBeLessThanOrEqual(38);
      expect(p.coordinates.lng).toBeGreaterThanOrEqual(68);
      expect(p.coordinates.lng).toBeLessThanOrEqual(98);
    });
  });

  it('8. static JSON: all JSONB-targeted fields are valid objects/arrays (no string corruption)', () => {
    seedProjects.forEach(p => {
      // stage_risks
      expect(typeof p.stage_risks).toBe('object');
      expect(p.stage_risks).not.toBeNull();
      // top_drivers
      expect(Array.isArray(p.top_drivers)).toBe(true);
      // coordinates
      expect(typeof p.coordinates).toBe('object');
      expect(typeof p.coordinates.lat).toBe('number');
      expect(typeof p.coordinates.lng).toBe('number');
    });
  });

  it('9. static JSON: 6 dispute_prone_project_ids all exist in projects dataset', () => {
    const disputeProneIds = rawFeedData._meta.dispute_prone_project_ids;
    const projectIds = new Set(seedProjects.map(p => p.id));
    expect(disputeProneIds.length).toBe(6);
    disputeProneIds.forEach(id => {
      expect(projectIds.has(id)).toBe(true);
    });
  });

  // ── Supabase parity (conditional on Supabase being configured) ──────────────

  it('10. Supabase parity: if Supabase is configured, project count matches static JSON (52)', async () => {
    const { isSupabaseConfigured, fetchAllProjects } = await import('@server/dataAccess/supabaseClient.js');

    if (!isSupabaseConfigured) {
      console.log('[migration.test] Supabase not configured — skipping live parity check.');
      expect(true).toBe(true); // pass
      return;
    }

    const projects = await fetchAllProjects();
    expect(projects).not.toBeNull();
    expect(projects.length).toBe(52);
  });

  it('11. Supabase parity: if Supabase is configured, PRJ-001 risk score matches static JSON ±0.5', async () => {
    const { isSupabaseConfigured, fetchProjectById } = await import('@server/dataAccess/supabaseClient.js');

    if (!isSupabaseConfigured) {
      console.log('[migration.test] Supabase not configured — skipping spot-check.');
      expect(true).toBe(true);
      return;
    }

    const liveProject = await fetchProjectById('PRJ-001');
    expect(liveProject).not.toBeNull();
    const staticProject = seedProjects.find(p => p.id === 'PRJ-001');
    expect(Math.abs(liveProject.overall_risk_score - staticProject.overall_risk_score)).toBeLessThanOrEqual(0.5);
  });

  it('12. Supabase parity: if configured, ingestion feed count matches static JSON (22)', async () => {
    const { isSupabaseConfigured, fetchIngestionFeed } = await import('@server/dataAccess/supabaseClient.js');

    if (!isSupabaseConfigured) {
      console.log('[migration.test] Supabase not configured — skipping feed parity check.');
      expect(true).toBe(true);
      return;
    }

    const feed = await fetchIngestionFeed();
    expect(feed).not.toBeNull();
    expect(feed.length).toBe(22);
  });
});
