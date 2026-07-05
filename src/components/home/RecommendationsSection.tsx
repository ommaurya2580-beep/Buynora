import React, { useState, useEffect } from 'react';
import { Sparkles, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [limit, setLimit] = useState(6);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setLimit(2);
      } else if (window.innerWidth < 1024) {
        setLimit(4);
      } else {
        setLimit(6);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const visibleProducts = isExpanded ? products : products.slice(0, limit);
  const showButton = products.length > limit;

  return (
    <section className="glass rounded-3xl p-3 sm:p-4 md:p-5 border border-indigo-500/15 relative overflow-hidden bg-indigo-500/[0.01] w-full max-w-full">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-[25vw] h-[25vw] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 relative z-10">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm sm:text-base md:text-2xl font-bold tracking-tight text-text-primary flex items-center gap-1.5 uppercase">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-550 animate-pulse" /> Recommended For You
            </h2>
            <span className="hidden lg:inline-flex bg-indigo-600/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-indigo-500/10">
              AI Personalized
            </span>
          </div>
          <p className="text-xs text-text-secondary hidden lg:block">Custom suggestions based on your search history and profile interests</p>
        </div>

        {/* Action Panel: Tooltip + Show More */}
        <div className="flex items-center gap-3 self-center sm:self-auto relative z-20">
          {/* Why Recommended Tooltip */}
          <div className="relative group/tooltip hidden lg:block">
            <button className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 bg-indigo-500/5 px-3 py-1.5 rounded-xl cursor-help transition-all hover:bg-indigo-500/10">
              <HelpCircle className="w-3.5 h-3.5" /> Why Recommended?
            </button>
            
            <div className="absolute bottom-full mb-2 right-0 sm:right-1/2 sm:translate-x-1/2 w-64 bg-slate-900 border border-slate-800 text-slate-100 text-[11px] p-3 rounded-xl shadow-xl opacity-0 scale-95 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 transition-all duration-200 z-50 leading-relaxed text-center">
              Our recommender system uses collaborative filtering to suggest items similar to your views, cart items, and recent purchases.
              <div className="absolute top-full right-4 sm:right-1/2 sm:translate-x-1/2 border-4 border-transparent border-t-slate-900" />
            </div>
          </div>

          {showButton && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors px-1 py-1 lg:px-3.5 lg:py-1.5 lg:bg-indigo-500/5 lg:hover:bg-indigo-500/10 lg:rounded-xl lg:border lg:border-indigo-500/10"
            >
              <span className="lg:hidden">{isExpanded ? 'Show Less' : 'See All →'}</span>
              <span className="hidden lg:inline">{isExpanded ? 'Show Less' : 'Show More'}</span>
            </button>
          )}
        </div>
      </div>

      <motion.div 
        layout
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 relative z-10 w-full"
      >
        <AnimatePresence mode="popLayout">
          {visibleProducts.map(prod => (
            <motion.div
              key={prod.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <ProductCard
                product={prod}
                onCompareToggle={onCompareToggle}
                isCompared={comparedProducts.some(p => p.id === prod.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};
