'use client';

import React from 'react';
import { RecommendationType } from '@/types';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showRecommendation?: boolean;
  recommendation?: RecommendationType;
  label?: string;
}

export function ScoreRing({
  score,
  size = 110,
  strokeWidth = 9,
  showRecommendation = true,
  recommendation = 'BUILD',
  label = 'Opportunity',
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const normalizedScore = Math.min(100, Math.max(0, score));
  const offset = circumference - (normalizedScore / 100) * circumference;

  let strokeColor = '#10B981'; // Green
  let badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

  if (score < 50) {
    strokeColor = '#EF4444'; // Red
    badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  } else if (score < 70) {
    strokeColor = '#F59E0B'; // Amber
    badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  } else if (score < 80) {
    strokeColor = '#3B82F6'; // Blue
    badgeBg = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
  }

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1E2633"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
          <span className="text-2xl font-bold tracking-tight text-white font-mono">{score}</span>
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mt-1">{label}</span>
        </div>
      </div>

      {showRecommendation && (
        <span
          className={`mt-2 inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${badgeBg}`}
        >
          {recommendation}
        </span>
      )}
    </div>
  );
}
