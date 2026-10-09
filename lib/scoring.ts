import { ScoreComponents, RecommendationType, UserAdvantageProfile, ProductOpportunity, SaaSIdea } from '@/types';

/**
 * Calculates Product Opportunity Score using exact weighted rubric:
 * Demand (20%) + Buyer Intent (15%) + Monetization (15%) + Competition Advantage (15%)
 * + Trend (10%) + Differentiation (10%) + Build Ease (5%) + Distribution (5%) + Upsell (5%) = 100%
 */
export function calculateOpportunityScore(components: ScoreComponents): {
  score: number;
  category: 'Exceptional' | 'Strong Opportunity' | 'Good Opportunity' | 'Possible' | 'Weak' | 'Avoid';
  recommendation: RecommendationType;
} {
  const rawScore =
    components.demand * 0.20 +
    components.buyerIntent * 0.15 +
    components.monetization * 0.15 +
    components.competitionAdvantage * 0.15 +
    components.trend * 0.10 +
    components.differentiation * 0.10 +
    components.buildEase * 0.05 +
    components.distribution * 0.05 +
    components.upsell * 0.05;

  const score = Math.round(Math.min(100, Math.max(0, rawScore)));

  let category: 'Exceptional' | 'Strong Opportunity' | 'Good Opportunity' | 'Possible' | 'Weak' | 'Avoid';
  let recommendation: RecommendationType;

  if (score >= 90) {
    category = 'Exceptional';
    recommendation = 'BUILD';
  } else if (score >= 80) {
    category = 'Strong Opportunity';
    recommendation = 'BUILD';
  } else if (score >= 70) {
    category = 'Good Opportunity';
    recommendation = 'TEST';
  } else if (score >= 60) {
    category = 'Possible';
    recommendation = 'TEST';
  } else if (score >= 50) {
    category = 'Weak';
    recommendation = 'WAIT';
  } else {
    category = 'Avoid';
    recommendation = 'AVOID';
  }

  return { score, category, recommendation };
}

/**
 * Calculates SaaS Opportunity Score:
 * Demand (20%) + Pain Severity (15%) + Willingness To Pay (15%) + Competition Advantage (10%)
 * + Recurring Revenue (15%) + Distribution (10%) + MVP Simplicity (5%) + AI Leverage (5%) + Expansion (5%) = 100%
 */
export function calculateSaaSScore(breakdown: SaaSIdea['scoreBreakdown']): {
  score: number;
  recommendation: RecommendationType;
} {
  const rawScore =
    breakdown.demand * 0.20 +
    breakdown.painSeverity * 0.15 +
    breakdown.willingnessToPay * 0.15 +
    breakdown.competitionAdvantage * 0.10 +
    breakdown.recurringRevenue * 0.15 +
    breakdown.distribution * 0.10 +
    breakdown.mvpSimplicity * 0.05 +
    breakdown.aiLeverage * 0.05 +
    breakdown.expansion * 0.05;

  const score = Math.round(Math.min(100, Math.max(0, rawScore)));
  let recommendation: RecommendationType = 'TEST';
  if (score >= 80) recommendation = 'BUILD';
  else if (score >= 65) recommendation = 'TEST';
  else if (score >= 50) recommendation = 'WAIT';
  else recommendation = 'AVOID';

  return { score, recommendation };
}

/**
 * Personalizes opportunity score based on the user's specific skills,
 * available weekly hours, audience size, and monthly budget ($0 Low Budget Mode).
 */
export function personalizeProductScore(
  product: ProductOpportunity,
  userProfile?: UserAdvantageProfile
): number {
  if (!userProfile) return product.opportunityScore;

  let adjustment = 0;

  // Technical ease alignment
  const isCodeOrDev = product.format === 'Developer tool' || product.format === 'Code boilerplate' || product.format === 'SaaS';
  if (userProfile.primaryRole === 'Full-stack Developer') {
    if (isCodeOrDev) adjustment += 5;
  } else if (userProfile.primaryRole === 'No-Code / Builder') {
    if (product.format === 'Notion template' || product.format === 'Framer template' || product.format === 'Spreadsheet') {
      adjustment += 6;
    } else if (isCodeOrDev) {
      adjustment -= 8;
    }
  }

  // Budget alignment ($0 Low Budget Mode)
  if (userProfile.monthlyBudget === 0) {
    // If the product requires heavy infrastructure or paid ads to distribute, lower score
    if (product.format === 'SaaS' && product.buildDifficulty > 70) {
      adjustment -= 6;
    }
    // If it relies on free organic channels (Reddit, SEO, Product Hunt, GitHub), boost
    if (product.components.distribution >= 75) {
      adjustment += 4;
    }
  } else if (userProfile.monthlyBudget >= 100) {
    adjustment += 2;
  }

  // Audience advantage
  if (userProfile.existingAudienceSize > 2000) {
    adjustment += 4; // High distribution boost
  } else if (userProfile.existingAudienceSize === 0 && product.components.distribution < 60) {
    adjustment -= 3;
  }

  // Weekly hours feasibility
  if (userProfile.weeklyHours < 10 && product.estimatedBuildDays > 20) {
    adjustment -= 5;
  }

  const finalScore = Math.min(99, Math.max(20, Math.round(product.opportunityScore + adjustment)));
  return finalScore;
}
