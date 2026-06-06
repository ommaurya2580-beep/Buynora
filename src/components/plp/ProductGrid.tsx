import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, RefreshCw } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../ProductCard';
import { ShimmerGrid } from '../Shimmer';
import { formatCurrency } from '../../utils/formatters';

interface ProductGridProps {
  productsList: Product[];
  viewMode: 'grid' | 'list';
  comparedProducts: Product[];
  handleCompareToggle: (product: Product) => void;
  hasMore: boolean;
  loading: boolean;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  handleClearFilters: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  productsList,
  viewMode,
  comparedProducts,
  handleCompareToggle,
  hasMore,
  loading,
  setPage,
  handleClearFilters
}) => {
  const navigate = useNavigate();

  if (loading && productsList.length === 0) {
    return <ShimmerGrid count={8} />;
  }

  if (productsList.length === 0) {
    return (
      <div className="glass p-12 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 text-center space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">No products match your current filters.</p>
        <button
          onClick={handleClearFilters}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow cursor-pointer transition-all hover:scale-105 active:scale-95"
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Products grid / list */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {productsList.map(prod => (
            <ProductCard
              key={prod.id}
              product={prod}
              onCompareToggle={handleCompareToggle}
              isCompared={comparedProducts.some(p => p.id === prod.id)}
            />
          ))}
        </div>
      ) : (
        /* List Mode View */
        <div className="space-y-4">
          {productsList.map(prod => (
            <div 
              key={prod.id} 
              className="glass p-4 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white dark:bg-slate-900/40 flex flex-col sm:flex-row gap-4 items-center"
            >
              <img
                src={prod.images[0]}
                alt={prod.name}
                className="w-32 h-32 object-cover rounded-xl"
              />
              <div className="flex-1 text-left space-y-1.5">
                <span className="text-[10px] font-bold text-indigo-500 uppercase">{prod.brand}</span>
                <h4 className="font-bold text-gray-900 dark:text-white">{prod.name}</h4>
                <p className="text-xs text-gray-500 line-clamp-2">{prod.description}</p>
                
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {formatCurrency(prod.price)}
                  </span>
                  {prod.discountPercentage > 0 && (
                    <span className="text-xs text-gray-400 line-through">
                      {formatCurrency(prod.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => navigate(`/product/${prod.id}`)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" /> Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Load More/Infinite Scroll Trigger */}
      {hasMore && (
        <div className="flex justify-center pt-6">
          <button
            disabled={loading}
            onClick={() => setPage(prev => prev + 1)}
            className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800 px-6 py-3 rounded-2xl text-xs font-bold shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              "Load More Products"
            )}
          </button>
        </div>
      )}
    </div>
  );
};
