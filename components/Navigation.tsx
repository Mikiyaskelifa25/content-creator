'use client';

import React from 'react';
import {
  LayoutDashboard,
  Search,
  Sparkles,
  TableProperties,
  Users2,
  KeyRound,
  Store,
  TrendingUp,
  FileEdit,
  Boxes,
  Grid,
  CalendarDays,
  FileText,
  Bookmark,
  Sliders,
  Wallet,
} from 'lucide-react';
import { UserAdvantageProfile } from '@/types';

export type NavTab =
  | 'dashboard'
  | 'explorer'
  | 'research'
  | 'ideas'
  | 'competitors'
  | 'keywords'
  | 'marketplaces'
  | 'channels'
  | 'content'
  | 'saas'
  | 'heatmap'
  | 'today'
  | 'reports'
  | 'saved'
  | 'settings';

interface NavigationProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  productCount: number;
  saasCount: number;
  profile: UserAdvantageProfile;
  setProfile: (p: UserAdvantageProfile) => void;
}

export function Navigation({
  activeTab,
  setActiveTab,
  productCount,
  saasCount,
  profile,
  setProfile,
}: NavigationProps) {
  const isZeroBudget = profile.monthlyBudget === 0;

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'explorer', label: 'Opportunity Explorer', icon: <Search className="w-4 h-4 text-emerald-400" />, badge: 'Core' },
    { id: 'research', label: 'Product Research', icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
    { id: 'ideas', label: 'Product Ideas', icon: <TableProperties className="w-4 h-4" />, badge: productCount },
    { id: 'competitors', label: 'Competitors', icon: <Users2 className="w-4 h-4" /> },
    { id: 'keywords', label: 'Keywords', icon: <KeyRound className="w-4 h-4" /> },
    { id: 'marketplaces', label: 'Marketplaces', icon: <Store className="w-4 h-4" /> },
    { id: 'channels', label: 'Growth Channels', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'content', label: 'Content Studio', icon: <FileEdit className="w-4 h-4" /> },
    { id: 'saas', label: 'Top 10 SaaS', icon: <Boxes className="w-4 h-4 text-cyan-400" />, badge: saasCount },
    { id: 'heatmap', label: 'Opportunity Heatmap', icon: <Grid className="w-4 h-4" /> },
    { id: 'today', label: "Today's Opportunities", icon: <CalendarDays className="w-4 h-4 text-emerald-400" /> },
    { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
    { id: 'saved', label: 'Saved & Alerts', icon: <Bookmark className="w-4 h-4" /> },
    { id: 'settings', label: 'My Advantage & Budget', icon: <Sliders className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 border-r border-[#1E2633] bg-[#0E1217] flex flex-col h-screen sticky top-0 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#1E2633] flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Boxes className="w-4 h-4 text-black font-bold" />
          </div>
          <div>
            <div className="font-semibold text-sm tracking-tight text-white flex items-center gap-1.5">
              ProductScope
              <span className="text-[10px] px-1 py-0.2 bg-emerald-500/10 text-emerald-400 rounded font-mono border border-emerald-500/20">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Digital Product Intel</p>
          </div>
        </div>
      </div>

      {/* Quick Budget Toggle Banner */}
      <div className="px-3 pt-3 pb-1">
        <button
          onClick={() => {
            const nextBudget = isZeroBudget ? 50 : 0;
            setProfile({ ...profile, monthlyBudget: nextBudget });
          }}
          className={`w-full text-left p-2 rounded-lg border text-xs transition-all flex items-center justify-between ${
            isZeroBudget
              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
              : 'bg-[#141A23] border-[#1E2633] text-slate-300'
          }`}
          title="Toggle between $0 Low Budget Mode and Standard Mode"
        >
          <div className="flex items-center gap-2">
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            <div>
              <div className="font-medium text-[11px]">
                {isZeroBudget ? 'Low Budget Mode: $0' : `Budget: $${profile.monthlyBudget}/mo`}
              </div>
              <div className="text-[10px] text-slate-400">
                {isZeroBudget ? 'Prioritizing organic channels' : 'Standard scoring'}
              </div>
            </div>
          </div>
          <span
            className={`w-2 h-2 rounded-full ${
              isZeroBudget ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
            }`}
          />
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-[#181F2B] text-white shadow-sm border border-[#2B3545]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#13171F]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-[#1A222F] text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Profile Bar */}
      <div className="p-3 border-t border-[#1E2633] bg-[#0B0D10]/50 text-xs">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-slate-200 truncate max-w-[140px]">
              {profile.primaryRole}
            </div>
            <div className="text-[10px] text-slate-500">
              {profile.weeklyHours}h/wk · {profile.existingAudienceSize > 0 ? `${profile.existingAudienceSize} aud.` : '0 audience'}
            </div>
          </div>
          <button
            onClick={() => setActiveTab('settings')}
            className="p-1 hover:bg-[#1E2633] rounded text-slate-400 hover:text-white"
            title="Edit My Advantage"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
