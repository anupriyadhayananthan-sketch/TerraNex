import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { RoleProvider } from './context/RoleContext';
import Navbar from './components/Navbar';
import RoleScopedBanner from './components/RoleScopedBanner';
import Ticker from './components/Ticker';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import ProjectDetail from './pages/ProjectDetail';
import MapView from './pages/MapView';
import DataSources from './pages/DataSources';
import NotFound from './pages/NotFound';
import PrecedentImpactSimulator from './pages/PrecedentImpactSimulator';


export default function App() {
  return (
    <RoleProvider>
      <Router>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
          <Ticker />
          <Navbar />
          <RoleScopedBanner />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/project/:id" element={<ProjectDetail />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/data-sources" element={<DataSources />} />
              <Route path="/precedent-impact" element={<PrecedentImpactSimulator />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div>
                <strong className="text-slate-300">TerraNex AI</strong>
              </div>
              <div>
                Predict → Explain → Act Early-Warning System
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </RoleProvider>
  );
}
