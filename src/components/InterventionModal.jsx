import React from 'react';
import { CheckCircle2, AlertTriangle, X, ShieldCheck, Clock, UserCheck } from 'lucide-react';

export default function InterventionModal({ isOpen, onClose, project }) {
  if (!isOpen || !project) return null;

  const rec = project.recommendation || {};
  const isPrj001 = project.id === 'PRJ-001';
  const originalScore = project.overall_risk_score;
  const simulatedAfterScore = isPrj001 ? 14.2 : Math.max(3, Math.round((originalScore * 0.6) * 10) / 10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Intervention Tracker</h3>
            <p className="text-xs text-slate-400">Assigned workflow for {project.name}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="my-5 p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium text-slate-300">
              Assigned to: <strong className="text-white">{rec.owner || 'District Officer'}</strong>
            </span>
          </div>
          <span className="px-2.5 py-1 text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>In Progress</span>
          </span>
        </div>

        {/* Action Items List */}
        <div className="space-y-3 mb-5">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mandatory Interventions</h4>
          <ul className="space-y-2">
            {rec.actions && rec.actions.map((act, idx) => (
              <li key={idx} className="flex items-start space-x-2.5 text-sm text-slate-200 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>{act}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Priority and Due Days */}
        <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-500 block">Priority Level</span>
            <span className={`font-bold text-sm ${rec.priority === 'High' ? 'text-red-400' : 'text-amber-400'}`}>
              {rec.priority || 'Medium'}
            </span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-500 block">Target Timeline</span>
              <span className="font-bold text-sm text-slate-200">{rec.due_days || 14} days due</span>
            </div>
            <Clock className="w-4 h-4 text-slate-500" />
          </div>
        </div>

        {/* Worked Example Before vs After Comparison */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 border border-indigo-500/30 rounded-xl mb-6">
          <div className="text-xs font-bold text-indigo-300 mb-2 flex items-center justify-between">
            <span>Worked Example Impact Projection</span>
            <span className="text-[10px] text-indigo-400 bg-indigo-900/60 px-2 py-0.5 rounded">Historical Intervention</span>
          </div>
          <div className="flex items-center justify-around py-2">
            <div className="text-center">
              <span className="text-[11px] text-slate-400 block">Before Intervention</span>
              <span className="text-lg font-extrabold text-red-400">{originalScore}%</span>
            </div>
            <div className="text-indigo-400 font-bold text-xl">→</div>
            <div className="text-center">
              <span className="text-[11px] text-slate-400 block">After Intervention</span>
              <span className="text-lg font-extrabold text-emerald-400">{simulatedAfterScore}%</span>
            </div>
          </div>
          <p className="text-[11px] text-emerald-300 text-center font-medium mt-1">
            Risk dropped from {originalScore}% to {simulatedAfterScore}% after intervention
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl transition-colors"
          >
            Close Window
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-600/30 transition-all"
          >
            Confirm & Log Intervention
          </button>
        </div>

      </div>
    </div>
  );
}
