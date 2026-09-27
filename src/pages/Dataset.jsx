/**
 * src/pages/Dataset.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * TerraNex AI — Live Dataset Page (/dataset)
 *
 * Fetches the `projects` table directly from Supabase using the anon key.
 * Falls back to the local static JSON if Supabase is not configured.
 * READ-ONLY — no editing or deleting rows.
 *
 * Features:
 *   - Search by project name or ID
 *   - Filter by state
 *   - Filter by risk category (High / Medium / Low)
 *   - Sort by risk score (asc / desc)
 *   - Pagination (20 rows per page)
 *   - Responsive, dark TerraNex styling
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Database, Search, ChevronUp, ChevronDown, ChevronLeft,
  ChevronRight, RefreshCw, ExternalLink, AlertTriangle,
  CheckCircle, Wifi, WifiOff, Filter, X
} from 'lucide-react';
import { supabase, isSupabaseReady } from '../lib/supabaseClient';
import rawProjectsData from '../data/seed_projects_dataset.json';

const PAGE_SIZE = 20;

// ── Risk badge helpers ────────────────────────────────────────────────────────
function RiskBadge({ category }) {
  const styles = {
    High:   'bg-red-950/70 text-red-400 border border-red-700/50',
    Medium: 'bg-amber-950/70 text-amber-400 border border-amber-700/50',
    Low:    'bg-emerald-950/70 text-emerald-400 border border-emerald-700/50',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wide ${styles[category] || 'bg-slate-800 text-slate-400'}`}>
      {category}
    </span>
  );
}

function ScoreBar({ score }) {
  const colour =
    score >= 70 ? 'bg-red-500' :
    score >= 45 ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-slate-700 overflow-hidden">
        <div className={`h-full rounded-full ${colour} transition-all`} style={{ width: `${Math.min(score, 100)}%` }} />
      </div>
      <span className="text-xs font-semibold tabular-nums text-slate-200">{score.toFixed(1)}</span>
    </div>
  );
}

// ── Sort indicator ────────────────────────────────────────────────────────────
function SortIcon({ active, dir }) {
  if (!active) return <ChevronDown className="w-3 h-3 text-slate-600 inline ml-1" />;
  return dir === 'asc'
    ? <ChevronUp className="w-3 h-3 text-indigo-400 inline ml-1" />
    : <ChevronDown className="w-3 h-3 text-indigo-400 inline ml-1" />;
}

// ── Columns definition ────────────────────────────────────────────────────────
const COLUMNS = [
  { key: 'id',                  label: 'ID',           sortable: true  },
  { key: 'name',                label: 'Project Name', sortable: true  },
  { key: 'state',               label: 'State',        sortable: true  },
  { key: 'district',            label: 'District',     sortable: true  },
  { key: 'project_type',        label: 'Sector',       sortable: false },
  { key: 'current_stage',       label: 'Stage',        sortable: false },
  { key: 'overall_risk_score',  label: 'Risk Score',   sortable: true  },
  { key: 'risk_category',       label: 'Risk Cat.',    sortable: true  },
  { key: 'families_affected',   label: 'Families',     sortable: true  },
  { key: 'land_area_hectares',  label: 'Area (ha)',    sortable: true  },
];

export default function Dataset() {
  // ── State ───────────────────────────────────────────────────────────────────
  const [projects, setProjects]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [source, setSource]             = useState('loading'); // 'supabase' | 'static'
  const [lastFetched, setLastFetched]   = useState(null);

  const [search, setSearch]             = useState('');
  const [filterState, setFilterState]   = useState('');
  const [filterRisk, setFilterRisk]     = useState('');
  const [sortKey, setSortKey]           = useState('overall_risk_score');
  const [sortDir, setSortDir]           = useState('desc');
  const [page, setPage]                 = useState(1);

  // ── Fetch data ──────────────────────────────────────────────────────────────
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    if (isSupabaseReady && supabase) {
      try {
        const { data, error: sbError } = await supabase
          .from('projects')
          .select(
            'id, name, state, district, project_type, current_stage, ' +
            'overall_risk_score, risk_category, families_affected, land_area_hectares'
          )
          .order('overall_risk_score', { ascending: false });

        if (sbError) throw sbError;
        if (data && data.length > 0) {
          setProjects(data);
          setSource('supabase');
          setLastFetched(new Date());
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('[Dataset] Supabase fetch failed, using static fallback:', err.message);
      }
    }

    // Fallback: static JSON
    const fallback = (rawProjectsData.projects || []).map(p => ({
      id: p.id,
      name: p.name,
      state: p.state,
      district: p.district,
      project_type: p.project_type,
      current_stage: p.current_stage,
      overall_risk_score: p.overall_risk_score,
      risk_category: p.risk_category,
      families_affected: p.families_affected,
      land_area_hectares: p.land_area_hectares,
    }));
    setProjects(fallback);
    setSource('static');
    setLastFetched(new Date());
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // ── Derived: unique states ──────────────────────────────────────────────────
  const uniqueStates = useMemo(() => {
    const s = new Set(projects.map(p => p.state).filter(Boolean));
    return [...s].sort();
  }, [projects]);

  // ── Derived: filtered + sorted + paginated ──────────────────────────────────
  const filtered = useMemo(() => {
    let rows = [...projects];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.id?.toLowerCase().includes(q)
      );
    }
    if (filterState) rows = rows.filter(p => p.state === filterState);
    if (filterRisk)  rows = rows.filter(p => p.risk_category === filterRisk);

    rows.sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      const as = String(av).toLowerCase();
      const bs = String(bv).toLowerCase();
      return sortDir === 'asc'
        ? as.localeCompare(bs)
        : bs.localeCompare(as);
    });

    return rows;
  }, [projects, search, filterState, filterRisk, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset page when filters change
  useEffect(() => setPage(1), [search, filterState, filterRisk, sortKey, sortDir]);

  // ── Sort handler ─────────────────────────────────────────────────────────────
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setFilterState('');
    setFilterRisk('');
  };

  const hasFilters = search || filterState || filterRisk;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">

      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="border-b border-slate-800/80 bg-gradient-to-r from-slate-950 via-indigo-950/20 to-slate-950 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Top note */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-400/80 bg-indigo-950/60 border border-indigo-800/40 rounded-full px-3 py-1">
              TerraNex AI — Live Dataset
            </span>
            <span className="text-[11px] font-medium text-slate-500 bg-slate-900/60 border border-slate-800/40 rounded-full px-3 py-1">
              Source: Supabase
            </span>
            <span className="text-[11px] font-medium text-slate-500 bg-slate-900/60 border border-slate-800/40 rounded-full px-3 py-1">
              Demonstration dataset
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-600/30">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white">
                  Projects Dataset
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Land acquisition risk monitoring — PS 26017
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Live indicator */}
              {source === 'supabase' ? (
                <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 rounded-full px-3 py-1.5 text-xs font-semibold">
                  <Wifi className="w-3.5 h-3.5" />
                  Live Supabase Dataset
                </div>
              ) : source === 'static' ? (
                <div className="flex items-center gap-1.5 text-amber-400 bg-amber-950/50 border border-amber-800/40 rounded-full px-3 py-1.5 text-xs font-semibold">
                  <WifiOff className="w-3.5 h-3.5" />
                  Static Fallback
                </div>
              ) : null}

              {/* Record count pill */}
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-300">
                Total records: <span className="text-indigo-400 font-bold">{projects.length}</span>
              </div>

              {/* Refresh button */}
              <button
                id="dataset-refresh-btn"
                onClick={fetchData}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-700/50 text-indigo-400 text-xs font-semibold transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Controls ─────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">

          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              id="dataset-search"
              type="text"
              placeholder="Search by project name or ID…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700/60 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 focus:border-indigo-600/60 transition-all"
            />
          </div>

          {/* State filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            <select
              id="dataset-filter-state"
              value={filterState}
              onChange={e => setFilterState(e.target.value)}
              className="pl-8 pr-8 py-2 bg-slate-900 border border-slate-700/60 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 appearance-none cursor-pointer min-w-[140px]"
            >
              <option value="">All States</option>
              {uniqueStates.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          </div>

          {/* Risk filter */}
          <div className="relative">
            <select
              id="dataset-filter-risk"
              value={filterRisk}
              onChange={e => setFilterRisk(e.target.value)}
              className="pl-3 pr-8 py-2 bg-slate-900 border border-slate-700/60 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 appearance-none cursor-pointer min-w-[140px]"
            >
              <option value="">All Risk Levels</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          </div>

          {/* Clear filters */}
          {hasFilters && (
            <button
              id="dataset-clear-filters"
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/60 text-slate-400 hover:text-slate-200 text-sm transition-all"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>

        {/* Result count */}
        {!loading && (
          <p className="mt-3 text-xs text-slate-500">
            Showing <span className="text-slate-300 font-semibold">{filtered.length}</span> of{' '}
            <span className="text-slate-300 font-semibold">{projects.length}</span> records
            {lastFetched && (
              <span className="ml-2 text-slate-600">
                · Last fetched {lastFetched.toLocaleTimeString()}
              </span>
            )}
          </p>
        )}
      </div>

      {/* ── Table ────────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-sm text-slate-500 animate-pulse">Loading dataset from Supabase…</p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-5 rounded-2xl bg-red-950/30 border border-red-800/40">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-800/70 shadow-2xl shadow-black/40">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-900/90 border-b border-slate-800">
                    {COLUMNS.map(col => (
                      <th
                        key={col.key}
                        onClick={col.sortable ? () => handleSort(col.key) : undefined}
                        className={`px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap select-none
                          ${col.sortable ? 'cursor-pointer hover:text-indigo-300 transition-colors' : ''}`}
                      >
                        {col.label}
                        {col.sortable && (
                          <SortIcon active={sortKey === col.key} dir={sortDir} />
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800/50">
                  {pageRows.length === 0 ? (
                    <tr>
                      <td colSpan={COLUMNS.length} className="py-16 text-center text-slate-500 text-sm">
                        No projects match your current filters.
                      </td>
                    </tr>
                  ) : pageRows.map((proj, idx) => (
                    <tr
                      key={proj.id}
                      className={`transition-colors hover:bg-indigo-950/20 ${
                        idx % 2 === 0 ? 'bg-slate-950' : 'bg-slate-900/30'
                      }`}
                    >
                      {/* ID */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <a
                          href={`/project/${proj.id}`}
                          className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-mono text-xs font-semibold transition-colors group"
                        >
                          {proj.id}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </td>

                      {/* Name */}
                      <td className="px-4 py-3 max-w-[240px]">
                        <span className="block text-slate-100 font-medium leading-snug line-clamp-2 text-xs">
                          {proj.name}
                        </span>
                      </td>

                      {/* State */}
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-300">
                        {proj.state}
                      </td>

                      {/* District */}
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-400">
                        {proj.district}
                      </td>

                      {/* Sector */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-[11px] text-slate-400 bg-slate-800/60 rounded-md px-2 py-0.5 border border-slate-700/40">
                          {proj.project_type || '—'}
                        </span>
                      </td>

                      {/* Stage */}
                      <td className="px-4 py-3 whitespace-nowrap text-[11px] text-slate-300">
                        {proj.current_stage}
                      </td>

                      {/* Risk Score */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <ScoreBar score={proj.overall_risk_score ?? 0} />
                      </td>

                      {/* Risk Category */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <RiskBadge category={proj.risk_category} />
                      </td>

                      {/* Families */}
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-300 tabular-nums">
                        {proj.families_affected?.toLocaleString() ?? '—'}
                      </td>

                      {/* Area */}
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-400 tabular-nums">
                        {proj.land_area_hectares != null
                          ? `${proj.land_area_hectares.toLocaleString()} ha`
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Pagination ─────────────────────────────────────────────────── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 border-t border-slate-800/60">
                <span className="text-xs text-slate-500">
                  Page {page} of {totalPages} &nbsp;·&nbsp; {filtered.length} results
                </span>
                <div className="flex items-center gap-1">
                  <button
                    id="dataset-prev-btn"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-30 text-slate-400 hover:text-slate-200 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Page number pills */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let p;
                    if (totalPages <= 5) p = i + 1;
                    else if (page <= 3) p = i + 1;
                    else if (page >= totalPages - 2) p = totalPages - 4 + i;
                    else p = page - 2 + i;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                          page === p
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}

                  <button
                    id="dataset-next-btn"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-30 text-slate-400 hover:text-slate-200 transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Supabase status note ──────────────────────────────────────────── */}
        <div className="mt-6 p-4 rounded-xl border border-slate-800/60 bg-slate-900/40 flex flex-col sm:flex-row sm:items-center gap-3">
          {source === 'supabase' ? (
            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          ) : (
            <WifiOff className="w-4 h-4 text-amber-500 flex-shrink-0" />
          )}
          <div className="text-xs text-slate-400">
            {source === 'supabase' ? (
              <>
                <span className="text-emerald-400 font-semibold">Connected to Supabase</span>
                {' — '}data is being served live from the <code className="bg-slate-800 px-1 rounded text-slate-300">projects</code> table.
                This page is read-only; no credentials are exposed to the browser.
              </>
            ) : (
              <>
                <span className="text-amber-400 font-semibold">Using static fallback data</span>
                {' — '}configure <code className="bg-slate-800 px-1 rounded text-slate-300">VITE_SUPABASE_URL</code> and{' '}
                <code className="bg-slate-800 px-1 rounded text-slate-300">VITE_SUPABASE_ANON_KEY</code> in your{' '}
                <code className="bg-slate-800 px-1 rounded text-slate-300">.env</code> file to enable live data.
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
