'use client';

import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, ShieldCheck, Wallet, Sparkles } from 'lucide-react';
import { GrowthChannel } from '@/types';
import { SEED_GROWTH_CHANNELS } from '@/lib/seedMarketAndGrowth';

export function GrowthChannelsView({ isZeroBudget }: { isZeroBudget: boolean }) {
  const [channels] = useState<GrowthChannel[]>(SEED_GROWTH_CHANNELS);
  const [filterZeroBudgetOnly, setFilterZeroBudgetOnly] = useState(isZeroBudget);

  const filtered = channels.filter((c) => !filterZeroBudgetOnly || c.lowBudgetFriendly);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <TrendingUp className="w-3.5 h-3.5" /> Acquisition Engine
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Customer Acquisition &amp; Growth Channels
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Scored 0–100 by audience fit, organic reach, buyer intent, and community promotion risk. No automated spam or mass bots.
        </p>
      </div>

      {/* Control Bar */}
      <div className="bg-[#11151B] border border-[#1E2633] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <label className="flex items-center gap-2 px-3 py-1.5 bg-[#0B0D10] border border-[#1E2633] rounded-lg cursor-pointer text-slate-300">
          <input
            type="checkbox"
            checked={filterZeroBudgetOnly}
            onChange={(e) => setFilterZeroBudgetOnly(e.target.checked)}
            className="rounded bg-[#181D24] border-[#2B3545] text-emerald-500 focus:ring-0"
          />
          <div className="flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-emerald-400">$0 Low-Budget Channels Only (Organic &amp; Free)</span>
          </div>
        </label>

        <span className="text-[11px] text-slate-400 font-mono">
          Showing {filtered.length} prioritized channels
        </span>
      </div>

      {/* Channel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((c) => {
          const isHighRisk = c.promotionRisk.includes('Strict');
          return (
            <div
              key={c.id}
              className="p-5 bg-[#11151B] border border-[#1E2633] rounded-2xl flex flex-col justify-between space-y-4 shadow-xl hover:border-[#2B3545] transition"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">{c.name}</h3>
                    <span className="text-[11px] text-slate-400 block mt-0.5">{c.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-semibold text-slate-500 block">Overall Score</span>
                    <span className="text-lg font-bold font-mono text-emerald-400">{c.overallChannelScore}/100</span>
                  </div>
                </div>

                {/* Sub metrics */}
                <div className="grid grid-cols-3 gap-2 mt-3 p-2.5 bg-[#0B0D10] rounded-xl border border-[#1E2633] text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Organic Reach</span>
                    <div className="text-sm font-bold font-mono text-cyan-400 mt-0.5">{c.organicReach}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Buyer Intent</span>
                    <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">{c.buyerIntent}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Speed</span>
                    <div className="text-[11px] font-semibold text-slate-300 mt-0.5">{c.speed.split(' ')[0]}</div>
                  </div>
                </div>

                {/* Strategy note */}
                <div className="mt-3 space-y-2 text-xs">
                  <div className="p-3 bg-[#141A23] rounded-xl border border-[#1E2633]">
                    <span className="font-semibold text-slate-200 block mb-1">Recommended Strategy:</span>
                    <p className="text-slate-300 leading-relaxed">{c.recommendedStrategy}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-400">Content Cost: <strong className="text-white">{c.contentCost}</strong></span>
                    <span className={`inline-flex items-center gap-1 font-semibold ${isHighRisk ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {isHighRisk && <AlertTriangle className="w-3 h-3" />}
                      Risk: {c.promotionRisk}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1E2633] text-[11px] text-slate-400">
                Best Product Fit: <span className="text-slate-200 font-medium">{c.bestProductType}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
