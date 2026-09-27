import { describe, it, expect } from 'vitest';
import { getAllProjects, getRiskTrendHistory } from '../utils/dataLoader';
import rawRiskTrendData from '../data/risk_trend_history.json';

describe('riskTrend.test.js — Risk Trend History & Sparkline Suite', () => {
  const allProjects = getAllProjects();

  it('1. every project ID in main dataset has matching entry in risk_trend_history.json', () => {
    allProjects.forEach(p => {
      const history = getRiskTrendHistory(p.id);
      expect(history).not.toBeNull();
      expect(history.points).toBeDefined();
      expect(history.points.length).toBe(6);
    });
  });

  it('2. every history series last point (months_ago: 0) equals project overall_risk_score', () => {
    allProjects.forEach(p => {
      const history = getRiskTrendHistory(p.id);
      const lastPoint = history.points[history.points.length - 1];
      expect(lastPoint.months_ago).toBe(0);
      expect(lastPoint.risk_score).toBe(p.overall_risk_score);
    });
  });

  it('3. trend_direction is one of worsening, improving, or stable for all 52 entries', () => {
    allProjects.forEach(p => {
      const history = getRiskTrendHistory(p.id);
      expect(['worsening', 'improving', 'stable']).toContain(history.trend_direction);
    });
  });

  it('4. trend delta rule verification (>3 worsening, <-3 improving, else stable)', () => {
    Object.values(rawRiskTrendData.history).forEach(item => {
      const delta = item.trend_delta;
      if (delta > 3) {
        expect(item.trend_direction).toBe('worsening');
      } else if (delta < -3) {
        expect(item.trend_direction).toBe('improving');
      } else {
        expect(item.trend_direction).toBe('stable');
      }
    });
  });

  it('5. sparkline history retriever handles invalid ID gracefully', () => {
    const invalid = getRiskTrendHistory('PRJ-999');
    expect(invalid).toBeNull();
  });

  it('6. history dataset contains at least one project of each trend direction', () => {
    const directions = Object.values(rawRiskTrendData.history).map(h => h.trend_direction);
    expect(directions).toContain('worsening');
    expect(directions).toContain('improving');
    expect(directions).toContain('stable');
  });
});
