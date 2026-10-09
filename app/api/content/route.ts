import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient, GEMINI_MODEL } from '@/lib/gemini';
import { ContentDraft } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      productName,
      audience = 'Solopreneurs & builders',
      platform = 'Medium',
      contentType = 'Problem -> Solution',
      tone = 'Educational & Direct',
      goal = 'Drive organic trust and waitlist signups',
      mainProblem = '',
      solution = '',
    } = body;

    const ai = getGeminiClient();

    let draft: Partial<ContentDraft> = {};

    if (ai) {
      try {
        const prompt = `You are an elite B2B content strategist. Generate a production-ready piece of content for this product:
Product: "${productName}"
Platform: "${platform}"
Audience: "${audience}"
Content Template / Type: "${contentType}"
Tone: "${tone}"
Goal: "${goal}"
Problem Solved: "${mainProblem}"
Solution: "${solution}"

CRITICAL PLATFORM GUIDELINES:
- If Platform is "Reddit":
  * Target a 90% helpful / 10% promo ratio. Absolutely NO spam, hard selling, or affiliate links.
  * Structure as honest lessons, mistakes made, or technical breakdowns.
  * Include a suggested subreddit type and a warning reminder to check community rules.
- If Platform is "Medium":
  * Write thoughtful, in-depth, structured editorial with clear H2/H3 headers, actionable takeaways, and a subtle closing CTA.
- If Platform is "LinkedIn":
  * Write a compelling scroll-stopping hook (first 2 lines), clear white-spaced body with tactical lessons, a conversation-starter CTA, and 3-5 relevant hashtags.
- If Platform is "X":
  * Provide a high-engagement thread (5-7 tweets) or strong single post with punchy hooks and zero fluff.
- If Platform is "Product Hunt":
  * Provide Product Name, Tagline, Problem, Solution, Key Features, and heartfelt Maker First Comment.

Respond ONLY with a valid JSON object matching:
{
  "title": "string",
  "subtitle": "string",
  "hook": "string",
  "body": "string (formatted with clean markdown)",
  "callToAction": "string",
  "hashtags": ["string", "string"],
  "visualPrompt": "string (description of ideal graphic or screenshot to accompany)",
  "commentsStrategy": "string",
  "redditValueRatio": {
    "helpfulPercent": 92,
    "promoPercent": 8,
    "riskLevel": "Safe (Value-first)",
    "rulesReminder": "Check individual subreddit rules regarding self-promotion before posting. Share free resource in comments only if asked."
  }
}`;

        const res = await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.4,
          },
        });

        if (res.text) {
          draft = JSON.parse(res.text);
        }
      } catch (err) {
        console.error('Gemini content generation error:', err);
      }
    }

    // Fallback template builder if AI is offline
    if (!draft.body) {
      if (platform === 'Reddit') {
        draft = {
          title: `How I eliminated 10+ hours of tedious work for ${productName} (Complete Breakdown & Free Framework)`,
          hook: `After talking with 30+ ${audience}, I noticed almost everyone makes the same mistake with ${mainProblem || 'this workflow'}. Here is how we fixed it.`,
          body: `Hey r/entrepreneur,\n\nOver the past 6 months, I've been researching how solo operators handle ${mainProblem || 'their core workflow'}.\n\n### The Common Mistake:\nMost people try to patch this with 4 different disjointed tools or complex spreadsheets that break as soon as edge cases happen.\n\n### The 3-Step Framework that works:\n1. **Standardize the Inputs:** Don't rebuild formulas from scratch every time.\n2. **Automate the High-Frequency Friction:** Set automated reminders and reserve thresholds.\n3. **Isolate Exceptions:** Treat irregular cases as separate buckets rather than complicating the core system.\n\nI built a lightweight framework for myself and documented the full architecture. Happy to answer questions in the comments!`,
          callToAction: `What does your current setup look like? Drop your questions below and I'll share what worked best.`,
          redditValueRatio: {
            helpfulPercent: 92,
            promoPercent: 8,
            riskLevel: 'Safe (Value-first)',
            rulesReminder: 'Do not post promotional links unless the subreddit explicitly permits them in designated weekly self-promo threads.',
          },
        };
      } else if (platform === 'LinkedIn') {
        draft = {
          title: `Why 80% of ${audience} lose revenue to unorganized systems`,
          hook: `Most founders don't have a lead problem.\nThey have a systems leak.`,
          body: `Here is what happens when you don't systematize ${productName}:\n\n1. Pricing is based on guesswork instead of baseline profit targets.\n2. Invoices sit overdue for 45+ days because follow-ups feel awkward.\n3. Tax season becomes an emergency rather than a routine line item.\n\nWe spent the last month building a streamlined operating model to fix this.\n\nThe result? 4 hours saved every single week and 100% visibility into cashflow.`,
          callToAction: `How often do you review your operational systems? Drop your thoughts in the comments!`,
          hashtags: ['#Productivity', '#Solopreneur', '#Founders', '#IndieHacker'],
          visualPrompt: 'Screenshot of the clean dashboard interface highlighting metrics and clean dark mode typography.',
        };
      } else if (platform === 'Medium') {
        draft = {
          title: `The Architecture of ${productName}: A Practical Guide for ${audience}`,
          subtitle: `How to build a streamlined, profitable workflow without bloated enterprise software.`,
          body: `## Introduction\n\nWhen you start as a ${audience}, managing operations feels simple. You keep a few notes in Google Docs, send manual invoices, and track tasks in your head.\n\nThen things scale.\n\nSuddenly, you are spending 15 hours a week managing administrative clutter instead of doing high-leverage work.\n\n## The Core Problem\n${mainProblem || 'Scattered data and inconsistent tools create mental fatigue and lost revenue.'}\n\n## The Solution: A Unified Operating System\nInstead of paying $200/month for enterprise suites, the winning approach is a lightweight, opinionated workspace built specifically for your niche.\n\n### Key Principles:\n- **Radical Simplicity:** If it takes more than 2 clicks to log, you won't do it.\n- **Built-in Automation:** Let alerts do the nagging for you.\n- **Actionable Outputs:** Only track numbers that inform tomorrow's decision.\n\n## Conclusion\nBuilding systems isn't about bureaucracy; it's about buying your focus back.`,
          callToAction: `If you want to explore the complete template, link is available in the profile bio.`,
        };
      } else {
        draft = {
          title: `${productName}: Launch Kit`,
          hook: `Tired of broken workflows? Discover ${productName}.`,
          body: `Built for ${audience}.\n\nSolves: ${mainProblem || 'Wasted hours and manual overhead'}.\n\nHighlights:\n- Zero setup friction\n- Tested by 100+ builders\n- Lifetime access with zero recurring fees`,
          callToAction: `Check out the live demo and share your feedback!`,
        };
      }
    }

    const finalDraft: ContentDraft = {
      id: `draft-${Date.now()}`,
      productId: 'current',
      productName,
      platform,
      contentType,
      tone,
      title: draft.title || `${productName} Strategy`,
      subtitle: draft.subtitle,
      hook: draft.hook,
      body: draft.body || '',
      callToAction: draft.callToAction || '',
      hashtags: draft.hashtags,
      visualPrompt: draft.visualPrompt,
      commentsStrategy: draft.commentsStrategy,
      redditValueRatio: draft.redditValueRatio,
      status: 'Ready',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ draft: finalDraft });
  } catch (err: unknown) {
    console.error('Content API error:', err);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}
