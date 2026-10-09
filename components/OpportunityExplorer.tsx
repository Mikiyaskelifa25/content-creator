'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Share2,
  DollarSign,
  Users,
  Compass,
  FileCode,
  ShieldAlert,
  ArrowRight,
  Activity,
  Flame,
  Globe,
  RefreshCw,
  BarChart3,
} from 'lucide-react';
import { ProductOpportunity, RecommendationType, ProductFormat, GoogleTrendsData } from '@/types';
import { ScoreRing } from './ScoreRing';

interface OpportunityExplorerProps {
  initialProduct?: ProductOpportunity;
  onSaveProduct: (p: ProductOpportunity) => void;
  onOpenContentStudio: (p: ProductOpportunity) => void;
  onGenerateReport: (p: ProductOpportunity) => void;
  allProducts: ProductOpportunity[];
}

export function OpportunityExplorer({
  initialProduct,
  onSaveProduct,
  onOpenContentStudio,
  onGenerateReport,
  allProducts,
}: OpportunityExplorerProps) {
  const [product, setProduct] = useState<ProductOpportunity>(
    initialProduct || allProducts[0]
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Google Trends real-time Search Grounding state
  const [trendsData, setTrendsData] = useState<GoogleTrendsData | null>(null);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);
  const [hoveredMonth, setHoveredMonth] = useState<{ period: string; interest: number } | null>(null);

  const fetchTrendsData = useCallback(async (topicName: string, categoryName: string) => {
    setIsLoadingTrends(true);
    try {
      const res = await fetch('/api/trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: topicName, category: categoryName }),
      });
      const data = await res.json();
      if (data.trends) {
        setTrendsData(data.trends);
      }
    } catch (e) {
      console.error('Failed to fetch Google Trends data:', e);
    } finally {
      setIsLoadingTrends(false);
    }
  }, []);

  // Fetch trends whenever product changes without synchronous setState cascading
  useEffect(() => {
    let isMounted = true;
    const loadTrends = async () => {
      try {
        const res = await fetch('/api/trends', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: product.name, category: product.category }),
        });
        const data = await res.json();
        if (isMounted && data.trends) {
          setTrendsData(data.trends);
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadTrends();
    return () => {
      isMounted = false;
    };
  }, [product.name, product.category]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleExecuteResearch = async (queryToRun: string) => {
    if (!queryToRun.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: queryToRun,
          category: 'Software & Productivity',
          targetCustomer: 'Solo builders, freelancers & micro-agencies',
          format: 'Notion template' as ProductFormat,
          expectedPrice: 39,
        }),
      });
      const data = await res.json();
      if (data.product) {
        setProduct(data.product);
        onSaveProduct(data.product);
        fetchTrendsData(data.product.name, data.product.category);
      }
    } catch (e) {
      console.error('Failed to run research in explorer:', e);
    } finally {
      setIsSearching(false);
    }
  };

  const quickIdeas = [
    'AI invoice tool for freelancers',
    'Next.js SaaS starter boilerplate with Stripe',
    'Real Estate cash flow underwriting model',
    'ICU clinical reference and dosage calculator',
    'AI prompt engineering system architecture kit',
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Hero Search Bar */}
      <div className="bg-gradient-to-b from-[#141A23] to-[#0E1217] border border-[#1E2633] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mb-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" /> 360° Opportunity Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Opportunity Explorer
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Enter any digital product or software idea to run an instant 9-factor demand audit, real-time Google Trends spike analysis, competitor pricing, and launch execution plan.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleExecuteResearch(searchQuery);
          }}
          className="flex flex-col sm:flex-row gap-2.5"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. AI invoice tool for freelancers or Next.js SaaS boilerplate..."
              className="w-full bg-[#0B0D10] border border-[#2B3545] rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20"
          >
            {isSearching ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Auditing Market...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Opportunity</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
          <span className="text-[11px] text-slate-500">Popular:</span>
          {quickIdeas.map((idea) => (
            <button
              key={idea}
              onClick={() => {
                setSearchQuery(idea);
                handleExecuteResearch(idea);
              }}
              className="px-2.5 py-1 bg-[#141A23] hover:bg-[#1E2633] border border-[#1E2633] rounded-lg text-slate-300 text-[11px] transition"
            >
              {idea}
            </button>
          ))}
        </div>
      </div>

      {/* Main Analysis Card */}
      <div className="bg-[#11151B] border border-[#1E2633] rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
        {/* Header with Title and Score Ring */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#1E2633]">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-[#18202B] text-slate-300 border border-[#2B3545]">
                {product.category}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-[#18202B] text-emerald-400 border border-emerald-500/20">
                {product.format}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Updated: {new Date(product.updatedAt).toLocaleDateString()}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {product.name}
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl">{product.tagline}</p>
            <p className="text-slate-400 text-xs max-w-3xl leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex items-center gap-6 bg-[#0B0D10] p-4 rounded-xl border border-[#1E2633] self-start md:self-auto">
            <ScoreRing
              score={product.opportunityScore}
              size={120}
              recommendation={product.recommendation}
              label="Opportunity"
            />
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center justify-between gap-4">
                <span>Recommendation:</span>
                <span className="font-bold text-white uppercase">{product.recommendation}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Score Tier:</span>
                <span className="text-emerald-400 font-medium">{product.scoreCategory}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Est. Build Time:</span>
                <span className="text-slate-200 font-mono">{product.estimatedBuildDays} days</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Target Price:</span>
                <span className="text-slate-200 font-mono font-bold">${product.estimatedPrice}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 9-Factor Component Metrics Grid */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
            <span>Score Rubric Breakdown (0 - 100)</span>
            <span className="text-[11px] font-normal text-slate-500">Weighted: Demand (20%) · Intent (15%) · Monetization (15%) · Advantage (15%) · Trend (10%)</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Demand', value: product.components.demand, weight: '20%' },
              { label: 'Buyer Intent', value: product.components.buyerIntent, weight: '15%' },
              { label: 'Monetization', value: product.components.monetization, weight: '15%' },
              { label: 'Comp. Advantage', value: product.components.competitionAdvantage, weight: '15%' },
              { label: 'Trend Strength', value: product.components.trend, weight: '10%' },
              { label: 'Differentiation', value: product.components.differentiation, weight: '10%' },
            ].map((m) => (
              <div key={m.label} className="bg-[#0E1217] border border-[#1E2633] rounded-xl p-3">
                <div className="text-[11px] text-slate-400 flex justify-between">
                  <span>{m.label}</span>
                  <span className="text-[10px] text-slate-500">{m.weight}</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-xl font-bold font-mono text-white">{m.value}</span>
                  <span className={`text-[10px] font-semibold ${m.value >= 80 ? 'text-emerald-400' : m.value >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {m.value >= 80 ? 'High' : m.value >= 60 ? 'Med' : 'Low'}
                  </span>
                </div>
                <div className="w-full bg-[#181D24] h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${m.value >= 80 ? 'bg-emerald-500' : m.value >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${m.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            GOOGLE TRENDS REAL-TIME INTEREST & SPIKES (Powered by Search Grounding)
            ========================================================================= */}
        <div className="bg-[#0E1217] border border-cyan-500/20 rounded-2xl p-6 space-y-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Panel Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E2633] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    Google Trends Real-Time Interest &amp; Spikes
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono font-bold">
                    <Globe className="w-3 h-3" /> Live Search Grounded
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Real search interest trajectory, breakout search queries, and demand peaks for &quot;{product.name}&quot;.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              {trendsData && (
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold font-mono border ${
                    trendsData.momentum === 'Breakout'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : trendsData.momentum === 'Rising'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  {trendsData.momentum} (+{trendsData.interestChangePct}%)
                </span>
              )}

              <button
                onClick={() => fetchTrendsData(product.name, product.category)}
                disabled={isLoadingTrends}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141A23] hover:bg-[#1E2633] border border-[#1E2633] rounded-lg text-xs font-semibold text-slate-300 transition"
                title="Query live Google Trends via Search Grounding"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingTrends ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />
                <span>{isLoadingTrends ? 'Auditing...' : 'Refresh Trends'}</span>
              </button>
            </div>
          </div>

          {/* Interactive 12-Month Search Interest Sparkline / Bar Graph */}
          {trendsData && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                  12-Month Google Search Interest Curve (0 - 100 Index)
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Peak: <strong className="text-emerald-400">{trendsData.peakPeriod}</strong> · Trend Index:{' '}
                  <strong className="text-white">{trendsData.trendScore}/100</strong>
                </span>
              </div>

              {/* Bar Visualizer */}
              <div className="bg-[#0B0D10] border border-[#1E2633] rounded-xl p-4 flex items-end justify-between gap-1.5 h-36 relative">
                {trendsData.monthlyInterestData.map((d, i) => {
                  const isSpike = d.isSpike || d.interest >= 90;
                  return (
                    <div
                      key={d.period}
                      onMouseEnter={() => setHoveredMonth(d)}
                      onMouseLeave={() => setHoveredMonth(null)}
                      className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
                    >
                      {/* Bar */}
                      <div
                        style={{ height: `${Math.max(12, d.interest)}%` }}
                        className={`w-full rounded-t transition-all duration-300 ${
                          isSpike
                            ? 'bg-gradient-to-t from-emerald-600 to-cyan-400 group-hover:brightness-125 shadow-lg shadow-cyan-500/20'
                            : 'bg-[#1E2633] hover:bg-slate-500'
                        }`}
                      />

                      {/* Period Label */}
                      <span className="text-[10px] text-slate-500 font-mono mt-2 block whitespace-nowrap truncate w-full text-center">
                        {d.period.split(' ')[0]}
                      </span>

                      {/* Floating Tooltip */}
                      <div className="hidden group-hover:flex absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#141A23] border border-[#2B3545] rounded text-[10px] font-mono text-white whitespace-nowrap z-20 shadow-xl">
                        {d.period}: {d.interest}/100 {isSpike ? '🔥 Spike' : ''}
                      </div>
                    </div>
                  );
                })}
              </div>

              {hoveredMonth && (
                <div className="text-[11px] font-mono text-slate-400 text-center">
                  Inspecting {hoveredMonth.period}: <strong className="text-emerald-400">{hoveredMonth.interest} index</strong>
                </div>
              )}
            </div>
          )}

          {/* 3 Sub-Panels: Trend Drivers, Breakout Queries, Geographic Hotspots */}
          {trendsData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-xs">
              {/* Left: Summary Thesis */}
              <div className="p-3.5 bg-[#141A23] rounded-xl border border-[#1E2633] space-y-1.5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 block mb-1">
                    Search Momentum Driver
                  </span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {trendsData.trendSummary}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#1E2633] text-[10px] text-slate-500">
                  Data source: {trendsData.groundingSource}
                </div>
              </div>

              {/* Center: Breakout Search Queries */}
              <div className="p-3.5 bg-[#141A23] rounded-xl border border-[#1E2633] space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 block">
                  Breakout Search Queries (Live)
                </span>
                <div className="space-y-1.5">
                  {trendsData.breakoutQueries.map((b, i) => (
                    <div key={i} className="flex items-center justify-between p-1.5 bg-[#0B0D10] rounded border border-[#1E2633]">
                      <span className="text-slate-300 font-medium truncate max-w-[150px]">{b.query}</span>
                      <span className="text-emerald-400 font-mono font-bold text-[10px] shrink-0 ml-2">
                        {b.growth}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Top Geographic Regions */}
              <div className="p-3.5 bg-[#141A23] rounded-xl border border-[#1E2633] space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
                  Top Regional Demand
                </span>
                <div className="space-y-1.5">
                  {trendsData.topRegions.slice(0, 4).map((r, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-300">{r.region}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-[#0B0D10] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${r.relativeInterest}%` }} />
                        </div>
                        <span className="font-mono text-slate-400 text-[10px] w-6 text-right">{r.relativeInterest}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Why This Score? Evidence Panel */}
        <div className="bg-[#0E1217] border border-[#1E2633] rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Why this score? (Evidence-Based Rationale)
            </h4>
            <button
              onClick={() => handleCopy(product.whyBuildReason, 'why')}
              className="text-slate-400 hover:text-white text-xs flex items-center gap-1"
            >
              {copiedSection === 'why' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'why' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {product.whyBuildReason}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
            <div className="p-3 bg-[#141A23] rounded-lg border border-[#1E2633]">
              <span className="font-semibold text-slate-200 block mb-1">Demand & Intent Evidence:</span>
              <p className="text-slate-400">{product.demandAnalysis}</p>
            </div>
            <div className="p-3 bg-[#141A23] rounded-lg border border-[#1E2633]">
              <span className="font-semibold text-slate-200 block mb-1">Competitive Landscape:</span>
              <p className="text-slate-400">{product.competitionSummary}</p>
            </div>
          </div>
        </div>

        {/* 2-Column Core Intelligence Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Target Customer & Core Pain */}
          <div className="bg-[#0E1217] border border-[#1E2633] rounded-xl p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              Target Customer & Pain Solved
            </h4>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Ideal Buyer Profile:</span>
                <p className="text-white font-semibold mt-0.5">{product.targetAudience}</p>
              </div>
              <div className="pt-2 border-t border-[#1E2633]">
                <span className="text-slate-400 font-medium">Main Urgent Pain:</span>
                <p className="text-slate-300 mt-0.5 leading-relaxed">{product.mainProblem}</p>
              </div>
              <div className="pt-2 border-t border-[#1E2633]">
                <span className="text-slate-400 font-medium">Buyer Willingness To Pay:</span>
                <p className="text-slate-300 mt-0.5">{product.buyerIntentNotes}</p>
              </div>
            </div>
          </div>

          {/* Pricing Model & Suggested Tiers */}
          <div className="bg-[#0E1217] border border-[#1E2633] rounded-xl p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Recommended Pricing Strategy
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 bg-[#141A23] rounded-lg border border-[#1E2633]">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Entry Tier</span>
                <div className="text-lg font-bold font-mono text-white mt-0.5">${product.suggestedPricing.entry}</div>
                <span className="text-[10px] text-slate-500">Core file only</span>
              </div>
              <div className="p-2.5 bg-emerald-950/20 rounded-lg border border-emerald-500/30 relative">
                <span className="text-[10px] text-emerald-400 uppercase font-bold">Recommended</span>
                <div className="text-lg font-bold font-mono text-emerald-300 mt-0.5">${product.suggestedPricing.recommended}</div>
                <span className="text-[10px] text-emerald-400/80">Sweet spot</span>
              </div>
              <div className="p-2.5 bg-[#141A23] rounded-lg border border-[#1E2633]">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Premium / Team</span>
                <div className="text-lg font-bold font-mono text-white mt-0.5">${product.suggestedPricing.premium}</div>
                <span className="text-[10px] text-slate-500">+ Video / bonus</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 italic">
              Model: {product.suggestedPricing.model}
            </p>
          </div>
        </div>

        {/* How You Beat Existing Products: Differentiation Wedges */}
        <div className="bg-[#0E1217] border border-[#1E2633] rounded-xl p-5 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            How You Could Beat Existing Products (Differentiation Wedges)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {product.differentiationWedges.map((wedge, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 bg-[#141A23] rounded-lg border border-[#1E2633] text-xs text-slate-200"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <span>{wedge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested MVP to Build in 7-30 Days */}
        <div className="bg-[#0E1217] border border-[#1E2633] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-amber-400" />
              Suggested MVP Scope ({product.suggestedMvp.timeline})
            </h4>
            <span className="text-xs font-mono text-slate-400">Est. Cost: {product.suggestedMvp.targetCost}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {product.suggestedMvp.coreFeatures.map((feat, i) => (
              <div key={i} className="p-3 bg-[#141A23] rounded-lg border border-[#1E2633] text-xs">
                <span className="text-[10px] font-mono text-amber-400 block mb-1">Module {i + 1}</span>
                <span className="text-slate-200 font-medium">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Where to Sell & Where to Acquire Customers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Best Marketplaces */}
          <div className="bg-[#0E1217] border border-[#1E2633] rounded-xl p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Where to Sell This (Marketplace Fit)
            </h4>
            <div className="space-y-2">
              {product.bestMarketplaces.map((m, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-[#141A23] rounded-lg border border-[#1E2633] text-xs">
                  <div>
                    <span className="font-semibold text-white">{m.platform}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{m.reason}</p>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 text-sm ml-2">{m.score}/100</span>
                </div>
              ))}
            </div>
          </div>

          {/* Best Acquisition Channels */}
          <div className="bg-[#0E1217] border border-[#1E2633] rounded-xl p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Customer Acquisition Channels
            </h4>
            <div className="space-y-2">
              {product.bestAcquisitionChannels.map((c, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-[#141A23] rounded-lg border border-[#1E2633] text-xs">
                  <div>
                    <span className="font-semibold text-white">{c.channel}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{c.strategy}</p>
                  </div>
                  <span className="font-mono font-bold text-cyan-400 text-sm ml-2">{c.score}/100</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risks & Mitigations */}
        <div className="p-4 bg-rose-950/10 border border-rose-500/20 rounded-xl space-y-2 text-xs">
          <div className="flex items-center gap-2 text-rose-400 font-semibold">
            <ShieldAlert className="w-4 h-4" />
            Key Execution Risks to Guard Against
          </div>
          <ul className="list-disc pl-5 space-y-1 text-slate-300">
            {product.keyRisks.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>

        {/* Action Buttons: Save, Generate Content, Export Report */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#1E2633]">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Search Grounding Verified: Google Trends trajectory &amp; real customer feedback</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenContentStudio(product)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#18202B] hover:bg-[#222C3B] border border-[#2B3545] rounded-xl text-xs font-semibold text-white transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Generate Content Drafts</span>
            </button>

            <button
              onClick={() => onGenerateReport(product)}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-500/20"
            >
              <span>Export Full Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
