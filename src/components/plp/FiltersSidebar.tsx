import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { Category } from '../../types';

interface FiltersSidebarProps {
  category: string;
  setCategory: (cat: string) => void;
  brand: string;
  setBrand: (brand: string) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  discountOnly: boolean;
  setDiscountOnly: (discount: boolean) => void;
  inStockOnly: boolean;
  setInStockOnly: (inStock: boolean) => void;
  categories: Category[];
  uniqueBrands: string[];
  handleClearFilters: () => void;
}

export const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  category,
  setCategory,
  brand,
  setBrand,
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
  discountOnly,
  setDiscountOnly,
  inStockOnly,
  setInStockOnly,
  categories,
  uniqueBrands,
  handleClearFilters
}) => {
  return (
    <aside className="hidden lg:block w-64 flex-shrink-0 space-y-6">
      <div className="glass rounded-2xl p-5 border border-gray-200/50 dark:border-gray-800/50 bg-white/60 dark:bg-slate-900/60 text-left space-y-6">
        <div className="flex items-center justify-between border-b border-gray-150 dark:border-gray-800 pb-3">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-indigo-500" /> Filters
          </h4>
          <button
            onClick={handleClearFilters}
            className="text-[10px] text-indigo-500 font-extrabold hover:underline uppercase tracking-wide cursor-pointer"
          >
            Clear
          </button>
        </div>

        {/* Categories */}
        <div className="space-y-2.5">
          <h5 className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Categories</h5>
          <div className="flex flex-col gap-1.5">
            {['All', ...categories.map(c => c.name)].map(catName => (
              <button
                key={catName}
                onClick={() => setCategory(catName)}
                className={`text-left text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer w-full ${
                  category === catName 
                    ? 'bg-indigo-500 text-white' 
                    : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                {catName}
              </button>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div className="space-y-2.5">
          <h5 className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Brands</h5>
          <div className="flex flex-col gap-1.5">
            {uniqueBrands.map(brandName => (
              <button
                key={brandName}
                onClick={() => setBrand(brandName)}
                className={`text-left text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer w-full ${
                  brand === brandName 
                    ? 'bg-indigo-500 text-white' 
                    : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                {brandName}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range Slider */}
        <div className="space-y-2.5">
          <div className="flex justify-between text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
            <span>Price Range</span>
            <span className="text-indigo-500 font-black">{formatCurrency(maxPrice)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="2000"
            step="50"
            value={maxPrice}
            onChange={e => setMaxPrice(parseInt(e.target.value))}
            className="w-full h-1.5 bg-gray-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
          />
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>$0</span>
            <span>$2,000</span>
          </div>
        </div>

        {/* Ratings Filter */}
        <div className="space-y-2.5">
          <h5 className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Min Rating</h5>
          <div className="flex gap-1">
            {[0, 3, 4, 4.5].map(rating => (
              <button
                key={rating}
                onClick={() => setMinRating(rating)}
                className={`text-xs px-2.5 py-1.5 rounded-lg font-bold border transition-colors cursor-pointer ${
                  minRating === rating 
                    ? 'bg-indigo-500 text-white border-indigo-500' 
                    : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                {rating === 0 ? 'Any' : `${rating}★`}
              </button>
            ))}
          </div>
        </div>

        {/* Toggle Filters */}
        <div className="space-y-2.5 pt-3 border-t border-gray-150 dark:border-gray-800">
          <label className="flex items-center gap-2.5 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={discountOnly}
              onChange={e => setDiscountOnly(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            Discounted Only
          </label>
          <label className="flex items-center gap-2.5 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={e => setInStockOnly(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            In Stock Only
          </label>
        </div>
      </div>
    </aside>
  );
};
