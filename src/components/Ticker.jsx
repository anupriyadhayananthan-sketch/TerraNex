import React from 'react';

export const TICKER_MESSAGES = [
  "🏆 Team CodeVeil — Project TerraNex",
  "🚧 TerraNex AI — Predictive Analytics for Land Acquisition Delay Detection",
  "📌 Synthetic demonstration dataset — shaped around real government data patterns",
];

export default function Ticker() {
  const tickerText = TICKER_MESSAGES.join('   •   ');

  return (
    <div className="w-full bg-slate-950 text-slate-300 dark:bg-slate-950 dark:text-slate-300 border-b border-slate-800/80 h-8 text-[13px] font-medium flex items-center overflow-hidden relative z-50 selection:bg-indigo-500 selection:text-white">
      <div className="animate-marquee whitespace-nowrap flex space-x-8 items-center px-4 w-full">
        <span>{tickerText}</span>
        <span className="text-indigo-400 font-bold">•</span>
        <span>{tickerText}</span>
        <span className="text-indigo-400 font-bold">•</span>
        <span>{tickerText}</span>
      </div>
    </div>
  );
}
