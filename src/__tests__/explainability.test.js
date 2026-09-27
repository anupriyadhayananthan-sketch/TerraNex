import { describe, it, expect } from 'vitest';
import rawMLExplanations from '../data/ml_explanations.json';
import rawProjectsData from '../data/seed_projects_dataset.json';
import { getMLExplanationsForProject } from '../utils/dataLoader';

describe('src/__tests__/explainability.test.js — ML Tier 2 Explainability Suite', () => {
  it('verifies all 10 project IDs in ml_explanations.json exist in seed dataset', () => {
    const mlIds = Object.keys(rawMLExplanations);
    expect(mlIds.length).toBe(10);
    
    const seedIds = new Set(rawProjectsData.projects.map(p => p.id));
    mlIds.forEach(id => {
      expect(seedIds.has(id)).toBe(true);
    });
  });

  it('verifies each of the 10 ML explanation objects contains at least 1 top_driver', () => {
    Object.keys(rawMLExplanations).forEach(id => {
      const entry = rawMLExplanations[id];
      expect(entry.top_drivers).toBeDefined();
      expect(entry.top_drivers.length).toBeGreaterThan(0);
      expect(entry.model_type).toBeDefined();
    });
  });

  it('getMLExplanationsForProject returns ML object for target ID PRJ-001', () => {
    const mlObj = getMLExplanationsForProject('PRJ-001');
    expect(mlObj).not.toBeNull();
    expect(mlObj.model_type).toContain('GradientBoosting');
  });

  it('getMLExplanationsForProject returns null for rule-based project PRJ-002', () => {
    const mlObj = getMLExplanationsForProject('PRJ-002');
    expect(mlObj).toBeNull();
  });
});
