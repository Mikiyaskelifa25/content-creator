'use client';

import React, { useState } from 'react';
import { Grid, Sparkles, Compass } from 'lucide-react';
import { ProductOpportunity } from '@/types';

interface OpportunityHeatmapProps {
  products: ProductOpportunity[];
  onSelectProduct: (p: ProductOpportunity) => void;
}

export function OpportunityHeatmap({ products, onSelectProduct }: OpportunityHeatmapProps) {
  const [hoveredProduct, setHoveredProduct] = useState<ProductOpportunity | null>(null);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Grid className="w-3.5 h-3.5" /> Market Matrix
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Market Opportunity Heatmap
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Visual 4-quadrant landscape plotting verified Demand vs Competition Difficulty. Focus on the upper-left GOLD quadrant.
        </p>
      </div>

      {/* Heatmap Visual Matrix Container */}
      <div className="bg-[#11151B] border border-[#1E2633] rounded-2xl p-6 sm:p-8 shadow-2xl relative">
        {/* Quadrant Legend Labels */}
        <div className="grid grid-cols-2 gap-4 h-[420px] relative border border-[#1E2633] rounded-xl overflow-hidden bg-[#0B0D10]">
          {/* Top-Left: GOLD (High Demand, Low Comp) */}
          <div className="bg-emerald-950/10 p-4 border-r border-b border-[#1E2633] flex flex-col justify-between">
            <span className="text-xs font-bold font-mono text-emerald-400 tracking-wider flex items-center gap-1">
              ★ GOLD (High Demand · Low Competition)
            </span>
            <span className="text-[10px] text-emerald-500/70">Prime Solo Founder Wedge</span>
          </div>

          {/* Top-Right: HARD (High Demand, High Comp) */}
          <div className="bg-blue-950/10 p-4 border-b border-[#1E2633] flex flex-col justify-between text-right">
            <span className="text-xs font-bold font-mono text-blue-400 tracking-wider">
              HARD (High Demand · High Competition)
            </span>
            <span className="text-[10px] text-blue-500/70">Requires Strong Differentiation</span>
          </div>

          {/* Bottom-Left: NICHE (Low Demand, Low Comp) */}
          <div className="bg-cyan-950/10 p-4 border-r border-[#1E2633] flex flex-col justify-between">
            <span className="text-xs font-bold font-mono text-cyan-400 tracking-wider">
              NICHE (Low Demand · Low Competition)
            </span>
            <span className="text-[10px] text-cyan-500/70">Boutique Profitability</span>
          </div>

          {/* Bottom-Right: AVOID (Low Demand, High Comp) */}
          <div className="bg-rose-950/10 p-4 flex flex-col justify-between text-right">
            <span className="text-xs font-bold font-mono text-rose-400 tracking-wider">
              AVOID (Low Demand · High Competition)
            </span>
            <span className="text-[10px] text-rose-500/70">Unfavorable Economics</span>
          </div>

          {/* Absolute Plotted Points */}
          <div className="absolute inset-0 p-8 pointer-events-none">
            {products.map((p) => {
              // x = competition (0 to 100) -> left %
              // y = demand (0 to 100) -> bottom %
              const leftPercent = Math.min(92, Math.max(8, p.competitionDifficulty));
              const bottomPercent = Math.min(92, Math.max(8, p.components.demand));

              const isGold = bottomPercent >= 60 && leftPercent <= 50;

              return (
                <div
                  key={p.id}
                  style={{
                    left: `${leftPercent}%`,
                    bottom: `${bottomPercent}%`,
                  }}
                  onMouseEnter={() => setHoveredProduct(p)}
                  onClick={() => onSelectProduct(p)}
                  className="absolute pointer-events-auto transform -translate-x-1/2 translate-y-1/2 cursor-pointer group"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border shadow-lg transition-transform duration-200 group-hover:scale-125 ${
                      isGold
                        ? 'bg-emerald-500 text-black border-emerald-300 ring-4 ring-emerald-500/20'
                        : p.opportunityScore >= 80
                        ? 'bg-cyan-500 text-black border-cyan-300'
                        : 'bg-[#18202B] text-slate-200 border-[#2B3545]'
                    }`}
                  >
                    {p.opportunityScore}
                  </div>

                  {/* Tooltip */}
                  <div className="hidden group-hover:block absolute bottom-8 left-1/2 -translate-x-1/2 z-30 w-48 p-2.5 bg-[#141A23] border border-[#2B3545] rounded-xl text-xs text-white shadow-2xl pointer-events-none">
                    <div className="font-bold truncate">{p.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Demand: {p.components.demand} · Comp: {p.competitionDifficulty}
                    </div>
                    <div className="text-[10px] font-semibold text-emerald-400 mt-1">
                      Click to explore dossier →
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hovered Details Inspector */}
        {hoveredProduct && (
          <div className="mt-4 p-4 bg-[#0B0D10] border border-[#1E2633] rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Inspecting:</span>
              <h4 className="font-bold text-white text-sm">{hoveredProduct.name}</h4>
              <p className="text-slate-400 text-xs">{hoveredProduct.tagline}</p>
            </div>
            <button
              onClick={() => onSelectProduct(hoveredProduct)}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg transition"
            >
              Open Dossier
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
