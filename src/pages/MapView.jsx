import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, ShieldAlert, ExternalLink, Filter } from 'lucide-react';
import { getAllProjects } from '../utils/dataLoader';
import { getRiskColor } from '../utils/riskFormula';
import { useRole } from '../context/RoleContext';

// Create SVG colored marker icon generator
const createMarkerIcon = (color, isSelected = false) => {
  const size = isSelected ? 24 : 18;
  const shadow = isSelected ? `0 0 15px ${color}` : `0 0 8px ${color}`;
  
  return L.divIcon({
    className: 'custom-leaflet-marker-icon',
    html: `<div style="
      background-color: ${color};
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      border: 2px solid #ffffff;
      box-shadow: ${shadow};
      transition: all 0.3s ease;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
};

export default function MapView() {
  const navigate = useNavigate();
  const { filterByRole } = useRole();
  const allProjects = getAllProjects();
  const scopedProjects = filterByRole(allProjects);

  const [filterCategory, setFilterCategory] = useState('All');

  const filteredProjects = scopedProjects.filter(p => 
    filterCategory === 'All' || p.risk_category === filterCategory
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight flex items-center space-x-3">
            <MapPin className="w-8 h-8 text-indigo-400" />
            <span>GIS Map View — National Risk Distribution</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Interactive geographical map of land acquisition projects across Indian states.
          </p>
        </div>

        {/* Risk Filter Buttons & Map Legend */}
        <div className="flex flex-wrap items-center gap-3">
          
          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {['All', 'High', 'Medium', 'Low'].map((r) => {
              const isSelected = filterCategory === r;
              let activeStyle = 'bg-indigo-600 text-white font-bold';
              if (isSelected) {
                if (r === 'High') activeStyle = 'bg-red-600 text-white font-bold';
                else if (r === 'Medium') activeStyle = 'bg-amber-500 text-slate-950 font-bold';
                else if (r === 'Low') activeStyle = 'bg-emerald-600 text-white font-bold';
              }
              return (
                <button
                  key={r}
                  id={`map-filter-${r.toLowerCase()}`}
                  onClick={() => setFilterCategory(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isSelected ? activeStyle : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {r === 'All' ? 'All Pins' : `${r} Risk`}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Map Legend Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 px-4 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
        <div className="flex items-center space-x-6">
          <span className="font-semibold text-slate-400">Risk Color Legend:</span>
          <span className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-red-600 border border-white"></span>
            <span>High Risk (≥ 65%)</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 border border-white"></span>
            <span>Medium Risk (35-64%)</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600 border border-white"></span>
            <span>Low Risk (&lt; 35%)</span>
          </span>
        </div>
        <div className="text-slate-400">
          Showing <strong className="text-white">{filteredProjects.length}</strong> project markers
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl h-[600px] relative z-0">
        <MapContainer
          center={[22.5937, 78.9629]} // India centered
          zoom={5}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredProjects.map((p) => {
            if (!p.coordinates || !p.coordinates.lat || !p.coordinates.lng) return null;
            const color = getRiskColor(p.risk_category);

            return (
              <Marker
                key={p.id}
                position={[p.coordinates.lat, p.coordinates.lng]}
                icon={createMarkerIcon(color)}
              >
                <Popup>
                  <div className="p-1 min-w-[200px]">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-indigo-400">{p.id}</span>
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-extrabold text-white"
                        style={{ backgroundColor: color }}
                      >
                        {p.risk_category} Risk
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-100 leading-tight mb-1">{p.name}</h4>
                    <p className="text-xs text-slate-400 mb-2">
                      {p.district}, {p.state} • Stage: {p.current_stage}
                    </p>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                      <span className="text-xs font-bold text-slate-200">
                        Overall Risk: <strong style={{ color }}>{p.overall_risk_score}%</strong>
                      </span>
                      <button
                        onClick={() => navigate(`/project/${p.id}`)}
                        className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                      >
                        <span>View Detail</span>
                        <ExternalLink className="w-3 h-3 inline" />
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

    </div>
  );
}
