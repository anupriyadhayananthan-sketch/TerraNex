import { describe, it, expect } from 'vitest';
import rawData from '../data/seed_projects_dataset.json';
import { getAllProjects, getProjectById, getDatasetStats } from '../utils/dataLoader';

describe('dataLoader.test.js — Data Integrity Suite', () => {
  it('loads JSON dataset file without throwing', () => {
    expect(rawData).toBeDefined();
    expect(rawData.projects).toBeDefined();
  });

  it('contains exactly 52 projects in the dataset', () => {
    const projects = getAllProjects();
    expect(projects.length).toBe(52);
  });

  it('verifies every project has all required fields present with non-null critical values', () => {
    const projects = getAllProjects();
    projects.forEach((p) => {
      expect(p.id).toBeDefined();
      expect(typeof p.id).toBe('string');
      expect(p.name).toBeDefined();
      expect(p.state).toBeDefined();
      expect(p.district).toBeDefined();
      expect(p.current_stage).toBeDefined();
      expect(p.overall_risk_score).toBeDefined();
      expect(typeof p.overall_risk_score).toBe('number');
      expect(p.risk_category).toBeDefined();
      expect(p.coordinates).toBeDefined();
      expect(p.coordinates.lat).toBeDefined();
      expect(p.coordinates.lng).toBeDefined();
    });
  });

  it('verifies every risk_category value is strictly one of High, Medium, Low', () => {
    const projects = getAllProjects();
    const validCategories = new Set(['High', 'Medium', 'Low']);
    projects.forEach((p) => {
      expect(validCategories.has(p.risk_category)).toBe(true);
    });
  });

  it('verifies every coordinate lat/lng falls within India bounding box (lat 6-38, lng 68-98)', () => {
    const projects = getAllProjects();
    projects.forEach((p) => {
      expect(p.coordinates.lat).toBeGreaterThanOrEqual(6);
      expect(p.coordinates.lat).toBeLessThanOrEqual(38);
      expect(p.coordinates.lng).toBeGreaterThanOrEqual(68);
      expect(p.coordinates.lng).toBeLessThanOrEqual(98);
    });
  });

  it('verifies there are no duplicate project IDs across all 52 projects', () => {
    const projects = getAllProjects();
    const ids = projects.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(52);
  });

  it('getProjectById retrieves correct project by ID', () => {
    const prj = getProjectById('PRJ-001');
    expect(prj).not.toBeNull();
    expect(prj.name).toBe('Patna-West Peripheral Ring Road');
  });

  it('getDatasetStats returns correct total, high-risk count, and confidence', () => {
    const stats = getDatasetStats();
    expect(stats.total).toBe(52);
    expect(stats.highRiskCount).toBe(11);
    expect(Number(stats.avgConfidence)).toBeGreaterThan(50);
  });
});
