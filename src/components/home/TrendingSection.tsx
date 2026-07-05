import React, { useState, useEffect } from 'react';
import { Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../types';
import { ProductCard } from '../ProductCard';

interface TrendingSectionProps {
  products: Product[];
  comparedProducts: Product[];
  onCompareToggle: (product: Product) => void;
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({
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
    <section className="space-y-6 w-full max-w-full">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm sm:text-base md:text-2xl font-bold tracking-tight text-text-primary flex items-center gap-1.5 uppercase">
            <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-550" /> Hot Trending
          </h2>
          <p className="text-xs text-text-secondary hidden lg:block">Popular items customers are purchasing right now</p>
        </div>

        {showButton && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors bg-indigo-500/5 hover:bg-indigo-500/10 px-3.5 py-1.5 rounded-xl border border-indigo-500/10"
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>

      <motion.div 
        layout
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5 w-full"
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
