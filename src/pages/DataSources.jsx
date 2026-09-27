import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Database, ExternalLink, Calendar, ShieldCheck, Zap } from 'lucide-react';
import { getIngestionFeed, prependFeedEntry, updateProjectSyncState, getAllProjects } from '../utils/dataLoader';

export default function DataSources() {
  const [feed, setFeed] = useState(getIngestionFeed());
  const [notification, setNotification] = useState('');

  const handleSimulateRefresh = () => {
    const today = new Date().toISOString().split('T')[0];
    const mockSources = [
      'Lok Sabha Unstarred Question Reply',
      'Rajya Sabha Unstarred Question Reply',
      'data.gov.in Dataset Update',
      'PIB Press Release',
      'eParlib Archive Record'
    ];
    const mockHeadlines = [
      'Gazette notification published for Section 19 land acquisition clearance in Bihar',
      'Lok Sabha reply details 18 new R&R clearance grants issued for highway widening',
      'data.gov.in update records compensation disbursement milestone reached in Punjab',
      'PIB press release confirms expedited land survey verification completed in Telangana',
      'State Revenue Department updates Section 11 preliminary notification status'
    ];

    const randomSource = mockSources[Math.floor(Math.random() * mockSources.length)];
    const randomHeadline = mockHeadlines[Math.floor(Math.random() * mockHeadlines.length)];
    
    // Pick a linked project
    const allPrjs = getAllProjects();
    const targetPrj = allPrjs[Math.floor(Math.random() * allPrjs.length)];
    const linkedId = targetPrj ? targetPrj.id : 'PRJ-001';

    const newEntry = {
      id: `FEED-LIVE-${Date.now()}`,
      date: today,
      days_ago: 0,
      source: randomSource,
      headline: randomHeadline,
      linked_project_id: linkedId
    };

    const updatedFeed = prependFeedEntry(newEntry);
    setFeed([...updatedFeed]);
    
    if (linkedId) {
      updateProjectSyncState(linkedId, 0);
      setNotification(`Pipeline ingested new record for ${linkedId}. Last synced updated to 0 days ago.`);
    } else {
      setNotification('Pipeline ingested new record successfully.');
    }

    setTimeout(() => setNotification(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight flex items-center space-x-3">
            <Database className="w-8 h-8 text-indigo-400" />
            <span>Auto-Ingestion Data Feed</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Automated pipeline monitoring Parliament Q&A, data.gov.in updates, and eParlib archives.
          </p>
        </div>

        <button
          id="simulate-refresh-btn"
          onClick={handleSimulateRefresh}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2 shrink-0"
        >
          <RefreshCw className="w-4 h-4 animate-spin-hover" />
          <span>Simulate Refresh</span>
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center space-x-2 animate-bounce-short">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Honesty Framing Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            <em>Simulated ingestion pipeline — demonstrates the auto-ingestion architecture; production version connects to live Parliament/data.gov.in sources.</em>
          </span>
        </div>
        <span className="font-bold text-slate-200 shrink-0">{feed.length} Ingested Records</span>
      </div>

      {/* Feed Timeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-slate-200 mb-2">Ingestion Activity Feed</h3>

        <div className="space-y-3">
          {feed.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center space-x-3">
                  <span className="px-2.5 py-0.5 text-[11px] font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-700/50 rounded-md">
                    {item.source}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500 inline" />
                    <span>{item.date}</span>
                    <span className="text-slate-600">({item.days_ago === 0 ? 'Today' : `${item.days_ago}d ago`})</span>
                  </span>
                </div>

                {item.linked_project_id ? (
                  <Link
                    to={`/project/${item.linked_project_id}`}
                    className="text-sm font-semibold text-slate-100 hover:text-indigo-400 transition-colors flex items-center space-x-1 group"
                  >
                    <span>{item.headline}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-0.5 transition-transform inline shrink-0" />
                  </Link>
                ) : (
                  <p className="text-sm font-medium text-slate-300">{item.headline}</p>
                )}
              </div>

              {item.linked_project_id && (
                <div className="shrink-0">
                  <Link
                    to={`/project/${item.linked_project_id}`}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors inline-block"
                  >
                    View Project {item.linked_project_id} →
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
