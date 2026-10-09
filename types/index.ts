export type ConfidenceLevel = 'High' | 'Medium' | 'Low' | 'Unknown';
export type DataType = 'observed' | 'estimated' | 'userProvided' | 'derived' | 'unavailable';

export type ProductFormat =
  | 'PDF'
  | 'Ebook'
  | 'Notion template'
  | 'Excel/Google Sheets template'
  | 'SaaS'
  | 'AI tool'
  | 'Prompt pack'
  | 'UI kit'
  | 'Figma template'
  | 'Framer template'
  | 'Code boilerplate'
  | 'Developer tool'
  | 'Course'
  | 'Checklist'
  | 'Database'
  | 'Spreadsheet'
  | 'Design assets'
  | '3D assets'
  | 'Mobile app'
  | 'Browser extension';

export type RecommendationType = 'BUILD' | 'TEST' | 'WAIT' | 'AVOID';

export interface ScoreComponents {
  demand: number; // 20%
  buyerIntent: number; // 15%
  monetization: number; // 15%
  competitionAdvantage: number; // 15% (lower competitor strength = higher advantage)
  trend: number; // 10%
  differentiation: number; // 10%
  buildEase: number; // 5% (100 - buildDifficulty)
  distribution: number; // 5%
  upsell: number; // 5%
}

export interface MetricWithConfidence<T = number | string> {
  value: T;
  source: string;
  confidence: ConfidenceLevel;
  dataType: DataType;
  lastUpdated: string;
}

export interface ProductOpportunity {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  targetAudience: string;
  mainProblem: string;
  format: ProductFormat;
  estimatedPrice: number;
  priceRange: string;
  opportunityScore: number;
  scoreCategory: 'Exceptional' | 'Strong Opportunity' | 'Good Opportunity' | 'Possible' | 'Weak' | 'Avoid';
  recommendation: RecommendationType;
  components: ScoreComponents;
  competitionDifficulty: number; // 0-100
  buildDifficulty: number; // 0-100 (time/effort to construct)
  estimatedBuildDays: number;
  whyBuildReason: string;
  demandAnalysis: string;
  buyerIntentNotes: string;
  competitionSummary: string;
  differentiationWedges: string[];
  suggestedMvp: {
    name: string;
    coreFeatures: string[];
    timeline: string;
    targetCost: string;
  };
  suggestedPricing: {
    entry: number;
    recommended: number;
    premium: number;
    model: string;
  };
  bestMarketplaces: {
    platform: string;
    score: number;
    reason: string;
  }[];
  bestAcquisitionChannels: {
    channel: string;
    score: number;
    strategy: string;
  }[];
  contentAngles: string[];
  keyRisks: string[];
  keywords: string[];
  competitors: Competitor[];
  status: 'researched' | 'saved' | 'building' | 'evaluating';
  createdAt: string;
  updatedAt: string;
}

export interface Competitor {
  id: string;
  productId?: string;
  name: string;
  url: string;
  price: number;
  priceModel: 'one-time' | 'subscription' | 'freemium';
  rating: number; // out of 5
  reviewCount: number;
  category: string;
  positioning: string;
  targetAudience: string;
  corePromise: string;
  features: string[];
  strengths: string[];
  weaknesses: string[];
  customerComplaints: string[];
  differentiationOpportunity: string;
  dataSource: string;
  lastVerified: string;
  confidence: ConfidenceLevel;
}

export interface KeywordData {
  id: string;
  keyword: string;
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
  competition: number; // 0-100
  trend: 'rising' | 'stable' | 'explosive' | 'declining';
  trendScore: number; // 0-100
  estimatedDemand: 'High' | 'Medium' | 'Low' | 'Emerging';
  commercialIntent: number; // 0-100
  contentDifficulty: number; // 0-100
  opportunityScore: number; // 0-100
  isBuyerIntent: boolean;
  relatedProducts: string[];
  suggestedAngle: string;
  volumeLabel: string; // derived/estimated
  dataSource: string;
}

export interface Marketplace {
  id: string;
  name: string;
  url: string;
  productTypes: ProductFormat[];
  targetAudience: string;
  discoveryStrength: number; // 0-100
  sellerDifficulty: number; // 0-100
  feeStructure: string;
  trafficPotential: 'Very High' | 'High' | 'Medium' | 'Niche';
  bestProductType: string;
  bestFor: string;
  payoutMethods: string[];
  currentPolicies: string;
  dataSource: string;
  lastVerified: string;
}

export interface GrowthChannel {
  id: string;
  name: string;
  category: 'Organic Search' | 'Community' | 'Social' | 'Developer' | 'Directory' | 'Video/Audio';
  audienceFit: number; // 0-100
  organicReach: number; // 0-100
  buyerIntent: number; // 0-100
  competition: number; // 0-100
  difficulty: number; // 0-100
  contentCost: 'Free / Effort' | 'Low' | 'Medium' | 'High';
  speed: 'Fast (1-7 days)' | 'Moderate (1-4 weeks)' | 'Slow (1-6 months)';
  longTermValue: number; // 0-100
  bestProductType: string;
  promotionRisk: 'Low' | 'Medium' | 'High' | 'Strict / Ban Risk';
  recommendedStrategy: string;
  overallChannelScore: number; // 0-100
  lowBudgetFriendly: boolean;
}

export interface SaaSIdea {
  id: string;
  rank: number;
  name: string;
  slug: string;
  category: string;
  targetCustomer: string;
  problem: string;
  solution: string;
  opportunityScore: number;
  scoreBreakdown: {
    demand: number; // 20%
    painSeverity: number; // 15%
    willingnessToPay: number; // 15%
    competitionAdvantage: number; // 10%
    recurringRevenue: number; // 15%
    distribution: number; // 10%
    mvpSimplicity: number; // 5%
    aiLeverage: number; // 5%
    expansion: number; // 5%
  };
  recommendation: RecommendationType;
  estimatedMvpDays: number;
  mvpComplexity: 'Low' | 'Medium' | 'High';
  suggestedPricing: {
    starter: number;
    pro: number;
    business: number;
  };
  whyNow: string;
  whyUsersWouldPay: string;
  existingAlternatives: string[];
  differentiationWedge: string;
  distributionChannels: string[];
  aiPotential: string;
  majorRisks: string[];
  mvpFeatures: string[];
}

export interface ContentDraft {
  id: string;
  productId: string;
  productName: string;
  platform: 'Medium' | 'Reddit' | 'LinkedIn' | 'X' | 'Product Hunt' | 'Dev.to' | 'Hashnode' | 'Email' | 'YouTube' | 'Pinterest';
  contentType: string;
  tone: string;
  title: string;
  subtitle?: string;
  hook?: string;
  body: string;
  callToAction: string;
  redditValueRatio?: {
    helpfulPercent: number;
    promoPercent: number;
    riskLevel: 'Safe (Value-first)' | 'Caution' | 'High Spam Risk';
    rulesReminder: string;
  };
  hashtags?: string[];
  visualPrompt?: string;
  commentsStrategy?: string;
  status: 'Idea' | 'Draft' | 'Ready' | 'Published' | 'Analyzing' | 'Winner' | 'Failed';
  createdAt: string;
}

export interface UserAdvantageProfile {
  skills: string[];
  primaryRole: 'Full-stack Developer' | 'Frontend / UI' | 'No-Code / Builder' | 'Marketer / Creator' | 'Domain Expert';
  experienceYears: number;
  existingAudienceSize: number;
  weeklyHours: number;
  monthlyBudget: 0 | 10 | 25 | 50 | 100 | 250;
  targetMonthlyIncome: number;
  preferredProductTypes: ('digital_products' | 'saas' | 'both')[];
  interests: string[];
}

export interface AlertRule {
  id: string;
  title: string;
  condition: string;
  triggerType: 'score_threshold' | 'competition_drop' | 'trend_spike' | 'price_change' | 'new_competitor';
  targetValue: number | string;
  isActive: boolean;
  createdAt: string;
  lastTriggered?: string;
}

export interface SavedResearchItem {
  id: string;
  itemType: 'product' | 'saas' | 'competitor' | 'keyword' | 'report' | 'content';
  title: string;
  folder: string;
  summary: string;
  dataRefId: string;
  createdAt: string;
}

export interface ResearchReportData {
  id: string;
  productName: string;
  category: string;
  executiveSummary: string;
  opportunityScore: number;
  scoreCategory: string;
  recommendation: RecommendationType;
  targetCustomer: string;
  customerPain: string;
  demandAnalysis: string;
  competitionAnalysis: string;
  pricingStrategy: string;
  differentiation: string[];
  mvpScope: string[];
  growthChannels: { name: string; score: number; rationale: string }[];
  contentRoadmap: { day: string; action: string; platform: string }[];
  risksAndMitigations: { risk: string; mitigation: string }[];
  disclaimer: string;
  generatedAt: string;
}

export interface GoogleTrendsData {
  topic: string;
  trendScore: number; // 0-100
  momentum: 'Breakout' | 'Rising' | 'Stable' | 'Cyclical' | 'Declining';
  interestChangePct: number; // e.g. +145
  peakPeriod: string;
  monthlyInterestData: {
    period: string;
    interest: number; // 0-100
    isSpike?: boolean;
  }[];
  breakoutQueries: {
    query: string;
    growth: string; // e.g. "+250%" or "Breakout"
  }[];
  topRegions: {
    region: string;
    relativeInterest: number; // 0-100
  }[];
  trendSummary: string;
  lastUpdated: string;
  groundingSource: string;
}

