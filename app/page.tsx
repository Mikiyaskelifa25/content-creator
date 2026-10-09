'use client';

import React, { useState } from 'react';
import { Navigation, NavTab } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { DashboardView } from '@/components/DashboardView';
import { OpportunityExplorer } from '@/components/OpportunityExplorer';
import { ProductResearchForm } from '@/components/ProductResearchForm';
import { ProductIdeasTable } from '@/components/ProductIdeasTable';
import { CompetitorIntelligence } from '@/components/CompetitorIntelligence';
import { KeywordResearch } from '@/components/KeywordResearch';
import { MarketplaceDirectory } from '@/components/MarketplaceDirectory';
import { GrowthChannelsView } from '@/components/GrowthChannelsView';
import { ContentStudio } from '@/components/ContentStudio';
import { SaaSOpportunities } from '@/components/SaaSOpportunities';
import { OpportunityHeatmap } from '@/components/OpportunityHeatmap';
import { TodaysOpportunities } from '@/components/TodaysOpportunities';
import { ReportsView } from '@/components/ReportsView';
import { SettingsView } from '@/components/SettingsView';
import { SavedAndAlertsView } from '@/components/SavedAndAlertsView';

import { ProductOpportunity, SaaSIdea, UserAdvantageProfile } from '@/types';
import {
  getStoredProducts,
  saveProduct,
  getStoredSaasIdeas,
  getStoredProfile,
  saveProfile,
} from '@/lib/storage';
import { personalizeProductScore } from '@/lib/scoring';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [products, setProducts] = useState<ProductOpportunity[]>(() => getStoredProducts());
  const [saasIdeas, setSaasIdeas] = useState<SaaSIdea[]>(() => getStoredSaasIdeas());
  const [profile, setProfile] = useState<UserAdvantageProfile>(() => getStoredProfile());
  const [selectedProduct, setSelectedProduct] = useState<ProductOpportunity | null>(() => {
    const list = getStoredProducts();
    return list.length > 0 ? list[0] : null;
  });

  // Update profile and synchronize personalized scores
  const handleUpdateProfile = (newProfile: UserAdvantageProfile) => {
    setProfile(newProfile);
    saveProfile(newProfile);

    // Apply personalized adjustment to all products
    const updatedProducts = products.map((p) => ({
      ...p,
      opportunityScore: personalizeProductScore(p, newProfile),
    }));
    setProducts(updatedProducts);
  };

  const handleSaveProduct = (p: ProductOpportunity) => {
    saveProduct(p);
    const existingIndex = products.findIndex((item) => item.id === p.id);
    if (existingIndex >= 0) {
      const copy = [...products];
      copy[existingIndex] = p;
      setProducts(copy);
    } else {
      setProducts([p, ...products]);
    }
  };

  const handleSelectProduct = (p: ProductOpportunity) => {
    setSelectedProduct(p);
    setActiveTab('explorer');
  };

  const handleGenerateContentForProduct = (p: ProductOpportunity) => {
    setSelectedProduct(p);
    setActiveTab('content');
  };

  const handleGenerateReportForProduct = (p: ProductOpportunity) => {
    setSelectedProduct(p);
    setActiveTab('reports');
  };

  const handleResearchCompleted = (newProduct: ProductOpportunity) => {
    handleSaveProduct(newProduct);
    setSelectedProduct(newProduct);
    setActiveTab('explorer');
  };

  const handleOpenExplorerWithIdea = (ideaName: string) => {
    setActiveTab('explorer');
  };

  return (
    <div className="flex min-h-screen bg-[#0B0D10] text-[#F8FAFC]">
      {/* Sidebar Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        productCount={products.length}
        saasCount={saasIdeas.length}
        profile={profile}
        setProfile={handleUpdateProfile}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenSearch={() => {}}
          onNewResearch={() => setActiveTab('research')}
          products={products}
          saasIdeas={saasIdeas}
          onSelectProduct={(p) => {
            setSelectedProduct(p);
            setActiveTab('explorer');
          }}
          onSelectSaas={() => {
            setActiveTab('saas');
          }}
        />

        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              products={products}
              saasIdeas={saasIdeas}
              profile={profile}
              onSelectProduct={handleSelectProduct}
              onNewResearch={() => setActiveTab('research')}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'explorer' && (
            <OpportunityExplorer
              initialProduct={selectedProduct || products[0]}
              onSaveProduct={handleSaveProduct}
              onOpenContentStudio={handleGenerateContentForProduct}
              onGenerateReport={handleGenerateReportForProduct}
              allProducts={products}
            />
          )}

          {activeTab === 'research' && (
            <ProductResearchForm onResearchComplete={handleResearchCompleted} />
          )}

          {activeTab === 'ideas' && (
            <ProductIdeasTable
              products={products}
              onSelectProduct={handleSelectProduct}
              onSaveProduct={handleSaveProduct}
              onGenerateContent={handleGenerateContentForProduct}
              onGenerateReport={handleGenerateReportForProduct}
            />
          )}

          {activeTab === 'competitors' && <CompetitorIntelligence />}

          {activeTab === 'keywords' && <KeywordResearch />}

          {activeTab === 'marketplaces' && <MarketplaceDirectory />}

          {activeTab === 'channels' && (
            <GrowthChannelsView isZeroBudget={profile.monthlyBudget === 0} />
          )}

          {activeTab === 'content' && (
            <ContentStudio
              products={products}
              selectedProduct={selectedProduct || products[0]}
            />
          )}

          {activeTab === 'saas' && (
            <SaaSOpportunities
              saasIdeas={saasIdeas}
              onOpenExplorerWithIdea={handleOpenExplorerWithIdea}
            />
          )}

          {activeTab === 'heatmap' && (
            <OpportunityHeatmap
              products={products}
              onSelectProduct={handleSelectProduct}
            />
          )}

          {activeTab === 'today' && (
            <TodaysOpportunities
              products={products}
              onSelectProduct={handleSelectProduct}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              products={products}
              selectedProduct={selectedProduct || products[0]}
            />
          )}

          {activeTab === 'saved' && <SavedAndAlertsView />}

          {activeTab === 'settings' && (
            <SettingsView
              profile={profile}
              onSaveProfile={handleUpdateProfile}
            />
          )}
        </main>
      </div>
    </div>
  );
}
