'use client';

import React, { useState } from 'react';
import { KeyRound, TrendingUp, Sparkles, Filter, ShieldCheck, Tag } from 'lucide-react';
import { KeywordData } from '@/types';
import { SEED_KEYWORDS } from '@/lib/seedMarketAndGrowth';

export function KeywordResearch() {
  const [keywords, setKeywords] = useState<KeywordData[]>(SEED_KEYWORDS);
  const [selectedIntent, setSelectedIntent] = useState<string>('all');
  const [filterBuyerIntentOnly, setFilterBuyerIntentOnly] = useState(false);

  const filtered = keywords.filter((k) => {
    const matchesIntent = selectedIntent === 'all' || k.intent === selectedIntent;
    const matchesBuyer = !filterBuyerIntentOnly || k.isBuyerIntent;
    return matchesIntent && matchesBuyer;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <KeyRound className="w-3.5 h-3.5" /> Search Intent Intelligence
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Keyword &amp; Buyer Intent Explorer
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          High-intent transactional search queries mapped to product opportunities. No fabricated search volumes; all metrics verified or labeled derived.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#11151B] border border-[#1E2633] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={selectedIntent}
            onChange={(e) => setSelectedIntent(e.target.value)}
            className="bg-[#0B0D10] border border-[#1E2633] rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none"
          >
            <option value="all">All Intent Types</option>
            <option value="transactional">Transactional (Ready to Buy)</option>
            <option value="commercial">Commercial (Comparing Options)</option>
            <option value="informational">Informational (Learning)</option>
          </select>

          <label className="flex items-center gap-2 px-3 py-1.5 bg-[#0B0D10] border border-[#1E2633] rounded-lg cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={filterBuyerIntentOnly}
              onChange={(e) => setFilterBuyerIntentOnly(e.target.checked)}
              className="rounded bg-[#181D24] border-[#2B3545] text-emerald-500 focus:ring-0"
            />
            <span className="font-semibold text-emerald-400">Buyer Intent Keywords Only</span>
          </label>
        </div>

        <div className="text-[11px] text-slate-500 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Derived from verified marketplace and forum demand</span>
        </div>
      </div>

      {/* Keywords Table */}
      <div className="bg-[#11151B] border border-[#1E2633] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0E1217] text-slate-400 uppercase text-[10px] font-semibold border-b border-[#1E2633] tracking-wider">
              <tr>
                <th className="py-3 px-4">Keyword Target</th>
                <th className="py-3 px-3">Intent Type</th>
                <th className="py-3 px-3 text-right">Opp. Score</th>
                <th className="py-3 px-3 text-right">Competition</th>
                <th className="py-3 px-3 text-right">Trend</th>
                <th className="py-3 px-4">Associated Product</th>
                <th className="py-3 px-4">Source &amp; Label</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181D24]">
              {filtered.map((k) => (
                <tr key={k.id} className="hover:bg-[#141A23] transition">
                  <td className="py-3.5 px-4 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <span>{k.keyword}</span>
                      {k.isBuyerIntent && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                          Buyer Intent
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5 font-normal">
                      Angle: {k.suggestedAngle}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold border ${
                        k.intent === 'transactional'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : k.intent === 'commercial'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                          : 'bg-[#18202B] text-slate-400 border-[#2B3545]'
                      }`}
                    >
                      {k.intent}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-400 text-sm">
                    {k.opportunityScore}/100
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                    {k.competition}/100
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20">
                      {k.trend} ({k.trendScore})
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-medium max-w-[200px] truncate">
                    {k.relatedProducts[0] || 'General Product'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 text-[11px] font-mono">
                    {k.volumeLabel}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
