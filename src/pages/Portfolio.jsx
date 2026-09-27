import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Layers, 
  MapPin, 
  AlertCircle, 
  ChevronRight,
  Building
} from 'lucide-react';
import { getAllProjects, getDisplayRiskScore, getIngestionFeed } from '../utils/dataLoader';
import { getRiskColor, getRiskCategory } from '../utils/riskFormula';
import { useRole } from '../context/RoleContext';
import RiskTrendSparkline from '../components/RiskTrendSparkline';

export default function Portfolio() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { filterByRole } = useRole();

  const initialRisk = searchParams.get('risk') || 'All';
  const initialState = searchParams.get('state') || 'All';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState(initialState);
  const [selectedRisk, setSelectedRisk] = useState(initialRisk);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' or 'asc'

  const allProjects = getAllProjects();
  const scopedProjects = filterByRole(allProjects);

  // Extract unique states for dropdown
  const uniqueStates = useMemo(() => {
    const states = Array.from(new Set(scopedProjects.map(p => p.state))).sort();
    return ['All', ...states];
  }, [scopedProjects]);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    return scopedProjects
      .filter(p => {
        // Search term filter
        const matchSearch =
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.id.toLowerCase().includes(searchTerm.toLowerCase());

        // State filter
        const matchState = selectedState === 'All' || p.state === selectedState;

        // Risk filter
        const matchRisk = selectedRisk === 'All' || p.risk_category === selectedRisk;

        return matchSearch && matchState && matchRisk;
      })
      .sort((a, b) => {
        if (sortOrder === 'desc') {
          return b.overall_risk_score - a.overall_risk_score;
        } else {
          return a.overall_risk_score - b.overall_risk_score;
        }
      });
  }, [scopedProjects, searchTerm, selectedState, selectedRisk, sortOrder]);

  const handleStateChange = (e) => {
    const val = e.target.value;
    setSelectedState(val);
    if (val !== 'All') {
      searchParams.set('state', val);
    } else {
      searchParams.delete('state');
    }
    setSearchParams(searchParams);
  };

  const handleRiskChange = (risk) => {
    setSelectedRisk(risk);
    if (risk !== 'All') {
      searchParams.set('risk', risk);
    } else {
      searchParams.delete('risk');
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight flex items-center space-x-3">
            <Layers className="w-8 h-8 text-indigo-400" />
            <span>Land Acquisition Project Portfolio</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Monitor, filter, and analyze all tracked acquisition projects across India.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
          <span className="text-slate-400">Showing</span>
          <span className="text-indigo-400 font-bold">{filteredProjects.length}</span>
          <span className="text-slate-400">of {scopedProjects.length} Projects</span>
        </div>
      </div>

      {/* Control Bar: Search, Filters & Sort */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search project name, ID, or district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* State Filter Dropdown */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:inline" />
          <select
            id="state-filter-select"
            value={selectedState}
            onChange={handleStateChange}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="All">All States ({uniqueStates.length - 1})</option>
            {uniqueStates.filter(s => s !== 'All').map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        {/* Risk Category Selector Buttons */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {['All', 'High', 'Medium', 'Low'].map((r) => {
            const isSelected = selectedRisk === r;
            let activeStyle = 'bg-slate-800 text-slate-200';
            if (isSelected) {
              if (r === 'High') activeStyle = 'bg-red-600 text-white font-bold shadow-md shadow-red-600/30';
              else if (r === 'Medium') activeStyle = 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30';
              else if (r === 'Low') activeStyle = 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30';
              else activeStyle = 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30';
            }

            return (
              <button
                key={r}
                id={`risk-filter-${r.toLowerCase()}`}
                onClick={() => handleRiskChange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected ? activeStyle : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r === 'All' ? 'All Risks' : `${r} Risk`}
              </button>
            );
          })}
        </div>

        {/* Sort Order Toggle */}
        <button
          id="sort-risk-btn"
          onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
          className="flex items-center space-x-2 px-3.5 py-2 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl transition-colors shrink-0"
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
          <span>Sort Risk: {sortOrder === 'desc' ? 'High → Low' : 'Low → High'}</span>
        </button>

      </div>

      {/* Projects Table / Grid List */}
      {filteredProjects.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center shadow-xl">
          <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-200">No Projects Found</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
            No land acquisition project matches your current filter combination. Try resetting your search terms or filter selection.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedState('All');
              setSelectedRisk('All');
              setSearchParams({});
            }}
            className="mt-5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Project ID & Name</th>
                  <th className="py-3.5 px-4">State & District</th>
                  <th className="py-3.5 px-4">Sector Type</th>
                  <th className="py-3.5 px-4">Current Stage</th>
                  <th className="py-3.5 px-4 text-right">Risk Score</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {filteredProjects.map((p) => {
                  const feed = getIngestionFeed();
                  const { score: displayScore, hasDisputeFriction } = getDisplayRiskScore(p, feed);
                  const displayCategory = getRiskCategory(displayScore);
                  const color = getRiskColor(displayCategory);
                  
                  return (
                    <tr
                      key={p.id}
                      onClick={() => navigate(`/project/${p.id}`)}
                      className="hover:bg-slate-800/70 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            {p.id}
                          </span>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-slate-100 group-hover:text-indigo-400 transition-colors block">
                                {p.name}
                              </span>
                              {hasDisputeFriction && (
                                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-red-950/90 text-red-300 border border-red-700/60 rounded-full flex items-center space-x-1 shrink-0" title="+5 risk bump applied from 2+ dispute records">
                                  <span>⚠ Rising legal/public friction</span>
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-400">
                              {p.land_area_hectares} Ha · {p.families_affected} Families
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        <div className="flex items-center space-x-1.5 text-xs">
                          <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span>{p.district}, <strong className="text-slate-200">{p.state}</strong></span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-xs font-medium text-slate-300 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800/80">
                          {p.project_type}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300 font-medium text-xs">
                        <span className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800">
                          {p.current_stage}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center space-x-3">
                          {/* Feature 1: Inline Sparkline */}
                          <RiskTrendSparkline projectId={p.id} variant="inline" />

                          <div className="text-right">
                            <span className="text-base font-extrabold text-white">{displayScore}%</span>
                            <span
                              className="ml-2 px-2 py-0.5 text-xs font-bold rounded text-white"
                              style={{ backgroundColor: color }}
                            >
                              {displayCategory}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="text-slate-500 group-hover:text-indigo-400 transition-colors">
                          <ChevronRight className="w-5 h-5 inline" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
