'use client';

import React, { useState } from 'react';
import { Sparkles, Compass, AlertCircle, ArrowRight } from 'lucide-react';
import { ProductOpportunity, ProductFormat } from '@/types';

interface ProductResearchFormProps {
  onResearchComplete: (p: ProductOpportunity) => void;
}

const ALL_FORMATS: ProductFormat[] = [
  'PDF',
  'Ebook',
  'Notion template',
  'Excel/Google Sheets template',
  'SaaS',
  'AI tool',
  'Prompt pack',
  'UI kit',
  'Figma template',
  'Framer template',
  'Code boilerplate',
  'Developer tool',
  'Course',
  'Checklist',
  'Database',
  'Spreadsheet',
  'Design assets',
  '3D assets',
  'Mobile app',
  'Browser extension',
];

export function ProductResearchForm({ onResearchComplete }: ProductResearchFormProps) {
  const [idea, setIdea] = useState('');
  const [category, setCategory] = useState('Finance & Productivity');
  const [targetCustomer, setTargetCustomer] = useState('');
  const [expectedPrice, setExpectedPrice] = useState(39);
  const [mainProblem, setMainProblem] = useState('');
  const [format, setFormat] = useState<ProductFormat>('Notion template');
  const [keywords, setKeywords] = useState('');
  const [competitorUrls, setCompetitorUrls] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) {
      setError('Please provide a product idea title or concept.');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea,
          category,
          targetCustomer: targetCustomer || 'Solo creators & indie founders',
          expectedPrice: Number(expectedPrice) || 39,
          mainProblem,
          format,
          competitors: competitorUrls,
          keywords,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.product) {
        throw new Error(data.error || 'Failed to complete research audit');
      }

      onResearchComplete(data.product);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while running the intelligence engine.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Research Studio
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Research Digital Product Opportunity
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Provide your concept details to calculate an objective 0-100 score, audit competition difficulty, uncover buyer intent keywords, and build your 7-day launch scope.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#11151B] border border-[#1E2633] rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl">
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Product Idea / Working Title <span className="text-emerald-400">*</span>
          </label>
          <input
            type="text"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="e.g. Freelancer Tax & Invoice OS for Digital Nomads"
            required
            className="w-full bg-[#0B0D10] border border-[#2B3545] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Product Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as ProductFormat)}
              className="w-full bg-[#0B0D10] border border-[#2B3545] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {ALL_FORMATS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Industry / Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Finance & Productivity, Developer Tools..."
              className="w-full bg-[#0B0D10] border border-[#2B3545] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Target Customer</label>
            <input
              type="text"
              value={targetCustomer}
              onChange={(e) => setTargetCustomer(e.target.value)}
              placeholder="e.g. Solo design agency founders billing $5k+/mo"
              className="w-full bg-[#0B0D10] border border-[#2B3545] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Expected Price ($ USD)</label>
            <input
              type="number"
              min={5}
              max={999}
              value={expectedPrice}
              onChange={(e) => setExpectedPrice(Number(e.target.value))}
              className="w-full bg-[#0B0D10] border border-[#2B3545] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Core Problem Solved</label>
          <textarea
            rows={3}
            value={mainProblem}
            onChange={(e) => setMainProblem(e.target.value)}
            placeholder="What specific friction or financial leak does the customer endure today? (e.g. Unpaid invoices, scattered spreadsheets, difficult tax reserves...)"
            className="w-full bg-[#0B0D10] border border-[#2B3545] rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Known Competitor URLs or Search Terms (Optional)</label>
          <input
            type="text"
            value={competitorUrls}
            onChange={(e) => setCompetitorUrls(e.target.value)}
            placeholder="e.g. https://gumroad.com/... or 'QuickBooks Self-Employed'"
            className="w-full bg-[#0B0D10] border border-[#2B3545] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="pt-3 border-t border-[#1E2633] flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Uses Google GenAI 3.8 Flash &amp; weighted deterministic scoring algorithms.
          </span>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold text-xs sm:text-sm rounded-xl transition shadow-lg shadow-emerald-500/20"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Running Audit...</span>
              </>
            ) : (
              <>
                <span>Launch Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
