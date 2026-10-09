'use client';

import React, { useState } from 'react';
import { Search, Sparkles, Command, ShieldCheck, X } from 'lucide-react';
import { ProductOpportunity, SaaSIdea } from '@/types';

interface HeaderProps {
  onOpenSearch: () => void;
  onNewResearch: () => void;
  products: ProductOpportunity[];
  saasIdeas: SaaSIdea[];
  onSelectProduct: (p: ProductOpportunity) => void;
  onSelectSaas: (s: SaaSIdea) => void;
}

export function Header({
  onOpenSearch,
  onNewResearch,
  products,
  saasIdeas,
  onSelectProduct,
  onSelectSaas,
}: HeaderProps) {
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filteredProducts = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.format.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredSaas = query.trim()
    ? saasIdeas.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.category.toLowerCase().includes(query.toLowerCase()) ||
          s.targetCustomer.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <>
      <header className="h-14 border-b border-[#1E2633] bg-[#0E1217]/80 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSearchModalOpen(true)}
            className="flex items-center gap-2.5 px-3 py-1.5 bg-[#141A23] hover:bg-[#18202B] border border-[#1E2633] rounded-lg text-xs text-slate-400 hover:text-slate-200 transition-all w-64 text-left shadow-sm"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span className="flex-1 truncate">Search opportunities, keywords...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-[#1E2633] text-slate-400 rounded">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </button>

          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 text-[11px]">
              <ShieldCheck className="w-3 h-3" /> Anti-Hallucination Verified
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNewResearch}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs rounded-lg transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Research New Product</span>
          </button>
        </div>
      </header>

      {/* Global Search Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="w-full max-w-xl bg-[#11151B] border border-[#2B3545] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
            <div className="p-3 border-b border-[#1E2633] flex items-center gap-3">
              <Search className="w-4 h-4 text-emerald-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, SaaS ideas, competitors, or topics..."
                autoFocus
                className="flex-1 bg-transparent text-sm text-white focus:outline-none placeholder:text-slate-500"
              />
              <button
                onClick={() => {
                  setSearchModalOpen(false);
                  setQuery('');
                }}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 overflow-y-auto space-y-4">
              {query.trim() === '' ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  Type a keyword like &quot;Notion&quot;, &quot;Finance&quot;, &quot;Developer&quot;, or &quot;SaaS&quot; to search.
                </div>
              ) : (
                <>
                  {filteredProducts.length > 0 && (
                    <div>
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">
                        Digital Products ({filteredProducts.length})
                      </div>
                      <div className="space-y-1">
                        {filteredProducts.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => {
                              onSelectProduct(p);
                              setSearchModalOpen(false);
                            }}
                            className="w-full text-left p-2 rounded-lg hover:bg-[#18202B] border border-transparent hover:border-[#2B3545] transition flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="font-medium text-white">{p.name}</div>
                              <div className="text-[11px] text-slate-400">{p.category} · {p.format}</div>
                            </div>
                            <span className="font-mono text-emerald-400 font-bold">{p.opportunityScore}/100</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredSaas.length > 0 && (
                    <div>
                      <div className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider mb-2 px-1">
                        SaaS Opportunities ({filteredSaas.length})
                      </div>
                      <div className="space-y-1">
                        {filteredSaas.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => {
                              onSelectSaas(s);
                              setSearchModalOpen(false);
                            }}
                            className="w-full text-left p-2 rounded-lg hover:bg-[#18202B] border border-transparent hover:border-[#2B3545] transition flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="font-medium text-white">{s.name}</div>
                              <div className="text-[11px] text-slate-400">{s.category} · {s.targetCustomer}</div>
                            </div>
                            <span className="font-mono text-cyan-400 font-bold">{s.opportunityScore}/100</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredProducts.length === 0 && filteredSaas.length === 0 && (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No matching products or SaaS ideas found for &quot;{query}&quot;.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
