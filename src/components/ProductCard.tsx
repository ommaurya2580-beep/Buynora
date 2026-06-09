import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart, BarChart3 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { addToCart } from '../redux/cartSlice';
import { addToWishlist, removeFromWishlist } from '../redux/wishlistSlice';
import { Product } from '../types';
import { useToast } from '../hooks/useToast';
import { formatCurrency } from '../utils/formatters';

const getDeliveryDateString = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

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
    <div className="group relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 flex flex-col h-full bg-bg-surface">
      
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-2.5 right-2.5 z-10 p-2 rounded-full glass hover:bg-white/95 dark:hover:bg-slate-800 cursor-pointer shadow transition-all duration-200 hover:scale-110 active:scale-95"
      >
        <Heart 
          className={`w-3.5 h-3.5 transition-colors ${
            isInWishlist 
              ? 'fill-rose-500 text-rose-500' 
              : 'text-text-secondary hover:text-rose-500'
          }`} 
        />
      </button>

      {/* Compare Button */}
      {onCompareToggle && (
        <button
          onClick={handleCompareClick}
          className={`absolute top-2.5 left-2.5 z-10 p-2 rounded-full bg-bg-surface cursor-pointer shadow transition-all duration-200 hover:scale-110 active:scale-95 ${
            isCompared 
              ? 'bg-primary text-text-inverted border-primary hover:bg-primary-hover' 
              : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-text-secondary hover:text-primary'
          }`}
          title="Add to Compare"
        >
          <BarChart3 className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Product Image Link */}
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/3] p-4 overflow-hidden bg-white dark:bg-slate-900 flex items-center justify-center border-b border-gray-100 dark:border-gray-800/80">
        <img
          src={product.images[0]}
          alt={product.name}
          className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute bottom-2 left-2 flex flex-col gap-1 pointer-events-none">
          {product.discountPercentage > 0 && (
            <span className="bg-rose-550 text-white text-[9px] font-extrabold px-2 py-0.5 rounded shadow">
              {product.discountPercentage}% OFF
            </span>
          )}
          {product.isTrending && (
            <span className="bg-amber-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded shadow">
              Trending
            </span>
          )}
          {product.isFlashSale && (
            <span className="bg-purple-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded shadow">
              Flash Deal
            </span>
          )}
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-3 flex-1 flex flex-col justify-between gap-2">
        <div className="space-y-1 text-left">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-semibold text-primary tracking-wide uppercase truncate">
              {product.brand}
            </span>
            {/* Rating */}
            <div className="flex items-center gap-1">
              <span className="inline-flex items-center gap-0.5 bg-emerald-600 dark:bg-emerald-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                {product.rating} <Star className="w-2.5 h-2.5 fill-current" />
              </span>
              <span className="text-[9px] text-text-secondary font-medium">({product.ratingCount})</span>
            </div>
          </div>
          
          <Link to={`/product/${product.id}`} className="block">
            <h4 className="font-bold text-sm text-text-primary hover:text-primary line-clamp-1 transition-colors">
              {product.name}
            </h4>
          </Link>
          
          {/* Price Hierarchy on One Line */}
          <div className="flex items-baseline flex-wrap gap-1 pt-0.5">
            <span className="text-sm sm:text-base font-extrabold text-text-primary">
              {formatCurrency(product.price)}
            </span>
            {product.discountPercentage > 0 && (
              <>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500">
                  ({product.discountPercentage}% off)
                </span>
              </>
            )}
          </div>

          {/* Delivery & Stock Info */}
          <div className="flex flex-col gap-0.5 pt-1 border-t border-gray-100 dark:border-gray-800/50">
            <div className="text-[10px] text-text-secondary">
              Get it by <span className="font-semibold text-text-primary">{getDeliveryDateString(product.deliveryDays)}</span>
            </div>
            
            <div className="text-[10px] font-semibold">
              {product.stock <= 0 ? (
                <span className="text-red-500">Out of Stock</span>
              ) : product.stock <= 5 ? (
                <span className="text-amber-600 dark:text-amber-500">Only {product.stock} left!</span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-500">In Stock</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-1">
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`w-full py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
              product.stock <= 0
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-450 dark:text-gray-500 cursor-not-allowed'
                : 'bg-accent hover:bg-accent-hover text-text-inverted'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="text-xs font-bold">Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
