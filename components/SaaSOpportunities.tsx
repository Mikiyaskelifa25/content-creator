'use client';

import React, { useState } from 'react';
import {
  Boxes,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  TrendingUp,
  DollarSign,
  Clock,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { SaaSIdea } from '@/types';
import { ScoreRing } from './ScoreRing';

interface SaaSOpportunitiesProps {
  saasIdeas: SaaSIdea[];
  onOpenExplorerWithIdea?: (name: string) => void;
}

export function SaaSOpportunities({ saasIdeas, onOpenExplorerWithIdea }: SaaSOpportunitiesProps) {
  const [expandedId, setExpandedId] = useState<string | null>(saasIdeas[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Boxes className="w-3.5 h-3.5" /> Software Intelligence
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Top 10 Micro-SaaS Opportunities
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Dynamically evaluated SaaS concepts scoring pain severity, willingness to pay, recurring revenue potential, and 7–30 day MVP simplicity.
        </p>
      </div>

      {/* SaaS Cards List */}
      <div className="space-y-4">
        {saasIdeas.map((saas, idx) => {
          const isExpanded = expandedId === saas.id;
          return (
            <div
              key={saas.id}
              className={`bg-[#11151B] border transition-all rounded-2xl overflow-hidden shadow-xl ${
                isExpanded ? 'border-[#3B82F6]/40 shadow-blue-500/5' : 'border-[#1E2633] hover:border-[#2B3545]'
              }`}
            >
              {/* Card Summary Header */}
              <div
                onClick={() => toggleExpand(saas.id)}
                className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 select-none"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-[#141A23] border border-[#2B3545] font-mono font-bold text-sm text-cyan-400 flex items-center justify-center shrink-0">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#18202B] text-slate-300 border border-[#2B3545]">
                        {saas.category}
                      </span>
                      <span className="text-xs text-slate-400">
                        Target: <strong className="text-slate-200">{saas.targetCustomer}</strong>
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{saas.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-2xl line-clamp-2">
                      {saas.problem}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Opp. Score</span>
                    <span className="text-xl font-bold font-mono text-emerald-400">{saas.opportunityScore}/100</span>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-bold uppercase border ${
                      saas.recommendation === 'BUILD'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                    }`}
                  >
                    {saas.recommendation}
                  </span>
                  <div className="p-1 rounded text-slate-400 hover:text-white">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expandable Section 26: “Why this SaaS?” */}
              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-[#1E2633] space-y-6 text-xs bg-[#0B0D10]/40">
                  {/* Solution & Timing */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#141A23] rounded-xl border border-[#1E2633] space-y-1">
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">Proposed Solution</span>
                      <p className="text-slate-200 leading-relaxed">{saas.solution}</p>
                    </div>

                    <div className="p-4 bg-[#141A23] rounded-xl border border-[#1E2633] space-y-1">
                      <span className="text-cyan-400 font-semibold uppercase text-[10px]">Why Now? (Market Timing)</span>
                      <p className="text-slate-200 leading-relaxed">{saas.whyNow}</p>
                    </div>
                  </div>

                  {/* Why Users Pay & Differentiation Wedge */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#141A23] rounded-xl border border-[#1E2633] space-y-1">
                      <span className="text-emerald-400 font-semibold uppercase text-[10px]">Why Users Would Pay</span>
                      <p className="text-slate-300 leading-relaxed">{saas.whyUsersWouldPay}</p>
                    </div>

                    <div className="p-4 bg-[#141A23] rounded-xl border border-[#1E2633] space-y-1">
                      <span className="text-amber-400 font-semibold uppercase text-[10px]">Differentiation Wedge</span>
                      <p className="text-slate-300 leading-relaxed">{saas.differentiationWedge}</p>
                    </div>
                  </div>

                  {/* MVP Scope & Pricing */}
                  <div className="p-4 bg-[#141A23] rounded-xl border border-[#1E2633] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        Suggested MVP Scope ({saas.estimatedMvpDays} Days · {saas.mvpComplexity} Complexity)
                      </span>
                      <div className="text-slate-300 font-mono">
                        Pricing: <strong className="text-emerald-400">${saas.suggestedPricing.starter}/mo</strong> (Starter) · ${saas.suggestedPricing.pro}/mo (Pro)
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                      {saas.mvpFeatures.map((feat, i) => (
                        <div key={i} className="p-2.5 bg-[#0B0D10] rounded-lg border border-[#1E2633] text-slate-300">
                          <span className="text-[10px] text-slate-500 font-mono block">Feature {i + 1}</span>
                          <span className="font-medium text-xs">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Major Risks & Distribution Channels */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <div className="text-xs text-rose-300 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>Risk: {saas.majorRisks[0]}</span>
                    </div>

                    {onOpenExplorerWithIdea && (
                      <button
                        onClick={() => onOpenExplorerWithIdea(saas.name)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition text-xs shadow-lg shadow-emerald-500/20"
                      >
                        <span>Deep Dive in Opportunity Explorer</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
