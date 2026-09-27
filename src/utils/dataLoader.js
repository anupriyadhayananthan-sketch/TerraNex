import rawProjectsData from '../data/seed_projects_dataset.json';
import rawFeedData from '../data/ingestion_feed_dataset.json';
import rawMLExplanations from '../data/ml_explanations.json';
import rawRiskTrendData from '../data/risk_trend_history.json';

// In-memory runtime cache for projects & feed
let projectsCache = [...(rawProjectsData.projects || [])];
let feedCache = [...(rawFeedData.feed || [])];

export function getAllProjects() {
  return projectsCache;
}

export function getProjectById(id) {
  return projectsCache.find(p => p.id === id) || null;
}

export function getMLExplanationsForProject(id) {
  return rawMLExplanations[id] || null;
}

export function getRiskTrendHistory(id) {
  return rawRiskTrendData.history?.[id] || null;
}

export function getDisplayRiskScore(project, feed = feedCache) {
  if (!project) return { score: 0, hasDisputeFriction: false, originalScore: 0, disputeCount: 0 };
  
  const originalScore = project.overall_risk_score;
  const currentFeed = feed || feedCache;
  const disputeCount = currentFeed.filter(
    item => item.linked_project_id === project.id && item.dispute_related === true
  ).length;

  const hasDisputeFriction = disputeCount >= 2;
  const bumpedScore = hasDisputeFriction ? Math.min(97, originalScore + 5) : originalScore;

  return {
    score: bumpedScore,
    hasDisputeFriction,
    originalScore,
    disputeCount
  };
}

export function updateProjectSyncState(id, daysAgo = 0) {
  const idx = projectsCache.findIndex(p => p.id === id);
  if (idx !== -1) {
    projectsCache[idx] = {
      ...projectsCache[idx],
      last_synced_days_ago: daysAgo
    };
  }
}

export function getHighRiskProjects() {
  return projectsCache
    .filter(p => p.risk_category === 'High')
    .sort((a, b) => b.overall_risk_score - a.overall_risk_score);
}

export function getDatasetStats() {
  const projects = getAllProjects();
  const total = projects.length;
  const highRiskCount = projects.filter(p => p.risk_category === 'High').length;
  const mediumRiskCount = projects.filter(p => p.risk_category === 'Medium').length;
  const lowRiskCount = projects.filter(p => p.risk_category === 'Low').length;
  
  const totalConfidence = projects.reduce((acc, p) => acc + (p.data_confidence_pct || 0), 0);
  const avgConfidence = total > 0 ? (totalConfidence / total).toFixed(1) : 0;

  return {
    total,
    highRiskCount,
    mediumRiskCount,
    lowRiskCount,
    avgConfidence
  };
}

export function getProjectsByState() {
  const projects = getAllProjects();
  const stateCounts = {};
  projects.forEach(p => {
    stateCounts[p.state] = (stateCounts[p.state] || 0) + 1;
  });
  return Object.keys(stateCounts).map(state => ({
    state,
    count: stateCounts[state]
  }));
}

export function getRiskDistribution() {
  const stats = getDatasetStats();
  return [
    { name: 'High Risk', category: 'High', value: stats.highRiskCount, color: '#dc2626' },
    { name: 'Medium Risk', category: 'Medium', value: stats.mediumRiskCount, color: '#f59e0b' },
    { name: 'Low Risk', category: 'Low', value: stats.lowRiskCount, color: '#16a34a' }
  ];
}

export function getIngestionFeed() {
  return feedCache;
}

export function prependFeedEntry(entry) {
  feedCache = [entry, ...feedCache];
  return feedCache;
}
