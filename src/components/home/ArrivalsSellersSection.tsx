import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../types';
import { ProductCard } from '../ProductCard';

interface ArrivalsSellersSectionProps {
  newArrivals: Product[];
  bestSellers: Product[];
  comparedProducts: Product[];
  onCompareToggle: (product: Product) => void;
}

export const ArrivalsSellersSection: React.FC<ArrivalsSellersSectionProps> = ({
  newArrivals,
  bestSellers,
  comparedProducts,
  onCompareToggle
}) => {
  const [newArrivalsExpanded, setNewArrivalsExpanded] = useState(false);
  const [bestSellersExpanded, setBestSellersExpanded] = useState(false);
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

  const visibleNewArrivals = newArrivalsExpanded ? newArrivals : newArrivals.slice(0, limit);
  const visibleBestSellers = bestSellersExpanded ? bestSellers : bestSellers.slice(0, limit);

  const showNewArrivalsButton = newArrivals.length > limit;
  const showBestSellersButton = bestSellers.length > limit;

  return (
    <div className="space-y-8 w-full max-w-full">
      {/* New Arrivals */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-text-primary flex items-center gap-2 uppercase">
              <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" /> New Arrivals
            </h2>
            <p className="text-xs text-text-secondary">Explore the latest additions to our store collections</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/products?sortBy=newest" className="text-xs text-indigo-500 font-bold hover:underline">
              View All
            </Link>
            {showNewArrivalsButton && (
              <button
                onClick={() => setNewArrivalsExpanded(!newArrivalsExpanded)}
                className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors bg-indigo-500/5 hover:bg-indigo-500/10 px-3.5 py-1.5 rounded-xl border border-indigo-500/10"
              >
                {newArrivalsExpanded ? 'Show Less' : 'Show More'}
              </button>
            )}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5 w-full"
        >
          <AnimatePresence mode="popLayout">
            {visibleNewArrivals.map(prod => (
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

      {/* Best Sellers */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-text-primary flex items-center gap-2 uppercase">
              <Award className="w-5 h-5 text-amber-500" /> Best Sellers
            </h2>
            <p className="text-xs text-text-secondary">Highly-rated and top-performing products by our customers</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/products?sortBy=popularity" className="text-xs text-indigo-500 font-bold hover:underline">
              View All
            </Link>
            {showBestSellersButton && (
              <button
                onClick={() => setBestSellersExpanded(!bestSellersExpanded)}
                className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors bg-indigo-500/5 hover:bg-indigo-500/10 px-3.5 py-1.5 rounded-xl border border-indigo-500/10"
              >
                {bestSellersExpanded ? 'Show Less' : 'Show More'}
              </button>
            )}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5 w-full"
        >
          <AnimatePresence mode="popLayout">
            {visibleBestSellers.map(prod => (
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
    </div>
  );
};
