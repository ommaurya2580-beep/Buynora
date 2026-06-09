import React from 'react';
import { Sparkles, HelpCircle } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../ProductCard';

interface RecommendationsSectionProps {
  products: Product[];
  comparedProducts: Product[];
  onCompareToggle: (product: Product) => void;
}

export const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({
  products,
  comparedProducts,
  onCompareToggle
}) => {
  return (
    <section className="glass rounded-3xl p-6 md:p-8 border border-indigo-500/15 relative overflow-hidden bg-indigo-500/[0.01]">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-[25vw] h-[25vw] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-text-primary flex items-center gap-2 uppercase">
              <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" /> Recommended For You
            </h2>
            <span className="bg-indigo-600/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-indigo-500/10">
              AI Personalized
            </span>
          </div>
          <p className="text-xs text-text-secondary">Custom suggestions based on your search history and profile interests</p>
        </div>

        {/* Why Recommended Tooltip */}
        <div className="relative group/tooltip self-start sm:self-auto">
          <button className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 bg-indigo-500/5 px-3 py-1.5 rounded-xl cursor-help transition-all hover:bg-indigo-500/10">
            <HelpCircle className="w-3.5 h-3.5" /> Why Recommended?
          </button>
          
          <div className="absolute bottom-full mb-2 right-0 sm:right-1/2 sm:translate-x-1/2 w-64 bg-slate-900 border border-slate-800 text-slate-100 text-[11px] p-3 rounded-xl shadow-xl opacity-0 scale-95 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 transition-all duration-200 z-50 leading-relaxed text-center">
            Our recommender system uses collaborative filtering to suggest items similar to your views, cart items, and recent purchases.
            <div className="absolute top-full right-4 sm:right-1/2 sm:translate-x-1/2 border-4 border-transparent border-t-slate-900" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-5 relative z-10">
        {products.map(prod => (
          <ProductCard
            key={prod.id}
            product={prod}
            onCompareToggle={onCompareToggle}
            isCompared={comparedProducts.some(p => p.id === prod.id)}
          />
        ))}
      </div>
    </section>
  );
};
