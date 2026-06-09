import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  Eye,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Award,
  TrendingDown,
  Flame,
  Zap,
  Gift,
  CreditCard,
  Landmark,
  Package,
  Clock,
  Star,
  ChevronRight,
  Sparkles,
  Users,
  AlertTriangle,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Countdown Timer Hook                                               */
/* ------------------------------------------------------------------ */
function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return { hrs, mins, secs };
}

/* ------------------------------------------------------------------ */
/*  Timer Box                                                          */
/* ------------------------------------------------------------------ */
const TimerBox: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <motion.div
      key={value}
      initial={{ rotateX: -90, opacity: 0 }}
      animate={{ rotateX: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center text-xl sm:text-2xl font-black shadow-lg"
    >
      {String(value).padStart(2, '0')}
    </motion.div>
    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-1.5">{label}</span>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Floating Info Card                                                 */
/* ------------------------------------------------------------------ */
interface FloatingCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
  delay?: number;
}

const FloatingCard: React.FC<FloatingCardProps> = ({ icon, title, subtitle, className = '', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.7, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    className={`absolute hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-white/60 dark:border-slate-700/60 shadow-xl text-xs z-20 ${className}`}
  >
    <span className="flex-shrink-0">{icon}</span>
    <div className="leading-tight">
      <p className="font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap">{title}</p>
      {subtitle && <p className="text-[10px] text-slate-500 dark:text-slate-400 whitespace-nowrap">{subtitle}</p>}
    </div>
  </motion.div>
);

/* ------------------------------------------------------------------ */
/*  Badge Pill                                                         */
/* ------------------------------------------------------------------ */
const Badge: React.FC<{ children: React.ReactNode; variant?: 'default' | 'ai' | 'fire' | 'zap' }> = ({ children, variant = 'default' }) => {
  const variants: Record<string, string> = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    ai: 'bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-700',
    fire: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700',
    zap: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700',
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${variants[variant]}`}>
      {children}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */
export const HeroSection: React.FC = () => {
  const { hrs, mins, secs } = useCountdown(8147); // ~2h 15m 47s

  /* Simulated live viewers with slight jitter */
  const [viewers, setViewers] = useState(214);
  useEffect(() => {
    const id = setInterval(() => {
      setViewers(v => v + Math.floor(Math.random() * 5) - 2);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const [wishlisted, setWishlisted] = useState(false);
  const toggleWishlist = useCallback(() => setWishlisted(w => !w), []);

  return (
    <section className="relative w-full" id="hero-section">
      {/* ============================================================ */}
      {/*  MAIN HERO AREA                                              */}
      {/* ============================================================ */}
      <div
        className="relative w-full rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #F6F3FF 0%, #F4F0FF 40%, #FFFFFF 100%)',
        }}
      >
        {/* --- Dark-mode overlay --- */}
        <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pointer-events-none" />

        {/* --- Subtle radial glow top-right --- */}
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none opacity-40 dark:opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)' }}
        />

        {/* --- Subtle radial glow bottom-left --- */}
        <div
          className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none opacity-30 dark:opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)' }}
        />

        {/* --- AI Personalization Badge (top-left) --- */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-600/10 dark:bg-violet-500/20 backdrop-blur-md border border-violet-300/40 dark:border-violet-500/30"
        >
          <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
          <span className="text-[10px] font-bold text-violet-700 dark:text-violet-300">Recommended For You</span>
          <span className="text-[9px] font-semibold text-violet-500 dark:text-violet-400">• 95% Match</span>
        </motion.div>

        {/* --- Content grid --- */}
        <div className="relative z-10 flex flex-col lg:flex-row min-h-[550px] lg:min-h-[620px]">

          {/* ==== LEFT COLUMN ==== */}
          <div className="flex-shrink-0 lg:w-[45%] flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-10 lg:py-12 order-2 lg:order-1">

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-wrap gap-2 mb-5"
            >
              <Badge>🚀 New Launch</Badge>
              <Badge variant="fire">🔥 Trending Now</Badge>
              <Badge variant="zap">⚡ Limited Time Deal</Badge>
              <Badge variant="ai">🤖 AI Recommended</Badge>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-3"
            >
              Sony WH-1000XM5
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-[550px] leading-relaxed mb-5"
            >
              Industry-leading noise cancellation headphones with premium audio quality and intelligent adaptive sound control.
            </motion.p>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="flex flex-wrap items-center gap-3 mb-5"
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="font-extrabold text-sm text-slate-800 dark:text-white ml-1">4.8</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">(12,540 Reviews)</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-2 py-0.5 rounded-md">
                <Award className="w-3 h-3" /> Amazon's Choice
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-md">
                <Flame className="w-3 h-3" /> Best Seller
              </span>
            </motion.div>

            {/* Price Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex flex-wrap items-end gap-3 mb-3"
            >
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">₹24,999</span>
              <span className="text-base sm:text-lg text-slate-400 line-through font-medium">₹39,999</span>
              <span className="text-xs font-extrabold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-700">
                37% OFF
              </span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.45 }}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-4"
            >
              You Save ₹15,000
            </motion.p>

            {/* Price Drop Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700/50 mb-5 max-w-fit"
            >
              <TrendingDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">📉 Price Dropped Today</p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400">Lowest price in last 30 days</p>
              </div>
            </motion.div>

            {/* Live Demand */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.55 }}
              className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 mb-5"
            >
              <span className="flex items-center gap-1 font-semibold">
                <Flame className="w-3.5 h-3.5 text-orange-500" /> {viewers} people viewing now
              </span>
              <span className="flex items-center gap-1 font-semibold">
                <ShoppingCart className="w-3.5 h-3.5 text-indigo-500" /> 1,240 sold this week
              </span>
              <span className="flex items-center gap-1 font-bold text-orange-600 dark:text-orange-400">
                <Zap className="w-3.5 h-3.5" /> Selling fast
              </span>
            </motion.div>

            {/* Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="mb-6"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Offer Ends In
              </p>
              <div className="flex items-center gap-3">
                <TimerBox value={hrs} label="Hrs" />
                <span className="text-xl font-black text-slate-400 dark:text-slate-500 -mt-4">:</span>
                <TimerBox value={mins} label="Min" />
                <span className="text-xl font-black text-slate-400 dark:text-slate-500 -mt-4">:</span>
                <TimerBox value={secs} label="Sec" />
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.65 }}
              className="flex flex-wrap items-center gap-3 mb-5"
            >
              <Link
                to="/product/p3"
                className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-violet-600/25 hover:shadow-xl hover:shadow-violet-600/30 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" /> Buy Now
              </Link>
              <Link
                to="/product/p3"
                className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-sm px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Eye className="w-4 h-4" /> View Details <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={toggleWishlist}
                className={`inline-flex items-center justify-center w-11 h-11 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${
                  wishlisted
                    ? 'bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-700 text-rose-600 dark:text-rose-400'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-rose-500 hover:border-rose-200'
                } shadow-md hover:shadow-lg`}
                title="Add to Wishlist"
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
              </button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400"
            >
              <span className="flex items-center gap-1"><Truck className="w-3 h-3 text-emerald-500" /> Free Delivery Tomorrow</span>
              <span className="flex items-center gap-1"><RotateCcw className="w-3 h-3 text-blue-500" /> Easy Returns</span>
              <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-violet-500" /> Secure Checkout</span>
              <span className="flex items-center gap-1"><Award className="w-3 h-3 text-amber-500" /> 1 Year Warranty</span>
            </motion.div>
          </div>

          {/* ==== RIGHT COLUMN ==== */}
          <div className="flex-1 lg:w-[55%] relative flex items-center justify-center py-8 lg:py-0 order-1 lg:order-2 min-h-[320px] lg:min-h-0">

            {/* Glowing Ring */}
            <div
              className="absolute w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] lg:w-[420px] lg:h-[420px] rounded-full animate-hero-glow pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(99,102,241,0.08) 50%, transparent 70%)',
                boxShadow: '0 0 80px rgba(139,92,246,0.15), 0 0 160px rgba(99,102,241,0.08)',
              }}
            />

            {/* Stage / Podium */}
            <div
              className="absolute bottom-6 sm:bottom-8 lg:bottom-16 w-[260px] sm:w-[320px] lg:w-[400px] h-4 rounded-[50%] pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse, rgba(139,92,246,0.2) 0%, transparent 70%)',
                filter: 'blur(6px)',
              }}
            />

            {/* Floating Product Image */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative z-10"
            >
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600"
                alt="Sony WH-1000XM5 Premium Headphones"
                className="w-48 sm:w-64 lg:w-80 aspect-square object-cover rounded-3xl animate-hero-float drop-shadow-2xl"
              />
              {/* Reflection */}
              <div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[70%] h-8 rounded-[50%] pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse, rgba(0,0,0,0.1) 0%, transparent 70%)',
                  filter: 'blur(4px)',
                }}
              />
            </motion.div>

            {/* === FLOATING INFO CARDS === */}
            <FloatingCard
              icon={<Users className="w-4 h-4 text-orange-500" />}
              title={`${viewers} Viewing`}
              className="top-[15%] right-[8%] lg:right-[10%]"
              delay={0.6}
            />
            <FloatingCard
              icon={<Package className="w-4 h-4 text-indigo-500" />}
              title="1.2K Sold Today"
              className="top-[35%] right-[2%] lg:right-[3%]"
              delay={0.75}
            />
            <FloatingCard
              icon={<AlertTriangle className="w-4 h-4 text-amber-500" />}
              title="Only 18 Left"
              className="bottom-[32%] right-[5%] lg:right-[6%]"
              delay={0.9}
            />
            <FloatingCard
              icon={<Gift className="w-4 h-4 text-pink-500" />}
              title="Free Gift Included"
              subtitle="Worth ₹2,999"
              className="top-[20%] left-[3%] lg:left-[5%]"
              delay={1.0}
            />
            <FloatingCard
              icon={<TrendingDown className="w-4 h-4 text-emerald-500" />}
              title="Price Dropped"
              subtitle="Lowest in 30 Days"
              className="bottom-[18%] left-[6%] lg:left-[8%]"
              delay={1.1}
            />
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  OFFERS BAR                                                   */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        {[
          { icon: <CreditCard className="w-5 h-5 text-violet-500" />, title: 'Extra 10% Off', subtitle: 'On Prepaid Orders' },
          { icon: <Landmark className="w-5 h-5 text-blue-500" />, title: 'Bank Discount', subtitle: 'Instant Savings' },
          { icon: <Truck className="w-5 h-5 text-emerald-500" />, title: 'Free Delivery', subtitle: 'Tomorrow by 9 PM' },
          { icon: <Gift className="w-5 h-5 text-pink-500" />, title: 'Free Gift', subtitle: 'Worth ₹2,999' },
        ].map((offer, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg border border-white/60 dark:border-slate-700/60 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-default"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              {offer.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{offer.title}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">{offer.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
