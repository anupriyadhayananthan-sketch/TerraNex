import React from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, Tooltip } from 'recharts';
import { getRiskTrendHistory } from '../utils/dataLoader';

export default function RiskTrendSparkline({ projectId, historyData, variant = 'inline' }) {
  const trendHistory = historyData || getRiskTrendHistory(projectId);

  if (!trendHistory || !trendHistory.points) {
    return null;
  }

  const { points, trend_direction, trend_delta } = trendHistory;
  const firstScore = points[0]?.risk_score;
  const lastScore = points[points.length - 1]?.risk_score;

  // Arrow & color logic
  let arrowSymbol = '→';
  let arrowColor = '#94a3b8'; // gray
  let arrowBg = 'bg-slate-800 text-slate-400 border-slate-700';

  if (trend_direction === 'worsening') {
    arrowSymbol = '↑';
    arrowColor = '#dc2626'; // red
    arrowBg = 'bg-red-950/80 text-red-400 border-red-800/60';
  } else if (trend_direction === 'improving') {
    arrowSymbol = '↓';
    arrowColor = '#16a34a'; // green
    arrowBg = 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60';
  }

  // Reverse points so months_ago: 5 is leftmost, 0 is rightmost
  const chartData = [...points].map(pt => ({
    label: pt.months_ago === 0 ? 'Current' : `${pt.months_ago}m ago`,
    score: pt.risk_score
  }));

  if (variant === 'inline') {
    return (
      <div className="inline-flex items-center space-x-1.5" title={`6-month trend: ${firstScore}% → ${lastScore}% (${trend_direction})`}>
        <div className="w-14 h-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
              <Line
                type="monotone"
                dataKey="score"
                stroke={arrowColor}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <span
          className={`w-5 h-5 text-[11px] font-extrabold rounded-full border flex items-center justify-center shrink-0 ${arrowBg}`}
        >
          {arrowSymbol}
        </span>
      </div>
    );
  }

  // Expanded variant for Project Detail Page
  return (
    <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-300">
          Risk Trend (6 Months)
        </span>
        <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold border flex items-center space-x-1 ${arrowBg}`}>
          <span>{arrowSymbol}</span>
          <span className="capitalize">{trend_direction} ({trend_delta > 0 ? `+${trend_delta}` : trend_delta}%)</span>
        </span>
      </div>

      <div className="w-full h-16 pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} hide />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
              itemStyle={{ color: '#f8fafc' }}
              formatter={(val) => [`${val}%`, 'Risk Score']}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke={arrowColor}
              strokeWidth={2.5}
              dot={{ r: 2.5, fill: arrowColor }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="text-[11px] text-slate-400 text-center font-mono">
        {firstScore}% → <strong className="text-slate-200">{lastScore}%</strong> over 6 months
      </div>
    </div>
  );
}
