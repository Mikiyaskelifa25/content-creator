'use client';

import React, { useState } from 'react';
import {
  FileEdit,
  Sparkles,
  Copy,
  Check,
  Download,
  AlertTriangle,
  ShieldCheck,
  Send,
  RefreshCw,
  Eye,
  Code,
  ThumbsUp,
  MessageSquare,
  Repeat,
  Heart,
  Bookmark,
  Share2,
  MoreHorizontal,
  ExternalLink,
  Flame,
  ArrowUp,
  ArrowDown,
  Layers,
} from 'lucide-react';
import { ProductOpportunity, ContentDraft } from '@/types';

interface ContentStudioProps {
  products: ProductOpportunity[];
  selectedProduct?: ProductOpportunity;
  onSaveDraft?: (d: ContentDraft) => void;
}

export function ContentStudio({ products, selectedProduct }: ContentStudioProps) {
  const [activeProduct, setActiveProduct] = useState<ProductOpportunity>(
    selectedProduct || products[0]
  );
  const [platform, setPlatform] = useState<
    'Reddit' | 'LinkedIn' | 'X' | 'Medium' | 'Product Hunt' | 'Dev.to'
  >('Reddit');
  const [contentType, setContentType] = useState('Case Study / Lessons Learned');
  const [tone, setTone] = useState('Authentic & Educational');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'prototype' | 'markdown'>('prototype');

  // Interactive like / upvote toggles for prototype realism
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(284);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(148);

  const [currentDraft, setCurrentDraft] = useState<ContentDraft>({
    id: 'draft-initial',
    productId: activeProduct?.id || 'prod-1',
    productName: activeProduct?.name || 'Freelancer Finance Notion OS',
    platform: 'Reddit',
    contentType: 'Lessons Learned',
    tone: 'Authentic & Educational',
    title: 'How I eliminated 10+ hours of tax chaos without paying $200/mo for software (Complete Breakdown)',
    hook: 'After talking with 35+ full-time freelancers, 80% admitted they have no clear idea of their safe quarterly tax reserve. Here is the 3-bucket formula that fixes it.',
    body: `Hey r/freelance,\n\nOver the last 6 months, I noticed a recurring trap: freelancers make great top-line revenue ($8k-$15k/month), but come April, panic sets in because money was spent as if it was take-home pay.\n\n### The 3-Bucket Reserve Method:\n1. **Tax Escrow (30%):** Automatically routed to a secondary sub-account the moment client invoices clear. Never touch it.\n2. **Operating Overhead & Tools (10%):** Covers Notion, Figma, hosting, and insurance.\n3. **Safe Owner Draw (60%):** What you can actually transfer to personal checking guilt-free.\n\n### Why Most Spreadsheets Fail:\nMost people build formulas that don't account for unpaid or delayed invoices, so their projected runway is artificially optimistic.\n\nI created a clean Notion dashboard for this with automated tax reserve buckets and invoice payment health scores. Happy to share how the relations are structured in the comments if anyone is building their own setup!`,
    callToAction: 'How are you currently tracking your tax reserves? Do you keep separate bank accounts or rely on spreadsheets?',
    redditValueRatio: {
      helpfulPercent: 92,
      promoPercent: 8,
      riskLevel: 'Safe (Value-first)',
      rulesReminder: 'Strictly value-first. Only mention templates if explicitly requested in comments.',
    },
    hashtags: ['#Productivity', '#Solopreneur', '#Notion', '#Finance'],
    status: 'Ready',
    createdAt: new Date().toISOString(),
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: activeProduct.name,
          audience: activeProduct.targetAudience,
          platform,
          contentType,
          tone,
          mainProblem: activeProduct.mainProblem,
          solution: activeProduct.tagline,
        }),
      });

      const data = await res.json();
      if (data.draft) {
        setCurrentDraft(data.draft);
      }
    } catch (e) {
      console.error('Failed to generate content:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    const fullText = `# ${currentDraft.title}\n\n${currentDraft.body}\n\nCTA: ${currentDraft.callToAction}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const fullText = `# ${currentDraft.title}\n\n**Platform:** ${currentDraft.platform}  \n**Tone:** ${currentDraft.tone}\n\n---\n\n${currentDraft.body}\n\n---\n\n**CTA:** ${currentDraft.callToAction}`;
    const blob = new Blob([fullText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentDraft.productName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}_${currentDraft.platform.toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const isReddit = platform === 'Reddit';

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <FileEdit className="w-3.5 h-3.5" /> Growth Content Engine
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Content Studio &amp; Platform Prototype Preview
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Generate platform-native content and inspect interactive prototypes of how your posts look natively on Reddit, LinkedIn, X, Medium, and Product Hunt.
        </p>
      </div>

      {/* Main Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Configuration Controls */}
        <div className="lg:col-span-4 bg-[#11151B] border border-[#1E2633] rounded-2xl p-5 space-y-4 shadow-xl self-start">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Content Parameters
          </h3>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Select Target Product</label>
            <select
              value={activeProduct.id}
              onChange={(e) => {
                const found = products.find((p) => p.id === e.target.value);
                if (found) setActiveProduct(found);
              }}
              className="w-full bg-[#0B0D10] border border-[#2B3545] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.format})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Target Platform</label>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {(['Reddit', 'LinkedIn', 'X', 'Medium', 'Product Hunt', 'Dev.to'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className={`py-2 px-2 rounded-lg border text-center font-medium transition text-xs ${
                    platform === p
                      ? 'bg-emerald-500 text-black font-bold border-emerald-400 shadow-sm'
                      : 'bg-[#0B0D10] border-[#1E2633] text-slate-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Content Angle / Template</label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full bg-[#0B0D10] border border-[#2B3545] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Problem -> Solution">Problem → Solution Breakdown</option>
              <option value="Lessons Learned">Lessons Learned / Mistakes I Made</option>
              <option value="Detailed Tutorial">Detailed Step-by-Step Tutorial</option>
              <option value="Case Study">Real Case Study with Metrics</option>
              <option value="Build in Public">Build in Public Founder Update</option>
              <option value="Product Launch">Launch Announcement &amp; First Comment</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Tone of Voice</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-[#0B0D10] border border-[#2B3545] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Authentic & Educational">Authentic &amp; Educational (Zero Hype)</option>
              <option value="Direct & Tactical">Direct &amp; Tactical (Data-Dense)</option>
              <option value="Founder Storytelling">Founder Storytelling (Vulnerable)</option>
              <option value="Technical Breakdown">Senior Engineering Breakdown</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20"
          >
            {isGenerating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Crafting Platform Copy...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate {platform} Draft</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Platform Prototype & Markdown Viewer */}
        <div className="lg:col-span-8 bg-[#11151B] border border-[#1E2633] rounded-2xl p-6 flex flex-col justify-between space-y-5 shadow-xl">
          <div>
            {/* Top Toolbar: Switcher between Prototype Preview & Raw Markdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E2633]">
              <div className="flex items-center gap-2">
                {/* View Mode Toggle */}
                <div className="p-1 bg-[#0B0D10] border border-[#1E2633] rounded-xl flex items-center gap-1 text-xs">
                  <button
                    onClick={() => setViewMode('prototype')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition ${
                      viewMode === 'prototype'
                        ? 'bg-emerald-500 text-black shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Platform Prototype</span>
                  </button>
                  <button
                    onClick={() => setViewMode('markdown')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition ${
                      viewMode === 'markdown'
                        ? 'bg-emerald-500 text-black shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>Raw Markdown</span>
                  </button>
                </div>

                <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                  {platform}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#141A23] hover:bg-[#18202B] border border-[#1E2633] rounded-lg text-xs font-semibold text-slate-300 transition"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownloadMarkdown}
                  className="p-1.5 bg-[#141A23] hover:bg-[#18202B] border border-[#1E2633] rounded-lg text-slate-300 transition"
                  title="Download .md"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Reddit 90/10 Ratio Banner */}
            {isReddit && (
              <div className="mt-4 p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Reddit Value Ratio: 92% Value / 8% Promo
                  </span>
                  <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded">
                    Safe (Value-first)
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Reminder: Check subreddit rules before posting. Do not post promotional links unless explicitly permitted by moderators.
                </p>
              </div>
            )}

            {/* ========================================================
                VIEW MODE 1: NATIVE PLATFORM PROTOTYPE PREVIEWS
                ======================================================== */}
            {viewMode === 'prototype' && (
              <div className="mt-4 space-y-4">
                {/* 1. REDDIT PROTOTYPE */}
                {platform === 'Reddit' && (
                  <div className="bg-[#1A1A1B] text-[#D7DADC] rounded-xl border border-[#343536] overflow-hidden shadow-2xl font-sans">
                    {/* Reddit Header */}
                    <div className="p-3 bg-[#1A1A1B] border-b border-[#272729] flex items-center justify-between text-xs text-[#818384]">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-orange-600 flex items-center justify-center font-bold text-white text-[11px]">
                          r/
                        </div>
                        <span className="font-bold text-[#D7DADC] hover:underline cursor-pointer">
                          r/freelance
                        </span>
                        <span>•</span>
                        <span>Posted by u/builder_solo 4 hours ago</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#272729] text-[#4FBCFF] font-semibold">
                          Case Study / Guide
                        </span>
                      </div>
                      <MoreHorizontal className="w-4 h-4 cursor-pointer hover:text-white" />
                    </div>

                    {/* Post Content */}
                    <div className="p-4 sm:p-5 space-y-3">
                      <h2 className="text-lg sm:text-xl font-bold text-[#D7DADC] tracking-tight leading-snug">
                        {currentDraft.title}
                      </h2>

                      <div className="text-sm text-[#D7DADC]/90 space-y-3 whitespace-pre-wrap leading-relaxed">
                        {currentDraft.body}
                      </div>

                      {/* Subtle CTA / Discussion Trigger */}
                      <div className="pt-2 text-sm text-[#4FBCFF] font-medium">
                        💬 {currentDraft.callToAction}
                      </div>
                    </div>

                    {/* Reddit Upvote & Action Bar */}
                    <div className="px-4 py-2.5 bg-[#141516] border-t border-[#272729] flex items-center gap-4 text-xs font-bold text-[#818384]">
                      <div className="flex items-center bg-[#272729] rounded-full px-2 py-1 gap-1.5">
                        <button
                          onClick={() => {
                            setUpvoted(!upvoted);
                            setUpvoteCount(upvoted ? upvoteCount - 1 : upvoteCount + 1);
                          }}
                          className={`p-0.5 hover:text-orange-500 transition ${upvoted ? 'text-orange-500' : ''}`}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <span className={`font-mono ${upvoted ? 'text-orange-500' : 'text-[#D7DADC]'}`}>
                          {upvoteCount}
                        </span>
                        <button className="p-0.5 hover:text-blue-500 transition">
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 bg-[#272729] rounded-full px-3 py-1 cursor-pointer hover:bg-[#343536] text-[#D7DADC]">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>42 Comments</span>
                      </div>

                      <div className="flex items-center gap-1.5 bg-[#272729] rounded-full px-3 py-1 cursor-pointer hover:bg-[#343536] text-[#D7DADC]">
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share</span>
                      </div>
                    </div>

                    {/* Community Comments Simulation */}
                    <div className="p-4 bg-[#141516] border-t border-[#272729] space-y-3 text-xs">
                      <span className="text-[11px] font-bold text-[#818384] uppercase tracking-wider block">
                        Top Community Comment
                      </span>
                      <div className="p-3 bg-[#1A1A1B] rounded-lg border border-[#272729] space-y-1">
                        <div className="flex items-center gap-2 text-[#818384] text-[11px]">
                          <span className="font-bold text-[#D7DADC]">u/dev_consultant</span>
                          <span>•</span>
                          <span>2 hours ago</span>
                        </div>
                        <p className="text-slate-300">
                          This 3-bucket reserve approach is huge. I got burned last tax year because I spent money that wasn&apos;t mine. Is there a template setup or sheet you recommend?
                        </p>
                        <div className="text-[11px] text-[#818384] pt-1">
                          Reply · Upvote (18)
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. LINKEDIN PROTOTYPE */}
                {platform === 'LinkedIn' && (
                  <div className="bg-[#1B1F23] text-white rounded-xl border border-[#2E343B] overflow-hidden shadow-2xl font-sans">
                    {/* LinkedIn Author Header */}
                    <div className="p-4 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-sm">
                          AR
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-white hover:underline cursor-pointer">
                              Alex Rivera
                            </span>
                            <span className="text-xs text-slate-400 font-normal">• 1st</span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1">
                            Solo Founder &amp; Systems Engineer • Building digital tools for creators
                          </p>
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                            <span>1h • </span>
                            <span>🌐</span>
                          </div>
                        </div>
                      </div>
                      <MoreHorizontal className="w-5 h-5 text-slate-400 cursor-pointer" />
                    </div>

                    {/* LinkedIn Post Copy */}
                    <div className="px-4 pb-3 space-y-3 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                      <p className="font-semibold text-white">{currentDraft.hook}</p>
                      <div>{currentDraft.body}</div>

                      {/* Hashtags */}
                      <div className="flex flex-wrap gap-1.5 pt-1 text-xs text-cyan-400 font-medium">
                        {(currentDraft.hashtags || ['#Productivity', '#Solopreneur', '#IndieHacker', '#BuildInPublic']).map(
                          (tag, i) => (
                            <span key={i} className="hover:underline cursor-pointer">
                              {tag}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    {/* Engagement Count Bar */}
                    <div className="px-4 py-2 border-t border-[#2E343B] flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <span className="flex items-center -space-x-1">
                          <span className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white">👍</span>
                          <span className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-[10px] text-white">💡</span>
                        </span>
                        <span className="ml-1 text-[11px] font-mono">{likeCount}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        29 comments • 12 reposts
                      </div>
                    </div>

                    {/* LinkedIn Action Bar */}
                    <div className="px-2 py-1.5 bg-[#14171A] border-t border-[#2E343B] grid grid-cols-4 gap-1 text-xs font-semibold text-slate-400">
                      <button
                        onClick={() => {
                          setLiked(!liked);
                          setLikeCount(liked ? likeCount - 1 : likeCount + 1);
                        }}
                        className={`flex items-center justify-center gap-1.5 py-2 hover:bg-[#1F2429] rounded transition ${
                          liked ? 'text-blue-400 font-bold' : ''
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>Like</span>
                      </button>
                      <button className="flex items-center justify-center gap-1.5 py-2 hover:bg-[#1F2429] rounded transition">
                        <MessageSquare className="w-4 h-4" />
                        <span>Comment</span>
                      </button>
                      <button className="flex items-center justify-center gap-1.5 py-2 hover:bg-[#1F2429] rounded transition">
                        <Repeat className="w-4 h-4" />
                        <span>Repost</span>
                      </button>
                      <button className="flex items-center justify-center gap-1.5 py-2 hover:bg-[#1F2429] rounded transition">
                        <Send className="w-4 h-4" />
                        <span>Send</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. X (TWITTER) PROTOTYPE */}
                {platform === 'X' && (
                  <div className="bg-[#000000] text-white rounded-xl border border-[#2F3336] p-4 sm:p-5 shadow-2xl font-sans space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-black text-sm">
                          AR
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-sm text-white hover:underline cursor-pointer">
                              Alex Rivera
                            </span>
                            <span className="text-cyan-400 text-xs">✓</span>
                            <span className="text-slate-500 text-xs">@alex_builds • 2h</span>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400">
                            Thread (1/4)
                          </span>
                        </div>
                      </div>
                      <MoreHorizontal className="w-4 h-4 text-slate-500" />
                    </div>

                    {/* Tweet Content */}
                    <div className="space-y-3 text-xs sm:text-sm text-slate-100 leading-relaxed whitespace-pre-wrap pl-1">
                      <p className="font-semibold text-white">{currentDraft.title}</p>
                      <div>{currentDraft.body}</div>
                    </div>

                    {/* X Metrics Bar */}
                    <div className="pt-2 border-t border-[#2F3336] flex items-center justify-between text-xs text-slate-500 font-mono">
                      <div className="flex items-center gap-1 hover:text-cyan-400 cursor-pointer">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>18</span>
                      </div>
                      <div className="flex items-center gap-1 hover:text-emerald-400 cursor-pointer">
                        <Repeat className="w-3.5 h-3.5" />
                        <span>42</span>
                      </div>
                      <div className="flex items-center gap-1 hover:text-rose-400 cursor-pointer">
                        <Heart className="w-3.5 h-3.5" />
                        <span>310</span>
                      </div>
                      <div className="flex items-center gap-1 hover:text-cyan-400 cursor-pointer">
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>88</span>
                      </div>
                      <div className="flex items-center gap-1 hover:text-slate-300 cursor-pointer">
                        <Share2 className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Thread Connector preview */}
                    <div className="pt-2 border-t border-[#2F3336] flex items-center gap-2 text-xs text-slate-400">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span>Next in thread: Detailed breakdown of the tax reserve database logic →</span>
                    </div>
                  </div>
                )}

                {/* 4. MEDIUM PROTOTYPE */}
                {platform === 'Medium' && (
                  <div className="bg-[#121212] text-slate-200 rounded-xl border border-[#292929] p-6 sm:p-8 shadow-2xl font-serif space-y-4">
                    <div className="flex items-center justify-between border-b border-[#292929] pb-3 text-xs font-sans text-slate-400">
                      <span className="font-bold text-white uppercase tracking-wider text-[10px]">
                        Published in <strong className="text-cyan-400">Better Systems</strong>
                      </span>
                      <span>4 min read • Oct 4, 2026</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-white font-sans tracking-tight leading-snug">
                      {currentDraft.title}
                    </h1>

                    <div className="flex items-center gap-3 py-2 border-b border-[#292929] text-xs font-sans">
                      <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white text-xs">
                        AR
                      </div>
                      <div>
                        <div className="font-bold text-white">Alex Rivera</div>
                        <div className="text-[11px] text-slate-500">Systems Designer &amp; Builder</div>
                      </div>
                    </div>

                    <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-serif whitespace-pre-wrap pt-2">
                      {currentDraft.body}
                    </div>

                    <div className="pt-4 border-t border-[#292929] flex items-center justify-between text-xs font-sans text-slate-400">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 hover:text-white cursor-pointer">
                          👏 <strong>480</strong>
                        </span>
                        <span className="flex items-center gap-1 hover:text-white cursor-pointer">
                          💬 <strong>34</strong>
                        </span>
                      </div>
                      <Bookmark className="w-4 h-4 cursor-pointer hover:text-white" />
                    </div>
                  </div>
                )}

                {/* 5. PRODUCT HUNT PROTOTYPE */}
                {platform === 'Product Hunt' && (
                  <div className="bg-[#15171C] text-white rounded-xl border border-[#26282E] p-5 shadow-2xl font-sans space-y-4">
                    {/* Launch Banner Card */}
                    <div className="p-4 bg-[#1E2028] rounded-xl border border-[#2D303A] flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center font-bold text-white text-lg shadow-lg">
                          ▲
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-white">{activeProduct.name}</h3>
                          <p className="text-xs text-slate-400">{activeProduct.tagline}</p>
                          <div className="flex gap-2 mt-1">
                            <span className="text-[10px] px-2 py-0.2 rounded bg-[#2D303A] text-slate-300">
                              #1 Product of the Day
                            </span>
                          </div>
                        </div>
                      </div>

                      <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl text-xs flex flex-col items-center shadow-lg shadow-orange-500/20">
                        <span className="text-[10px]">▲ UPVOTE</span>
                        <span className="font-mono text-sm">342</span>
                      </button>
                    </div>

                    {/* Maker First Comment Box */}
                    <div className="p-4 bg-[#0E1015] rounded-xl border border-[#26282E] space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-orange-600 flex items-center justify-center font-bold text-[10px] text-white">
                          M
                        </div>
                        <span className="font-bold text-white">Alex Rivera</span>
                        <span className="px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 text-[10px] font-mono font-bold">
                          Maker
                        </span>
                        <span className="text-slate-500">• 2h ago</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {currentDraft.body}
                      </p>
                      <div className="pt-2 text-orange-400 font-semibold">
                        {currentDraft.callToAction}
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. DEV.TO PROTOTYPE */}
                {platform === 'Dev.to' && (
                  <div className="bg-[#0E1117] text-slate-200 rounded-xl border border-[#23272F] p-6 shadow-2xl font-sans space-y-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                      <span>#nextjs</span>
                      <span>#productivity</span>
                      <span>#webdev</span>
                      <span>#indiehackers</span>
                    </div>

                    <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                      {currentDraft.title}
                    </h1>

                    <div className="flex items-center gap-3 text-xs text-slate-400 pb-3 border-b border-[#23272F]">
                      <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white text-xs">
                        AR
                      </div>
                      <span>Alex Rivera • Published Oct 4</span>
                    </div>

                    <div className="text-xs sm:text-sm text-slate-300 space-y-3 leading-relaxed whitespace-pre-wrap font-sans">
                      {currentDraft.body}
                    </div>

                    <div className="pt-3 border-t border-[#23272F] flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-rose-400">❤️ 84</span>
                      <span className="flex items-center gap-1 text-amber-400">🦄 32</span>
                      <span className="flex items-center gap-1 text-cyan-400">🔖 46</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================
                VIEW MODE 2: RAW MARKDOWN EDITOR
                ======================================================== */}
            {viewMode === 'markdown' && (
              <div className="mt-4 space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">
                    Title / Headline
                  </span>
                  <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                    {currentDraft.title}
                  </h3>
                </div>

                {currentDraft.hook && (
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">
                      Opening Hook
                    </span>
                    <div className="p-3 bg-[#0B0D10] border border-[#1E2633] rounded-xl text-xs text-slate-300 italic">
                      {currentDraft.hook}
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">
                    Post Body (Raw Markdown)
                  </span>
                  <div className="p-4 bg-[#0B0D10] border border-[#1E2633] rounded-xl text-xs text-slate-200 whitespace-pre-wrap font-mono leading-relaxed max-h-[360px] overflow-y-auto">
                    {currentDraft.body}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">
                    Recommended Subtle CTA
                  </span>
                  <p className="text-xs text-emerald-400 font-medium">
                    {currentDraft.callToAction}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer bar */}
          <div className="pt-3 border-t border-[#1E2633] flex items-center justify-between text-[11px] text-slate-500">
            <span>Repurposing engine ready for multi-channel publishing</span>
            <button
              onClick={handleGenerate}
              className="text-slate-400 hover:text-white flex items-center gap-1 transition"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Regenerate Angle</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
