import React from 'react';
import { Compass } from 'lucide-react';
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
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-black tracking-tight text-text-primary flex items-center gap-2">
          <Compass className="w-5 h-5 text-indigo-500" /> Hot Trending
        </h2>
        <p className="text-xs text-gray-500">Popular items customers are purchasing right now</p>
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
