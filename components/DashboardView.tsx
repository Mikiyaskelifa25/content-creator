'use client';

import React from 'react';
import {
  Boxes,
  TrendingUp,
  Zap,
  Target,
  ArrowUpRight,
  ShieldCheck,
  CalendarCheck2,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { ProductOpportunity, SaaSIdea, UserAdvantageProfile } from '@/types';
import { ScoreRing } from './ScoreRing';

interface DashboardViewProps {
  products: ProductOpportunity[];
  saasIdeas: SaaSIdea[];
  profile: UserAdvantageProfile;
  onSelectProduct: (p: ProductOpportunity) => void;
  onNewResearch: () => void;
  onNavigateTab: (tab: any) => void;
}

export function DashboardView({
  products,
  saasIdeas,
  profile,
  onSelectProduct,
  onNewResearch,
  onNavigateTab,
}: DashboardViewProps) {
  const totalProducts = products.length;
  const highOppProducts = products.filter((p) => p.opportunityScore >= 80).length;
  const avgScore = Math.round(
    products.reduce((acc, p) => acc + p.opportunityScore, 0) / (totalProducts || 1)
  );
  const bestProduct = [...products].sort((a, b) => b.opportunityScore - a.opportunityScore)[0] || products[0];
  const avgCompetition = Math.round(
    products.reduce((acc, p) => acc + p.competitionDifficulty, 0) / (totalProducts || 1)
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Opportunity Overview Banner */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Opportunity Intelligence Dashboard
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Objective decision-support metrics for solo developers and builders.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1.5 rounded-lg bg-[#141A23] border border-[#1E2633] text-slate-300 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Verified Index: 2026-10-04
            </span>
          </div>
        </div>

        {/* 7 Key Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="bg-[#11151B] border border-[#1E2633] rounded-xl p-3.5 shadow-sm">
            <div className="text-[11px] font-medium text-slate-400">Total Products</div>
            <div className="text-2xl font-bold font-mono text-white mt-1">{totalProducts}</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3 h-3" /> 100% audited
            </div>
          </div>

          <div className="bg-[#11151B] border border-[#1E2633] rounded-xl p-3.5 shadow-sm">
            <div className="text-[11px] font-medium text-slate-400">High Opportunity</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{highOppProducts}</div>
            <div className="text-[10px] text-slate-500 mt-1">Score 80+</div>
          </div>

          <div className="bg-[#11151B] border border-[#1E2633] rounded-xl p-3.5 shadow-sm">
            <div className="text-[11px] font-medium text-slate-400">Avg. Score</div>
            <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">{avgScore}</div>
            <div className="text-[10px] text-slate-500 mt-1">out of 100</div>
          </div>

          <div className="bg-[#11151B] border border-[#1E2633] rounded-xl p-3.5 shadow-sm">
            <div className="text-[11px] font-medium text-slate-400">Top Opportunity</div>
            <div className="text-sm font-bold text-white mt-1.5 truncate max-w-[120px]" title={bestProduct?.name}>
              {bestProduct?.name.split(' ')[0]}...
            </div>
            <div className="text-[10px] text-emerald-400 font-mono font-semibold mt-1">
              Score: {bestProduct?.opportunityScore}
            </div>
          </div>

          <div className="bg-[#11151B] border border-[#1E2633] rounded-xl p-3.5 shadow-sm">
            <div className="text-[11px] font-medium text-slate-400">Avg. Competition</div>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1">{avgCompetition}</div>
            <div className="text-[10px] text-slate-500 mt-1">Moderate difficulty</div>
          </div>

          <div className="bg-[#11151B] border border-[#1E2633] rounded-xl p-3.5 shadow-sm">
            <div className="text-[11px] font-medium text-slate-400">Best Channel</div>
            <div className="text-sm font-bold text-white mt-1.5 truncate">
              {profile.monthlyBudget === 0 ? 'Reddit / SEO' : 'Search & X'}
            </div>
            <div className="text-[10px] text-emerald-400 mt-1">Organic reach</div>
          </div>

          <div className="bg-[#11151B] border border-[#1E2633] rounded-xl p-3.5 shadow-sm">
            <div className="text-[11px] font-medium text-slate-400">SaaS Ideas</div>
            <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">{saasIdeas.length}</div>
            <div className="text-[10px] text-slate-500 mt-1">Dynamic rankings</div>
          </div>
        </div>
      </div>

      {/* Large Featured Card: “What Should I Build Next?” (Section 5) */}
      {bestProduct && (
        <div className="bg-gradient-to-br from-[#121822] via-[#0E131A] to-[#0B0D10] border border-[#232D3F] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" /> What Should I Build Next?
                </span>
                <span className="text-xs font-mono text-slate-400">#1 Ranked Candidate</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {bestProduct.name}
                </h2>
                <p className="text-slate-300 text-sm mt-1 max-w-2xl">{bestProduct.tagline}</p>
              </div>

              {/* Rationale Quote */}
              <div className="p-4 bg-[#0B0D10]/80 border border-[#1E2633] rounded-xl text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                <span className="font-semibold text-white block mb-1">Analyst Verdict:</span>
                &quot;{bestProduct.whyBuildReason}&quot;
              </div>

              {/* 6 Sub-metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 pt-2">
                {[
                  { label: 'Demand', val: bestProduct.components.demand },
                  { label: 'Competition', val: bestProduct.competitionDifficulty },
                  { label: 'Monetization', val: bestProduct.components.monetization },
                  { label: 'Build Difficulty', val: bestProduct.buildDifficulty },
                  { label: 'Trend', val: bestProduct.components.trend },
                  { label: 'Differentiation', val: bestProduct.components.differentiation },
                ].map((s) => (
                  <div key={s.label} className="p-2.5 bg-[#141A23] rounded-lg border border-[#1E2633] text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-medium">{s.label}</span>
                    <div className="text-base font-bold font-mono text-white mt-0.5">{s.val}</div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onSelectProduct(bestProduct)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs sm:text-sm rounded-xl transition shadow-lg shadow-emerald-500/20"
                >
                  <span>Explore Deep Research Dossier</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onNewResearch}
                  className="px-4 py-2.5 bg-[#18202B] hover:bg-[#202A38] text-white border border-[#2B3545] rounded-xl text-xs sm:text-sm font-semibold transition"
                >
                  Analyze Different Idea
                </button>
              </div>
            </div>

            {/* Score Ring Component */}
            <div className="bg-[#0B0D10] border border-[#1E2633] p-6 rounded-2xl flex flex-col items-center justify-center shrink-0 self-center lg:self-start w-full lg:w-60 shadow-xl">
              <ScoreRing
                score={bestProduct.opportunityScore}
                size={130}
                recommendation={bestProduct.recommendation}
                label="Opp. Score"
              />
              <div className="mt-4 text-center space-y-1">
                <div className="text-xs font-semibold text-white">Recommendation: {bestProduct.recommendation}</div>
                <div className="text-[11px] text-slate-400">Price Target: ${bestProduct.estimatedPrice}</div>
                <div className="text-[11px] text-emerald-400 font-mono">MVP Build: ~{bestProduct.estimatedBuildDays} days</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* “What Should I Do This Week?” Panel (Section 51) */}
      <div className="bg-[#11151B] border border-[#1E2633] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E2633] pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CalendarCheck2 className="w-4 h-4 text-emerald-400" />
              What Should I Do This Week? (7-Day Execution Blueprint)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Structured cadence personalized for {profile.weeklyHours} hours/week available and ${profile.monthlyBudget} budget.
            </p>
          </div>
          <span className="text-[11px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
            Sprint Focus: {bestProduct?.name || 'Top Product'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5">
          {[
            { day: 'Mon', action: 'Research 5 Competitors', note: 'Audit pricing, review complaints, find missing features' },
            { day: 'Tue', action: 'Draft Core MVP Scope', note: 'Lock down the 3 non-negotiable modules' },
            { day: 'Wed', action: 'Create Free Lead Magnet', note: 'Single-sheet checklist to validate email signups' },
            { day: 'Thu', action: 'Publish Value Article', note: 'Educational 1,500-word case study on Medium/Dev.to' },
            { day: 'Fri', action: 'Value-First Reddit Post', note: 'Break down lesson in relevant subreddit (90/10 ratio)' },
            { day: 'Sat', action: 'Setup Store & Assets', note: 'List on Gumroad/Lemon Squeezy with clean mockups' },
            { day: 'Sun', action: 'Analyze & Retarget', note: 'Review traffic sources, refine pricing, prepare week 2' },
          ].map((item, idx) => (
            <div key={item.day} className="p-3 bg-[#0E1217] border border-[#1E2633] rounded-xl flex flex-col justify-between text-xs">
              <div>
                <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider mb-1">
                  Day {idx + 1} · {item.day}
                </div>
                <div className="font-semibold text-white">{item.action}</div>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Opportunity Grid */}
      <div className="bg-[#11151B] border border-[#1E2633] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Top Digital Product Candidates</h3>
            <p className="text-xs text-slate-400">Highest opportunity scores in current database</p>
          </div>
          <button
            onClick={() => onNavigateTab('ideas')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
          >
            <span>View All ({products.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.slice(0, 6).map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectProduct(p)}
              className="p-4 bg-[#0E1217] hover:bg-[#141A23] border border-[#1E2633] hover:border-[#2B3545] rounded-xl transition cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#18202B] text-slate-300 border border-[#2B3545]">
                    {p.format}
                  </span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    {p.opportunityScore}/100
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm tracking-tight">{p.name}</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.description}</p>
              </div>

              <div className="pt-2 border-t border-[#1E2633] flex items-center justify-between text-xs text-slate-400">
                <span>Est: ${p.estimatedPrice}</span>
                <span className="text-emerald-400 font-semibold">{p.recommendation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
