'use client';

import React, { useState } from 'react';
import {
  FileText,
  Download,
  Copy,
  Check,
  Printer,
  ShieldCheck,
  Sparkles,
  FileDown,
  CheckCircle2,
  Eye,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';
import { ProductOpportunity } from '@/types';

interface ReportsViewProps {
  products: ProductOpportunity[];
  selectedProduct?: ProductOpportunity;
}

export function ReportsView({ products, selectedProduct }: ReportsViewProps) {
  const [product, setProduct] = useState<ProductOpportunity>(
    selectedProduct || products[0]
  );
  const [copied, setCopied] = useState(false);
  const [mdDownloaded, setMdDownloaded] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState<number>(100);

  // Generate full markdown representation
  const generateMarkdownReport = (p: ProductOpportunity) => {
    return `# ProductScope AI — Product Intelligence Dossier
**Product:** ${p.name}  
**Category:** ${p.category}  
**Format:** ${p.format}  
**Target Audience:** ${p.targetAudience}  
**Opportunity Score:** ${p.opportunityScore}/100 (${p.scoreCategory})  
**Analyst Verdict:** ${p.recommendation}  
**Date Generated:** ${new Date().toISOString().slice(0, 10)}  

---

## 1. Executive Summary
${p.whyBuildReason}

---

## 2. Target Customer & Problem Solved
- **Primary Audience:** ${p.targetAudience}
- **Main Problem Solved:** ${p.mainProblem}
- **Buyer Intent:** ${p.buyerIntentNotes}

---

## 3. Market Demand & Competitive Audit
### Demand Analysis
${p.demandAnalysis}

### Competitive Landscape
${p.competitionSummary}

---

## 4. How You Beat Existing Products (Differentiation Wedges)
${p.differentiationWedges.map((wedge, idx) => `${idx + 1}. **${wedge}**`).join('\n')}

---

## 5. Suggested MVP Scope (${p.suggestedMvp.timeline})
**Name:** ${p.suggestedMvp.name}  
**Estimated Construction Cost:** ${p.suggestedMvp.targetCost}  

### Core MVP Deliverables:
${p.suggestedMvp.coreFeatures.map((feat, i) => `- [ ] **Module ${i + 1}:** ${feat}`).join('\n')}

---

## 6. Recommended Pricing Architecture
- **Entry Tier:** $${p.suggestedPricing.entry} (Core starter)
- **Recommended Price:** $${p.suggestedPricing.recommended} (Optimal value point)
- **Premium Tier:** $${p.suggestedPricing.premium} (Full package / team license)
- **Sales Model:** ${p.suggestedPricing.model}

---

## 7. Where to Sell & Distribution Channels
### Top Marketplaces
${p.bestMarketplaces.map((m) => `- **${m.platform}** (Score: ${m.score}/100): ${m.reason}`).join('\n')}

### Priority Customer Acquisition Channels
${p.bestAcquisitionChannels.map((c) => `- **${c.channel}** (Score: ${c.score}/100): ${c.strategy}`).join('\n')}

---

## 8. Content Marketing Angles
${p.contentAngles.map((angle) => `- "${angle}"`).join('\n')}

---

## 9. Key Execution Risks & Mitigations
${p.keyRisks.map((risk) => `- ⚠️ ${risk}`).join('\n')}

---

## 10. Research Methodology & Disclaimer
ProductScope AI evaluates verified marketplace signals, organic community search trends, and buyer complaint data to provide objective decision-support metrics. All search volume estimates and revenue projections are modeled estimates; no financial success is guaranteed.
`;
  };

  // Export as Markdown File
  const handleExportMarkdown = () => {
    const mdContent = generateMarkdownReport(product);
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const filename = `ProductScope_${product.name.replace(/[^a-zA-Z0-9]+/g, '_')}_Report.md`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setMdDownloaded(true);
    setTimeout(() => setMdDownloaded(false), 2500);
  };

  // Export as PDF (via Browser Print Engine)
  const handleExportPDF = () => {
    setIsExportingPdf(true);
    const originalTitle = document.title;
    const cleanName = product.name.replace(/[^a-zA-Z0-9]+/g, '_');
    document.title = `ProductScope_${cleanName}_Report`;

    setTimeout(() => {
      window.print();
      document.title = originalTitle;
      setIsExportingPdf(false);
    }, 200);
  };

  // Copy full text to clipboard
  const handleCopy = () => {
    const text = generateMarkdownReport(product);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 print:p-0">
      {/* Top Header Controls (Hidden during print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <FileText className="w-3.5 h-3.5" /> Executive Intelligence Dossier
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Research Reports
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Download professional, investor-grade dossiers in PDF or Markdown format.
          </p>
        </div>

        {/* Action Controls & Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={product.id}
            onChange={(e) => {
              const found = products.find((p) => p.id === e.target.value);
              if (found) setProduct(found);
            }}
            className="bg-[#11151B] border border-[#1E2633] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Copy Report */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#141A23] hover:bg-[#1E2633] border border-[#1E2633] rounded-xl text-xs font-semibold text-slate-300 transition"
            title="Copy Report to Clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {/* Preview PDF Layout Button */}
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#141A23] hover:bg-[#1E2633] border border-cyan-500/40 hover:border-cyan-400 rounded-xl text-xs font-semibold text-cyan-300 transition shadow-sm"
            title="Preview formatted PDF pages before saving"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Preview PDF</span>
          </button>

          {/* Export as Markdown (.md) */}
          <button
            onClick={handleExportMarkdown}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#141A23] hover:bg-[#1E2633] border border-[#1E2633] hover:border-slate-500 rounded-xl text-xs font-semibold text-slate-200 transition"
            title="Download formatted Markdown file"
          >
            {mdDownloaded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Downloaded .md</span>
              </>
            ) : (
              <>
                <FileDown className="w-3.5 h-3.5 text-slate-400" />
                <span>Export Markdown</span>
              </>
            )}
          </button>

          {/* Export as PDF */}
          <button
            onClick={handleExportPDF}
            disabled={isExportingPdf}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-xs transition shadow-lg shadow-emerald-500/20"
            title="Export report as styled PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isExportingPdf ? 'Preparing PDF...' : 'Export PDF'}</span>
          </button>
        </div>
      </div>

      {/* Export Format Capabilities Badge Strip */}
      <div className="print:hidden flex items-center justify-between text-xs text-slate-400 bg-[#0E1217] p-3 rounded-xl border border-[#1E2633]">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Available Export Formats:
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[11px] font-mono border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> PDF (Vector / Printable)
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[11px] font-mono border border-cyan-500/20">
            <CheckCircle2 className="w-3 h-3" /> Markdown (.md)
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#18202B] text-slate-300 text-[11px] font-mono border border-[#2B3545]">
            <CheckCircle2 className="w-3 h-3" /> Plain Text
          </span>
        </div>
        <button
          onClick={() => setIsPreviewOpen(true)}
          className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition"
        >
          <Eye className="w-3 h-3" />
          <span>Open PDF Layout Previewer</span>
        </button>
      </div>

      {/* Main Report Document Card on Dashboard */}
      <div className="bg-[#11151B] border border-[#1E2633] rounded-2xl p-8 sm:p-10 space-y-8 shadow-2xl print:bg-white print:text-black print:border-none print:shadow-none print-card">
        {/* Dossier Header */}
        <div className="border-b border-[#1E2633] print:border-slate-300 pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 print:text-emerald-700 font-bold block mb-1">
              Confidential Product Opportunity Dossier
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white print:text-slate-900 tracking-tight">
              {product.name}
            </h2>
            <p className="text-slate-400 print:text-slate-600 text-xs sm:text-sm mt-1">{product.tagline}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#18202B] print:bg-slate-100 print:text-slate-800 text-slate-300 font-mono">
                {product.category}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#18202B] print:bg-slate-100 print:text-slate-800 text-slate-300 font-mono">
                Format: {product.format}
              </span>
            </div>
          </div>

          <div className="p-4 bg-[#0B0D10] print:bg-slate-50 border border-[#1E2633] print:border-slate-300 rounded-xl text-right shrink-0">
            <span className="text-[10px] uppercase font-semibold text-slate-400 print:text-slate-600 block">
              Opportunity Score
            </span>
            <div className="text-3xl font-extrabold font-mono text-emerald-400 print:text-emerald-700 mt-0.5">
              {product.opportunityScore}<span className="text-sm text-slate-500 print:text-slate-600">/100</span>
            </div>
            <span className="text-xs font-bold text-white print:text-slate-900 uppercase mt-1 block">
              Verdict: {product.recommendation}
            </span>
          </div>
        </div>

        {/* 1. Executive Summary */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-slate-700">
            1. Executive Summary
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 print:text-slate-900 leading-relaxed bg-[#0E1217] print:bg-slate-50 p-4 rounded-xl border border-[#1E2633] print:border-slate-200">
            {product.whyBuildReason}
          </p>
        </div>

        {/* 2. Target Customer & Problem Solved */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1 bg-[#0E1217] print:bg-slate-50 p-4 rounded-xl border border-[#1E2633] print:border-slate-200 text-xs">
            <h4 className="font-bold text-slate-300 print:text-slate-800">Target Audience</h4>
            <p className="text-slate-200 print:text-slate-900 font-semibold">{product.targetAudience}</p>
          </div>
          <div className="space-y-1 bg-[#0E1217] print:bg-slate-50 p-4 rounded-xl border border-[#1E2633] print:border-slate-200 text-xs">
            <h4 className="font-bold text-slate-300 print:text-slate-800">Urgent Problem Solved</h4>
            <p className="text-slate-400 print:text-slate-700 leading-relaxed">{product.mainProblem}</p>
          </div>
        </div>

        {/* 3. Market Demand & Competitive Landscape */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-slate-700">
            2. Market Demand &amp; Competition Audit
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-[#0E1217] print:bg-slate-50 p-4 rounded-xl border border-[#1E2633] print:border-slate-200">
              <span className="font-semibold text-white print:text-slate-900 block mb-1">
                Demand &amp; Search Behavior:
              </span>
              <p className="text-slate-400 print:text-slate-700 leading-relaxed">{product.demandAnalysis}</p>
            </div>
            <div className="bg-[#0E1217] print:bg-slate-50 p-4 rounded-xl border border-[#1E2633] print:border-slate-200">
              <span className="font-semibold text-white print:text-slate-900 block mb-1">
                Competitive Landscape:
              </span>
              <p className="text-slate-400 print:text-slate-700 leading-relaxed">{product.competitionSummary}</p>
            </div>
          </div>
        </div>

        {/* 4. Differentiation Wedges */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-slate-700">
            3. Differentiation Wedges (How to Beat Existing Products)
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-200 print:text-slate-900">
            {product.differentiationWedges.map((wedge, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 bg-[#0E1217] print:bg-slate-50 p-2.5 rounded-lg border border-[#1E2633] print:border-slate-200"
              >
                <span className="text-emerald-400 print:text-emerald-700 font-bold font-mono">0{idx + 1}.</span>
                <span>{wedge}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 5. MVP Scope & Pricing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 bg-[#0E1217] print:bg-slate-50 p-4 rounded-xl border border-[#1E2633] print:border-slate-200 text-xs">
            <h4 className="font-bold text-white print:text-slate-900">
              Suggested MVP ({product.suggestedMvp.timeline})
            </h4>
            <ul className="list-disc pl-4 space-y-1 text-slate-300 print:text-slate-700">
              {product.suggestedMvp.coreFeatures.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 bg-[#0E1217] print:bg-slate-50 p-4 rounded-xl border border-[#1E2633] print:border-slate-200 text-xs">
            <h4 className="font-bold text-white print:text-slate-900">Recommended Pricing Architecture</h4>
            <div className="space-y-1 text-slate-300 print:text-slate-800">
              <div>
                Entry Tier: <strong className="text-white print:text-slate-900">${product.suggestedPricing.entry}</strong>
              </div>
              <div>
                Recommended Price:{' '}
                <strong className="text-emerald-400 print:text-emerald-700">${product.suggestedPricing.recommended}</strong>
              </div>
              <div>
                Premium / Team Pack:{' '}
                <strong className="text-white print:text-slate-900">${product.suggestedPricing.premium}</strong>
              </div>
              <div className="text-[11px] text-slate-400 print:text-slate-600 mt-2">
                Model: {product.suggestedPricing.model}
              </div>
            </div>
          </div>
        </div>

        {/* 6. Distribution & Growth Strategy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2 bg-[#0E1217] print:bg-slate-50 p-4 rounded-xl border border-[#1E2633] print:border-slate-200">
            <h4 className="font-bold text-white print:text-slate-900">Priority Sales Marketplaces</h4>
            <ul className="space-y-1 text-slate-300 print:text-slate-700">
              {product.bestMarketplaces.map((m, i) => (
                <li key={i}>
                  • <strong className="text-white print:text-slate-900">{m.platform}</strong> ({m.score}/100): {m.reason}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 bg-[#0E1217] print:bg-slate-50 p-4 rounded-xl border border-[#1E2633] print:border-slate-200">
            <h4 className="font-bold text-white print:text-slate-900">Key Customer Acquisition Channels</h4>
            <ul className="space-y-1 text-slate-300 print:text-slate-700">
              {product.bestAcquisitionChannels.map((c, i) => (
                <li key={i}>
                  • <strong className="text-white print:text-slate-900">{c.channel}</strong> ({c.score}/100): {c.strategy}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 7. Disclaimer */}
        <div className="pt-4 border-t border-[#1E2633] print:border-slate-300 text-[10px] text-slate-500 print:text-slate-600 leading-normal">
          <p>
            <strong>Research Methodology &amp; Disclaimer:</strong> ProductScope AI provides objective scoring based on observed marketplace listings, organic search trends, and customer complaint data. All search volumes and potential revenues are estimates. No financial success is guaranteed.
          </p>
        </div>
      </div>

      {/* ========================================================
          INLINE PDF PREVIEW MODAL (Verifies layout before saving)
          ======================================================== */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-between overflow-hidden">
          {/* Modal Top Bar */}
          <div className="h-14 bg-[#0E1217] border-b border-[#1E2633] px-6 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-3">
              <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <FileText className="w-4 h-4" />
              </span>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>ProductScope_{product.name.replace(/[^a-zA-Z0-9]+/g, '_')}_Report.pdf</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    PDF Preview (A4 / Letter)
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Verify pagination, margins, and typography prior to printing or saving.
                </div>
              </div>
            </div>

            {/* Center Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#141A23] border border-[#1E2633] rounded-xl text-xs text-slate-300">
              <button
                onClick={() => setZoomScale((prev) => Math.max(70, prev - 10))}
                className="p-1 hover:text-white rounded"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] w-12 text-center">{zoomScale}%</span>
              <button
                onClick={() => setZoomScale((prev) => Math.min(130, prev + 10))}
                className="p-1 hover:text-white rounded"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomScale(100)}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 ml-1 px-1 font-mono"
              >
                Reset
              </button>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportMarkdown}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141A23] hover:bg-[#1E2633] border border-[#1E2633] rounded-xl text-xs font-semibold text-slate-300 transition"
              >
                <FileDown className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden md:inline">Download Markdown</span>
              </button>

              <button
                onClick={handleExportPDF}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-xs transition shadow-lg shadow-emerald-500/20"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save as PDF</span>
              </button>

              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-1.5 hover:bg-[#1E2633] rounded-xl text-slate-400 hover:text-white transition ml-1"
                title="Close Preview (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Scrollable Canvas Body */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex flex-col items-center gap-8 bg-[#090C10]">
            {/* Sheet Container with Zoom Transformation */}
            <div
              style={{ transform: `scale(${zoomScale / 100})`, transformOrigin: 'top center' }}
              className="transition-transform duration-150 space-y-8"
            >
              {/* PAGE 1: Executive Overview, Demand, & Differentiation */}
              <div className="w-[800px] min-h-[1050px] bg-white text-slate-900 rounded-sm shadow-2xl p-12 flex flex-col justify-between border border-slate-200 relative select-text">
                {/* Header Strip */}
                <div>
                  <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-6">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-emerald-800">
                        PRODUCTSCOPE AI · CONFIDENTIAL REPORT
                      </span>
                      <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                        {product.name}
                      </h1>
                      <p className="text-xs text-slate-600 font-medium">{product.tagline}</p>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] font-mono uppercase text-slate-500 font-bold">Opportunity Score</div>
                      <div className="text-3xl font-black font-mono text-emerald-700">
                        {product.opportunityScore}<span className="text-sm font-normal text-slate-400">/100</span>
                      </div>
                      <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-900 text-white">
                        {product.recommendation}
                      </span>
                    </div>
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-700 mb-6 bg-slate-50 p-2.5 rounded border border-slate-200">
                    <div>Category: <strong>{product.category}</strong></div>
                    <div>•</div>
                    <div>Format: <strong>{product.format}</strong></div>
                    <div>•</div>
                    <div>Target Audience: <strong>{product.targetAudience}</strong></div>
                    <div>•</div>
                    <div>Date: <strong>{new Date().toISOString().slice(0, 10)}</strong></div>
                  </div>

                  {/* Section 1 */}
                  <div className="mb-6 space-y-1.5">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                      1. Executive Summary &amp; Opportunity Thesis
                    </h2>
                    <p className="text-xs text-slate-800 leading-relaxed bg-slate-50/70 p-3 rounded border border-slate-200">
                      {product.whyBuildReason}
                    </p>
                  </div>

                  {/* Section 2 */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 p-3.5 rounded border border-slate-200">
                      <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1">
                        Target Customer Profile
                      </h3>
                      <p className="text-xs text-slate-700 leading-relaxed">{product.targetAudience}</p>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded border border-slate-200">
                      <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1">
                        Core Customer Friction Solved
                      </h3>
                      <p className="text-xs text-slate-700 leading-relaxed">{product.mainProblem}</p>
                    </div>
                  </div>

                  {/* Section 3 */}
                  <div className="mb-6 space-y-1.5">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                      2. Market Demand &amp; Competitive Landscape
                    </h2>
                    <div className="grid grid-cols-2 gap-4 pt-1">
                      <div className="text-xs text-slate-700 leading-relaxed">
                        <strong className="text-slate-900 block mb-0.5">Search &amp; Community Demand:</strong>
                        {product.demandAnalysis}
                      </div>
                      <div className="text-xs text-slate-700 leading-relaxed">
                        <strong className="text-slate-900 block mb-0.5">Current Alternatives:</strong>
                        {product.competitionSummary}
                      </div>
                    </div>
                  </div>

                  {/* Section 4 */}
                  <div className="space-y-1.5">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                      3. Differentiation Wedges (How to Beat Existing Products)
                    </h2>
                    <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-slate-800">
                      {product.differentiationWedges.map((wedge, idx) => (
                        <div key={idx} className="p-2 bg-slate-50 rounded border border-slate-200 flex items-start gap-1.5">
                          <span className="font-bold text-emerald-800 font-mono">0{idx + 1}.</span>
                          <span className="leading-snug">{wedge}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Page 1 Footer */}
                <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>ProductScope AI Intelligence Engine</span>
                  <span>Page 1 of 2</span>
                </div>
              </div>

              {/* PAGE 2: MVP Scope, Pricing, Distribution Channels, & Risks */}
              <div className="w-[800px] min-h-[1050px] bg-white text-slate-900 rounded-sm shadow-2xl p-12 flex flex-col justify-between border border-slate-200 relative select-text">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-300 pb-3 mb-6">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                      {product.name} · Section 4: Execution Architecture
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">Page 2</span>
                  </div>

                  {/* Section 5: MVP Scope */}
                  <div className="mb-6 space-y-1.5">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                        4. Suggested MVP Deliverables ({product.suggestedMvp.timeline})
                      </h2>
                      <span className="text-[11px] font-mono text-slate-600">
                        Est. Cost: {product.suggestedMvp.targetCost}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {product.suggestedMvp.coreFeatures.map((feat, i) => (
                        <div key={i} className="p-2.5 bg-slate-50 rounded border border-slate-200 text-xs">
                          <span className="text-[10px] font-mono font-bold text-slate-500 block">Module {i + 1}</span>
                          <span className="font-semibold text-slate-800">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 6: Recommended Pricing */}
                  <div className="mb-6 space-y-1.5">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                      5. Recommended Pricing Architecture
                    </h2>
                    <div className="grid grid-cols-3 gap-3 pt-1 text-center">
                      <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Entry Tier</span>
                        <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">${product.suggestedPricing.entry}</div>
                        <span className="text-[10px] text-slate-500">Core download</span>
                      </div>
                      <div className="p-3 bg-emerald-50 rounded border border-emerald-300">
                        <span className="text-[10px] font-bold text-emerald-800 uppercase block">Recommended</span>
                        <div className="text-xl font-bold font-mono text-emerald-800 mt-0.5">${product.suggestedPricing.recommended}</div>
                        <span className="text-[10px] text-emerald-700">Optimal value point</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Premium / Team</span>
                        <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">${product.suggestedPricing.premium}</div>
                        <span className="text-[10px] text-slate-500">Full package</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 italic">
                      Sales Model: {product.suggestedPricing.model}
                    </p>
                  </div>

                  {/* Section 7: Distribution & Marketplaces */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-1">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                        Where to Sell
                      </h3>
                      <ul className="text-xs text-slate-700 space-y-1 pt-1">
                        {product.bestMarketplaces.map((m, i) => (
                          <li key={i}>
                            • <strong>{m.platform}</strong> ({m.score}/100): {m.reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                        Top Acquisition Channels
                      </h3>
                      <ul className="text-xs text-slate-700 space-y-1 pt-1">
                        {product.bestAcquisitionChannels.map((c, i) => (
                          <li key={i}>
                            • <strong>{c.channel}</strong> ({c.score}/100): {c.strategy}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Section 8: Key Execution Risks */}
                  <div className="p-3 bg-amber-50/60 rounded border border-amber-200 text-xs text-amber-900 mb-6">
                    <strong className="block font-bold mb-1">Key Execution Risks &amp; Mitigations:</strong>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                      {product.keyRisks.map((risk, i) => (
                        <li key={i}>{risk}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Section 9: Disclaimer */}
                  <div className="text-[9px] text-slate-500 leading-normal border-t border-slate-200 pt-3">
                    ProductScope AI provides objective scoring based on observed marketplace listings, organic search trends, and customer complaint data. All search volumes and potential revenues are modeled estimates; no financial return is guaranteed.
                  </div>
                </div>

                {/* Page 2 Footer */}
                <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>ProductScope AI Intelligence Engine</span>
                  <span>Page 2 of 2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
