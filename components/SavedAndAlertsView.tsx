'use client';

import React, { useState } from 'react';
import { Bookmark, Bell, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { AlertRule, SavedResearchItem } from '@/types';
import { SEED_ALERTS } from '@/lib/seedMarketAndGrowth';

export function SavedAndAlertsView() {
  const [alerts, setAlerts] = useState<AlertRule[]>(SEED_ALERTS);
  const [newTitle, setNewTitle] = useState('');
  const [newThreshold, setNewThreshold] = useState(85);

  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newRule: AlertRule = {
      id: `alt-${Date.now()}`,
      title: newTitle,
      condition: `Opportunity Score >= ${newThreshold}`,
      triggerType: 'score_threshold',
      targetValue: newThreshold,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    setAlerts([newRule, ...alerts]);
    setNewTitle('');
  };

  const handleToggle = (id: string) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a)));
  };

  const handleDelete = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Bookmark className="w-3.5 h-3.5" /> Research Vault
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Saved Research &amp; Market Alerts
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Monitor threshold alerts (e.g. score spikes, competition drops) and manage your bookmarked opportunities.
        </p>
      </div>

      {/* Active Alerts Section */}
      <div className="bg-[#11151B] border border-[#1E2633] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" /> Active Opportunity Alerts
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">Real-time condition listener</span>
        </div>

        <div className="space-y-2.5">
          {alerts.map((alt) => (
            <div
              key={alt.id}
              className="p-3.5 bg-[#0E1217] border border-[#1E2633] rounded-xl flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggle(alt.id)}
                  className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                    alt.isActive
                      ? 'bg-emerald-500 border-emerald-400 text-black'
                      : 'border-slate-600 bg-transparent'
                  }`}
                >
                  {alt.isActive && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
                <div>
                  <div className={`font-semibold ${alt.isActive ? 'text-white' : 'text-slate-500 line-through'}`}>
                    {alt.title}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">{alt.condition}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    alt.isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-[#18202B] text-slate-500'
                  }`}
                >
                  {alt.isActive ? 'Active' : 'Paused'}
                </span>
                <button
                  onClick={() => handleDelete(alt.id)}
                  className="p-1 text-slate-500 hover:text-rose-400 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Alert Form */}
        <form onSubmit={handleAddAlert} className="pt-3 border-t border-[#1E2633] flex flex-col sm:flex-row gap-2.5 text-xs">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Alert title (e.g. Notify when AI developer tool scores > 85)..."
            required
            className="flex-1 bg-[#0B0D10] border border-[#2B3545] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
          />
          <input
            type="number"
            min={50}
            max={99}
            value={newThreshold}
            onChange={(e) => setNewThreshold(Number(e.target.value))}
            className="w-24 bg-[#0B0D10] border border-[#2B3545] rounded-xl px-3 py-2 text-white font-mono text-center focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Alert</span>
          </button>
        </form>
      </div>
    </div>
  );
}
