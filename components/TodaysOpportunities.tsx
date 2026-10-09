'use client';

import React from 'react';
import { CalendarDays, Flame, Sparkles, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react';
import { ProductOpportunity } from '@/types';

interface TodaysOpportunitiesProps {
  products: ProductOpportunity[];
  onSelectProduct: (p: ProductOpportunity) => void;
}

export function TodaysOpportunities({ products, onSelectProduct }: TodaysOpportunitiesProps) {
  const topDaily = products.slice(0, 8);

  const emergingSignals = [
    { title: 'Underserved Niche: Healthcare Clinical Reference Sheets', note: 'Nurse and ICU practitioners surging on Etsy with zero modern competition.' },
    { title: 'Micro-SaaS Wedge: AI Business Analytics via Email/Telegram', note: 'Founders refusing to log into complex BI dashboards; high demand for scheduled digests.' },
    { title: 'Competitor Movement: Accounting SaaS Prices Rising +25%', note: 'Creates instant opening for $39 one-time Notion/Excel financial operating systems.' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <CalendarDays className="w-3.5 h-3.5" /> Daily Research Feed
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Today&apos;s High-Priority Opportunities
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Daily audited market signals, competitor movements, and emerging underserved niches. Timestamp: 2026-10-04.
        </p>
      </div>

      {/* Top Emerging Signals Banner */}
      <div className="bg-[#11151B] border border-[#1E2633] rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
          <Flame className="w-4 h-4" /> Market Movements Detected Today
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {emergingSignals.map((sig, i) => (
            <div key={i} className="p-3.5 bg-[#0E1217] rounded-xl border border-[#1E2633] text-xs">
              <span className="font-bold text-white block mb-1">{sig.title}</span>
              <p className="text-slate-400 leading-snug">{sig.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Ranked Product Opportunities */}
      <div className="bg-[#11151B] border border-[#1E2633] rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white">Daily Opportunity Ranked Radar</h3>
        <div className="space-y-3">
          {topDaily.map((p, idx) => (
            <div
              key={p.id}
              onClick={() => onSelectProduct(p)}
              className="p-4 bg-[#0E1217] hover:bg-[#141A23] border border-[#1E2633] hover:border-[#2B3545] rounded-xl transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5 flex-1">
                <span className="w-7 h-7 rounded-lg bg-[#18202B] text-emerald-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  #{idx + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm">{p.name}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.2 bg-[#141A23] text-slate-300 rounded border border-[#2B3545]">
                      {p.format}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{p.whyBuildReason}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Score</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">{p.opportunityScore}/100</span>
                </div>
                <button className="p-1.5 rounded-lg bg-[#141A23] text-slate-300 hover:text-white border border-[#1E2633]">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
