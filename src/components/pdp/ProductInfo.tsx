import React, { useState } from 'react';
import { Star, Heart, BarChart3, Truck, RefreshCcw, ShieldCheck, BadgePercent, MapPin, ChevronDown, Sparkles, TrendingUp, AlertCircle, HelpCircle } from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useToast } from '../../hooks/useToast';
import { SmartAddToCart } from '../SmartAddToCart';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductInfoProps {
  product: Product;
  isInWishlist: boolean;
  isCompared: boolean;
  handleWishlistToggle: () => void;
  handleCompareToggle: () => void;
  handleAddToCart: (color?: string, size?: string) => void;
  handleBuyNow: (color?: string, size?: string) => void;
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
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const { showToast } = useToast();

  // Variant States
  const isFootwear = product.category.toLowerCase().includes('footwear') || product.subcategory.toLowerCase().includes('shoes');
  const isApparel = product.category.toLowerCase().includes('apparel') || product.subcategory.toLowerCase().includes('hoodie');
  const isElectronics = product.category.toLowerCase().includes('electronics') || product.subcategory.toLowerCase().includes('laptop') || product.subcategory.toLowerCase().includes('phone');

  const colorVariants = isFootwear 
    ? ['Racer Red', 'Neon Green', 'Triple White']
    : isApparel 
    ? ['Heather Gray', 'Charcoal Black', 'Navy Blue']
    : isElectronics
    ? ['Titanium Gray', 'Space Black', 'Deep Gold']
    : ['Standard Edition'];

  const sizeVariants = isFootwear 
    ? ['UK 7', 'UK 8', 'UK 9', 'UK 10']
    : isApparel 
    ? ['S', 'M', 'L', 'XL']
    : isElectronics
    ? ['128GB', '256GB', '512GB']
    : ['One Size'];

  const [selectedColor, setSelectedColor] = useState(colorVariants[0]);
  const [selectedSize, setSelectedSize] = useState(sizeVariants[0]);

  // Adjust price based on variant selection (e.g. storage size)
  const getVariantPriceModifier = () => {
    if (isElectronics) {
      if (selectedSize === '256GB') return 8000;
      if (selectedSize === '512GB') return 18000;
    }
    return 0;
  };
  const activePrice = product.price + getVariantPriceModifier();
  const activeOriginalPrice = product.originalPrice + getVariantPriceModifier();

  // Ratings breakdown state
  const [showRatingBreakdown, setShowRatingBreakdown] = useState(false);

  // India PIN Validation Checker
  const handleZipCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipCode.trim() || zipCode.length !== 6) {
      showToast("Please enter a valid 6-digit Indian PIN code", "error");
      return;
    }
    calculateEstimate(zipCode);
  };

  const calculateEstimate = (pin: string) => {
    const days = product.deliveryDays;
    const date = new Date();
    date.setDate(date.getDate() + days);
    const dateStr = date.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });
    setDeliveryEstimate(`Delivery to ${pin} guaranteed by ${dateStr} (${days} days)`);
    showToast(`Pincode ${pin} checked successfully!`, "success");
  };

  const simulateLocationDetection = () => {
    setIsDetectingLocation(true);
    setTimeout(() => {
      // Simulate Indian GPS Coordinates translation to Varanasi / Bengaluru PIN
      const mockPins = ['221005', '560001', '110001', '400001'];
      const randomPin = mockPins[Math.floor(Math.random() * mockPins.length)];
      setZipCode(randomPin);
      calculateEstimate(randomPin);
      setIsDetectingLocation(false);
    }, 1200);
  };

  return (
    <div className="text-left space-y-6">
      
      {/* Brand & Badges Row */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
            {product.brand} Verified Partner
          </span>
          {product.isTrending && (
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <TrendingUp className="w-3 h-3" /> Trending #1
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-full shadow-sm">
              Best Seller
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3.5xl font-black text-text-primary leading-tight tracking-tight mt-1">{product.name}</h1>
        
        {/* Interactive Rating Component */}
        <div className="relative inline-block">
          <button 
            onClick={() => setShowRatingBreakdown(!showRatingBreakdown)}
            className="flex items-center gap-2 hover:bg-gray-150 dark:hover:bg-slate-800/60 p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <div className="flex items-center text-amber-400 gap-0.5">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-extrabold ml-1">{product.rating}</span>
            </div>
            <span className="text-xs text-text-secondary font-medium">({product.ratingCount} Ratings)</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {/* Rating Breakdown Dropdown Card */}
          <AnimatePresence>
            {showRatingBreakdown && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 mt-2 z-40 w-72 glass p-5 rounded-2xl border border-gray-200/60 dark:border-slate-850 shadow-2xl bg-bg-surface text-left"
              >
                <h4 className="text-xs font-black uppercase tracking-wider text-text-primary mb-3">Rating Breakdown</h4>
                
                {/* 5 bars */}
                <div className="space-y-2 text-xs text-text-secondary">
                  {[
                    { stars: 5, pct: '78%', count: 1185 },
                    { stars: 4, pct: '12%', count: 182 },
                    { stars: 3, pct: '5%', count: 76 },
                    { stars: 2, pct: '3%', count: 45 },
                    { stars: 1, pct: '2%', count: 32 }
                  ].map((item) => (
                    <div key={item.stars} className="flex items-center gap-2">
                      <span className="w-3 font-semibold">{item.stars}</span>
                      <Star className="w-3 h-3 text-amber-400 fill-current" />
                      <div className="flex-1 h-2 bg-gray-150 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: item.pct }} />
                      </div>
                      <span className="w-8 text-right font-medium">{item.pct}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-150 dark:border-gray-800 mt-4 pt-3 flex items-center justify-between text-[10px] text-gray-400">
                  <span>100% Verified Reviews</span>
                  <span className="font-bold text-primary">Read reviews below</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Pricing and Offers Section */}
      <div className="glass p-5 rounded-3xl border border-gray-200/50 dark:border-gray-800/80 bg-bg-surface/50 shadow-xl space-y-4">
        
        {/* Core Price Info */}
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-3.5xl font-black text-text-primary tracking-tight">
            {formatCurrency(activePrice)}
          </span>
          {product.discountPercentage > 0 && (
            <>
              <span className="text-sm text-gray-400 line-through">
                {formatCurrency(activeOriginalPrice)}
              </span>
              <span className="bg-rose-500/10 text-rose-500 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
                Save {product.discountPercentage}%
              </span>
            </>
          )}
        </div>

        {/* Price History Sparkline & Value Indicator */}
        <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-500 font-bold bg-emerald-500/5 p-2 rounded-xl border border-emerald-500/10">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Lowest Price in 30 Days!</span>
          
          {/* SVG sparkline chart */}
          <svg className="w-16 h-5 stroke-emerald-500 fill-none ml-auto" strokeWidth="2">
            <path d="M0,18 Q8,15 16,10 T32,15 T48,5 T64,2" />
          </svg>
        </div>

        {/* Trust/Bank Offers Scrollable Horizontal Strip */}
        <div className="space-y-2 pt-1 border-t border-gray-150 dark:border-slate-800/50">
          <h5 className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Available Bank Offers</h5>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
            
            <div className="flex-shrink-0 w-52 p-3 rounded-2xl bg-indigo-500/[0.02] border border-indigo-500/10 text-[11px] space-y-1">
              <div className="flex items-center gap-1.5 text-indigo-500 font-extrabold">
                <BadgePercent className="w-4 h-4" /> 10% Instant Discount
              </div>
              <p className="text-text-secondary leading-tight">Get up to ₹1,500 off on HDFC Credit & Debit Cards. Min txn ₹5,000</p>
            </div>

            <div className="flex-shrink-0 w-52 p-3 rounded-2xl bg-emerald-500/[0.02] border border-emerald-500/10 text-[11px] space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-450 font-extrabold">
                <BadgePercent className="w-4 h-4" /> 5% Unlimited Cashback
              </div>
              <p className="text-text-secondary leading-tight">Using Flipkart Axis Bank Card. No upper limit on cashback</p>
            </div>

            <div className="flex-shrink-0 w-52 p-3 rounded-2xl bg-amber-500/[0.02] border border-amber-500/10 text-[11px] space-y-1">
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-500 font-extrabold">
                <Truck className="w-4 h-4" /> No-Cost EMI
              </div>
              <p className="text-text-secondary leading-tight">EMIs starting from ₹2,350/mo with interest-free installment options</p>
            </div>

          </div>
        </div>
      </div>

      {/* Product Variants (Color, Storage/Size) */}
      <div className="space-y-4 pt-1">
        
        {/* Colors selector */}
        <div className="space-y-2 text-left">
          <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
            Select Color: <span className="text-text-primary font-bold">{selectedColor}</span>
          </span>
          <div className="flex gap-2.5">
            {colorVariants.map((col) => {
              // Map color names to classes
              const colClass = col.includes('Red') ? 'bg-rose-500' 
                             : col.includes('Green') ? 'bg-emerald-500' 
                             : col.includes('White') ? 'bg-white border-gray-300'
                             : col.includes('Black') ? 'bg-slate-900 border-gray-800'
                             : col.includes('Blue') ? 'bg-indigo-600'
                             : 'bg-slate-500';

              return (
                <button
                  key={col}
                  onClick={() => setSelectedColor(col)}
                  className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-all ${colClass} ${
                    selectedColor === col 
                      ? 'ring-2 ring-primary ring-offset-2 scale-105 shadow' 
                      : 'opacity-85 hover:scale-105'
                  }`}
                  title={col}
                />
              );
            })}
          </div>
        </div>

        {/* Sizes / Storage Selector */}
        <div className="space-y-2 text-left">
          <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
            {isElectronics ? 'Storage Option:' : 'Select Size:'} <span className="text-text-primary font-bold">{selectedSize}</span>
          </span>
          <div className="flex flex-wrap gap-2.5">
            {sizeVariants.map((sz) => (
              <button
                key={sz}
                onClick={() => setSelectedSize(sz)}
                className={`px-4 py-2 text-xs font-bold rounded-xl border cursor-pointer transition-all ${
                  selectedSize === sz
                    ? 'border-primary bg-primary text-text-inverted scale-105 shadow-md'
                    : 'border-gray-200 dark:border-gray-850 hover:bg-gray-100 dark:hover:bg-slate-800 text-text-primary'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* AI Sentiment Analysis Card */}
      <div className="glass p-4 rounded-2xl border border-indigo-500/10 bg-indigo-500/[0.01] text-[11px] space-y-2.5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 text-indigo-500">
          <Sparkles className="w-4 h-4 animate-pulse" />
        </div>
        <h5 className="font-black uppercase tracking-wider text-indigo-500 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> AI Review Insights Summary
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1">
            <span className="font-extrabold text-emerald-600 dark:text-emerald-500">PROS</span>
            <ul className="list-disc list-inside text-text-secondary space-y-0.5">
              <li>Excellent premium build quality</li>
              <li>Outstanding real-world efficiency</li>
              <li>Lightweight design with verified durability</li>
            </ul>
          </div>
          <div className="space-y-1">
            <span className="font-extrabold text-rose-500">CONS</span>
            <ul className="list-disc list-inside text-text-secondary space-y-0.5">
              <li>Pricing is slightly premium</li>
              <li>Charging adapters must be bought separately</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <button
          onClick={() => handleAddToCart(selectedColor, selectedSize)}
          className="bg-primary hover:bg-primary-hover text-text-inverted font-bold py-3.5 rounded-2xl cursor-pointer shadow-lg transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-sm"
        >
          Add to Cart
        </button>
        <button
          onClick={() => handleBuyNow(selectedColor, selectedSize)}
          className="bg-slate-900 dark:bg-white text-text-inverted dark:text-slate-900 font-bold py-3.5 rounded-2xl cursor-pointer shadow-lg transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center text-sm"
        >
          Buy Now
        </button>
      </div>

      {/* Wishlist & Compare Toolbar */}
      <div className="flex gap-5 pt-1 border-b border-gray-150 dark:border-gray-800/80 pb-4 text-xs font-bold">
        <button
          onClick={handleWishlistToggle}
          className="flex items-center gap-1.5 text-gray-500 hover:text-rose-500 transition-colors cursor-pointer active:scale-95"
        >
          <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
          {isInWishlist ? "Wishlisted" : "Add to Wishlist"}
        </button>
        <button
          onClick={handleCompareToggle}
          className="flex items-center gap-1.5 text-gray-500 hover:text-indigo-500 transition-colors cursor-pointer active:scale-95"
        >
          <BarChart3 className={`w-4 h-4 ${isCompared ? 'text-indigo-500' : ''}`} />
          {isCompared ? "Compared" : "Add to Compare"}
        </button>
      </div>

      {/* India PIN Delivery checker */}
      <div className="space-y-3.5">
        <h5 className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1">
          <Truck className="w-3.5 h-3.5" /> Delivery & Installation Checker
        </h5>
        
        <form onSubmit={handleZipCalculate} className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <input
              type="text"
              maxLength={6}
              placeholder="Enter 6-digit Pincode"
              value={zipCode}
              onChange={e => setZipCode(e.target.value.replace(/\D/g, ''))}
              className="bg-gray-150 dark:bg-slate-800 text-xs px-4 py-2.5 rounded-xl focus:border-primary outline-none w-full border border-transparent font-medium"
            />
            <button
              type="button"
              onClick={simulateLocationDetection}
              disabled={isDetectingLocation}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-primary transition-colors cursor-pointer"
              title="Detect Location automatically"
            >
              <MapPin className={`w-4 h-4 ${isDetectingLocation ? 'animate-bounce text-primary' : ''}`} />
            </button>
          </div>
          <button
            type="submit"
            className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-black px-5 py-2.5 rounded-xl cursor-pointer"
          >
            Check
          </button>
        </form>

        {deliveryEstimate && (
          <p className="text-xs text-emerald-600 dark:text-emerald-500 font-extrabold flex items-center gap-1.5 bg-emerald-500/5 p-2.5 rounded-xl border border-emerald-500/10">
            <ShieldCheck className="w-4 h-4" /> {deliveryEstimate}
          </p>
        )}

        <div className="text-[11px] text-gray-450 space-y-1.5 pl-1 flex flex-col">
          <p className="flex items-center gap-2"><Truck className="w-3.5 h-3.5" /> 30-Day Hassle-free Returns Policy</p>
          <p className="flex items-center gap-2"><RefreshCcw className="w-3.5 h-3.5" /> Free installation & setup available on electronics</p>
        </div>
      </div>
    </div>
  );
};
