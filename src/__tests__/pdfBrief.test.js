import { describe, it, expect, vi } from 'vitest';
import { generateOfficerBrief } from '../utils/pdfBriefGenerator';
import { getProjectById } from '../utils/dataLoader';

describe('pdfBrief.test.js — PDF Officer Brief Generator Suite', () => {
  const sampleProject = getProjectById('PRJ-001');

  it('1. generateOfficerBrief creates filename matching expected TerraNex_Brief_{id}.pdf pattern', () => {
    const filename = generateOfficerBrief(sampleProject);
    expect(filename).toBe(`TerraNex_Brief_${sampleProject.id}.pdf`);
  });

  it('2. function executes without throwing error for valid project', () => {
    expect(() => generateOfficerBrief(sampleProject)).not.toThrow();
  });

  it('3. returns null when called with null/undefined project', () => {
    expect(generateOfficerBrief(null)).toBeNull();
    expect(generateOfficerBrief(undefined)).toBeNull();
  });

  it('4. handles project with empty top_drivers array without crashing', () => {
    const projectEmptyDrivers = {
      ...sampleProject,
      id: 'PRJ-TEST',
      top_drivers: []
    };
    expect(() => generateOfficerBrief(projectEmptyDrivers)).not.toThrow();
  });

  it('5. handles project with missing recommendation gracefully', () => {
    const projectMissingRec = {
      ...sampleProject,
      id: 'PRJ-TEST2',
      recommendation: null
    };
    expect(() => generateOfficerBrief(projectMissingRec)).not.toThrow();
  });
});
