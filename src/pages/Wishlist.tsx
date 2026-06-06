import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { removeFromWishlist } from '../redux/wishlistSlice';
import { addToCart } from '../redux/cartSlice';
import { useToast } from '../hooks/useToast';
import { formatCurrency } from '../utils/formatters';
import { Product } from '../types';

export const Wishlist: React.FC = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const wishlistItems = useAppSelector(state => state.wishlist.wishlistItems);

  const handleMoveToCart = (product: Product) => {
    dispatch(addToCart({ product, quantity: 1 }));
    dispatch(removeFromWishlist(product.id));
    showToast(`${product.name} moved to cart!`, "success");
  };

  return (
    <div className="space-y-10 pb-16 text-left">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500" /> Wishlist Catalog
        </h1>
        <p className="text-xs text-gray-500">Products you've saved to purchase later</p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="glass p-12 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 text-center space-y-4 max-w-md mx-auto">
          <Heart className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto animate-pulse" />
          <h3 className="font-bold text-gray-800 dark:text-white">Your wishlist is empty</h3>
          <p className="text-xs text-gray-400">Save items you like by clicking the heart button on listing grids.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-3 rounded-full shadow cursor-pointer"
          >
            Browse Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product: Product) => (
            <div 
              key={product.id}
              className="glass p-4 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 flex flex-col justify-between h-full bg-white dark:bg-slate-900/20 hover:shadow-xl transition-all group"
            >
              <div className="space-y-3 relative">
                
                {/* Product image */}
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 dark:bg-slate-950/20 relative">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" />
                  <button
                    onClick={() => {
                      dispatch(removeFromWishlist(product.id));
                      showToast(`${product.name} removed from wishlist`, "info");
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-white/95 dark:bg-slate-900/95 hover:bg-rose-500 hover:text-white rounded-full text-gray-400 cursor-pointer shadow-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-left space-y-0.5">
                  <span className="text-[10px] font-bold text-indigo-500 uppercase">{product.brand}</span>
                  <Link to={`/product/${product.id}`} className="font-bold text-xs text-gray-850 dark:text-white hover:text-indigo-500 block line-clamp-1">
                    {product.name}
                  </Link>
                  <span className="text-xs font-black block pt-1">{formatCurrency(product.price)}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => handleMoveToCart(product)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShoppingCart className="w-4 h-4" /> Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
