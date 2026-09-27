import React from 'react';
import { useRole } from '../context/RoleContext';
import { getAllProjects } from '../utils/dataLoader';
import { ShieldCheck, Filter } from 'lucide-react';

export default function RoleScopedBanner() {
  const { role, filterByRole, scopedDistrict, scopedState, setRole } = useRole();
  const allProjects = getAllProjects();

  if (role === 'Central Ministry') return null;

  const scopedCount = filterByRole(allProjects).length;
  const scopeLabel = role === 'District Officer' ? `Patna District` : `Bihar State`;

  return (
    <div className="bg-indigo-950/80 border-b border-indigo-800/50 py-2 px-4 text-xs text-indigo-200 flex items-center justify-between animate-fade-in">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>
            Viewing: <strong className="text-white">{scopeLabel}</strong> projects only (<strong>{scopedCount}</strong> of {allProjects.length})
          </span>
        </div>

        <button
          onClick={() => setRole('Central Ministry')}
          className="text-[11px] font-bold text-indigo-300 hover:text-white underline transition-colors"
        >
          View All India ({allProjects.length}) →
        </button>
      </div>
    </div>
  );
}
