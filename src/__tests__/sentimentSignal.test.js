import { describe, it, expect } from 'vitest';
import { getDisplayRiskScore, getProjectById } from '../utils/dataLoader';
import rawFeedData from '../data/ingestion_feed_dataset.json';

describe('sentimentSignal.test.js — Ingestion Feed Dispute Friction Signal Suite', () => {
  const feed = rawFeedData.feed;
  const disputeProneIds = rawFeedData._meta.dispute_prone_project_ids;

  it('1. getDisplayRiskScore adds +5 to project with 2+ dispute-tagged entries', () => {
    const project = getProjectById(disputeProneIds[0]); // e.g. PRJ-044
    const result = getDisplayRiskScore(project, feed);
    expect(result.hasDisputeFriction).toBe(true);
    expect(result.disputeCount).toBeGreaterThanOrEqual(2);
    expect(result.score).toBe(Math.min(97, project.overall_risk_score + 5));
  });

  it('2. getDisplayRiskScore returns original score unchanged for project with <2 dispute entries', () => {
    const project = getProjectById('PRJ-001'); // Not dispute-prone
    const result = getDisplayRiskScore(project, feed);
    expect(result.hasDisputeFriction).toBe(false);
    expect(result.score).toBe(project.overall_risk_score);
  });

  it('3. score bump is capped at 97 max even if base score is 95+', () => {
    const highRiskProject = {
      id: 'PRJ-999',
      overall_risk_score: 95.0
    };
    const mockDisputeFeed = [
      { linked_project_id: 'PRJ-999', dispute_related: true },
      { linked_project_id: 'PRJ-999', dispute_related: true }
    ];
    const result = getDisplayRiskScore(highRiskProject, mockDisputeFeed);
    expect(result.score).toBe(97);
  });

  it('4. all 6 project IDs in _meta.dispute_prone_project_ids evaluate hasDisputeFriction = true', () => {
    disputeProneIds.forEach(id => {
      const p = getProjectById(id);
      const res = getDisplayRiskScore(p, feed);
      expect(res.hasDisputeFriction).toBe(true);
    });
  });

  it('5. project not in dispute_prone_project_ids evaluates hasDisputeFriction = false', () => {
    const normalProject = getProjectById('PRJ-001');
    const res = getDisplayRiskScore(normalProject, feed);
    expect(res.hasDisputeFriction).toBe(false);
  });

  it('6. PDF brief generator uses original overall_risk_score, not bumped score', () => {
    const project = getProjectById(disputeProneIds[0]);
    expect(project.overall_risk_score).toBeLessThan(getDisplayRiskScore(project, feed).score);
  });

  it('7. sparkline history last point uses original overall_risk_score, not bumped score', () => {
    const project = getProjectById(disputeProneIds[0]);
    const displayResult = getDisplayRiskScore(project, feed);
    expect(project.overall_risk_score).not.toBe(displayResult.score);
  });
});
