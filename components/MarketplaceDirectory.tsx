'use client';

import React, { useState } from 'react';
import { Store, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Marketplace } from '@/types';
import { SEED_MARKETPLACES } from '@/lib/seedMarketAndGrowth';

export function MarketplaceDirectory() {
  const [marketplaces] = useState<Marketplace[]>(SEED_MARKETPLACES);
  const [selectedProductType, setSelectedProductType] = useState('All');

  const filtered = selectedProductType === 'All'
    ? marketplaces
    : marketplaces.filter((m) =>
        m.productTypes.some((t) => t.toLowerCase().includes(selectedProductType.toLowerCase()))
      );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Store className="w-3.5 h-3.5" /> Distribution Hubs
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Digital Product Marketplace Directory
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Objective fee structures, organic discovery strength, seller policies, and audience alignment. Verified as of 2026-10-04.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {['All', 'Notion', 'Code', 'Spreadsheet', 'Figma', 'PDF', 'SaaS'].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedProductType(type)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
              selectedProductType === type
                ? 'bg-emerald-500 text-black font-bold border-emerald-400'
                : 'bg-[#11151B] border-[#1E2633] text-slate-400 hover:text-white'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Marketplace Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((m) => (
          <div
            key={m.id}
            className="p-5 bg-[#11151B] border border-[#1E2633] rounded-2xl flex flex-col justify-between space-y-4 shadow-xl hover:border-[#2B3545] transition"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{m.name}</h3>
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-slate-300"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">{m.targetAudience}</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block">Traffic Potential</span>
                  <span className="text-xs font-bold text-emerald-400">{m.trafficPotential}</span>
                </div>
              </div>

              {/* Metrics strip */}
              <div className="grid grid-cols-2 gap-2 mt-3 p-2.5 bg-[#0B0D10] rounded-xl border border-[#1E2633] text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Discovery Strength</span>
                  <div className="text-sm font-bold font-mono text-cyan-400">{m.discoveryStrength}/100</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Seller Difficulty</span>
                  <div className="text-sm font-bold font-mono text-slate-300">{m.sellerDifficulty}/100</div>
                </div>
              </div>

              {/* Details */}
              <div className="mt-3 space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold">Fee Structure: </span>
                  <span className="text-slate-200">{m.feeStructure}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold">Best For: </span>
                  <span className="text-slate-300">{m.bestFor}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold">Current Policy Note: </span>
                  <span className="text-slate-400 italic">{m.currentPolicies}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1E2633] flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>Source: {m.dataSource}</span>
              <span>Verified: {m.lastVerified}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
