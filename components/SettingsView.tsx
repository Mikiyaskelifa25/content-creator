'use client';

import React, { useState } from 'react';
import { Sliders, Wallet, UserCheck, ShieldCheck, Check } from 'lucide-react';
import { UserAdvantageProfile } from '@/types';

interface SettingsViewProps {
  profile: UserAdvantageProfile;
  onSaveProfile: (p: UserAdvantageProfile) => void;
}

export function SettingsView({ profile, onSaveProfile }: SettingsViewProps) {
  const [formData, setFormData] = useState<UserAdvantageProfile>(profile);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sliders className="w-3.5 h-3.5" /> Personalization
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          My Advantage &amp; Budget Settings
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Customize your engineering skills, audience reach, weekly hours, and monthly budget. The algorithm recalculates feasibility and distribution scores dynamically.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#11151B] border border-[#1E2633] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        {/* Low Budget Mode Highlight (Section 31) */}
        <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-400 flex items-center gap-2 text-sm">
              <Wallet className="w-4 h-4" />
              Low Budget Mode ($0)
            </span>
            <span className="text-xs font-mono text-emerald-300">
              {formData.monthlyBudget === 0 ? 'Active ($0 Mode)' : `$${formData.monthlyBudget}/mo`}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            When $0 is selected, the scoring engine heavily prioritizes free organic channels (Reddit, SEO, Product Hunt, GitHub, Medium) and avoids ideas requiring paid API subscriptions or ads.
          </p>

          <div className="pt-2 flex flex-wrap gap-2">
            {[0, 10, 25, 50, 100, 250].map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setFormData({ ...formData, monthlyBudget: b as any })}
                className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition ${
                  formData.monthlyBudget === b
                    ? 'bg-emerald-500 text-black border-emerald-400 shadow-sm'
                    : 'bg-[#0B0D10] border-[#1E2633] text-slate-400 hover:text-white'
                }`}
              >
                ${b}/mo
              </button>
            ))}
          </div>
        </div>

        {/* Primary Role & Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Primary Role / Archetype</label>
            <select
              value={formData.primaryRole}
              onChange={(e) => setFormData({ ...formData, primaryRole: e.target.value as any })}
              className="w-full bg-[#0B0D10] border border-[#2B3545] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Full-stack Developer">Full-stack Developer (Next.js / Node)</option>
              <option value="Frontend / UI">Frontend &amp; UI Designer (Figma / React)</option>
              <option value="No-Code / Builder">No-Code / Notion &amp; Spreadsheet Builder</option>
              <option value="Marketer / Creator">Marketer / Content Creator</option>
              <option value="Domain Expert">Domain Subject Matter Expert</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Available Time (Hours / Week)</label>
            <input
              type="number"
              min={2}
              max={60}
              value={formData.weeklyHours}
              onChange={(e) => setFormData({ ...formData, weeklyHours: Number(e.target.value) })}
              className="w-full bg-[#0B0D10] border border-[#2B3545] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>

        {/* Existing Audience Size & Target Income */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Existing Audience / Email List Size</label>
            <input
              type="number"
              min={0}
              value={formData.existingAudienceSize}
              onChange={(e) => setFormData({ ...formData, existingAudienceSize: Number(e.target.value) })}
              placeholder="0 if starting fresh"
              className="w-full bg-[#0B0D10] border border-[#2B3545] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Target Monthly Income ($ USD)</label>
            <input
              type="number"
              min={500}
              max={50000}
              value={formData.targetMonthlyIncome}
              onChange={(e) => setFormData({ ...formData, targetMonthlyIncome: Number(e.target.value) })}
              className="w-full bg-[#0B0D10] border border-[#2B3545] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#1E2633] flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Scores across all products and SaaS recalculate immediately upon save.
          </span>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs sm:text-sm rounded-xl transition shadow-lg shadow-emerald-500/20"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Advantage Profile Updated!</span>
              </>
            ) : (
              <span>Save Advantage Profile</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
