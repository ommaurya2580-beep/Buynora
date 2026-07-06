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
      
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 pb-3 mb-3 relative z-10 w-full border-b border-indigo-500/10">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-[18px] lg:text-[24px] font-bold tracking-tight text-text-primary flex items-center gap-1.5 leading-none">
            <Sparkles className="w-5 h-5 lg:w-7 lg:h-7 text-indigo-550 animate-pulse" /> Recommended For You
          </h2>
          <span className="bg-indigo-600/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400 text-[12px] font-bold px-2.5 py-0.5 rounded-full border border-indigo-500/10 leading-none">
            AI Personalized
          </span>
        </div>

        {showButton && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[12px] lg:text-[14px] font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>{isExpanded ? 'Show Less' : 'Show More →'}</span>
          </button>
        )}
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
