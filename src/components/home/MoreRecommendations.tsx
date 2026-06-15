import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, ShoppingCart, MapPin, History } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

interface MoreRecommendationsProps {
  allProducts: Product[];
  comparedProducts: Product[];
  onCompareToggle: (product: Product) => void;
}

type TabType = 'ai' | 'frequent' | 'popular' | 'recent';

interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export const MoreRecommendations: React.FC<MoreRecommendationsProps> = ({
  allProducts,
  comparedProducts,
  onCompareToggle
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('ai');
  const [localRecentItems, setLocalRecentItems] = useState<Product[]>([]);

  // Load recently viewed products from localStorage and resolve them against allProducts
  useEffect(() => {
    try {
      const stored = localStorage.getItem('recentlyViewed');
      if (stored && allProducts.length > 0) {
        const parsed = JSON.parse(stored) as { id: string }[];
        const resolved = parsed
          .map(item => allProducts.find(p => p.id === item.id))
          .filter((p): p is Product => !!p);
        setLocalRecentItems(resolved.slice(0, 4));
      }
    } catch (e) {
      console.error('Failed to load recent items in recommendations', e);
    }
  }, [allProducts]);

  // Slices of products to ensure variety across sections
  const aiPicks = useMemo(() => {
    const recommended = allProducts.filter(p => p.isAiRecommended);
    return recommended.length > 0 ? recommended.slice(0, 4) : allProducts.slice(0, 4);
  }, [allProducts]);

  const frequentlyBought = useMemo(() => {
    // Slice unique segment
    return allProducts.slice(4, 8);
  }, [allProducts]);

  const popularInArea = useMemo(() => {
    // Slice unique segment
    return allProducts.slice(8, 12);
  }, [allProducts]);

  const recentlyViewed = useMemo(() => {
    if (localRecentItems.length > 0) {
      return localRecentItems;
    }
    // Fallback if empty
    return allProducts.slice(12, 16);
  }, [localRecentItems, allProducts]);

  const tabs: TabConfig[] = [
    {
      id: 'ai',
      label: 'AI Picks',
      icon: <Sparkles className="w-3.5 h-3.5" />,
      description: 'Personalized items matching your interest profile'
    },
    {
      id: 'frequent',
      label: 'Frequently Bought',
      icon: <ShoppingCart className="w-3.5 h-3.5" />,
      description: 'Common bundles other customers purchase together'
    },
    {
      id: 'popular',
      label: 'Popular in Your Area',
      icon: <MapPin className="w-3.5 h-3.5" />,
      description: 'Trending and top-purchased items in your zip code'
    },
    {
      id: 'recent',
      label: 'Recently Viewed',
      icon: <History className="w-3.5 h-3.5" />,
      description: 'Products you recently checked out on Buynora'
    }
  ];

  const currentProducts = useMemo(() => {
    switch (activeTab) {
      case 'ai': return aiPicks;
      case 'frequent': return frequentlyBought;
      case 'popular': return popularInArea;
      case 'recent': return recentlyViewed;
      default: return aiPicks;
    }
  }, [activeTab, aiPicks, frequentlyBought, popularInArea, recentlyViewed]);

  const activeTabConfig = tabs.find(t => t.id === activeTab)!;

  return (
    <section className="space-y-6 w-full max-w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-150 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-text-primary uppercase flex items-center gap-2">
            Recommended For You
          </h2>
          <p className="text-xs text-text-secondary">{activeTabConfig.description}</p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-900/60 p-1.5 rounded-xl border border-gray-200/50 dark:border-slate-800">
          {tabs.map(tab => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-bg-surface text-primary shadow-sm border border-gray-200/10'
                    : 'text-text-secondary hover:text-text-primary hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panel Contents */}
      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {currentProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isCompared={comparedProducts.some(p => p.id === product.id)}
                onCompareToggle={onCompareToggle}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
