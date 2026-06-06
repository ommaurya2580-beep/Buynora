import React from 'react';
import { Grid, List, Filter, ArrowUpDown } from 'lucide-react';

interface SortControlsProps {
  search: string;
  category: string;
  totalCount: number;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (viewMode: 'grid' | 'list') => void;
  setShowFiltersMobile: (show: boolean) => void;
}

export const SortControls: React.FC<SortControlsProps> = ({
  search,
  category,
  totalCount,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  setShowFiltersMobile
}) => {
  return (
    <div className="glass p-4 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/50 dark:bg-slate-900/50">
      
      {/* Header count info */}
      <div className="text-left w-full sm:w-auto">
        <h3 className="text-sm font-bold text-gray-800 dark:text-white">
          {search ? `Search results for "${search}"` : category !== 'All' ? `${category} Products` : 'All Products'}
        </h3>
        <span className="text-[10px] text-gray-400">{totalCount} premium items found</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
        
        {/* Mobile Filter Button */}
        <button
          onClick={() => setShowFiltersMobile(true)}
          className="lg:hidden flex items-center gap-1.5 bg-gray-100 dark:bg-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-700 cursor-pointer"
        >
          <Filter className="w-3.5 h-3.5" /> Filters
        </button>

        {/* Sorting */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bg-gray-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-xs font-bold rounded-xl px-3 py-2 outline-none cursor-pointer"
          >
            <option value="popularity">Most Popular</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>

        {/* Grid / List View Toggle */}
        <div className="hidden sm:flex items-center gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg cursor-pointer ${
              viewMode === 'grid' ? 'bg-white dark:bg-slate-900 text-indigo-500 shadow-sm' : 'text-gray-400'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg cursor-pointer ${
              viewMode === 'list' ? 'bg-white dark:bg-slate-900 text-indigo-500 shadow-sm' : 'text-gray-400'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
