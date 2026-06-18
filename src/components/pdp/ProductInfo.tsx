import React, { useState } from 'react';
import { Star, ShoppingCart, Heart, BarChart3, Truck, RefreshCcw } from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useToast } from '../../hooks/useToast';
import { SmartAddToCart } from '../SmartAddToCart';

interface ProductInfoProps {
  product: Product;
  isInWishlist: boolean;
  isCompared: boolean;
  handleWishlistToggle: () => void;
  handleCompareToggle: () => void;
  handleAddToCart: () => void;
  handleBuyNow: () => void;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  isInWishlist,
  isCompared,
  handleWishlistToggle,
  handleCompareToggle,
  handleAddToCart,
  handleBuyNow
}) => {
  const [zipCode, setZipCode] = useState('');
  const [deliveryEstimate, setDeliveryEstimate] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleZipCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipCode.trim() || zipCode.length < 5) {
      showToast("Please enter a valid zip code", "error");
      return;
    }
    const days = product.deliveryDays;
    const date = new Date();
    date.setDate(date.getDate() + days);
    const dateStr = date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
    setDeliveryEstimate(`Delivery guaranteed by ${dateStr} (${days} days)`);
  };

  return (
    <div className="text-left space-y-6">
      <div className="space-y-2">
        <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">{product.brand}</span>
        <h1 className="text-2xl sm:text-3xl font-black text-text-primary leading-tight mt-1">{product.name}</h1>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center text-amber-400 gap-0.5">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-xs font-extrabold ml-1">{product.rating}</span>
          </div>
          <span className="text-xs text-gray-400">({product.ratingCount} Verified Reviews)</span>
        </div>
      </div>

      <div className="border-t border-b border-gray-150 dark:border-gray-800 py-4 flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-3xl font-black text-text-primary">
            {formatCurrency(product.price)}
          </span>
          {product.discountPercentage > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
              <span className="bg-rose-500/10 text-rose-500 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                Save {product.discountPercentage}%
              </span>
            </div>
          )}
        </div>

        <div className="text-right">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            product.availabilityStatus === 'In Stock' 
              ? 'bg-emerald-500/10 text-emerald-500' 
              : 'bg-amber-500/10 text-amber-500'
          }`}>
            {product.availabilityStatus}
          </span>
          <p className="text-[10px] text-gray-400 mt-1">Stock left: {product.stock} units</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-text-secondary leading-relaxed">
        {product.longDescription || product.description}
      </p>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SmartAddToCart 
          product={product} 
          buttonPaddingClass="py-3.5" 
          colorClass="bg-indigo-600 hover:bg-indigo-700 text-text-inverted" 
          iconSize={16} 
        />
        <button
          onClick={handleBuyNow}
          className="bg-slate-900 dark:bg-white text-text-inverted dark:text-slate-900 font-bold py-3.5 rounded-xl cursor-pointer shadow-lg transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center"
        >
          Buy Now
        </button>
      </div>

      {/* Wishlist & Compare Toolbar */}
      <div className="flex gap-4 pt-2 border-b border-gray-150 dark:border-gray-800 pb-4">
        <button
          onClick={handleWishlistToggle}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-rose-500 transition-colors cursor-pointer"
        >
          <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
          {isInWishlist ? "Wishlisted" : "Add to Wishlist"}
        </button>
        <button
          onClick={handleCompareToggle}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-indigo-500 transition-colors cursor-pointer"
        >
          <BarChart3 className={`w-4 h-4 ${isCompared ? 'text-indigo-500' : ''}`} />
          {isCompared ? "Compared" : "Add to Compare"}
        </button>
      </div>

      {/* Delivery & Returns Panel */}
      <div className="space-y-4">
        <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400">Delivery Options</h5>
        <form onSubmit={handleZipCalculate} className="flex gap-2">
          <input
            type="text"
            maxLength={5}
            placeholder="Enter 5-digit zip code"
            value={zipCode}
            onChange={e => setZipCode(e.target.value.replace(/\D/g, ''))}
            className="bg-gray-150 dark:bg-slate-800 text-xs px-4 py-2 rounded-xl focus:border-indigo-500 outline-none flex-1 border border-transparent"
          />
          <button
            type="submit"
            className="bg-slate-200 hover:bg-slate-350 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
          >
            Check
          </button>
        </form>
        {deliveryEstimate && (
          <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1.5">
            <Truck className="w-4 h-4" /> {deliveryEstimate}
          </p>
        )}
        <div className="text-[11px] text-gray-400 space-y-1 pl-1">
          <p className="flex items-center gap-2"><Truck className="w-3.5 h-3.5" /> 30-Day Returns Policy</p>
          <p className="flex items-center gap-2"><RefreshCcw className="w-3.5 h-3.5" /> Free return shipping on exchanges</p>
        </div>
      </div>
    </div>
  );
};
