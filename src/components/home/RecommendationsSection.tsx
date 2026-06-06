import React from 'react';
import { Sparkles } from 'lucide-react';
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
    <section className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" /> AI Recommended for You
        </h2>
        <p className="text-xs text-gray-500">Custom recommendations based on search trends and profiles</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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
