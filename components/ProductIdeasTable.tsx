'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Sparkles,
  Bookmark,
  FileText,
  Users2,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { ProductOpportunity, RecommendationType, ProductFormat } from '@/types';

interface ProductIdeasTableProps {
  products: ProductOpportunity[];
  onSelectProduct: (p: ProductOpportunity) => void;
  onSaveProduct: (p: ProductOpportunity) => void;
  onGenerateContent: (p: ProductOpportunity) => void;
  onGenerateReport: (p: ProductOpportunity) => void;
}

export function ProductIdeasTable({
  products,
  onSelectProduct,
  onSaveProduct,
  onGenerateContent,
  onGenerateReport,
}: ProductIdeasTableProps) {
  const [search, setSearch] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [selectedRec, setSelectedRec] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof ProductOpportunity>('opportunityScore');
  const [sortAsc, setSortAsc] = useState(false);

  const formats = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.format));
    return Array.from(set);
  }, [products]);

  const filtered = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase()) ||
          p.targetAudience.toLowerCase().includes(search.toLowerCase());
        const matchesFormat = selectedFormat === 'all' || p.format === selectedFormat;
        const matchesRec = selectedRec === 'all' || p.recommendation === selectedRec;
        return matchesSearch && matchesFormat && matchesRec;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }
        return sortAsc
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
  }, [products, search, selectedFormat, selectedRec, sortField, sortAsc]);

  const handleExportCSV = () => {
    const headers = ['Rank', 'Name', 'Category', 'Format', 'Score', 'Demand', 'Competition', 'Price', 'Recommendation'];
    const rows = filtered.map((p, idx) => [
      idx + 1,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      `"${p.format}"`,
      p.opportunityScore,
      p.components.demand,
      p.competitionDifficulty,
      p.estimatedPrice,
      p.recommendation,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ProductScope_Opportunities_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = (field: keyof ProductOpportunity) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-16">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Product Idea Matrix</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Ranked database of digital products evaluated across demand, buyer intent, and competitive difficulty.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141A23] hover:bg-[#18202B] border border-[#1E2633] rounded-lg text-xs font-semibold text-slate-300 transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#11151B] border border-[#1E2633] rounded-xl p-3 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by product name, category, or customer..."
            className="w-full bg-[#0B0D10] border border-[#1E2633] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="bg-[#0B0D10] border border-[#1E2633] rounded-lg px-2.5 py-1.5 text-slate-300 text-xs focus:outline-none"
          >
            <option value="all">All Formats</option>
            {formats.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          <select
            value={selectedRec}
            onChange={(e) => setSelectedRec(e.target.value)}
            className="bg-[#0B0D10] border border-[#1E2633] rounded-lg px-2.5 py-1.5 text-slate-300 text-xs focus:outline-none"
          >
            <option value="all">All Recommendations</option>
            <option value="BUILD">BUILD (80+)</option>
            <option value="TEST">TEST (65-79)</option>
            <option value="WAIT">WAIT (50-64)</option>
            <option value="AVOID">AVOID (&lt;50)</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[#11151B] border border-[#1E2633] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0E1217] text-slate-400 uppercase text-[10px] font-semibold border-b border-[#1E2633] tracking-wider select-none">
              <tr>
                <th className="py-3 px-3 w-12 text-center">Rank</th>
                <th
                  onClick={() => handleSort('name')}
                  className="py-3 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Product</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3">Format</th>
                <th className="py-3 px-3">Target Customer</th>
                <th
                  onClick={() => handleSort('opportunityScore')}
                  className="py-3 px-3 cursor-pointer hover:text-white text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Score</span>
                    <ArrowUpDown className="w-3 h-3 text-emerald-400" />
                  </div>
                </th>
                <th className="py-3 px-3 text-right">Demand</th>
                <th className="py-3 px-3 text-right">Comp. Diff.</th>
                <th className="py-3 px-3 text-right">Price</th>
                <th className="py-3 px-3 text-center">Verdict</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181D24]">
              {filtered.map((p, idx) => {
                const isBuild = p.recommendation === 'BUILD';
                const isTest = p.recommendation === 'TEST';
                return (
                  <tr
                    key={p.id}
                    className="hover:bg-[#141A23] transition-colors group cursor-pointer"
                    onClick={() => onSelectProduct(p)}
                  >
                    <td className="py-3.5 px-3 text-center font-mono text-slate-500 font-bold">
                      #{idx + 1}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <span>{p.name}</span>
                      </div>
                      <span className="text-[11px] font-normal text-slate-400 line-clamp-1">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#18202B] text-slate-300 border border-[#2B3545]">
                        {p.format}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 max-w-[180px] truncate" title={p.targetAudience}>
                      {p.targetAudience}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-sm text-emerald-400">
                      {p.opportunityScore}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-slate-200">
                      {p.components.demand}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-slate-400">
                      {p.competitionDifficulty}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-semibold text-white">
                      ${p.estimatedPrice}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          isBuild
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : isTest
                            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {p.recommendation}
                      </span>
                    </td>
                    <td
                      className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => onSelectProduct(p)}
                        className="p-1.5 hover:bg-[#1E2633] rounded text-slate-400 hover:text-white transition"
                        title="Explore Full Research"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      </button>
                      <button
                        onClick={() => onGenerateContent(p)}
                        className="p-1.5 hover:bg-[#1E2633] rounded text-slate-400 hover:text-white transition"
                        title="Generate Content"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                      </button>
                      <button
                        onClick={() => onGenerateReport(p)}
                        className="p-1.5 hover:bg-[#1E2633] rounded text-slate-400 hover:text-white transition"
                        title="Create Report"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
