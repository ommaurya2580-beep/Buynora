import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRightLeft, Star, ShoppingCart, Trash2 } from 'lucide-react';
import { Product } from '../services/mockDb';
import { useAppDispatch } from '../redux/store';
import { addToCart } from '../redux/cartSlice';
import { useToast } from '../hooks/useToast';
import { formatCurrency } from '../utils/formatters';

interface CompareDrawerProps {
  comparedProducts: Product[];
  onRemove: (productId: string) => void;
  onClear: () => void;
}

export const CompareDrawer: React.FC<CompareDrawerProps> = ({
  comparedProducts,
  onRemove,
  onClear,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  if (comparedProducts.length === 0) return null;

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({ product, quantity: 1 }));
    showToast(`${product.name} added to cart!`, 'success');
  };

  // Get all unique specification keys across compared products
  const allSpecKeys = Array.from(
    new Set(comparedProducts.flatMap(p => Object.keys(p.specs || {})))
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 md:px-8 pb-4 pointer-events-none">
      <div className="max-w-6xl mx-auto w-full pointer-events-auto">
        <AnimatePresence>
          {!isOpen ? (
            /* Bar view when minimized */
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="glass p-4 rounded-t-2xl shadow-2xl border border-indigo-500/20 flex items-center justify-between bg-white/95 dark:bg-slate-900/95"
            >
              <div className="flex items-center gap-3">
                <div className="bg-indigo-500 p-2 rounded-xl text-white">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-gray-800 dark:text-white">
                    Compare Products ({comparedProducts.length}/3)
                  </h5>
                  <p className="text-xs text-gray-500">Compare specifications side-by-side</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClear}
                  className="text-xs text-gray-500 hover:text-rose-500 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Compare Now
                </button>
              </div>
            </motion.div>
          ) : (
            /* Detailed full modal view */
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="glass rounded-t-3xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white/95 dark:bg-slate-900/95 max-h-[80vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800/50 sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur z-10">
                <div className="flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-indigo-500" />
                  <h4 className="text-base font-bold text-gray-900 dark:text-white">Product Comparison Matrix</h4>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={onClear} className="text-xs text-gray-400 hover:text-rose-500 cursor-pointer">
                    Clear All
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Comparison Grid */}
              <div className="p-6">
                <div className={`grid grid-cols-1 md:grid-cols-${comparedProducts.length + 1} gap-6`}>
                  
                  {/* Labels Column (only visible on desktop md+) */}
                  <div className="hidden md:flex flex-col gap-6 font-bold text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 pt-[240px]">
                    <div className="py-2 border-b border-gray-100 dark:border-gray-800/50 h-10 flex items-center">Brand</div>
                    <div className="py-2 border-b border-gray-100 dark:border-gray-800/50 h-10 flex items-center">Price</div>
                    <div className="py-2 border-b border-gray-100 dark:border-gray-800/50 h-10 flex items-center">Rating</div>
                    <div className="py-2 border-b border-gray-100 dark:border-gray-800/50 h-10 flex items-center">Availability</div>
                    {allSpecKeys.map(key => (
                      <div key={key} className="py-2 border-b border-gray-100 dark:border-gray-800/50 h-12 flex items-center">{key}</div>
                    ))}
                  </div>

                  {/* Product Columns */}
                  {comparedProducts.map(product => (
                    <div key={product.id} className="flex flex-col gap-6 relative border-b md:border-b-0 pb-6 md:pb-0">
                      
                      {/* Close button on column */}
                      <button
                        onClick={() => onRemove(product.id)}
                        className="absolute top-0 right-0 p-1 bg-gray-100 hover:bg-rose-500 hover:text-white dark:bg-slate-800 dark:hover:bg-rose-500 text-gray-400 rounded-full cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Summary card info */}
                      <div className="flex flex-col items-center text-center h-[230px] justify-between">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded-xl"
                        />
                        <div className="mt-2">
                          <h5 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{product.name}</h5>
                          <span className="text-xs text-indigo-500 font-semibold">{product.brand}</span>
                        </div>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="mt-3 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer w-full"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                        </button>
                      </div>

                      {/* Brand */}
                      <div className="py-2 border-b border-gray-100 dark:border-gray-800/50 h-10 flex items-center justify-between md:justify-center">
                        <span className="md:hidden text-xs font-bold text-gray-400 uppercase">Brand:</span>
                        <span className="text-sm font-semibold">{product.brand}</span>
                      </div>

                      {/* Price */}
                      <div className="py-2 border-b border-gray-100 dark:border-gray-800/50 h-10 flex items-center justify-between md:justify-center">
                        <span className="md:hidden text-xs font-bold text-gray-400 uppercase">Price:</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(product.price)}</span>
                      </div>

                      {/* Rating */}
                      <div className="py-2 border-b border-gray-100 dark:border-gray-800/50 h-10 flex items-center justify-between md:justify-center gap-1">
                        <span className="md:hidden text-xs font-bold text-gray-400 uppercase">Rating:</span>
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {product.rating} <span className="text-gray-400 text-xs">({product.ratingCount})</span>
                        </div>
                      </div>

                      {/* Availability */}
                      <div className="py-2 border-b border-gray-100 dark:border-gray-800/50 h-10 flex items-center justify-between md:justify-center">
                        <span className="md:hidden text-xs font-bold text-gray-400 uppercase">Availability:</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          product.availabilityStatus === 'In Stock' 
                            ? 'bg-emerald-500/10 text-emerald-500' 
                            : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {product.availabilityStatus}
                        </span>
                      </div>

                      {/* Dynamic Specs */}
                      {allSpecKeys.map(key => {
                        const val = product.specs[key] || "—";
                        return (
                          <div key={key} className="py-2 border-b border-gray-100 dark:border-gray-800/50 h-12 flex flex-col justify-center md:items-center text-left md:text-center">
                            <span className="md:hidden text-xs font-bold text-gray-400 uppercase mb-0.5">{key}:</span>
                            <span className="text-xs text-gray-700 dark:text-gray-300 font-medium line-clamp-2">{val}</span>
                          </div>
                        );
                      })}

                    </div>
                  ))}

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
