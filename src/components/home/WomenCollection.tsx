import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../ProductCard';

interface WomenCollectionProps {
  products: Product[];
  comparedProducts: Product[];
  onCompareToggle: (product: Product) => void;
}

export const WomenCollection: React.FC<WomenCollectionProps> = ({
  products,
  comparedProducts,
  onCompareToggle
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayCount = isExpanded ? 6 : 3;
  const visibleProducts = products.slice(0, displayCount);
  const hasMore = products.length > displayCount;

  return (
    <section className="space-y-6 w-full max-w-full">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm sm:text-base md:text-2xl font-bold tracking-tight text-text-primary flex items-center gap-1.5 uppercase">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-550" /> Women's Collection
          </h2>
          <p className="text-xs text-text-secondary hidden lg:block">Chic dresses, designer apparel, footwear, and cosmetics for women</p>
        </div>
        <Link
          to="/products?search=Women"
          className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors bg-indigo-500/5 hover:bg-indigo-500/10 px-3.5 py-1.5 rounded-xl border border-indigo-500/10"
        >
          View Catalog <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Lifestyle Banner Card */}
        <div 
          className="lg:col-span-1 relative rounded-2xl overflow-hidden min-h-[350px] lg:h-full flex flex-col justify-end p-6 shadow-lg group"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.3)), url('https://images.unsplash.com/photo-1524041255139-59c5b74b776f?auto=format&fit=crop&q=80&w=800')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="space-y-3 relative z-10 text-white">
            <span className="text-[10px] font-black uppercase tracking-widest text-pink-400 bg-pink-500/15 px-2 py-1 rounded-md">
              Trending Now
            </span>
            <h3 className="text-xl font-black tracking-tight uppercase leading-tight">
              Graceful & Vibrant
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Discover stunning dresses, handbags, and makeup essentials for your everyday expression.
            </p>
            <Link
              to="/products?search=Women"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-pink-300 transition-colors pt-2 group-hover:translate-x-1 duration-300"
            >
              Shop Women Fashion <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="absolute inset-0 bg-pink-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Product Cards Grid */}
        <div className="lg:col-span-3 flex flex-col gap-5 justify-between">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {visibleProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isCompared={comparedProducts.some(p => p.id === product.id)}
                onCompareToggle={onCompareToggle}
              />
            ))}
          </div>

          {(hasMore || isExpanded) && (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs font-black text-text-primary px-6 py-2.5 rounded-xl border border-gray-300 dark:border-slate-800 bg-bg-surface hover:bg-slate-50 dark:hover:bg-slate-800/60 shadow-sm transition-all duration-200 cursor-pointer active:scale-95"
              >
                {isExpanded ? 'Show Less Items' : 'Show More Items'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
