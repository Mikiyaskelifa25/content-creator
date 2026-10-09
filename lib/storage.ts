import {
  ProductOpportunity,
  SaaSIdea,
  Marketplace,
  GrowthChannel,
  KeywordData,
  UserAdvantageProfile,
  AlertRule,
  SavedResearchItem,
  ContentDraft,
} from '@/types';
import { SEED_PRODUCTS } from './seedProducts';
import { SEED_SAAS_IDEAS } from './seedSaas';
import {
  SEED_MARKETPLACES,
  SEED_GROWTH_CHANNELS,
  SEED_KEYWORDS,
  DEFAULT_USER_PROFILE,
  SEED_ALERTS,
} from './seedMarketAndGrowth';

const STORAGE_KEYS = {
  PRODUCTS: 'productscope_products_v2',
  SAAS: 'productscope_saas_v2',
  PROFILE: 'productscope_profile_v2',
  SAVED: 'productscope_saved_v2',
  ALERTS: 'productscope_alerts_v2',
  DRAFTS: 'productscope_drafts_v2',
};

export function getStoredProducts(): ProductOpportunity[] {
  if (typeof window === 'undefined') return SEED_PRODUCTS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
      return SEED_PRODUCTS;
    }
    return JSON.parse(data);
  } catch {
    return SEED_PRODUCTS;
  }
}

export function saveProduct(product: ProductOpportunity): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getStoredProducts();
    const existingIndex = list.findIndex((p) => p.id === product.id);
    let updated: ProductOpportunity[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = product;
    } else {
      updated = [product, ...list];
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save product to storage', e);
  }
}

export function getStoredSaasIdeas(): SaaSIdea[] {
  if (typeof window === 'undefined') return SEED_SAAS_IDEAS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SAAS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SAAS, JSON.stringify(SEED_SAAS_IDEAS));
      return SEED_SAAS_IDEAS;
    }
    return JSON.parse(data);
  } catch {
    return SEED_SAAS_IDEAS;
  }
}

export function getStoredProfile(): UserAdvantageProfile {
  if (typeof window === 'undefined') return DEFAULT_USER_PROFILE;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!data) return DEFAULT_USER_PROFILE;
    return JSON.parse(data);
  } catch {
    return DEFAULT_USER_PROFILE;
  }
}

export function saveProfile(profile: UserAdvantageProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function getStoredSavedItems(): SavedResearchItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SAVED);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function toggleSaveItem(item: SavedResearchItem): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const list = getStoredSavedItems();
    const exists = list.some((i) => i.id === item.id || i.dataRefId === item.dataRefId);
    let updated: SavedResearchItem[];
    if (exists) {
      updated = list.filter((i) => i.id !== item.id && i.dataRefId !== item.dataRefId);
      localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(updated));
      return false; // removed
    } else {
      updated = [item, ...list];
      localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(updated));
      return true; // added
    }
  } catch {
    return false;
  }
}

export function getStoredAlerts(): AlertRule[] {
  if (typeof window === 'undefined') return SEED_ALERTS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ALERTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(SEED_ALERTS));
      return SEED_ALERTS;
    }
    return JSON.parse(data);
  } catch {
    return SEED_ALERTS;
  }
}

export function saveAlerts(alerts: AlertRule[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
  } catch (e) {
    console.error('Failed to save alerts', e);
  }
}

export function getStoredDrafts(): ContentDraft[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DRAFTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveDraft(draft: ContentDraft): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getStoredDrafts();
    const updated = [draft, ...list.filter((d) => d.id !== draft.id)];
    localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save draft', e);
  }
}
