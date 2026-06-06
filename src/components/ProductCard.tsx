import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart, BarChart3 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { addToCart } from '../redux/cartSlice';
import { addToWishlist, removeFromWishlist } from '../redux/wishlistSlice';
import { Product } from '../types';
import { useToast } from '../hooks/useToast';
import { formatCurrency } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  onCompareToggle?: (product: Product) => void;
  isCompared?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onCompareToggle, 
  isCompared = false 
}) => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const wishlistItems = useAppSelector(state => state.wishlist.wishlistItems);
  const isInWishlist = wishlistItems.some((item: Product) => item.id === product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
      showToast(`${product.name} removed from wishlist`, 'info');
    } else {
      dispatch(addToWishlist(product));
      showToast(`${product.name} added to wishlist!`, 'success');
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) {
      showToast("Product is out of stock", 'error');
      return;
    }
    dispatch(addToCart({ product, quantity: 1 }));
    showToast(`${product.name} added to cart!`, 'success');
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onCompareToggle) {
      onCompareToggle(product);
    }
  };

  return (
    <div className="group relative glass rounded-2xl overflow-hidden border border-gray-200/50 dark:border-gray-800/50 hover:border-indigo-500/30 dark:hover:border-indigo-400/30 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col h-full bg-white dark:bg-slate-900/40">
      
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-3 right-3 z-10 p-2 rounded-full glass hover:bg-white/90 dark:hover:bg-slate-800 cursor-pointer shadow-md transition-all duration-200 hover:scale-110 active:scale-95"
      >
        <Heart 
          className={`w-4 h-4 transition-colors ${
            isInWishlist 
              ? 'fill-rose-500 text-rose-500' 
              : 'text-gray-500 dark:text-gray-400 hover:text-rose-500'
          }`} 
        />
      </button>

      {/* Compare Button */}
      {onCompareToggle && (
        <button
          onClick={handleCompareClick}
          className={`absolute top-3 left-3 z-10 p-2 rounded-full glass cursor-pointer shadow-md transition-all duration-200 hover:scale-110 active:scale-95 ${
            isCompared 
              ? 'bg-indigo-500 text-white border-indigo-500 hover:bg-indigo-600' 
              : 'hover:bg-white/90 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 hover:text-indigo-500'
          }`}
          title="Add to Compare"
        >
          <BarChart3 className="w-4 h-4" />
        </button>
      )}

      {/* Product Image Link */}
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-50 dark:bg-slate-950/20">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute bottom-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {product.discountPercentage > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
              {product.discountPercentage}% OFF
            </span>
          )}
          {product.isTrending && (
            <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
              Trending
            </span>
          )}
          {product.isFlashSale && (
            <span className="bg-purple-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
              Flash Sale
            </span>
          )}
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 tracking-wide uppercase">
            {product.brand}
          </span>
          <Link to={`/product/${product.id}`}>
            <h4 className="font-bold text-gray-800 dark:text-gray-100 hover:text-indigo-500 dark:hover:text-indigo-400 mt-1 line-clamp-1 transition-colors">
              {product.name}
            </h4>
          </Link>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{product.rating}</span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">({product.ratingCount})</span>
          </div>
        </div>

        {/* Pricing and Action */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/50">
          <div className="flex flex-col">
            <span className="text-lg font-black text-gray-900 dark:text-white">
              {formatCurrency(product.price)}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-xs text-gray-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`p-2.5 rounded-xl flex items-center justify-center cursor-pointer shadow-md transition-all duration-200 hover:scale-105 active:scale-95 ${
              product.stock <= 0
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/15'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
