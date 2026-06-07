import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../ProductCard';

interface RecentlyViewedSectionProps {
  products: Product[];
  comparedProducts: Product[];
  onCompareToggle: (product: Product) => void;
}

export const RecentlyViewedSection: React.FC<RecentlyViewedSectionProps> = ({
  products,
  comparedProducts,
  onCompareToggle
}) => {
  if (products.length === 0) return null;

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-black tracking-tight text-text-primary flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-gray-500" /> Recently Viewed
        </h2>
        <p className="text-xs text-gray-500">Pick up right where you left off</p>
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
