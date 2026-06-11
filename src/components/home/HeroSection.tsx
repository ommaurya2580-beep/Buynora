import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, ShoppingBag, Eye, ArrowRight, TrendingDown,
  Volume2, Battery, Award, Cpu, Tv, Camera, Activity, ShieldCheck
} from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useProducts } from '../../hooks/useQueries';
import { products as fallbackProducts } from '../../services/mockDb';
import sonyHeadphonesImage from '../../assets/sony_headphones_podium.png';

/* ------------------------------------------------------------------ */
/*  Feature Icon Picker Helper                                         */
/* ------------------------------------------------------------------ */
const getFeatureIcon = (label: string) => {
  const l = label.toLowerCase();
  if (l.includes('noise') || l.includes('sound') || l.includes('audio')) {
    return <Volume2 className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />;
  }
  if (l.includes('battery') || l.includes('charge') || l.includes('runtime')) {
    return <Battery className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />;
  }
  if (l.includes('display') || l.includes('screen') || l.includes('oled')) {
    return <Tv className="w-4 h-4 text-blue-500 dark:text-blue-400" />;
  }
  if (l.includes('processor') || l.includes('chip') || l.includes('cpu')) {
    return <Cpu className="w-4 h-4 text-violet-500 dark:text-violet-400" />;
  }
  if (l.includes('camera') || l.includes('lens')) {
    return <Camera className="w-4 h-4 text-rose-500 dark:text-rose-400" />;
  }
  if (l.includes('cushion') || l.includes('support') || l.includes('fit') || l.includes('sole')) {
    return <Activity className="w-4 h-4 text-amber-500 dark:text-amber-400" />;
  }
  if (l.includes('rating') || l.includes('star')) {
    return <Star className="w-4 h-4 text-amber-400 fill-current" />;
  }
  if (l.includes('premium') || l.includes('brand') || l.includes('quality') || l.includes('fabric')) {
    return <Award className="w-4 h-4 text-indigo-500 dark:text-indigo-450" />;
  }
  return <ShieldCheck className="w-4 h-4 text-sky-500 dark:text-sky-400" />;
};

/* ------------------------------------------------------------------ */
/*  Product Subtitle Helper                                           */
/* ------------------------------------------------------------------ */
const getProductSubtitle = (product: Product) => {
  const subtitleMap: Record<string, string> = {
    'p3': 'Hear Every Detail.\nBlock Every Distraction.',
    'p1': 'Titanium design. A17 Pro chip.\nPro camera system.',
    'p4': 'Mind-blowing performance.\nStunning Liquid Retina XDR display.',
    'p2': 'Step into the future.\nUnmatched all-day comfort.',
    'p5': 'Cozy premium fleece.\nPerfect everyday comfort.',
  };
  return subtitleMap[product.id] || product.description;
};

/* ------------------------------------------------------------------ */
/*  Product Features Helper                                           */
/* ------------------------------------------------------------------ */
const getProductFeatures = (product: Product) => {
  const customFeatures: Record<string, { label: string; value: string }[]> = {
    'p3': [
      { label: 'NOISE CANCELLATION', value: 'Industry Leading' },
      { label: 'BATTERY LIFE', value: '30H Continuous' },
      { label: 'SOUND QUALITY', value: 'Premium Audio' }
    ],
    'p1': [
      { label: 'DISPLAY', value: 'Super Retina XDR' },
      { label: 'PROCESSOR', value: 'A17 Pro Chip' },
      { label: 'CAMERA SYSTEM', value: '48MP Pro Lens' }
    ],
    'p4': [
      { label: 'PROCESSOR', value: 'Apple M3 Chip' },
      { label: 'DISPLAY SCREEN', value: 'Liquid Retina XDR' },
      { label: 'BATTERY RUNTIME', value: 'Up to 22 Hours' }
    ],
    'p2': [
      { label: 'HEEL CUSHION', value: 'Max Air 270 Unit' },
      { label: 'OUTSOLE FIT', value: 'Premium Mesh' },
      { label: 'MIDSOLE SUPPORT', value: 'Dual-Density Foam' }
    ],
    'p5': [
      { label: 'FABRIC MATERIAL', value: 'Heavyweight Fleece' },
      { label: 'SWEATER COPE', value: 'Classic Fit' },
      { label: 'HEAVY WEIGHT', value: 'Cotton Blend' }
    ]
  };

  if (customFeatures[product.id]) return customFeatures[product.id];

  // Fallback: extract from specs
  const specsKeys = Object.keys(product.specs || {});
  if (specsKeys.length >= 3) {
    return [
      { label: specsKeys[0].toUpperCase(), value: product.specs[specsKeys[0]] },
      { label: specsKeys[1].toUpperCase(), value: product.specs[specsKeys[1]] },
      { label: specsKeys[2].toUpperCase(), value: product.specs[specsKeys[2]] }
    ];
  }

  return [
    { label: 'RATING', value: `${product.rating} Stars` },
    { label: 'AVAILABILITY', value: `${product.availabilityStatus}` },
    { label: 'OFFICIAL BRAND', value: `${product.brand}` }
  ];
};

/* ------------------------------------------------------------------ */
/*  MAIN HERO COMPONENT                                                */
/* ------------------------------------------------------------------ */
export const HeroSection: React.FC = () => {
  const { data: productsData, isLoading } = useProducts({ limit: 20 });
  const allProducts = productsData?.products || [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Curate 5 premium products from categories
  const featuredProducts = useMemo(() => {
    const list = allProducts.length > 0 ? allProducts : fallbackProducts;
    const targetIds = ['p3', 'p1', 'p4', 'p2', 'p5'];
    const curated = targetIds
      .map(id => list.find(p => p.id === id))
      .filter((p): p is Product => !!p);
    
    return curated.length > 0 ? curated : list.slice(0, 5);
  }, [allProducts]);

  // Slideshow auto-rotation logic
  useEffect(() => {
    if (isPaused || featuredProducts.length === 0) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, featuredProducts.length]);

  if (isLoading && allProducts.length === 0) {
    return (
      <section className="relative w-full lg:w-[95vw] lg:max-w-[1400px] lg:left-1/2 lg:-translate-x-1/2 h-[450px] md:h-[480px] lg:h-[500px] rounded-3xl overflow-hidden shimmer-effect" />
    );
  }

  if (featuredProducts.length === 0) return null;

  const activeProduct = featuredProducts[activeIndex];
  const features = getProductFeatures(activeProduct);
  const subtitle = getProductSubtitle(activeProduct);
  const savingsAmount = activeProduct.originalPrice - activeProduct.price;

  return (
    <section 
      className="relative w-full lg:w-[95vw] lg:max-w-[1400px] lg:left-1/2 lg:-translate-x-1/2 transition-all duration-300 z-30 select-none" 
      id="hero-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Outer Banner Frame */}
      <div className="w-full h-auto lg:h-[480px] rounded-3xl overflow-hidden border border-gray-150/90 dark:border-slate-800/80 shadow-xl relative flex flex-col lg:flex-row transition-all duration-300">
        
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFFFFF] via-[#F7F8FC] via-[#EEF2FF] to-[#F6F3FF] dark:from-[#0F172A] dark:via-[#111827] dark:via-[#1E293B] dark:to-[#312E81] transition-all duration-500 z-0" />
        
        {/* Ambient Glow Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none rounded-3xl z-0">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-200/25 dark:bg-indigo-900/15 rounded-full blur-[110px]" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-200/25 dark:bg-purple-900/15 rounded-full blur-[110px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-150/15 dark:bg-indigo-950/10 rounded-full blur-[130px]" />
        </div>

        {/* Content Slider */}
        <div className="w-full h-full relative z-10 flex flex-col lg:flex-row">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProduct.id}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full flex flex-col lg:flex-row"
            >
              
              {/* LEFT SIDE CONTENT - ORDER 2 ON MOBILE */}
              <div className="w-full lg:w-[52%] flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-8 lg:py-10 order-2 lg:order-1 select-text">
                
                {/* Badge Pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-indigo-50/80 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100/60 dark:border-indigo-900/30 rounded-full w-fit mb-3">
                  🚀 NEW LAUNCH
                </div>

                {/* Sub-label & Headline */}
                <div className="mb-2">
                  <p className="text-[11px] lg:text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest mb-0.5">
                    Introducing
                  </p>
                  <h1 className="text-2xl sm:text-3xl lg:text-[38px] font-black text-slate-900 dark:text-white leading-[1.15] tracking-tight">
                    {activeProduct.name}
                  </h1>
                </div>

                {/* Subtitle */}
                <p className="text-[13px] sm:text-sm text-slate-550 dark:text-slate-400 max-w-[480px] leading-relaxed mb-4 whitespace-pre-line">
                  {subtitle}
                </p>

                {/* Stars Rating */}
                <div className="flex items-center gap-2 mb-4 text-xs font-semibold">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(activeProduct.rating) 
                            ? 'fill-amber-400 text-amber-400' 
                            : 'text-slate-300 dark:text-slate-700 fill-slate-200 dark:fill-slate-800'
                        }`} 
                      />
                    ))}
                    <span className="text-slate-800 dark:text-slate-255 font-black ml-1">{activeProduct.rating}</span>
                  </div>
                  <span className="text-slate-400 dark:text-slate-500 font-medium">({activeProduct.ratingCount.toLocaleString()} Reviews)</span>
                </div>

                {/* Price Section */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white">
                      {formatCurrency(activeProduct.price)}
                    </span>
                    <span className="text-sm lg:text-base text-slate-450 dark:text-slate-500 line-through font-medium">
                      {formatCurrency(activeProduct.originalPrice)}
                    </span>
                    <span className="text-[10px] font-black bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded border border-rose-100/50 dark:border-rose-900/30">
                      {activeProduct.discountPercentage}% OFF
                    </span>
                  </div>
                  {savingsAmount > 0 && (
                    <p className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-450 mt-1">
                      Save {formatCurrency(savingsAmount)}
                    </p>
                  )}

                  {/* Price Drop Badge */}
                  <div className="flex items-center gap-1 px-2.5 py-1 mt-2.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/30 text-[10px] font-bold text-emerald-700 dark:text-emerald-450 w-fit">
                    <TrendingDown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span>📉 Price Dropped Today • Lowest Price in Last 30 Days</span>
                  </div>
                </div>

                {/* 3 Inline Features */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-1.5 mb-5 border-t border-gray-150/40 dark:border-slate-800/40 pt-4">
                  {features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-white/90 dark:bg-slate-800/80 shadow-sm border border-gray-100/40 dark:border-slate-700/40 flex items-center justify-center flex-shrink-0">
                        {getFeatureIcon(feat.label)}
                      </div>
                      <div className="leading-tight text-[11px]">
                        <p className="font-semibold text-[8px] text-slate-400 dark:text-slate-500 tracking-wider uppercase">{feat.label}</p>
                        <p className="font-bold text-slate-850 dark:text-slate-205">{feat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 relative z-20">
                  <Link
                    to={`/product/${activeProduct.id}`}
                    className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                  >
                    Explore Now <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to={`/product/${activeProduct.id}`}
                    className="inline-flex items-center gap-1 hover:bg-slate-200/40 dark:hover:bg-slate-800/40 text-slate-750 dark:text-slate-300 font-bold text-xs px-4 py-2.5 rounded-full border border-slate-200/40 dark:border-slate-700/40 transition-all duration-200 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Details
                  </Link>
                </div>

              </div>

              {/* RIGHT SIDE PRODUCT AREA - ORDER 1 ON MOBILE */}
              <div className="flex-1 w-full lg:w-[48%] h-[240px] sm:h-[280px] lg:h-full relative flex items-center justify-center py-6 lg:py-0 order-1 lg:order-2">
                
                {/* Large Circular Glow Halo */}
                <div
                  className="absolute w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] lg:w-[320px] lg:h-[320px] rounded-full border border-indigo-200/20 dark:border-indigo-400/10 shadow-[0_0_80px_rgba(165,180,252,0.25),inset_0_0_40px_rgba(165,180,252,0.15)] dark:shadow-[0_0_80px_rgba(99,102,241,0.2),inset_0_0_40px_rgba(99,102,241,0.1)] blur-[2px] pointer-events-none transition-all duration-500 z-0"
                  style={{
                    background: 'radial-gradient(circle, rgba(165,180,252,0.15) 0%, transparent 70%)',
                  }}
                />

                {/* Ambient Backlight Reflection */}
                <div className="absolute w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] rounded-full bg-white/60 dark:bg-indigo-950/20 blur-[50px] pointer-events-none z-0" />

                {/* Premium 3D CSS Podium */}
                <div className="absolute bottom-[20px] sm:bottom-[30px] lg:bottom-[45px] flex flex-col items-center justify-center z-0">
                  {/* Floor Shadow under the podium */}
                  <div className="w-[220px] sm:w-[260px] lg:w-[300px] h-[16px] bg-black/[0.04] dark:bg-black/[0.3] rounded-[50%] blur-sm pointer-events-none" />
                  
                  {/* 3D Extruded Cylinder (Podium Body) */}
                  <div className="relative w-[200px] sm:w-[240px] lg:w-[280px] h-[35px] -mt-[14px]">
                    {/* Side extrusion of cylinder */}
                    <div className="absolute top-[6px] w-full h-[18px] bg-gradient-to-b from-[#E2E8F0] to-[#CBD5E1] dark:from-slate-800 dark:to-slate-900 rounded-[50%]" />
                    
                    {/* Top cap of cylinder */}
                    <div className="absolute top-0 w-full h-[15px] bg-gradient-to-b from-white to-[#F1F5F9] dark:from-slate-700 dark:to-slate-800 border border-gray-200/50 dark:border-slate-650/40 rounded-[50%] shadow-[inset_0px_1px_2px_rgba(255,255,255,0.8)]" />
                  </div>
                </div>

                {/* Product Image Floating Container */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative z-10 flex flex-col items-center justify-center w-full"
                >
                  {/* Dynamic Image */}
                  <img
                    src={activeProduct.id === 'p3' ? sonyHeadphonesImage : activeProduct.images[0]}
                    alt={activeProduct.name}
                    className="max-h-[190px] sm:max-h-[220px] lg:max-h-[260px] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.12)] select-none z-10 transition-transform duration-350 hover:scale-105"
                    loading="eager"
                  />

                  {/* Floating Shadow under the product */}
                  <div className="absolute bottom-[-10px] w-[50%] h-[12px] bg-black/[0.06] dark:bg-black/[0.25] rounded-[50%] blur-md pointer-events-none scale-x-90" />
                </motion.div>

              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Dots Indicator - Bottom Left */}
        <div className="absolute bottom-5 left-6 sm:left-10 lg:left-14 flex items-center gap-2 z-20">
          {featuredProducts.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === activeIndex
                  ? 'w-6 bg-indigo-600 dark:bg-indigo-400'
                  : 'w-2 bg-slate-350 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
