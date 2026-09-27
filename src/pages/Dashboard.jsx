import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  BarChart3, 
  ShieldAlert, 
  CheckCircle2, 
  Database, 
  TrendingUp, 
  AlertTriangle, 
  ArrowRight,
  Layers,
  MapPin,
  Building
} from 'lucide-react';
import { 
  getAllProjects
} from '../utils/dataLoader';
import { useRole } from '../context/RoleContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { filterByRole, role } = useRole();
  const allProjects = getAllProjects();
  const scopedProjects = filterByRole(allProjects);

  const total = scopedProjects.length;
  const highRiskProjects = scopedProjects
    .filter(p => p.risk_category === 'High')
    .sort((a, b) => b.overall_risk_score - a.overall_risk_score);
  const highRiskCount = highRiskProjects.length;
  const mediumRiskCount = scopedProjects.filter(p => p.risk_category === 'Medium').length;
  const lowRiskCount = scopedProjects.filter(p => p.risk_category === 'Low').length;

  const totalConfidence = scopedProjects.reduce((acc, p) => acc + (p.data_confidence_pct || 0), 0);
  const avgConfidence = total > 0 ? (totalConfidence / total).toFixed(1) : '0.0';

  // Group projects by state for bar chart
  const stateCounts = {};
  scopedProjects.forEach(p => {
    stateCounts[p.state] = (stateCounts[p.state] || 0) + 1;
  });
  const stateData = Object.keys(stateCounts).map(st => ({
    state: st,
    count: stateCounts[st]
  }));

  const riskDistribution = [
    { name: 'High Risk', category: 'High', value: highRiskCount, color: '#dc2626' },
    { name: 'Medium Risk', category: 'Medium', value: mediumRiskCount, color: '#f59e0b' },
    { name: 'Low Risk', category: 'Low', value: lowRiskCount, color: '#16a34a' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight flex items-center space-x-3">
            <BarChart3 className="w-8 h-8 text-indigo-400" />
            <span>Land Acquisition Delay Early-Warning Dashboard</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Predict → Explain → Act executive summary powered by Parliament reply & eParlib historical models.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/portfolio"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2"
          >
            <span>Explore Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 3 Key Metric Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Total Projects */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-all"></div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Tracked Projects</span>
              <div className="text-3xl sm:text-4xl font-black text-slate-100 mt-2">
                {total}
              </div>
              <span className="text-xs text-indigo-400 mt-1 block font-medium">
                {role === 'Central Ministry' ? 'Across 10 Indian States' : `Scoped to ${role}`}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Layers className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Card 2: High-Risk Count */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-xl group-hover:bg-red-500/20 transition-all"></div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">High-Risk Projects</span>
              <div className="text-3xl sm:text-4xl font-black text-red-500 mt-2">
                {highRiskCount}
              </div>
              <span className="text-xs text-red-400/80 mt-1 block font-medium">Requires Priority Intervention</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Card 3: Average Data Confidence */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all"></div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Data Confidence</span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 mt-2">
                {avgConfidence}%
              </div>
              <span className="text-xs text-emerald-400/80 mt-1 block font-medium">Parliament-Reply Synced</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-6 h-6" />
            </div>
          </div>
        </div>

      </div>

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Bar Chart: Projects by State (2 cols on LG) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-200 mb-1 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-indigo-400" />
              <span>Project Count by State</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">Distribution across active state scope</p>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stateData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis
                    dataKey="state"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
                    itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                    formatter={(val) => [`${val} Projects`, 'Count']}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Donut Chart: Risk Category Distribution (1 col on LG) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-200 mb-1 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Risk Category Distribution</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">Total {total} projects breakdown</p>

            <div className="h-64 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
                    formatter={(val, name) => [`${val} Projects`, name]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => <span className="text-xs text-slate-300 font-medium">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Stat inside Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                <span className="text-2xl font-black text-slate-100">{total}</span>
                <span className="text-[10px] text-slate-400 font-medium">Projects</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Critical High-Risk Action Items Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-200 flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <span>Priority High-Risk Projects ({highRiskCount})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Projects exceeding 65% risk threshold requiring urgent District Collector & Legal Cell intervention.
            </p>
          </div>

          <Link
            to="/portfolio?risk=High"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            View All High-Risk →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {highRiskProjects.slice(0, 6).map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/project/${p.id}`)}
              className="bg-slate-950 p-4 rounded-xl border border-red-950/60 hover:border-red-500/50 cursor-pointer transition-all hover:scale-[1.02] group shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400">{p.id}</span>
                <span className="px-2 py-0.5 text-xs font-extrabold bg-red-600 text-white rounded">
                  {p.overall_risk_score}% High
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1">
                {p.name}
              </h4>

              <p className="text-xs text-slate-400 mt-1">
                {p.district}, {p.state} • Stage: <strong className="text-slate-300">{p.current_stage}</strong>
              </p>

              <div className="mt-3 pt-2.5 border-t border-slate-900 text-xs text-slate-400 flex items-center justify-between">
                <span>Driver: {p.top_drivers[0]?.factor || 'Legal dispute'}</span>
                <span className="text-indigo-400 font-bold group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
