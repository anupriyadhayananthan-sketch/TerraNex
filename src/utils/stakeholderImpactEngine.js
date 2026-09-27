/**
 * stakeholderImpactEngine.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Rule-based engine for the Historical Precedent & Impact Simulator.
 * All business logic is isolated here so it can later be replaced by an ML model.
 *
 * IMPORTANT: This module uses transparent rule-based logic derived from
 * project attributes and historical patterns. It does NOT make final decisions.
 * Results are scenario-based estimates and should not be interpreted as
 * guaranteed outcomes.
 */

// ─── Driver keyword taxonomy ──────────────────────────────────────────────────
const DRIVER_GROUPS = {
  compensation: [
    'compensation',
    'pending compensation',
    'compensation disbursement',
    'compensation dispute',
  ],
  rr: [
    'r&r',
    'rehabilitation',
    'resettlement',
    'r&r progress',
    'r&r delay',
  ],
  legal: [
    'legal',
    'dispute',
    'legal dispute',
    'unresolved legal',
    'court',
  ],
  documentation: [
    'documentation',
    'incomplete documentation',
    'documentation completeness',
  ],
  administrative: [
    'approval',
    'notification backlog',
    'administrative',
    'administrative delay',
    'backlog',
  ],
  landowner: [
    'landowner',
    'farmer',
    'objection',
    'farmer objections',
    'landowner objections',
    'stakeholder',
  ],
};

/**
 * Classify a driver string into a driver group key.
 */
function classifyDriver(driverStr) {
  const lower = (driverStr || '').toLowerCase();
  for (const [group, keywords] of Object.entries(DRIVER_GROUPS)) {
    if (keywords.some((kw) => lower.includes(kw))) return group;
  }
  return 'other';
}

/**
 * Extract driver groups from a project's top_drivers array.
 */
function getDriverGroups(project) {
  const drivers = project.top_drivers || [];
  return drivers.map((d) => classifyDriver(d.factor));
}

// ─── Similarity calculation ────────────────────────────────────────────────────

/**
 * Calculate similarity between a current project and a historical project.
 * Returns:
 *   { score: number (0-100), matchedFactors: string[], unmatchedFactors: string[] }
 */
export function calculateSimilarity(currentProject, historicalProject) {
  if (!currentProject || !historicalProject) return { score: 0, matchedFactors: [], unmatchedFactors: [] };
  if (currentProject.id === historicalProject.id) return { score: 0, matchedFactors: [], unmatchedFactors: [] };

  const matchedFactors = [];
  const unmatchedFactors = [];
  let totalWeight = 0;
  let earnedWeight = 0;

  // Driver overlap (weight: 40)
  const currGroups = new Set(getDriverGroups(currentProject));
  const histGroups = new Set(getDriverGroups(historicalProject));
  const driverWeight = 40;
  totalWeight += driverWeight;
  const allGroups = new Set([...currGroups, ...histGroups]);
  let driverMatch = 0;
  allGroups.forEach((g) => {
    if (currGroups.has(g) && histGroups.has(g)) {
      driverMatch++;
      matchedFactors.push(`${g.charAt(0).toUpperCase() + g.slice(1)} issue`);
    } else if (currGroups.has(g)) {
      unmatchedFactors.push(`${g.charAt(0).toUpperCase() + g.slice(1)} issue (current only)`);
    }
  });
  earnedWeight += allGroups.size > 0 ? (driverMatch / Math.max(currGroups.size, 1)) * driverWeight : 0;

  // Project type (weight: 15)
  totalWeight += 15;
  if ((currentProject.project_type || '').toLowerCase() === (historicalProject.project_type || '').toLowerCase()) {
    earnedWeight += 15;
    matchedFactors.push('Similar project type');
  } else {
    unmatchedFactors.push('Different project type');
  }

  // Risk category (weight: 15)
  totalWeight += 15;
  if ((currentProject.risk_category || '') === (historicalProject.risk_category || '')) {
    earnedWeight += 15;
    matchedFactors.push('Similar risk category');
  } else {
    unmatchedFactors.push('Different risk category');
  }

  // Risk score proximity (weight: 10)
  totalWeight += 10;
  const riskDiff = Math.abs((currentProject.overall_risk_score || 0) - (historicalProject.overall_risk_score || 0));
  if (riskDiff <= 10) {
    earnedWeight += 10;
    matchedFactors.push('Similar risk level');
  } else if (riskDiff <= 25) {
    earnedWeight += 5;
    matchedFactors.push('Somewhat similar risk level');
  } else {
    unmatchedFactors.push('Significantly different risk level');
  }

  // State/region (weight: 10)
  totalWeight += 10;
  if ((currentProject.state || '') === (historicalProject.state || '')) {
    earnedWeight += 10;
    matchedFactors.push('Same state/region');
  } else {
    unmatchedFactors.push('Different state/region');
  }

  // Compensation disbursement proximity (weight: 10)
  totalWeight += 10;
  const compDiff = Math.abs(
    (currentProject.compensation_disbursed_pct || 0) - (historicalProject.compensation_disbursed_pct || 0)
  );
  if (compDiff <= 15) {
    earnedWeight += 10;
    matchedFactors.push('Similar compensation disbursement level');
  } else if (compDiff <= 30) {
    earnedWeight += 5;
    matchedFactors.push('Somewhat similar compensation level');
  } else {
    unmatchedFactors.push('Different compensation disbursement level');
  }

  const score = Math.round((earnedWeight / totalWeight) * 100);
  return { score: Math.min(98, Math.max(0, score)), matchedFactors, unmatchedFactors };
}

/**
 * Find top N similar historical cases for a given current project.
 */
export function findSimilarCases(currentProject, allProjects, topN = 5) {
  if (!currentProject || !allProjects) return [];

  const results = allProjects
    .filter((p) => p.id !== currentProject.id)
    .map((p) => {
      const { score, matchedFactors, unmatchedFactors } = calculateSimilarity(currentProject, p);
      return { project: p, similarity: score, matchedFactors, unmatchedFactors };
    })
    .filter((r) => r.similarity >= 30)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topN);

  return results;
}

// ─── Historical case enrichment ────────────────────────────────────────────────

/**
 * Derive a synthetic historical action/outcome for a project based on its
 * dominant driver profile.
 */
export function deriveHistoricalRecord(project) {
  const groups = getDriverGroups(project);
  const dominant = groups[0] || 'other';
  const risk = project.overall_risk_score || 0;
  const compPct = project.compensation_disbursed_pct || 0;
  const rrPct = project.rr_progress_pct || 0;
  const legalCount = project.legal_disputes_count || 0;

  const actionMap = {
    compensation: {
      problem: `Pending compensation disbursement (${compPct}% disbursed)`,
      actionTaken: 'Accelerated compensation processing with District Collector oversight',
      outcome: legalCount > 3 ? 'Partially resolved — legal disputes persist' : 'Compensation disbursement accelerated; farmer satisfaction improved',
      resolutionDays: 30 + Math.round(risk / 4),
      improved: compPct < 70,
    },
    rr: {
      problem: `R&R progress lagging (${rrPct}% complete)`,
      actionTaken: 'Enhanced R&R support with dedicated welfare officers',
      outcome: 'R&R families received additional support; progress accelerated',
      resolutionDays: 45 + Math.round(risk / 5),
      improved: true,
    },
    legal: {
      problem: `${legalCount} active/unresolved legal disputes`,
      actionTaken: 'Fast-track dispute resolution committee constituted',
      outcome: legalCount > 5 ? 'Disputes reduced by ~60%; some cases remain' : 'Legal disputes resolved; possession proceedings resumed',
      resolutionDays: 60 + Math.round(legalCount * 5),
      improved: true,
    },
    documentation: {
      problem: `Documentation completeness at ${project.documentation_completeness_pct || 0}%`,
      actionTaken: 'Documentation acceleration drive with dedicated staff',
      outcome: 'Documentation completed; approval process unblocked',
      resolutionDays: 20 + Math.round(risk / 6),
      improved: true,
    },
    administrative: {
      problem: 'Approval/notification backlog causing statutory deadline breach',
      actionTaken: 'Administrative resources augmented; priority review scheduled',
      outcome: 'Approval backlog cleared; statutory compliance restored',
      resolutionDays: 25 + Math.round(risk / 5),
      improved: true,
    },
    landowner: {
      problem: 'Landowner/farmer objections blocking acquisition progress',
      actionTaken: 'Grievance redressal camp conducted with District Officer',
      outcome: 'Objections addressed; landowner participation improved',
      resolutionDays: 35 + Math.round(risk / 4),
      improved: true,
    },
    other: {
      problem: 'Multiple compounding delay factors identified',
      actionTaken: 'Joint stakeholder consultation and inter-departmental review',
      outcome: 'Inter-departmental coordination improved; delays partially reduced',
      resolutionDays: 50,
      improved: false,
    },
  };

  return actionMap[dominant] || actionMap['other'];
}

// ─── Available actions catalog ─────────────────────────────────────────────────

export const AVAILABLE_ACTIONS = [
  {
    id: 'grievance_camp',
    label: 'Conduct Grievance Redressal Camp',
    shortLabel: 'Grievance Camp',
    icon: '🏕️',
    description: 'Organise a dedicated camp where affected farmers and landowners can directly raise compensation, R&R, or documentation concerns with district officers.',
    targetDrivers: ['compensation', 'landowner', 'rr'],
  },
  {
    id: 'accelerate_compensation',
    label: 'Accelerate Compensation Processing',
    shortLabel: 'Compensation Acceleration',
    icon: '💰',
    description: 'Assign dedicated finance officers to fast-track pending disbursement cases with weekly tracking and DC oversight.',
    targetDrivers: ['compensation'],
  },
  {
    id: 'increase_compensation',
    label: 'Increase Compensation Offer',
    shortLabel: 'Compensation Increase',
    icon: '📈',
    description: 'Propose enhanced compensation package to address landowner objections and reduce legal dispute risk.',
    targetDrivers: ['compensation', 'landowner', 'legal'],
  },
  {
    id: 'rr_support',
    label: 'Increase R&R Support',
    shortLabel: 'R&R Support',
    icon: '🏘️',
    description: 'Deploy additional welfare officers, improve housing allotment tracking, and release pending rehabilitation grants.',
    targetDrivers: ['rr', 'landowner'],
  },
  {
    id: 'consultation',
    label: 'Community Consultation',
    shortLabel: 'Consultation',
    icon: '🤝',
    description: 'Organise structured community meetings to explain project benefits, address concerns, and build broader stakeholder consensus.',
    targetDrivers: ['landowner', 'administrative'],
  },
  {
    id: 'legal_fast_track',
    label: 'Legal Fast-Track Committee',
    shortLabel: 'Legal Fast-Track',
    icon: '⚖️',
    description: 'Constitute a dedicated fast-track dispute resolution committee with State Legal Cell involvement.',
    targetDrivers: ['legal'],
  },
  {
    id: 'admin_resources',
    label: 'Additional Administrative Resources',
    shortLabel: 'Admin Resources',
    icon: '🏛️',
    description: 'Augment district administration capacity with additional staff, inter-departmental task force, and priority review scheduling.',
    targetDrivers: ['administrative', 'documentation'],
  },
  {
    id: 'doc_acceleration',
    label: 'Documentation Acceleration Drive',
    shortLabel: 'Doc Acceleration',
    icon: '📋',
    description: 'Assign dedicated documentation officers to complete missing records, verify land titles, and unblock approval processes.',
    targetDrivers: ['documentation', 'administrative'],
  },
];

// ─── Stakeholder impact computation ───────────────────────────────────────────

export function computeBaselineImpact(project) {
  if (!project) return { farmers: 40, government: 70, contractors: 65, community: 50 };

  const compPct = project.compensation_disbursed_pct || 0;
  const rrPct = project.rr_progress_pct || 0;
  const legalCount = project.legal_disputes_count || 0;
  const docPct = project.documentation_completeness_pct || 0;
  const responsiveness = project.stakeholder_responsiveness_score || 50;
  const riskScore = project.overall_risk_score || 50;

  const farmers = Math.round(
    compPct * 0.4 +
    rrPct * 0.3 +
    Math.max(0, 30 - legalCount * 2) +
    (responsiveness > 60 ? 5 : 0)
  );

  const government = Math.round(
    docPct * 0.4 +
    Math.max(0, 80 - riskScore * 0.5) +
    (legalCount === 0 ? 10 : 0)
  );

  const contractorBase = project.stage_risks?.Possession
    ? Math.max(0, 100 - project.stage_risks.Possession)
    : 65;
  const contractors = Math.round(
    contractorBase * 0.6 +
    Math.max(0, 30 - legalCount * 3) +
    (docPct > 80 ? 5 : 0)
  );

  const community = Math.round(
    responsiveness * 0.4 +
    compPct * 0.2 +
    rrPct * 0.2 +
    (legalCount <= 2 ? 15 : 5)
  );

  return {
    farmers: Math.min(95, Math.max(10, farmers)),
    government: Math.min(95, Math.max(10, government)),
    contractors: Math.min(95, Math.max(10, contractors)),
    community: Math.min(95, Math.max(10, community)),
  };
}

export function computeStakeholderImpact(currentProject, actionId, similarCases = []) {
  const action = AVAILABLE_ACTIONS.find((a) => a.id === actionId);
  if (!action || !currentProject) return null;

  const baseline = computeBaselineImpact(currentProject);
  const evidenceCount = similarCases.length;
  const evidenceBoost = evidenceCount >= 4 ? 1.1 : evidenceCount >= 2 ? 1.0 : 0.85;

  const deltaMap = {
    grievance_camp: {
      farmers: { delta: 38, reasons: ['Grievance concerns directly heard by officer', 'Faster response commitment made', 'Reduced uncertainty for affected families', 'Improved communication channel established'] },
      government: { delta: -8, reasons: ['Additional officer time required', 'Logistics and coordination cost', 'Short-term administrative workload increase'] },
      contractors: { delta: 7, reasons: ['Reduced probability of work stoppage', 'Better project continuity signals', 'Improved local acceptance'] },
      community: { delta: 32, reasons: ['Direct participation opportunity', 'Voices formally heard', 'Reduced local resistance', 'Improved trust in administration'] },
    },
    accelerate_compensation: {
      farmers: { delta: 42, reasons: ['Direct financial benefit to affected families', 'Reduced wait time for compensation', 'Financial security improved', 'Fewer pending cases causing distress'] },
      government: { delta: -12, reasons: ['Financial outflow accelerated', 'Officer monitoring workload increases', 'Weekly tracking meetings required'] },
      contractors: { delta: 10, reasons: ['Land possession can proceed faster', 'Fewer farmer-contractor disputes', 'Work schedule improves'] },
      community: { delta: 18, reasons: ['Community sees administration responding quickly', 'Reduced displacement anxiety'] },
    },
    increase_compensation: {
      farmers: { delta: 48, reasons: ['Higher monetary offer directly benefits landowners', 'Reduces objections and appeals', 'Market-rate or above-market compensation', 'Improved acceptance of acquisition'] },
      government: { delta: -18, reasons: ['Higher fiscal outlay required', 'May set precedent for other projects', 'Budget approval needed', 'Additional financial scrutiny'] },
      contractors: { delta: -5, reasons: ['Slightly delayed timeline due to package renegotiation', 'Additional approvals needed before proceeding'] },
      community: { delta: 28, reasons: ['Community perceives fairer treatment', 'Reduced social unrest', 'Improved government trust'] },
    },
    rr_support: {
      farmers: { delta: 35, reasons: ['Better housing allotment and tracking', 'Pending rehabilitation grants released', 'Additional welfare officer support', 'R&R timeline improved'] },
      government: { delta: -10, reasons: ['Additional welfare officers needed', 'Grant disbursement workload', 'Coordination with R&R committee required'] },
      contractors: { delta: 12, reasons: ['Possession of land can proceed with fewer R&R holdups', 'Fewer family protests at site'] },
      community: { delta: 42, reasons: ['Displaced families receive better support', 'Community sees stronger safety net', 'Long-term livelihood concerns addressed', 'Improved resettlement satisfaction'] },
    },
    consultation: {
      farmers: { delta: 22, reasons: ['Concerns formally registered', 'Project benefits explained clearly', 'Reduced uncertainty', 'Participation opportunity given'] },
      government: { delta: -6, reasons: ['Meeting organisation cost', 'Officer time for facilitation', 'Follow-up action items created'] },
      contractors: { delta: 8, reasons: ['Reduced community opposition to site work', 'Better local cooperation expected'] },
      community: { delta: 38, reasons: ['Strongest direct benefit to community', 'Voice in process provided', 'Informed consent improved', 'Reduced social conflict', 'Community ownership of outcome'] },
    },
    legal_fast_track: {
      farmers: { delta: 18, reasons: ['Faster resolution of compensation disputes', 'Legal uncertainty reduced', 'Appeals heard promptly'] },
      government: { delta: -15, reasons: ['Legal Cell resource deployment', 'Committee formation and meetings', 'Judicial coordination workload'] },
      contractors: { delta: 20, reasons: ['Legal disputes no longer blocking site possession', 'Court-imposed stays lifted faster', 'Project timeline de-risked'] },
      community: { delta: 10, reasons: ['Rule of law demonstrated', 'Disputes resolved fairly', 'Reduced prolonged uncertainty'] },
    },
    admin_resources: {
      farmers: { delta: 12, reasons: ['Faster processing of pending cases', 'Reduced waiting time', 'More staff available for queries'] },
      government: { delta: 8, reasons: ['Increased internal capacity reduces bottlenecks', 'Better project monitoring', 'Improved compliance tracking'] },
      contractors: { delta: 15, reasons: ['Administrative approvals faster', 'Fewer inter-departmental delays', 'Site clearances expedited'] },
      community: { delta: 10, reasons: ['Faster resolution of community concerns', 'More accessible administration'] },
    },
    doc_acceleration: {
      farmers: { delta: 10, reasons: ['Compensation cases unblocked by documentation', 'Land titles verified faster', 'Less uncertainty from missing records'] },
      government: { delta: 12, reasons: ['Statutory compliance restored', 'Approval process unblocked', 'Reduced legal vulnerability from gaps'] },
      contractors: { delta: 18, reasons: ['Environmental/forestry clearances unblocked', 'Project timeline freed from documentation holds'] },
      community: { delta: 8, reasons: ['Faster overall project progress signals commitment', 'Less prolonged disruption to local area'] },
    },
  };

  const deltas = deltaMap[actionId] || {};

  const applyDelta = (base, delta) => {
    const scaled = Math.round(delta * evidenceBoost);
    return {
      current: base,
      simulated: Math.min(97, Math.max(5, base + scaled)),
      delta: scaled,
    };
  };

  return {
    action,
    baseline,
    farmers: {
      ...applyDelta(baseline.farmers, deltas.farmers?.delta || 0),
      reasons: deltas.farmers?.reasons || ['Impact analysis not available for this action'],
      label: 'Farmers / Landowners',
      emoji: '👨‍🌾',
    },
    government: {
      ...applyDelta(baseline.government, deltas.government?.delta || 0),
      reasons: deltas.government?.reasons || ['Impact analysis not available for this action'],
      label: 'Government / Administration',
      emoji: '🏛️',
    },
    contractors: {
      ...applyDelta(baseline.contractors, deltas.contractors?.delta || 0),
      reasons: deltas.contractors?.reasons || ['Impact analysis not available for this action'],
      label: 'Contractors',
      emoji: '🏗️',
    },
    community: {
      ...applyDelta(baseline.community, deltas.community?.delta || 0),
      reasons: deltas.community?.reasons || ['Impact analysis not available for this action'],
      label: 'Local Community',
      emoji: '🏘️',
    },
    evidenceCount,
    evidenceStrength: evidenceCount >= 4 ? 'strong' : evidenceCount >= 2 ? 'moderate' : 'limited',
  };
}

export function computeMultiActionImpact(currentProject, actionIds, similarCases = []) {
  return actionIds
    .map((id) => computeStakeholderImpact(currentProject, id, similarCases))
    .filter(Boolean);
}
