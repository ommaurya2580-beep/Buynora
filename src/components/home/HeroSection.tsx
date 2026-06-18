import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, ArrowRight, Eye, TrendingDown,
  Volume2, Battery, Award, Cpu, Tv, Camera, Activity, ShieldCheck,
  ChevronLeft, ChevronRight, Play
} from 'lucide-react';
import { useCampaignsList } from '../../features/admin/hero-campaigns/hooks/useCampaigns';
import sonyHeadphonesImage from '../../assets/sony_headphones_podium.png';
import { formatCurrency } from '../../utils/formatters';

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
/*  Dynamic Image Render with Error Fallback                          */
/* ------------------------------------------------------------------ */
const CampaignImage: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-150/40 dark:bg-slate-800/40 rounded-2xl border border-dashed border-gray-300 dark:border-slate-700 text-gray-400 p-4">
        <svg viewBox="0 0 24 24" className="w-12 h-12 stroke-current mb-2" fill="none" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <span className="text-[10px] font-black uppercase tracking-wider">Image Unavailable</span>
      </div>
    );
  }

  // Resolve local asset paths if mock database uses relative project source paths
  let resolvedSrc = src;
  if (src.includes('/src/assets/sony_headphones_podium.png')) {
    resolvedSrc = sonyHeadphonesImage;
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={`${className} object-contain`}
      onError={() => setHasError(true)}
      loading="eager"
    />
  );
};

const getBackgroundStyle = (campaign: any) => {
  const theme = campaign.backgroundTheme || 'Premium White';
  const dir = campaign.gradientDirection || 'to-br';
  
  const presets: Record<string, string> = {
    'Premium White': 'linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 50%, #F1F5F9 100%)',
    'Apple Silver': 'linear-gradient(135deg, #E2E8F0 0%, #F8FAFC 50%, #CBD5E1 100%)',
    'Soft Purple': 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 50%, #DDD6FE 100%)',
    'Luxury Black': 'linear-gradient(135deg, #111827 0%, #1F2937 50%, #030712 100%)',
    'Midnight Blue': 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #172554 100%)',
    'Royal Gold': 'linear-gradient(135deg, #FEF08A 0%, #F59E0B 50%, #78350F 100%)',
    'Rose Gold': 'linear-gradient(135deg, #FFF1F2 0%, #FDA4AF 50%, #F43F5E 100%)',
    'Luxury Pink': 'linear-gradient(135deg, #FDF2F8 0%, #FBCFE8 50%, #EC4899 100%)',
    'Ocean Blue': 'linear-gradient(135deg, #ECFDF5 0%, #06B6D4 50%, #0891B2 100%)',
    'Cyber Neon': 'linear-gradient(135deg, #09090B 0%, #2563EB 50%, #D946EF 100%)'
  };

  if (presets[theme]) {
    return { background: presets[theme] };
  }
  
  if (theme === 'Gradient Custom') {
    const c1 = campaign.bgColor1 || '#FFFFFF';
    const c2 = campaign.bgColor2 || '#F7F8FC';
    const c3 = campaign.bgColor3 || '#EEF2FF';
    
    let angle = '135deg';
    if (dir === 'to-r') angle = '90deg';
    else if (dir === 'to-br') angle = '135deg';
    else if (dir === 'to-tr') angle = '45deg';
    else if (dir === 'to-b') angle = '180deg';
    else if (dir === 'to-t') angle = '0deg';
    else if (dir === 'to-l') angle = '270deg';
    
    return { background: `linear-gradient(${angle}, ${c1} 0%, ${c2} 50%, ${c3} 100%)` };
  }
  
  return { background: 'linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 50%, #F1F5F9 100%)' };
};

const isDarkBackground = (campaign: any) => {
  const theme = campaign.backgroundTheme || 'Premium White';
  return ['Luxury Black', 'Midnight Blue', 'Cyber Neon'].includes(theme);
};

/* ------------------------------------------------------------------ */
/*  MAIN HERO COMPONENT                                                */
/* ------------------------------------------------------------------ */
export const HeroSection: React.FC = () => {
  const { data: campaigns = [], isLoading } = useCampaignsList();
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Touch States for swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Filter active published campaigns
  const activeCampaigns = useMemo(() => {
    const list = campaigns.filter((c: any) => c.status === 'Published');
    return list.sort((a: any, b: any) => a.priority - b.priority);
  }, [campaigns]);

  const currentCampaign = activeCampaigns[activeIndex];

  const handleNext = useCallback(() => {
    if (activeCampaigns.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % activeCampaigns.length);
  }, [activeCampaigns.length]);

  const handlePrev = useCallback(() => {
    if (activeCampaigns.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + activeCampaigns.length) % activeCampaigns.length);
  }, [activeCampaigns.length]);

  // Slideshow auto-rotation logic
  useEffect(() => {
    if (activeCampaigns.length === 0) return;
    
    // Check if CMS autoplay is enabled
    const autoplayEnabled = currentCampaign?.carouselAutoplay ?? true;
    if (isPaused || !autoplayEnabled) return;

    const intervalTime = currentCampaign?.carouselTransitionSpeed || 6000;
    const timer = setInterval(() => {
      handleNext();
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPaused, activeCampaigns.length, currentCampaign, handleNext]);

  // Keyboard navigation listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Mobile Swipe handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  if (isLoading) {
    return (
      <section className="relative w-full lg:w-[98vw] lg:max-w-[1600px] lg:left-1/2 lg:-translate-x-1/2 h-[450px] md:h-[480px] lg:h-[500px] rounded-3xl overflow-hidden shimmer-effect" />
    );
  }

  if (activeCampaigns.length === 0) return null;

  // Features mapping
  const features = [
    { label: 'DELIVERY', value: 'Express shipping' },
    { label: 'WARRANTY', value: 'Official coverage' },
    { label: 'SUPPORT', value: '24/7 Helpline' }
  ];

  return (
    <section 
      className="relative w-full lg:w-[98vw] lg:max-w-[1600px] lg:left-1/2 lg:-translate-x-1/2 transition-all duration-300 z-30 select-none group/hero" 
      id="hero-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Outer Banner Frame */}
      <div className={`w-full h-auto lg:min-h-[480px] rounded-3xl overflow-hidden border border-gray-150/90 dark:border-slate-800/80 shadow-xl relative flex flex-col lg:flex-row transition-all duration-300 ${
        isDarkBackground(currentCampaign) ? 'dark text-white' : ''
      }`}>
        
        {/* Background Gradients */}
        <div className="absolute inset-0 transition-all duration-500 z-0" style={getBackgroundStyle(currentCampaign)} />
        
        {/* Background Image override */}
        {currentCampaign.backgroundImageUrl && (
          <img 
            src={currentCampaign.backgroundImageUrl} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover opacity-15 dark:opacity-10 z-0 pointer-events-none" 
          />
        )}

        {/* Ambient Glow Blobs */}
        {currentCampaign.ambientEffect && (
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none rounded-3xl z-0">
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-200/25 dark:bg-indigo-900/15 rounded-full blur-[110px]" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-200/25 dark:bg-purple-900/15 rounded-full blur-[110px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-150/15 dark:bg-indigo-950/10 rounded-full blur-[130px]" />
          </div>
        )}

        {/* Floating Lights */}
        {currentCampaign.floatingLights && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute top-10 left-10 w-2.5 h-2.5 rounded-full bg-white/40 blur-[1px] animate-pulse-slow" />
            <div className="absolute top-1/3 left-1/2 w-4 h-4 rounded-full bg-white/30 blur-[2px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-12 left-1/4 w-3 h-3 rounded-full bg-white/20 blur-[1px] animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
            <div className="absolute top-1/4 right-12 w-2 h-2 rounded-full bg-white/40 blur-[0.5px] animate-pulse-slow" style={{ animationDelay: '0.5s' }} />
            <div className="absolute bottom-20 right-1/3 w-3 h-3 rounded-full bg-white/35 blur-[1.5px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
          </div>
        )}

        {/* Background Blur Overlay */}
        {currentCampaign.backgroundBlur && currentCampaign.backgroundBlur !== 'none' && (
          <div className={`absolute inset-0 z-0 pointer-events-none ${
            currentCampaign.backgroundBlur === 'high' ? 'backdrop-blur-lg' : currentCampaign.backgroundBlur === 'low' ? 'backdrop-blur-xs' : 'backdrop-blur-md'
          }`} />
        )}

        {/* Content Slider */}
        <div className="w-full h-full relative z-10 flex flex-col lg:flex-row">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCampaign.id}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full flex flex-col lg:flex-row"
            >
              
              {/* LEFT SIDE CONTENT - ORDER 2 ON MOBILE */}
              <div className="w-full lg:w-[52%] flex flex-col items-center lg:items-start text-center lg:text-left justify-center px-6 sm:px-10 lg:px-14 py-8 lg:py-10 order-2 lg:order-1 select-text">
                
                {/* Badge Pill */}
                {currentCampaign.badge && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-indigo-50/80 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100/60 dark:border-indigo-900/30 rounded-full w-fit mb-3">
                    {currentCampaign.badge}
                  </div>
                )}

                {/* Sub-label & Headline */}
                <div className="mb-2">
                  <p className="text-[11px] lg:text-xs font-bold text-slate-455 dark:text-slate-500 uppercase tracking-widest mb-0.5">
                    {currentCampaign.campaignType || 'Featured'}
                  </p>
                  <h1 className="text-2xl sm:text-3xl lg:text-[38px] font-black text-slate-900 dark:text-white leading-[1.15] tracking-tight">
                    {currentCampaign.title || currentCampaign.campaignName}
                  </h1>
                </div>

                {/* Subtitle */}
                {currentCampaign.subtitle && (
                  <p className="text-[13px] sm:text-sm text-slate-550 dark:text-slate-400 max-w-[480px] leading-relaxed mb-4 whitespace-pre-line">
                    {currentCampaign.subtitle}
                  </p>
                )}

                {/* Description */}
                {currentCampaign.description && (
                  <p className="text-xs text-slate-450 dark:text-slate-555 max-w-[460px] leading-relaxed mb-4">
                    {currentCampaign.description}
                  </p>
                )}

                {/* Price Section */}
                {currentCampaign.pricing?.enablePricing && (
                  <div className="mb-4 flex flex-col items-center lg:items-start">
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white">
                        {formatCurrency(currentCampaign.pricing.price)}
                      </span>
                      {currentCampaign.pricing.oldPrice > 0 && (
                        <span className="text-sm lg:text-base text-slate-450 dark:text-slate-500 line-through font-medium">
                          {formatCurrency(currentCampaign.pricing.oldPrice)}
                        </span>
                      )}
                      {currentCampaign.pricing.discount > 0 && (
                        <span className="text-[10px] font-black bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded border border-rose-100/50 dark:border-rose-900/30">
                          {currentCampaign.pricing.discount}% OFF
                        </span>
                      )}
                    </div>
                    {currentCampaign.pricing.savingsAmount > 0 && (
                      <p className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-450 mt-1">
                        Save {formatCurrency(currentCampaign.pricing.savingsAmount)}
                      </p>
                    )}

                    {/* EMI / Bank Offer Badge */}
                    {(currentCampaign.pricing.emiOption || currentCampaign.pricing.bankOffer) && (
                      <div className="flex items-center gap-1 px-2.5 py-1 mt-2.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/30 text-[10px] font-bold text-emerald-700 dark:text-emerald-450 w-fit">
                        <TrendingDown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span>
                          {currentCampaign.pricing.bankOffer || currentCampaign.pricing.emiOption}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* 3 Inline Features */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 mt-1.5 mb-5 border-t border-gray-150/40 dark:border-slate-800/40 pt-4">
                  {features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-white/90 dark:bg-slate-800/80 shadow-sm border border-gray-100/40 dark:border-slate-700/40 flex items-center justify-center flex-shrink-0">
                        {getFeatureIcon(feat.label)}
                      </div>
                      <div className="leading-tight text-[11px] text-left">
                        <p className="font-semibold text-[8px] text-slate-400 dark:text-slate-500 tracking-wider uppercase">{feat.label}</p>
                        <p className="font-bold text-slate-850 dark:text-slate-200">{feat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 relative z-20 w-full sm:w-auto">
                  {currentCampaign.primaryButton?.text && (
                    <Link
                      to={currentCampaign.primaryButton.link || '/products'}
                      className={`w-full sm:w-auto text-center inline-flex items-center justify-center gap-1.5 font-bold text-xs px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer ${
                        currentCampaign.primaryButton.color || 'bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950'
                      }`}
                    >
                      {currentCampaign.primaryButton.text} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                  {currentCampaign.secondaryButton?.text && (
                    <Link
                      to={currentCampaign.secondaryButton.link || '/products'}
                      className={`w-full sm:w-auto text-center inline-flex items-center justify-center gap-1 hover:bg-slate-200/40 dark:hover:bg-slate-800/40 font-bold text-xs px-4 py-2.5 rounded-full border border-slate-200/40 dark:border-slate-700/40 transition-all duration-200 cursor-pointer ${
                        currentCampaign.secondaryButton.color || 'text-slate-750 dark:text-slate-300'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" /> {currentCampaign.secondaryButton.text}
                    </Link>
                  )}
                </div>

              </div>

              {/* RIGHT SIDE PRODUCT AREA - ORDER 1 ON MOBILE */}
              <div className="flex-1 w-full lg:w-[48%] h-[260px] sm:h-[300px] lg:h-auto relative flex items-center justify-center p-6 order-1 lg:order-2">
                
                {/* Large Circular Glow Halo */}
                {currentCampaign.glowIntensity !== 'none' && (
                  <div
                    className="absolute rounded-full border border-indigo-200/20 dark:border-indigo-400/10 blur-[2px] pointer-events-none transition-all duration-500 z-0"
                    style={{
                      width: currentCampaign.glowIntensity === 'high' ? '360px' : currentCampaign.glowIntensity === 'low' ? '240px' : '320px',
                      height: currentCampaign.glowIntensity === 'high' ? '360px' : currentCampaign.glowIntensity === 'low' ? '240px' : '320px',
                      background: `radial-gradient(circle, rgba(165,180,252,${currentCampaign.glowIntensity === 'high' ? 0.28 : currentCampaign.glowIntensity === 'low' ? 0.08 : 0.16}) 0%, transparent 70%)`,
                      boxShadow: currentCampaign.glowIntensity === 'high'
                        ? '0 0 100px rgba(165,180,252,0.4), inset 0 0 50px rgba(165,180,252,0.25)'
                        : currentCampaign.glowIntensity === 'low'
                        ? '0 0 40px rgba(165,180,252,0.12), inset 0 0 20px rgba(165,180,252,0.06)'
                        : '0 0 80px rgba(165,180,252,0.25), inset 0 0 40px rgba(165,180,252,0.15)'
                    }}
                  />
                )}

                {/* Ambient Backlight Reflection */}
                <div className="absolute w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] rounded-full bg-white/60 dark:bg-indigo-950/20 blur-[50px] pointer-events-none z-0" />

                {/* Premium 3D CSS Podium (Only show for product image layouts, not lifestyle banner grids) */}
                {!currentCampaign.videoUrl && !currentCampaign.youtubeUrl && (
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
                )}

                {/* Product Image / Video Floating Container */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative z-10 flex flex-col items-center justify-center w-full h-full"
                >
                  {currentCampaign.videoUrl ? (
                    <div className="w-full h-full max-h-[200px] sm:max-h-[240px] lg:max-h-[300px] rounded-3xl overflow-hidden shadow-2xl border border-gray-200/20 dark:border-slate-800 bg-slate-950 flex items-center justify-center">
                      <video
                        src={currentCampaign.videoUrl}
                        autoPlay={currentCampaign.videoSettings?.videoAutoplay ?? true}
                        loop={currentCampaign.videoSettings?.videoLoop ?? true}
                        muted={currentCampaign.videoSettings?.videoMute ?? true}
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : currentCampaign.youtubeUrl ? (
                    <div className="w-full h-full max-h-[200px] sm:max-h-[240px] lg:max-h-[300px] rounded-3xl overflow-hidden shadow-2xl border border-gray-200/20 dark:border-slate-800 bg-slate-950 flex items-center justify-center text-[10px] font-bold text-gray-400 p-2">
                      <Play className="w-8 h-8 text-rose-500 animate-pulse mr-2" />
                      <span>YouTube Campaign Video Streaming...</span>
                    </div>
                  ) : (
                    <>
                      <CampaignImage
                        src={currentCampaign.heroProductImageUrl || currentCampaign.imageUrl}
                        alt={currentCampaign.title || currentCampaign.campaignName}
                        className="max-h-[190px] sm:max-h-[220px] lg:max-h-[280px] w-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.12)] select-none z-10 transition-transform duration-350 hover:scale-105"
                      />
                      
                      {/* Floating Shadow under the product */}
                      <div className="absolute bottom-[-10px] w-[50%] h-[12px] bg-black/[0.06] dark:bg-black/[0.25] rounded-[50%] blur-md pointer-events-none scale-x-90" />
                    </>
                  )}
                </motion.div>

              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Manual Left/Right Chevrons Controls */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-gray-200/50 dark:border-slate-800/80 shadow hover:bg-white dark:hover:bg-slate-800 hover:scale-115 active:scale-95 cursor-pointer text-text-primary opacity-0 group-hover/hero:opacity-100 transition-all duration-350 hidden lg:flex items-center justify-center"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-gray-200/50 dark:border-slate-800/80 shadow hover:bg-white dark:hover:bg-slate-800 hover:scale-115 active:scale-95 cursor-pointer text-text-primary opacity-0 group-hover/hero:opacity-100 transition-all duration-350 hidden lg:flex items-center justify-center"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Carousel Dots Indicator - Bottom Center/Left */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 lg:left-14 lg:translate-x-0 flex items-center gap-2 z-20">
          {activeCampaigns.map((_, idx) => (
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
