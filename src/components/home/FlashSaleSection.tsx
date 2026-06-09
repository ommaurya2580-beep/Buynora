import React, { useState, useEffect } from 'react';
import { Flame, Clock } from 'lucide-react';
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

  return (
    <section className="glass p-6 md:p-8 rounded-3xl border border-rose-500/15 relative overflow-hidden bg-rose-500/[0.01]">
      <div className="absolute top-0 right-0 w-[30vw] h-[30vw] bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-rose-500 p-2.5 rounded-2xl text-white shadow-lg shadow-rose-500/20">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-black text-text-primary tracking-tight uppercase flex items-center gap-2">
              Flash Deals
            </h2>
            <p className="text-xs text-text-secondary">Limited quantities. Offers end soon!</p>
          </div>
        </div>

        {/* Countdown Clock */}
        <div className="flex items-center gap-1 text-slate-800 dark:text-slate-200 bg-gray-100 dark:bg-slate-800 px-4 py-2 rounded-2xl self-start sm:self-auto border border-gray-200/50 dark:border-gray-700/50 font-mono text-xs shadow-sm">
          <Clock className="w-3.5 h-3.5 text-rose-500 mr-1 animate-pulse" />
          <span className="font-extrabold">{timeLeft.hours.toString().padStart(2, '0')}</span>h :
          <span className="font-extrabold">{timeLeft.minutes.toString().padStart(2, '0')}</span>m :
          <span className="font-extrabold">{timeLeft.seconds.toString().padStart(2, '0')}</span>s
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
