import { describe, it, expect } from 'vitest';
import { computeRiskScore, getRiskCategory, getRiskColor } from '../utils/riskFormula';
import rawData from '../data/seed_projects_dataset.json';

describe('riskFormula.test.js — Risk Recompute Formula Suite', () => {
  const projects = rawData.projects;

  it('matches computeRiskScore within ±0.5 for all 52 seed projects', () => {
    let passCount = 0;
    projects.forEach((prj) => {
      const computed = computeRiskScore(prj);
      const diff = Math.abs(computed - prj.overall_risk_score);
      if (diff <= 0.5) {
        passCount++;
      }
      expect(diff).toBeLessThanOrEqual(0.5);
    });
    console.log(`[TEST RESULT] ${passCount}/52 projects passed formula reproduction test.`);
    expect(passCount).toBe(52);
  });

  it('returns a value between 3 and 97 for edge-case input: 0% compensation', () => {
    const p = projects[0];
    const score = computeRiskScore(p, { compensation_disbursed_pct: 0 });
    expect(score).toBeGreaterThanOrEqual(3);
    expect(score).toBeLessThanOrEqual(97);
  });

  it('returns a value between 3 and 97 for edge-case input: 100% compensation', () => {
    const p = projects[0];
    const score = computeRiskScore(p, { compensation_disbursed_pct: 100 });
    expect(score).toBeGreaterThanOrEqual(3);
    expect(score).toBeLessThanOrEqual(97);
  });

  it('returns a value between 3 and 97 for edge-case input: 0 legal disputes', () => {
    const p = projects[0];
    const score = computeRiskScore(p, { legal_disputes_count: 0 });
    expect(score).toBeGreaterThanOrEqual(3);
    expect(score).toBeLessThanOrEqual(97);
  });

  it('returns a value between 3 and 97 for edge-case input: 12+ legal disputes', () => {
    const p = projects[0];
    const score = computeRiskScore(p, { legal_disputes_count: 15 });
    expect(score).toBeGreaterThanOrEqual(3);
    expect(score).toBeLessThanOrEqual(97);
  });

  it('returns a value between 3 and 97 for edge-case input: 0 months since notification', () => {
    const p = projects[0];
    const score = computeRiskScore(p, { months_since_notification: 0 });
    expect(score).toBeGreaterThanOrEqual(3);
    expect(score).toBeLessThanOrEqual(97);
  });

  it('returns a value between 3 and 97 for edge-case input: 40+ months since notification', () => {
    const p = projects[0];
    const score = computeRiskScore(p, { months_since_notification: 48 });
    expect(score).toBeGreaterThanOrEqual(3);
    expect(score).toBeLessThanOrEqual(97);
  });

  it('higher compensation_disbursed_pct leads to lower or equal risk score', () => {
    const p = projects[0];
    const lowCompScore = computeRiskScore(p, { compensation_disbursed_pct: 10 });
    const highCompScore = computeRiskScore(p, { compensation_disbursed_pct: 90 });
    expect(highCompScore).toBeLessThanOrEqual(lowCompScore);
  });

  it('risk_category boundary test: score of exactly 65 is High', () => {
    expect(getRiskCategory(65)).toBe('High');
    expect(getRiskCategory(85)).toBe('High');
  });

  it('risk_category boundary test: score of 64.9 is Medium', () => {
    expect(getRiskCategory(64.9)).toBe('Medium');
  });

  it('risk_category boundary test: score of exactly 35 is Medium', () => {
    expect(getRiskCategory(35)).toBe('Medium');
    expect(getRiskCategory(50)).toBe('Medium');
  });

  it('risk_category boundary test: score of 34.9 is Low', () => {
    expect(getRiskCategory(34.9)).toBe('Low');
    expect(getRiskCategory(10)).toBe('Low');
  });

  it('getRiskColor returns correct hex values per global color system', () => {
    expect(getRiskColor('High')).toBe('#dc2626');
    expect(getRiskColor('Medium')).toBe('#f59e0b');
    expect(getRiskColor('Low')).toBe('#16a34a');
  });
});
