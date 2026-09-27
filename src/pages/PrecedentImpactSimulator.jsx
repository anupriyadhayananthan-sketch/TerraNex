import React, { useState, useMemo, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import {
  Search,
  History,
  Zap,
  Scale,
  FileText,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ArrowRight,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  ShieldAlert,
  BarChart3,
} from 'lucide-react';
import { getAllProjects } from '../utils/dataLoader';
import {
  findSimilarCases,
  deriveHistoricalRecord,
  AVAILABLE_ACTIONS,
  computeStakeholderImpact,
  computeMultiActionImpact,
  computeBaselineImpact,
} from '../utils/stakeholderImpactEngine';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function riskColor(score) {
  if (score >= 70) return 'text-red-400';
  if (score >= 45) return 'text-amber-400';
  return 'text-emerald-400';
}

function riskBg(score) {
  if (score >= 70) return 'bg-red-500/10 border-red-500/30 text-red-400';
  if (score >= 45) return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
  return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
}

function deltaColor(delta) {
  if (delta > 0) return 'text-emerald-400';
  if (delta < 0) return 'text-red-400';
  return 'text-slate-400';
}

function deltaBg(delta) {
  if (delta > 5) return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400';
  if (delta < -3) return 'bg-red-500/15 border-red-500/30 text-red-400';
  return 'bg-slate-700/40 border-slate-600/40 text-slate-400';
}

function DeltaIcon({ delta }) {
  if (delta > 3) return <TrendingUp className="w-3.5 h-3.5" />;
  if (delta < -3) return <TrendingDown className="w-3.5 h-3.5" />;
  return <Minus className="w-3.5 h-3.5" />;
}

function SimilarityBadge({ score }) {
  const color =
    score >= 80 ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300' :
    score >= 60 ? 'bg-blue-600/20 border-blue-500/40 text-blue-300' :
                  'bg-slate-700/40 border-slate-600/40 text-slate-300';
  return (
    <span className={`px-2.5 py-0.5 rounded-full border text-xs font-bold ${color}`}>
      {score}% Match
    </span>
  );
}

function EvidenceBadge({ strength, count }) {
  const map = {
    strong: { cls: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400', label: 'Strong Historical Evidence' },
    moderate: { cls: 'bg-amber-500/15 border-amber-500/30 text-amber-400', label: 'Moderate Historical Evidence' },
    limited: { cls: 'bg-slate-700/30 border-slate-600/40 text-slate-400', label: 'Limited Historical Evidence' },
  };
  const { cls, label } = map[strength] || map.limited;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold ${cls}`}>
      <ShieldAlert className="w-3.5 h-3.5" />
      {label} — {count} case{count !== 1 ? 's' : ''}
    </span>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ icon, title, subtitle, children, className = '' }) {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl ${className}`}>
      <div className="mb-5">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          {title}
        </h2>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

// ─── Single bar row for stakeholder chart ─────────────────────────────────────
function StakeholderBarRow({ emoji, label, current, simulated, delta, onClick, selected }) {
  const maxVal = 100;
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3.5 rounded-xl border transition-all ${
        selected
          ? 'bg-indigo-950/50 border-indigo-500/50'
          : 'bg-slate-950/60 border-slate-800/60 hover:border-slate-700/60 hover:bg-slate-800/30'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
          <span>{emoji}</span> {label}
        </span>
        <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded border ${deltaBg(delta)}`}>
          <DeltaIcon delta={delta} />
          {delta > 0 ? '+' : ''}{delta}
        </span>
      </div>

      {/* Current bar */}
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[10px] text-slate-500 w-16 shrink-0">Current</span>
        <div className="flex-1 bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full bg-slate-600 rounded-full transition-all duration-700"
            style={{ width: `${(current / maxVal) * 100}%` }}
          />
        </div>
        <span className="text-[10px] text-slate-400 w-7 text-right">{current}%</span>
      </div>

      {/* Simulated bar */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-slate-500 w-16 shrink-0">Simulated</span>
        <div className="flex-1 bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              delta > 5 ? 'bg-emerald-500' : delta < -3 ? 'bg-red-500' : 'bg-indigo-500'
            }`}
            style={{ width: `${(simulated / maxVal) * 100}%` }}
          />
        </div>
        <span className="text-[10px] text-slate-400 w-7 text-right">{simulated}%</span>
      </div>
    </button>
  );
}

// ─── Historical Case Card ─────────────────────────────────────────────────────
function HistoricalCaseCard({ caseNum, similarity, matchedFactors, unmatchedFactors, project, expanded, onToggle }) {
  const record = useMemo(() => deriveHistoricalRecord(project), [project]);
  const riskCat = project.risk_category || 'Medium';

  return (
    <div className="bg-slate-950/70 border border-slate-800/60 rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full text-left p-4 flex items-start justify-between hover:bg-slate-800/30 transition-colors"
      >
        <div className="flex-1 min-w-0 mr-3">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Case #{caseNum}</span>
            <SimilarityBadge score={similarity} />
            <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${riskBg(project.overall_risk_score)}`}>
              {riskCat} Risk
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-200 truncate">{project.name}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{project.district}, {project.state} · {project.project_type}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] text-slate-500">Resolution</div>
            <div className="text-xs font-bold text-indigo-400">{record.resolutionDays}d</div>
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-800/60 pt-3 space-y-4">
          {/* Grid: Problem / Action / Outcome */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-red-950/20 border border-red-900/30 rounded-lg p-3">
              <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1">⚠ Problem</div>
              <p className="text-xs text-slate-300">{record.problem}</p>
            </div>
            <div className="bg-indigo-950/20 border border-indigo-900/30 rounded-lg p-3">
              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">⚡ Action Taken</div>
              <p className="text-xs text-slate-300">{record.actionTaken}</p>
            </div>
            <div className={`border rounded-lg p-3 ${record.improved ? 'bg-emerald-950/20 border-emerald-900/30' : 'bg-amber-950/20 border-amber-900/30'}`}>
              <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${record.improved ? 'text-emerald-400' : 'text-amber-400'}`}>
                {record.improved ? '✓ Outcome' : '~ Outcome'}
              </div>
              <p className="text-xs text-slate-300">{record.outcome}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="font-medium text-indigo-300">Timeline: </span>
            Day 0 → Problem identified
            <ArrowRight className="w-3 h-3" />
            Day {Math.round(record.resolutionDays * 0.3)} → Intervention
            <ArrowRight className="w-3 h-3" />
            Day {Math.round(record.resolutionDays * 0.7)} → Response
            <ArrowRight className="w-3 h-3" />
            Day {record.resolutionDays} → Resolution
          </div>

          {/* Why this case matched */}
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Why this case matched — {similarity}% similarity
            </div>
            <div className="flex flex-wrap gap-1.5">
              {matchedFactors.map((f, i) => (
                <span key={i} className="flex items-center gap-1 text-[10px] font-medium bg-emerald-950/30 border border-emerald-800/40 text-emerald-400 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-2.5 h-2.5" /> {f}
                </span>
              ))}
              {unmatchedFactors.slice(0, 2).map((f, i) => (
                <span key={i} className="flex items-center gap-1 text-[10px] font-medium bg-slate-800/40 border border-slate-700/40 text-slate-500 px-2 py-0.5 rounded-full">
                  <XCircle className="w-2.5 h-2.5" /> {f}
                </span>
              ))}
            </div>
          </div>

          {/* Metrics row */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center bg-slate-900/60 rounded-lg p-2">
              <div className="text-[10px] text-slate-500">Risk Score</div>
              <div className={`text-sm font-bold ${riskColor(project.overall_risk_score)}`}>{project.overall_risk_score}%</div>
            </div>
            <div className="text-center bg-slate-900/60 rounded-lg p-2">
              <div className="text-[10px] text-slate-500">Comp. Disbursed</div>
              <div className="text-sm font-bold text-slate-200">{project.compensation_disbursed_pct}%</div>
            </div>
            <div className="text-center bg-slate-900/60 rounded-lg p-2">
              <div className="text-[10px] text-slate-500">Resolution</div>
              <div className="text-sm font-bold text-indigo-400">{record.resolutionDays} days</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function PrecedentImpactSimulator() {
  const allProjects = getAllProjects();

  // State
  const [selectedProjectId, setSelectedProjectId] = useState(allProjects[0]?.id || '');
  const [expandedCases, setExpandedCases] = useState({});
  const [primaryAction, setPrimaryAction] = useState(null);
  const [compareActions, setCompareActions] = useState([]);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedStakeholder, setSelectedStakeholder] = useState(null);

  const currentProject = useMemo(
    () => allProjects.find((p) => p.id === selectedProjectId) || allProjects[0],
    [selectedProjectId, allProjects]
  );

  const similarCases = useMemo(
    () => findSimilarCases(currentProject, allProjects, 5),
    [currentProject, allProjects]
  );

  // "What worked before" aggregation
  const whatWorkedBefore = useMemo(() => {
    const records = similarCases.map((c) => deriveHistoricalRecord(c.project));
    const interventionCounts = {};
    records.forEach((r) => {
      const key = r.actionTaken;
      interventionCounts[key] = (interventionCounts[key] || 0) + 1;
    });
    const sorted = Object.entries(interventionCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const improvedCount = records.filter((r) => r.improved).length;
    return { sorted, improvedCount, total: records.length };
  }, [similarCases]);

  // Primary impact result
  const primaryImpact = useMemo(
    () => primaryAction ? computeStakeholderImpact(currentProject, primaryAction, similarCases) : null,
    [currentProject, primaryAction, similarCases]
  );

  // Compare impact results
  const compareImpacts = useMemo(
    () => compareMode && compareActions.length > 0
      ? computeMultiActionImpact(currentProject, compareActions, similarCases)
      : [],
    [currentProject, compareActions, similarCases, compareMode]
  );

  const baseline = useMemo(() => computeBaselineImpact(currentProject), [currentProject]);

  const stakeholders = ['farmers', 'government', 'contractors', 'community'];
  const stakeholderMeta = {
    farmers: { label: 'Farmers / Landowners', emoji: '👨‍🌾' },
    government: { label: 'Government / Administration', emoji: '🏛️' },
    contractors: { label: 'Contractors', emoji: '🏗️' },
    community: { label: 'Local Community', emoji: '🏘️' },
  };

  const toggleCase = (id) => setExpandedCases((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleCompareAction = (id) => {
    setCompareActions((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const topDrivers = currentProject?.top_drivers?.slice(0, 3) || [];
  const topSimilar = similarCases[0];
  const topRecord = topSimilar ? deriveHistoricalRecord(topSimilar.project) : null;

  // Bar chart data for recharts comparison
  const comparisonChartData = stakeholders.map((key) => {
    const row = { stakeholder: stakeholderMeta[key].emoji + ' ' + stakeholderMeta[key].label.split(' /')[0] };
    compareImpacts.forEach((imp) => {
      row[imp.action.shortLabel] = imp[key]?.delta || 0;
    });
    return row;
  });

  const COMPARE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight flex items-center gap-3">
            <span className="text-3xl">📊</span>
            Historical Precedent &amp; Impact Simulator
          </h1>
          <p className="text-sm text-slate-400 mt-1.5 max-w-2xl">
            Find historically similar cases, understand what interventions worked, and simulate stakeholder impacts — supporting officer decision-making with evidence.
          </p>
        </div>
        <div className="shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-950/60 border border-indigo-700/40 rounded-xl text-xs font-semibold text-indigo-300">
            <BarChart3 className="w-3.5 h-3.5" />
            Decision-Support System
          </span>
        </div>
      </div>

      {/* ── Disclaimer ────────────────────────────────────────────────────────── */}
      <div className="flex items-start gap-2.5 bg-slate-900/60 border border-slate-700/50 rounded-xl px-4 py-3 text-xs text-slate-400">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <p>
          Historical cases are used to identify similar situations and previous interventions. Stakeholder impacts are
          scenario-based estimates and should not be interpreted as guaranteed outcomes.{' '}
          <strong className="text-slate-300">The officer always makes the final decision.</strong>
        </p>
      </div>

      {/* ── 1. CURRENT PROJECT SECTION ─────────────────────────────────────────── */}
      <Section icon="📁" title="Current Project" subtitle="Select a project to analyse its historical precedents and simulate interventions.">
        {/* Project selector */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-400 mb-2">Select Project</label>
          <select
            value={selectedProjectId}
            onChange={(e) => {
              setSelectedProjectId(e.target.value);
              setPrimaryAction(null);
              setCompareActions([]);
              setSelectedStakeholder(null);
            }}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            {allProjects.map((p) => (
              <option key={p.id} value={p.id}>{p.id} — {p.name} ({p.state})</option>
            ))}
          </select>
        </div>

        {currentProject && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Project info */}
            <div className="lg:col-span-2 bg-slate-950/60 border border-slate-800/60 rounded-xl p-4">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{currentProject.id}</div>
              <h3 className="text-sm font-bold text-slate-100 mb-0.5">{currentProject.name}</h3>
              <p className="text-xs text-slate-400">{currentProject.district}, {currentProject.state}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded-full border border-slate-700">
                  {currentProject.project_type}
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded-full border border-slate-700">
                  Stage: {currentProject.current_stage}
                </span>
              </div>
            </div>

            {/* Risk */}
            <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-4 flex flex-col items-center justify-center">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Risk Score</div>
              <div className={`text-3xl font-black ${riskColor(currentProject.overall_risk_score)}`}>
                {currentProject.overall_risk_score}%
              </div>
              <div className={`text-[10px] font-semibold mt-1 px-2 py-0.5 rounded border ${riskBg(currentProject.overall_risk_score)}`}>
                {currentProject.risk_category}
              </div>
            </div>

            {/* Top drivers */}
            <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-4">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Top Drivers</div>
              <div className="space-y-1.5">
                {topDrivers.map((d, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="text-[10px] font-bold text-indigo-400 mt-0.5">{i + 1}.</span>
                    <span className="text-[11px] text-slate-300 leading-snug">{d.factor}</span>
                  </div>
                ))}
                {topDrivers.length === 0 && <span className="text-[11px] text-slate-500">No drivers recorded</span>}
              </div>
            </div>
          </div>
        )}
      </Section>

      {/* ── 2. FIND SIMILAR HISTORICAL CASES ─────────────────────────────────── */}
      <Section
        icon="🔎"
        title="Find Similar Historical Cases"
        subtitle={`Comparing current project against ${allProjects.length - 1} historical projects by driver profile, project type, risk level, and compensation status.`}
      >
        {similarCases.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-amber-500/50" />
            No sufficiently similar historical cases found (≥30% threshold).
          </div>
        ) : (
          <div className="space-y-3">
            {similarCases.map((c, i) => (
              <HistoricalCaseCard
                key={c.project.id}
                caseNum={i + 1}
                similarity={c.similarity}
                matchedFactors={c.matchedFactors}
                unmatchedFactors={c.unmatchedFactors}
                project={c.project}
                expanded={!!expandedCases[c.project.id]}
                onToggle={() => toggleCase(c.project.id)}
              />
            ))}
          </div>
        )}
      </Section>

      {/* ── 3. WHAT WORKED BEFORE ─────────────────────────────────────────────── */}
      {similarCases.length > 0 && (
        <Section
          icon="🧠"
          title="What Worked Before?"
          subtitle="Aggregated intervention patterns from historically similar cases."
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-4 text-center">
              <div className="text-[10px] text-slate-500 mb-1">Similar Cases Found</div>
              <div className="text-3xl font-black text-indigo-400">{similarCases.length}</div>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-4 text-center">
              <div className="text-[10px] text-slate-500 mb-1">Showing Improvement</div>
              {whatWorkedBefore.total > 0 ? (
                <div className="text-3xl font-black text-emerald-400">
                  {whatWorkedBefore.improvedCount}/{whatWorkedBefore.total}
                </div>
              ) : (
                <div className="text-xs text-slate-500 mt-2">Limited historical evidence</div>
              )}
            </div>
            <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-4 text-center">
              <div className="text-[10px] text-slate-500 mb-1">Best Match</div>
              <div className="text-xl font-black text-indigo-300">{similarCases[0]?.similarity}%</div>
              <div className="text-[10px] text-slate-400 mt-0.5 truncate">{similarCases[0]?.project?.name}</div>
            </div>
          </div>

          {whatWorkedBefore.sorted.length > 0 ? (
            <div>
              <div className="text-xs font-semibold text-slate-400 mb-3">Most Frequently Used Interventions</div>
              <div className="space-y-2">
                {whatWorkedBefore.sorted.map(([action, count], i) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-950/50 border border-slate-800/40 rounded-lg p-3">
                    <span className="text-lg font-black text-indigo-400">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-200 truncate">{action}</p>
                    </div>
                    <span className="text-[11px] font-bold text-indigo-300 shrink-0">
                      {count} of {whatWorkedBefore.total} cases
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">Limited historical evidence — insufficient data to determine frequent interventions.</p>
          )}
        </Section>
      )}

      {/* ── 4. SIMULATE AN ACTION ────────────────────────────────────────────── */}
      <Section
        icon="⚡"
        title="Simulate an Action"
        subtitle="Select an action previously used in similar cases to see its projected stakeholder impact."
      >
        {/* Mode toggle */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => { setCompareMode(false); setCompareActions([]); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${!compareMode ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}
          >
            Single Action
          </button>
          <button
            onClick={() => { setCompareMode(true); setPrimaryAction(null); setSelectedStakeholder(null); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${compareMode ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}
          >
            ⚖️ Compare Actions (up to 4)
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {AVAILABLE_ACTIONS.map((action) => {
            const isSelected = compareMode
              ? compareActions.includes(action.id)
              : primaryAction === action.id;
            return (
              <button
                key={action.id}
                onClick={() => {
                  if (compareMode) {
                    toggleCompareAction(action.id);
                  } else {
                    setPrimaryAction(isSelected ? null : action.id);
                    setSelectedStakeholder(null);
                  }
                }}
                className={`text-left p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-indigo-950/60 border-indigo-500/60 shadow-lg shadow-indigo-900/20'
                    : 'bg-slate-950/50 border-slate-800/50 hover:border-slate-700 hover:bg-slate-800/30'
                }`}
              >
                <div className="text-xl mb-1.5">{action.icon}</div>
                <div className="text-xs font-bold text-slate-200 mb-1">{action.label}</div>
                <div className="text-[10px] text-slate-500 leading-snug">{action.description}</div>
                {isSelected && (
                  <div className="mt-2 text-[10px] font-bold text-indigo-400">✓ Selected</div>
                )}
              </button>
            );
          })}
        </div>
      </Section>

      {/* ── 5. STAKEHOLDER IMPACT CHART (primary action) ─────────────────────── */}
      {primaryImpact && !compareMode && (
        <Section
          icon="🎯"
          title="Who Benefits? Who Bears the Impact?"
          subtitle={`Simulated stakeholder wellbeing scores for: "${primaryImpact.action.label}"`}
        >
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <EvidenceBadge strength={primaryImpact.evidenceStrength} count={primaryImpact.evidenceCount} />
          </div>

          {/* Evidence → Simulation bridge */}
          {topSimilar && topRecord && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-indigo-950/25 border border-indigo-800/30 rounded-xl p-4">
                <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-2">📚 Historical Evidence</div>
                <div className="text-[11px] text-slate-400 mb-1">{topSimilar.similarity}% Similar Case</div>
                <div className="text-xs font-bold text-slate-200 mb-1">{topSimilar.project.name}</div>
                <div className="text-[11px] text-slate-400">Previous action: <span className="text-slate-300 font-medium">{topRecord.actionTaken}</span></div>
                <div className="text-[11px] text-slate-400 mt-0.5">Outcome: <span className="text-emerald-400 font-medium">{topRecord.outcome}</span></div>
                <div className="text-[11px] text-slate-400 mt-0.5">Resolved in: <span className="text-indigo-400 font-medium">{topRecord.resolutionDays} days</span></div>
              </div>
              <div className="bg-emerald-950/20 border border-emerald-800/30 rounded-xl p-4">
                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2">⚡ Current Simulation</div>
                <div className="text-[11px] text-slate-400 mb-1">Proposed action: <span className="text-slate-300 font-medium">{primaryImpact.action.label}</span></div>
                <div className="space-y-1 mt-2">
                  {stakeholders.map((key) => (
                    <div key={key} className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">{stakeholderMeta[key].emoji} {stakeholderMeta[key].label.split(' /')[0]}</span>
                      <span className={`font-bold ${deltaColor(primaryImpact[key].delta)}`}>
                        {primaryImpact[key].delta > 0 ? '+' : ''}{primaryImpact[key].delta}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bar rows */}
          <div className="space-y-3 mb-5">
            {stakeholders.map((key) => (
              <StakeholderBarRow
                key={key}
                emoji={stakeholderMeta[key].emoji}
                label={stakeholderMeta[key].label}
                current={primaryImpact[key].current}
                simulated={primaryImpact[key].simulated}
                delta={primaryImpact[key].delta}
                selected={selectedStakeholder === key}
                onClick={() => setSelectedStakeholder(selectedStakeholder === key ? null : key)}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-[10px] text-slate-500 border-t border-slate-800/60 pt-3">
            <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-full bg-slate-600" /> Current condition</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-full bg-emerald-500" /> Positive impact</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-full bg-red-500" /> Negative impact</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-full bg-indigo-500" /> Neutral/small change</div>
          </div>

          {/* ── 6. STAKEHOLDER DETAIL PANEL ─────────────────────────────────── */}
          {selectedStakeholder && primaryImpact[selectedStakeholder] && (
            <div className="mt-5 bg-slate-950/70 border border-indigo-800/40 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <span className="text-xl">{stakeholderMeta[selectedStakeholder].emoji}</span>
                  {primaryImpact[selectedStakeholder].label}
                </h3>
                <span className={`text-sm font-black px-3 py-1 rounded-lg border ${deltaBg(primaryImpact[selectedStakeholder].delta)}`}>
                  Impact: {primaryImpact[selectedStakeholder].delta > 0 ? '+' : ''}{primaryImpact[selectedStakeholder].delta}
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-500 mb-2">Why this stakeholder is affected:</div>
              <ul className="space-y-1.5">
                {primaryImpact[selectedStakeholder].reasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="text-indigo-400 mt-0.5 shrink-0">•</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Section>
      )}

      {/* ── 7. COMPARE ACTIONS TABLE ─────────────────────────────────────────── */}
      {compareMode && compareImpacts.length > 0 && (
        <Section
          icon="⚖️"
          title="Compare Possible Actions"
          subtitle="Side-by-side stakeholder impact comparison for selected interventions. Examine trade-offs before deciding."
        >
          {/* Recharts grouped bar chart */}
          <div className="h-72 w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={comparisonChartData}
                margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
              >
                <XAxis
                  dataKey="stakeholder"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <ReferenceLine y={0} stroke="#475569" strokeDasharray="3 3" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc', fontSize: '11px' }}
                  formatter={(val) => [`${val > 0 ? '+' : ''}${val}`, 'Impact']}
                />
                {compareImpacts.map((imp, idx) => (
                  <Bar key={imp.action.id} dataKey={imp.action.shortLabel} fill={COMPARE_COLORS[idx % COMPARE_COLORS.length]} radius={[4, 4, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800/60">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-800/60">
                  <th className="text-left px-4 py-2.5 text-slate-400 font-semibold">Stakeholder</th>
                  {compareImpacts.map((imp, idx) => (
                    <th key={imp.action.id} className="text-center px-4 py-2.5 font-semibold" style={{ color: COMPARE_COLORS[idx] }}>
                      {imp.action.icon} {imp.action.shortLabel}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {stakeholders.map((key) => (
                  <tr key={key} className="bg-slate-950/40 hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-200">
                      {stakeholderMeta[key].emoji} {stakeholderMeta[key].label}
                    </td>
                    {compareImpacts.map((imp, idx) => {
                      const d = imp[key]?.delta || 0;
                      return (
                        <td key={imp.action.id} className="px-4 py-3 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className={`font-black text-sm ${deltaColor(d)}`}>
                              {d > 0 ? '+' : ''}{d}
                            </span>
                            {/* Mini bar */}
                            <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${Math.min(100, Math.abs(d) * 2)}%`,
                                  backgroundColor: COMPARE_COLORS[idx],
                                  opacity: d < 0 ? 0.5 : 1,
                                }}
                              />
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Trade-off note */}
          <div className="mt-4 flex items-start gap-2 bg-amber-950/20 border border-amber-800/30 rounded-lg px-3 py-2.5 text-xs text-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <p>
              The table shows projected impact deltas per stakeholder group. Positive values (+) indicate improvement in stakeholder wellbeing.
              Negative values (−) indicate additional burden. Trade-offs are inherent — the officer must weigh these before deciding.
            </p>
          </div>
        </Section>
      )}

      {/* ── 8. DECISION SUPPORT SUMMARY ─────────────────────────────────────── */}
      {(primaryImpact || (compareMode && compareImpacts.length > 0)) && (
        <Section
          icon="📋"
          title="Decision Support Summary"
          subtitle="A structured overview of available evidence and simulated outcomes to support officer decision-making."
          className="border-indigo-800/30"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <div className="bg-slate-950/60 border border-slate-800/50 rounded-xl p-3 text-center">
              <div className="text-[10px] text-slate-500 mb-1">Similar Cases</div>
              <div className="text-2xl font-black text-indigo-400">{similarCases.length}</div>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/50 rounded-xl p-3 text-center">
              <div className="text-[10px] text-slate-500 mb-1">Best Match</div>
              <div className="text-lg font-black text-indigo-300">{similarCases[0]?.similarity || 0}%</div>
              <div className="text-[10px] text-slate-500 truncate mt-0.5">{similarCases[0]?.project?.name}</div>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/50 rounded-xl p-3 text-center">
              <div className="text-[10px] text-slate-500 mb-1">Prev. Action</div>
              <div className="text-[11px] font-bold text-slate-300 leading-snug">{topRecord?.actionTaken?.split(' ').slice(0, 4).join(' ') || '—'}…</div>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/50 rounded-xl p-3 text-center">
              <div className="text-[10px] text-slate-500 mb-1">Hist. Outcome</div>
              <div className="text-[11px] font-bold text-emerald-400 leading-snug">{topRecord?.outcome?.split(';')[0] || '—'}</div>
            </div>
          </div>

          {/* Current simulated summary */}
          {primaryImpact && !compareMode && (
            <div className="bg-slate-950/60 border border-slate-800/50 rounded-xl p-4 mb-4">
              <div className="text-xs font-semibold text-slate-400 mb-3">
                Simulated Impact — {primaryImpact.action.label}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {stakeholders.map((key) => (
                  <div key={key} className="text-center">
                    <div className="text-base">{stakeholderMeta[key].emoji}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{stakeholderMeta[key].label.split(' /')[0]}</div>
                    <div className={`text-lg font-black mt-1 ${deltaColor(primaryImpact[key].delta)}`}>
                      {primaryImpact[key].delta > 0 ? '+' : ''}{primaryImpact[key].delta}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trade-off identified */}
          {primaryImpact && !compareMode && (() => {
            const negatives = stakeholders.filter((k) => primaryImpact[k].delta < -3);
            const positives = stakeholders.filter((k) => primaryImpact[k].delta > 5);
            if (negatives.length > 0 && positives.length > 0) {
              return (
                <div className="mb-4 bg-amber-950/20 border border-amber-800/30 rounded-xl px-4 py-3">
                  <div className="text-xs font-bold text-amber-400 mb-1">⚠ Trade-off Identified</div>
                  <p className="text-xs text-slate-300">
                    The proposed action may improve conditions for{' '}
                    <strong>{positives.map((k) => stakeholderMeta[k].label.split(' /')[0]).join(', ')}</strong>{' '}
                    while increasing burden on{' '}
                    <strong>{negatives.map((k) => stakeholderMeta[k].label.split(' /')[0]).join(', ')}</strong>.
                    The officer should weigh these trade-offs in context.
                  </p>
                </div>
              );
            }
            return null;
          })()}

          {/* Important note */}
          <div className="bg-indigo-950/30 border border-indigo-800/30 rounded-xl px-4 py-3 flex items-start gap-2.5">
            <FileText className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-indigo-300">
                This analysis provides historical evidence and simulated stakeholder impacts to support officer decision-making.
              </strong>{' '}
              It does not recommend a specific course of action. The reviewing officer must make the final decision based on their
              contextual knowledge, field reports, and applicable administrative guidelines.
            </p>
          </div>
        </Section>
      )}

    </div>
  );
}
