import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Bell, ShieldAlert, ChevronDown, Layers, MapPin, BarChart3, UserCheck, Database, TrendingUp } from 'lucide-react';
import { useRole } from '../context/RoleContext';
import { getHighRiskProjects } from '../utils/dataLoader';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { role, setRole } = useRole();
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const roleRef = useRef(null);
  const navigate = useNavigate();

  const highRiskProjects = getHighRiskProjects();
  const badgeCount = highRiskProjects.length;
  const topHighRisk = highRiskProjects.slice(0, 3);

  const roles = [
    'District Officer',
    'State Officer',
    'Central Ministry'
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAlertsOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target)) {
        setRoleMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <NavLink to="/dashboard" className="flex items-center space-x-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-extrabold bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent tracking-tight">
                  TerraNex <span className="text-indigo-400 font-semibold">AI</span>
                </span>
                <span className="ml-2 px-2 py-0.5 text-[10px] font-medium bg-indigo-950/80 text-indigo-300 border border-indigo-700/50 rounded-full hidden sm:inline-block">
                  PS 26017 MVP
                </span>
              </div>
            </NavLink>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-950/50 p-1 rounded-xl border border-slate-800/80">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/portfolio"
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <Layers className="w-4 h-4" />
              <span>Portfolio</span>
            </NavLink>

            <NavLink
              to="/map"
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <MapPin className="w-4 h-4" />
              <span>Map View</span>
            </NavLink>

            <NavLink
              to="/data-sources"
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <Database className="w-4 h-4" />
              <span>Data Feed</span>
            </NavLink>

            <NavLink
              to="/precedent-impact"
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <TrendingUp className="w-4 h-4" />
              <span>Precedent</span>
            </NavLink>
          </nav>

          {/* Right Section: Role Selector, Alerts & Theme Toggle */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <ThemeToggle />
            
            {/* Role Switcher */}
            <div className="relative" ref={roleRef}>
              <button
                id="role-selector-btn"
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 text-xs sm:text-sm font-medium rounded-lg border border-slate-700/80 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>{role}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-800/60">
                    Switch Active Role
                  </div>
                  {roles.map(r => (
                    <button
                      key={r}
                      onClick={() => {
                        setRole(r);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between transition-colors ${
                        role === r
                          ? 'bg-indigo-600/20 text-indigo-300 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{r}</span>
                      {role === r && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Alerts Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                id="alerts-bell-btn"
                onClick={() => setAlertsOpen(!alertsOpen)}
                aria-label="High Risk Alerts"
                className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {badgeCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-md">
                    {badgeCount}
                  </span>
                )}
              </button>

              {alertsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-3.5 bg-slate-800/80 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ShieldAlert className="w-4 h-4 text-red-500" />
                      <h4 className="text-sm font-bold text-slate-100">Critical High-Risk Alerts</h4>
                    </div>
                    <span className="text-xs bg-red-950 text-red-400 border border-red-800/50 px-2 py-0.5 rounded-md font-semibold">
                      {badgeCount} Projects
                    </span>
                  </div>

                  <div className="divide-y divide-slate-800/60 max-h-80 overflow-y-auto">
                    {topHighRisk.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setAlertsOpen(false);
                          navigate(`/project/${p.id}`);
                        }}
                        className="p-3.5 hover:bg-slate-800/70 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[11px] font-semibold text-slate-400">{p.id} · {p.state}</span>
                            <h5 className="text-xs font-bold text-slate-200 group-hover:text-indigo-400 transition-colors line-clamp-1">
                              {p.name}
                            </h5>
                          </div>
                          <span className="bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-extrabold px-2 py-0.5 rounded">
                            {p.overall_risk_score}%
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                          Stage: <span className="text-slate-300 font-medium">{p.current_stage}</span> · Driver: {p.top_drivers[0]?.factor || 'Legal backlog'}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="p-2.5 bg-slate-950 border-t border-slate-800 text-center">
                    <button
                      onClick={() => {
                        setAlertsOpen(false);
                        navigate('/portfolio?risk=High');
                      }}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      View All {badgeCount} High-Risk Projects →
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="md:hidden border-t border-slate-800 bg-slate-950/90 px-4 py-2 flex justify-around text-xs">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 ${isActive ? 'text-indigo-400 font-bold' : 'text-slate-400'}`
          }
        >
          <BarChart3 className="w-4 h-4 mb-0.5" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/portfolio"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 ${isActive ? 'text-indigo-400 font-bold' : 'text-slate-400'}`
          }
        >
          <Layers className="w-4 h-4 mb-0.5" />
          <span>Portfolio</span>
        </NavLink>
        <NavLink
          to="/map"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 ${isActive ? 'text-indigo-400 font-bold' : 'text-slate-400'}`
          }
        >
          <MapPin className="w-4 h-4 mb-0.5" />
          <span>Map</span>
        </NavLink>
        <NavLink
          to="/data-sources"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 ${isActive ? 'text-indigo-400 font-bold' : 'text-slate-400'}`
          }
        >
          <Database className="w-4 h-4 mb-0.5" />
          <span>Feed</span>
        </NavLink>
        <NavLink
          to="/precedent-impact"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 ${isActive ? 'text-indigo-400 font-bold' : 'text-slate-400'}`
          }
        >
          <TrendingUp className="w-4 h-4 mb-0.5" />
          <span>Precedent</span>
        </NavLink>
      </div>
    </header>
  );
}
