import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient, GEMINI_MODEL } from '@/lib/gemini';
import { calculateOpportunityScore } from '@/lib/scoring';
import { ProductOpportunity, ScoreComponents, ProductFormat } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      idea,
      category = 'Software & Productivity',
      targetCustomer = 'Solo operators & freelancers',
      format = 'Notion template' as ProductFormat,
      expectedPrice = 39,
      competitors = '',
      mainProblem = '',
    } = body;

    if (!idea || typeof idea !== 'string') {
      return NextResponse.json({ error: 'Product idea is required' }, { status: 400 });
    }

    const ai = getGeminiClient();

    // Default heuristic scoring based on product idea keywords
    const lower = idea.toLowerCase();
    let demand = 78;
    let buyerIntent = 80;
    let monetization = 82;
    let competitionAdvantage = 70;
    let trend = 80;
    let differentiation = 78;
    let buildEase = 80;
    let distribution = 75;
    let upsell = 75;

    if (lower.includes('finance') || lower.includes('tax') || lower.includes('invoice') || lower.includes('money')) {
      demand += 6;
      buyerIntent += 8;
      monetization += 9;
      upsell += 10;
    }
    if (lower.includes('ai') || lower.includes('agent') || lower.includes('mcp')) {
      trend += 14;
      demand += 8;
      competitionAdvantage -= 4;
    }
    if (lower.includes('dev') || lower.includes('code') || lower.includes('nextjs') || lower.includes('api')) {
      buyerIntent += 7;
      monetization += 6;
      buildEase -= 10;
      distribution += 8;
    }
    if (lower.includes('template') || lower.includes('notion') || lower.includes('sheet')) {
      buildEase += 12;
      monetization -= 4;
    }

    // Cap values 15 to 98
    const components: ScoreComponents = {
      demand: Math.min(98, Math.max(25, demand)),
      buyerIntent: Math.min(98, Math.max(25, buyerIntent)),
      monetization: Math.min(98, Math.max(25, monetization)),
      competitionAdvantage: Math.min(98, Math.max(25, competitionAdvantage)),
      trend: Math.min(98, Math.max(25, trend)),
      differentiation: Math.min(98, Math.max(25, differentiation)),
      buildEase: Math.min(98, Math.max(25, buildEase)),
      distribution: Math.min(98, Math.max(25, distribution)),
      upsell: Math.min(98, Math.max(25, upsell)),
    };

    const { score, category: scoreCategory, recommendation } = calculateOpportunityScore(components);

    let aiResearchData: Partial<ProductOpportunity> = {};

    if (ai) {
      try {
        const prompt = `You are a principal digital product intelligence analyst.
Perform a live web search audit to analyze this real-world product opportunity:
Product Idea: "${idea}"
Category: "${category}"
Target Customer: "${targetCustomer}"
Format: "${format}"
Expected Price: $${expectedPrice}
Competitor notes or URLs: "${competitors}"
Core problem: "${mainProblem}"

Search Google for actual real-world competitors, existing tools, real customer discussions on Reddit / forums, and realistic pricing.

CRITICAL: Return ONLY raw, valid JSON matching this schema (do NOT wrap in markdown fences if possible, or use standard JSON):
{
  "tagline": "string (one snappy sentence)",
  "description": "string (2-3 sentences)",
  "whyBuildReason": "string (evidence-based explanation citing real market dynamics)",
  "demandAnalysis": "string (evidence from real search intent and community forums)",
  "buyerIntentNotes": "string (explanation of willingness to pay and search intent)",
  "competitionSummary": "string (real competitor landscape citing existing software/templates)",
  "differentiationWedges": ["string (wedge 1)", "string (wedge 2)", "string (wedge 3)", "string (wedge 4)"],
  "suggestedMvp": {
    "name": "string (name of MVP)",
    "coreFeatures": ["string", "string", "string", "string"],
    "timeline": "string (e.g. 7-14 Days)",
    "targetCost": "string"
  },
  "suggestedPricing": {
    "entry": number,
    "recommended": number,
    "premium": number,
    "model": "string"
  },
  "bestMarketplaces": [
    {"platform": "string", "score": number, "reason": "string"},
    {"platform": "string", "score": number, "reason": "string"}
  ],
  "bestAcquisitionChannels": [
    {"channel": "string", "score": number, "strategy": "string"},
    {"channel": "string", "score": number, "strategy": "string"}
  ],
  "contentAngles": ["string", "string", "string"],
  "keyRisks": ["string", "string"],
  "keywords": ["string", "string", "string", "string"]
}`;

        const response = await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }],
          },
        });

        if (response.text) {
          let cleanJson = response.text.trim();
          if (cleanJson.startsWith('```json')) {
            cleanJson = cleanJson.replace(/^```json/, '').replace(/```$/, '').trim();
          } else if (cleanJson.startsWith('```')) {
            cleanJson = cleanJson.replace(/^```/, '').replace(/```$/, '').trim();
          }

          const parsed = JSON.parse(cleanJson);
          aiResearchData = parsed;
        }
      } catch (err) {
        console.error('Gemini research API call failed, using heuristic model:', err);
      }
    }

    const defaultPrice = Number(expectedPrice) || 39;
    const finalProduct: ProductOpportunity = {
      id: `prod-gen-${Date.now()}`,
      name: idea,
      slug: idea.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      tagline: aiResearchData.tagline || `Specialized ${format} for ${targetCustomer}`,
      description:
        aiResearchData.description ||
        `Comprehensive ${format} targeting ${targetCustomer}. Solves ${mainProblem || 'daily operational inefficiencies'} with streamlined workflows and structured outputs.`,
      category,
      targetAudience: targetCustomer,
      mainProblem: mainProblem || `Manual, error-prone workflows and lack of specialized tools for ${targetCustomer}.`,
      format: format as ProductFormat,
      estimatedPrice: defaultPrice,
      priceRange: `$${Math.round(defaultPrice * 0.7)} - $${Math.round(defaultPrice * 1.8)}`,
      opportunityScore: score,
      scoreCategory,
      recommendation,
      components,
      competitionDifficulty: 100 - components.competitionAdvantage,
      buildDifficulty: 100 - components.buildEase,
      estimatedBuildDays: Math.max(3, Math.round((100 - components.buildEase) / 4)),
      whyBuildReason:
        aiResearchData.whyBuildReason ||
        `${score >= 80 ? 'Strong' : 'Moderate'} buyer intent, clear recurring pain point, manageable MVP scope, and clear differentiation wedges against generic alternatives.`,
      demandAnalysis:
        aiResearchData.demandAnalysis ||
        `Estimated healthy search demand across relevant niche communities and marketplace search queries. Buyers actively search for pre-built solutions to avoid manual setup.`,
      buyerIntentNotes:
        aiResearchData.buyerIntentNotes ||
        `Commercial search intent is high because the product directly saves time or unlocks business income.`,
      competitionSummary:
        aiResearchData.competitionSummary ||
        `Existing competitors are either dated, overly generic, or overpriced enterprise suites with steep learning curves.`,
      differentiationWedges: aiResearchData.differentiationWedges || [
        'Niche-focused UX tailored specifically for this audience',
        'Ready-to-use templates with zero configuration required',
        'Includes actionable step-by-step implementation guide',
        'Cheaper and lighter than bloated legacy software',
      ],
      suggestedMvp: aiResearchData.suggestedMvp || {
        name: `${idea} Core MVP`,
        coreFeatures: ['Core dashboard/workspace', 'Step-by-step workflow guide', 'Exportable reporting format', 'Quickstart video tour'],
        timeline: '7 Days',
        targetCost: '$0',
      },
      suggestedPricing: aiResearchData.suggestedPricing || {
        entry: Math.round(defaultPrice * 0.7),
        recommended: defaultPrice,
        premium: Math.round(defaultPrice * 2.2),
        model: 'One-time download with optional premium bonus pack',
      },
      bestMarketplaces: aiResearchData.bestMarketplaces || [
        { platform: 'Gumroad', score: 90, reason: 'Lowest setup friction, high organic creator reach' },
        { platform: 'Lemon Squeezy', score: 85, reason: 'Clean modern checkout and global VAT handling' },
        { platform: 'Product Hunt', score: 82, reason: 'Great launch spike for tech-forward tools' },
      ],
      bestAcquisitionChannels: aiResearchData.bestAcquisitionChannels || [
        { channel: 'Reddit (Niche communities)', score: 91, strategy: 'Post educational value-first teardowns solving the main problem without promo' },
        { channel: 'SEO / Long-tail content', score: 86, strategy: 'Publish comparison and tutorial articles targeting specific problem queries' },
        { channel: 'X / Twitter Build in Public', score: 84, strategy: 'Share transparent screenshots of the prototype and early tester feedback' },
      ],
      contentAngles: aiResearchData.contentAngles || [
        `Why most ${targetCustomer} struggle with ${mainProblem || 'this problem'} and the simple system that fixes it`,
        `How to solve ${idea} in 15 minutes instead of spending 20 hours in custom setups`,
        `The exact template I used to streamline my workflow without expensive subscriptions`,
      ],
      keyRisks: aiResearchData.keyRisks || [
        'Commoditization by copycats if marketing is not strongly differentiated',
        'Platform dependency on host marketplace algorithms',
      ],
      keywords: aiResearchData.keywords || [
        `${idea.toLowerCase()} template`,
        `best ${idea.toLowerCase()}`,
        `${targetCustomer.toLowerCase()} tool`,
        `how to solve ${mainProblem ? mainProblem.slice(0, 30) : 'workflow'}`,
      ],
      competitors: [],
      status: 'researched',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ product: finalProduct });
  } catch (err: unknown) {
    console.error('Research route error:', err);
    return NextResponse.json({ error: 'Failed to process product research' }, { status: 500 });
  }
}
