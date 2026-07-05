import React, { useState, useEffect } from 'react';
import { Flame, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../types';
import { ProductCard } from '../ProductCard';

interface FlashSaleSectionProps {
  products: Product[];
  comparedProducts: Product[];
  onCompareToggle: (product: Product) => void;
}

export const FlashSaleSection: React.FC<FlashSaleSectionProps> = ({
  products,
  comparedProducts,
  onCompareToggle
}) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 34, seconds: 12 });
  const [isExpanded, setIsExpanded] = useState(false);
  const [limit, setLimit] = useState(6);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 4, minutes: 34, seconds: 12 }; // reset
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
    <section className="glass p-3 sm:p-4 md:p-5 rounded-3xl border border-rose-500/15 relative overflow-hidden bg-rose-500/[0.01] w-full max-w-full">
      <div className="absolute top-0 right-0 w-[30vw] h-[30vw] bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-rose-500 p-2.5 rounded-2xl text-white shadow-lg shadow-rose-500/20">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base md:text-xl font-bold text-text-primary tracking-tight uppercase flex items-center gap-2">
              Flash Deals
            </h2>
            <p className="text-xs text-text-secondary hidden sm:block">Limited quantities. Offers end soon!</p>
          </div>
        </div>

        {/* Countdown Clock & Show More */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-1 text-slate-800 dark:text-slate-200 bg-gray-100 dark:bg-slate-800 px-4 py-2 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 font-mono text-xs shadow-sm">
            <Clock className="w-3.5 h-3.5 text-rose-500 mr-1 animate-pulse" />
            <span className="font-extrabold">{timeLeft.hours.toString().padStart(2, '0')}</span>h :
            <span className="font-extrabold">{timeLeft.minutes.toString().padStart(2, '0')}</span>m :
            <span className="font-extrabold">{timeLeft.seconds.toString().padStart(2, '0')}</span>s
          </div>

          {showButton && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs font-black text-rose-600 dark:text-rose-450 hover:text-rose-700 dark:hover:text-rose-350 flex items-center gap-1 cursor-pointer transition-colors px-1 py-1 lg:px-3.5 lg:py-1.5 lg:bg-rose-500/5 lg:hover:bg-rose-500/10 lg:rounded-xl lg:border lg:border-rose-500/10"
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
