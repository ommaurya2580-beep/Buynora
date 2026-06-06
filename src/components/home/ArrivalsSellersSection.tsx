import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Award } from 'lucide-react';
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
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* New Arrivals */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-indigo-500 animate-spin" /> New Arrivals
          </h3>
          <Link to="/products?sortBy=newest" className="text-xs text-indigo-500 font-semibold hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {newArrivals.map(prod => (
            <ProductCard
              key={prod.id}
              product={prod}
              onCompareToggle={onCompareToggle}
              isCompared={comparedProducts.some(p => p.id === prod.id)}
            />
          ))}
        </div>
      </div>

      {/* Best Sellers */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-1.5">
            <Award className="w-5 h-5 text-amber-500" /> Best Sellers
          </h3>
          <Link to="/products?sortBy=popularity" className="text-xs text-indigo-500 font-semibold hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {bestSellers.map(prod => (
            <ProductCard
              key={prod.id}
              product={prod}
              onCompareToggle={onCompareToggle}
              isCompared={comparedProducts.some(p => p.id === prod.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
