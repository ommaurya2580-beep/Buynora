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
    <div className="space-y-16">
      {/* New Arrivals */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-text-primary flex items-center gap-2 uppercase">
              <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" /> New Arrivals
            </h2>
            <p className="text-xs text-text-secondary">Explore the latest additions to our store collections</p>
          </div>
          <Link to="/products?sortBy=newest" className="text-xs text-indigo-500 font-bold hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-5">
          {newArrivals.map(prod => (
            <ProductCard
              key={prod.id}
              product={prod}
              onCompareToggle={onCompareToggle}
              isCompared={comparedProducts.some(p => p.id === prod.id)}
            />
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-text-primary flex items-center gap-2 uppercase">
              <Award className="w-5 h-5 text-amber-500" /> Best Sellers
            </h2>
            <p className="text-xs text-text-secondary">Highly-rated and top-performing products by our customers</p>
          </div>
          <Link to="/products?sortBy=popularity" className="text-xs text-indigo-500 font-bold hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-5">
          {bestSellers.map(prod => (
            <ProductCard
              key={prod.id}
              product={prod}
              onCompareToggle={onCompareToggle}
              isCompared={comparedProducts.some(p => p.id === prod.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
