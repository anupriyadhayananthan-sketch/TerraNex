/**
 * Risk recompute formula per prompt specification (§5)
 */
export function computeRiskScore(project, overrides = {}) {
  const p = { ...project, ...overrides };
  const stageMult = {
    "Notification": 0.3,
    "SIA/Approvals": 0.5,
    "Compensation": 0.9,
    "R&R": 0.7,
    "Possession": 0.8
  }[p.current_stage] || 0.5;

  const overdueRatio = Math.min(p.months_since_notification / 12, 3);

  const delayProbability = Math.min(40, stageMult * 40 * Math.min(1, 0.4 + overdueRatio * 0.3));
  const overdueSeverity = Math.min(20, overdueRatio * 8);
  const compRrExposure = Math.min(15, ((100 - p.compensation_disbursed_pct) / 100 * 10) + ((100 - p.rr_progress_pct) / 100 * 5));
  const legalExposure = Math.min(15, (Math.min(p.legal_disputes_count, 10) / 10) * 15);
  const freshness = Math.min(10, (Math.min(p.last_synced_days_ago, 30) / 30) * 10);
  const stakeholderBonus = (p.stakeholder_responsiveness_score / 100) * 6;

  const raw = delayProbability + overdueSeverity + compRrExposure + legalExposure + freshness - stakeholderBonus;
  return Math.max(3, Math.min(97, Math.round(raw * 10) / 10));
}

export function getRiskCategory(score) {
  if (score >= 65) return "High";
  if (score >= 35) return "Medium";
  return "Low";
}

export function getRiskColor(categoryOrScore) {
  let cat = categoryOrScore;
  if (typeof categoryOrScore === 'number') {
    cat = getRiskCategory(categoryOrScore);
  }
  switch (cat) {
    case 'High':
      return '#dc2626';
    case 'Medium':
      return '#f59e0b';
    case 'Low':
      return '#16a34a';
    default:
      return '#6b7280';
  }
}
