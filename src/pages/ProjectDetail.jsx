import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { 
  ArrowLeft, 
  AlertTriangle, 
  TrendingDown, 
  CheckCircle2, 
  Sliders, 
  MapPin, 
  Database, 
  Clock, 
  Layers, 
  Info,
  Building,
  Users,
  Sparkles,
  Cpu,
  FileText
} from 'lucide-react';
import { getProjectById, getMLExplanationsForProject, getDisplayRiskScore, getIngestionFeed } from '../utils/dataLoader';
import { computeRiskScore, getRiskCategory, getRiskColor } from '../utils/riskFormula';
import InterventionModal from '../components/InterventionModal';
import VoiceReporter from '../components/VoiceReporter';
import ProjectAssistant from '../components/ProjectAssistant';
import RiskTrendSparkline from '../components/RiskTrendSparkline';
import { generateOfficerBrief } from '../utils/pdfBriefGenerator';

// Custom Colored Leaflet Marker Icons
const createCustomMarker = (color) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px ${color};"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [sliderVal, setSliderVal] = useState(0);
  const [simulatedScore, setSimulatedScore] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mlExplanation, setMlExplanation] = useState(null);

  useEffect(() => {
    const p = getProjectById(id);
    if (p) {
      setProject(p);
      setSliderVal(p.compensation_disbursed_pct || 0);
      setSimulatedScore(p.overall_risk_score);
      const ml = getMLExplanationsForProject(p.id);
      setMlExplanation(ml);
    }
  }, [id]);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center text-red-400 mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100">Project Not Found</h2>
        <p className="text-slate-400 mt-2">No project matching ID "{id}" was found in the static dataset.</p>
        <Link
          to="/portfolio"
          className="inline-flex items-center space-x-2 mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </Link>
      </div>
    );
  }

  const feed = getIngestionFeed();
  const { score: displayScore, hasDisputeFriction } = getDisplayRiskScore(project, feed);
  const displayCategory = getRiskCategory(displayScore);
  const displayColor = getRiskColor(displayCategory);

  const currentRiskCategory = getRiskCategory(project.overall_risk_score);
  const currentRiskColor = getRiskColor(currentRiskCategory);

  const simulatedCategory = getRiskCategory(simulatedScore);
  const simulatedColor = getRiskColor(simulatedCategory);

  const handleSliderChange = (e) => {
    const val = Number(e.target.value);
    setSliderVal(val);
    const newScore = computeRiskScore(project, { compensation_disbursed_pct: val });
    setSimulatedScore(newScore);
  };

  const rfctlarrStages = ['Notification', 'SIA/Approvals', 'Compensation', 'R&R', 'Possession'];

  // Feature 3: Use ML explanations if available for this project, else rule-based drivers
  const displayDrivers = mlExplanation && mlExplanation.top_drivers
    ? mlExplanation.top_drivers
    : project.top_drivers || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Top Navigation Back Link */}
      <div>
        <Link
          to="/portfolio"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects List</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2.5 py-0.5 text-xs font-bold bg-slate-800 text-indigo-400 border border-slate-700 rounded-md">
              {project.id}
            </span>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-950/60 text-indigo-300 border border-indigo-800/40 rounded-md">
              {project.project_type}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            {project.name}
          </h1>
          <p className="text-sm text-slate-400 mt-1 flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <MapPin className="w-4 h-4 text-indigo-400 inline" />
              <span>{project.district}, {project.state}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Building className="w-4 h-4 text-slate-500 inline" />
              <span>{project.land_area_hectares} Hectares</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-slate-500 inline" />
              <span>{project.families_affected} Families</span>
            </span>
          </p>
        </div>

        {/* Overall Risk Score Badge & Sparkline */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
          
          {/* Feature 1: Expanded Sparkline */}
          <div className="min-w-[200px]">
            <RiskTrendSparkline projectId={project.id} variant="expanded" />
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-center text-right shrink-0">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block">Overall Delay Risk</span>
            <div className="flex items-center space-x-2 mt-0.5 justify-end">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: displayColor }}></span>
              <span className="text-2xl font-black text-white">{displayScore}%</span>
              <span
                className="px-2 py-0.5 text-xs font-extrabold rounded text-white"
                style={{ backgroundColor: displayColor }}
              >
                {displayCategory}
              </span>
            </div>
            
            {hasDisputeFriction && (
              <span className="mt-1.5 px-2 py-0.5 text-[10px] font-extrabold bg-red-950 text-red-300 border border-red-700/60 rounded-full inline-block self-end" title="+5 risk bump applied from 2+ dispute records">
                ⚠ Rising legal/public friction
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stage-wise Risk (RFCTLARR stages) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-200 flex items-center space-x-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <span>Stage-Wise Risk Breakdown (RFCTLARR Act Stages)</span>
          </h3>
          <span className="text-xs text-slate-400">🔴 Bottleneck marker indicates high-risk stage (≥ 65%)</span>
        </div>

        <div className="space-y-4">
          {rfctlarrStages.map((stage) => {
            const riskVal = project.stage_risks ? project.stage_risks[stage] || 0 : 0;
            const isBottleneck = riskVal >= 65;
            const barColor = getRiskColor(riskVal);
            const isCurrent = project.current_stage === stage;

            return (
              <div key={stage} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <span className={`font-semibold ${isCurrent ? 'text-indigo-400 font-extrabold' : 'text-slate-300'}`}>
                      {stage}
                    </span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 rounded">
                        Current Stage
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {isBottleneck && (
                      <span className="text-red-500 font-extrabold text-sm" title="High Risk Bottleneck Stage">
                        🔴 BOTTLENECK
                      </span>
                    )}
                    <span className="font-bold text-slate-100">{riskVal}%</span>
                  </div>
                </div>

                {/* Progress Bar Container */}
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full transition-all duration-500 rounded-full"
                    style={{
                      width: `${Math.min(100, Math.max(0, riskVal))}%`,
                      backgroundColor: barColor
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-Column Section: Explainability ("Why?") + Mini Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Why? (Explainability Panel with ML Tier 2 Badge) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-200 flex items-center space-x-2">
                <Info className="w-5 h-5 text-indigo-400" />
                <span>Why? Top Delay Drivers</span>
              </h3>

              {/* Feature 3 ML Badge vs Rule-Based Badge */}
              {mlExplanation ? (
                <span className="px-2.5 py-1 text-[11px] font-extrabold bg-emerald-950 text-emerald-300 border border-emerald-700/60 rounded-full flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ML-verified explanation</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700 rounded-full flex items-center space-x-1">
                  <Cpu className="w-3.5 h-3.5 text-slate-400" />
                  <span>Rule-based explanation</span>
                </span>
              )}
            </div>

            <div className="space-y-4">
              {displayDrivers.map((driver, idx) => {
                const impact = driver.impact_pct;
                const isNegative = impact < 0;
                const absImpact = Math.abs(impact);
                const barColorClass = isNegative
                  ? '#16a34a'
                  : impact >= 15
                  ? '#dc2626'
                  : '#f59e0b';

                return (
                  <div key={idx} className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-semibold mb-1.5">
                      <span className="text-slate-200">{driver.factor}</span>
                      <span className={`font-mono font-bold ${isNegative ? 'text-emerald-400' : 'text-red-400'}`}>
                        {impact >= 0 ? '+' : ''}{impact}%
                      </span>
                    </div>
                    {/* Bar visualization */}
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-500 rounded-full"
                        style={{
                          width: `${Math.min(100, absImpact * 3.5)}%`,
                          backgroundColor: barColorClass
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <span>Model Engine</span>
            <span className="font-semibold text-indigo-300">
              {mlExplanation ? mlExplanation.model_type : 'PS 26017 Grounded Rule Engine'}
            </span>
          </div>
        </div>

        {/* Mini Leaflet Map */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <h3 className="text-base font-bold text-slate-200 mb-4 flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-indigo-400" />
            <span>Project GIS Location</span>
          </h3>

          <div className="w-full h-64 rounded-xl overflow-hidden border border-slate-800 relative z-0">
            {project.coordinates && (
              <MapContainer
                center={[project.coordinates.lat, project.coordinates.lng]}
                zoom={10}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[project.coordinates.lat, project.coordinates.lng]}
                  icon={createCustomMarker(currentRiskColor)}
                >
                  <Popup>
                    <div className="text-xs">
                      <strong className="block text-slate-100 font-bold">{project.name}</strong>
                      <span className="text-slate-400">{project.district}, {project.state}</span>
                      <br />
                      <span className="font-semibold" style={{ color: currentRiskColor }}>
                        Risk: {project.overall_risk_score}% ({project.risk_category})
                      </span>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            )}
          </div>

          <div className="mt-4 text-xs text-slate-400 flex items-center justify-between">
            <span>Coordinates: {project.coordinates?.lat}, {project.coordinates?.lng}</span>
            <span className="text-indigo-400">Single project focus</span>
          </div>
        </div>

      </div>

      {/* Recommended Action (Tied to Real Levers) & Feature 4 Voice Reporting */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <h3 className="text-base font-bold text-slate-200 flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Recommended Actions (Tied to Real Policy Levers)</span>
        </h3>

        <div className="space-y-3">
          {project.recommendation?.actions && project.recommendation.actions.map((act, idx) => (
            <div key={idx} className="flex items-start space-x-3 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="w-5 h-5 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="text-sm font-medium text-slate-200">{act}</span>
            </div>
          ))}
        </div>

        {/* Feature 4: Voice-Based Field Reporting */}
        <VoiceReporter projectId={project.id} />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-slate-800/80 gap-4">
          <div className="flex items-center space-x-4 text-xs text-slate-300">
            <div>
              <span className="text-slate-500 block">Owner</span>
              <span className="font-bold text-slate-200">{project.recommendation?.owner || 'District Collector'}</span>
            </div>
            <div className="h-6 w-px bg-slate-800"></div>
            <div>
              <span className="text-slate-500 block">Priority</span>
              <span className={`font-bold ${project.recommendation?.priority === 'High' ? 'text-red-400' : 'text-amber-400'}`}>
                {project.recommendation?.priority || 'Medium'}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-800"></div>
            <div>
              <span className="text-slate-500 block">Timeline Due</span>
              <span className="font-bold text-slate-200">{project.recommendation?.due_days || 14} days</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              id="download-officer-brief-btn"
              onClick={() => generateOfficerBrief(project)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white border border-slate-700/80 font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center space-x-2 shrink-0"
              title="Download official PDF briefing document"
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Download Officer Brief</span>
            </button>

            <button
              id="assign-intervention-btn"
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center space-x-2 shrink-0"
            >
              <span>Assign Intervention →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Rule-Based Project Assistant */}
      <ProjectAssistant currentProject={project} />

      {/* What-If Simulator */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-200 flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <span>What-If Delay Risk Simulator</span>
          </h3>
          <span className="text-xs text-indigo-300 bg-indigo-950/80 px-2.5 py-1 rounded-full border border-indigo-700/50 font-semibold">
            Live Recomputation Engine
          </span>
        </div>

        <p className="text-xs text-slate-300">
          Drag the slider to test policy levers (e.g. increasing Compensation Disbursed %). The system recomputes the expected overall risk score live using the §5 algorithm.
        </p>

        <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between text-sm font-semibold">
            <label htmlFor="compensation-slider" className="text-slate-300">
              Compensation Disbursed: <span className="text-indigo-400 font-extrabold">{sliderVal}%</span>
            </label>
            <span className="text-xs text-slate-500">Default: {project.compensation_disbursed_pct}%</span>
          </div>

          <input
            id="compensation-slider"
            type="range"
            min="0"
            max="100"
            value={sliderVal}
            onChange={handleSliderChange}
            className="w-full"
          />

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <div className="text-xs text-slate-400">
              Current: <strong className="text-slate-200">{project.overall_risk_score}%</strong> ({project.risk_category})
            </div>

            <div className="flex items-center space-x-2 text-sm font-bold">
              <span className="text-slate-400">Simulated Score:</span>
              <span className="text-lg font-black" style={{ color: simulatedColor }}>
                {simulatedScore}%
              </span>
              <span
                className="px-2 py-0.5 text-xs font-bold rounded text-white"
                style={{ backgroundColor: simulatedColor }}
              >
                {simulatedCategory}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Confidence Footer with Honesty Framing */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            Data confidence: <strong className="text-slate-200">{project.data_confidence_pct}%</strong> (last synced from Parliament records: <strong>{project.last_synced_days_ago} days ago</strong>)
          </span>
        </div>

        <div className="text-[11px] text-slate-500 italic">
          Synthetic demonstration dataset shaped around PS 26017 variables
        </div>
      </div>

      {/* Intervention Modal */}
      <InterventionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={project}
      />

    </div>
  );
}
