import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Sparkles, Flame, Clock, Award, Star, 
  RotateCcw, Compass, ArrowLeft, ArrowRight as ArrowRightIcon
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { toggleCompareProduct } from '../redux/cartSlice';
import { products, categories, testimonials, Product } from '../services/mockDb';
import { ProductCard } from '../components/ProductCard';
import { CompareDrawer } from '../components/CompareDrawer';
import { removeCompareProduct, clearCompareProducts } from '../redux/cartSlice';
import { formatCurrency } from '../utils/formatters';
import { useToast } from '../hooks/useToast';

interface HeroSlide {
  title: string;
  subtitle: string;
  image: string;
  link: string;
  actionText: string;
  bgGradient: string;
}

const heroSlides: HeroSlide[] = [
  {
    title: "iPhone 15 Pro",
    subtitle: "Titanium. So strong. So light. So Pro. Experience A17 Pro performance today.",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800",
    link: "/product/p1",
    actionText: "Shop iPhone 15 Pro",
    bgGradient: "from-slate-900 to-indigo-950"
  },
  {
    title: "Nike Air Max 270",
    subtitle: "Like walking on clouds. Engineered with dual-density foam for premium athletics.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
    link: "/product/p2",
    actionText: "Browse Athletic Wear",
    bgGradient: "from-slate-900 to-rose-950"
  },
  {
    title: "Sony WH-1000XM5",
    subtitle: "Industry-leading noise cancelling over-ear headphones with premium High-Resolution audio.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
    link: "/product/p3",
    actionText: "Claim Sony ANC Deals",
    bgGradient: "from-slate-900 to-slate-950"
  }
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const comparedProducts = useAppSelector(state => state.cart.comparedItems);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 34, seconds: 12 });
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // Hero carousel autoplay
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(slideInterval);
  }, []);

  // Flash sale countdown timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 4, minutes: 34, seconds: 12 }; // reset
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch recently viewed items from localStorage
  useEffect(() => {
    const list = localStorage.getItem('recentlyViewed');
    if (list) {
      try {
        const ids: string[] = JSON.parse(list);
        const matched = ids.map(id => products.find(p => p.id === id)).filter(Boolean) as Product[];
        setRecentlyViewed(matched.slice(0, 4));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleCompareToggle = (product: Product) => {
    if (comparedProducts.some(p => p.id === product.id)) {
      dispatch(removeCompareProduct(product.id));
      showToast(`${product.name} removed from comparison list`, 'info');
    } else {
      if (comparedProducts.length >= 3) {
        showToast("You can compare up to 3 products at a time.", 'error');
        return;
      }
      dispatch(toggleCompareProduct(product));
      showToast(`${product.name} added to comparison list!`, 'success');
    }
  };

  // Sections data
  const trending = products.filter(p => p.isTrending).slice(0, 4);
  const flashSale = products.filter(p => p.isFlashSale).slice(0, 4);
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 4);
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);
  const aiRecommended = products.filter(p => p.isAiRecommended).slice(0, 4);

  return (
    <div className="space-y-16 pb-12">
      
      {/* 1. HERO CAROUSEL BANNER */}
      <section className="relative h-[300px] sm:h-[450px] rounded-3xl overflow-hidden shadow-2xl border border-white/5 bg-slate-950">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className={`absolute inset-0 bg-gradient-to-r ${heroSlides[currentSlide].bgGradient} flex flex-col md:flex-row items-center justify-between p-6 md:p-12 gap-8`}
          >
            {/* Slide Information */}
            <div className="flex-1 space-y-4 text-center md:text-left z-10">
              <span className="text-[10px] uppercase bg-indigo-500/20 text-indigo-400 font-extrabold px-3 py-1 rounded-full tracking-widest border border-indigo-500/20">
                Premium Launch
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm max-w-lg leading-relaxed">
                {heroSlides[currentSlide].subtitle}
              </p>
              <div className="pt-2">
                <Link
                  to={heroSlides[currentSlide].link}
                  className="inline-flex items-center gap-2 bg-white hover:bg-gray-150 text-slate-900 font-black text-xs px-6 py-3 rounded-full cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  {heroSlides[currentSlide].actionText} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Slide Image */}
            <div className="w-40 sm:w-80 aspect-square rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex-shrink-0 relative">
              <img
                src={heroSlides[currentSlide].image}
                alt={heroSlides[currentSlide].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel controls */}
        <div className="absolute bottom-6 left-6 md:left-12 flex gap-2 z-20">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                currentSlide === idx ? 'w-8 bg-indigo-500' : 'w-2 bg-white/40'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-gray-900 dark:text-white">Shop by Category</h2>
            <p className="text-xs text-gray-500">Discover premium collections tailored to your lifestyle</p>
          </div>
          <Link to="/products" className="text-xs font-bold text-indigo-500 hover:text-indigo-600 flex items-center gap-1">
            See All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group relative h-40 rounded-2xl overflow-hidden glass border border-gray-200/50 dark:border-gray-800/50 hover:shadow-lg transition-all"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent flex flex-col justify-end p-4" />
              <div className="absolute bottom-4 left-4 text-left">
                <span className="text-white font-bold text-sm tracking-wide block">{cat.name}</span>
                <span className="text-slate-300 text-[10px]">{cat.itemCount}+ Items</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FLASH SALE */}
      <section className="glass p-6 md:p-8 rounded-3xl border border-rose-500/15 relative overflow-hidden bg-rose-500/[0.01]">
        <div className="absolute top-0 right-0 w-[30vw] h-[30vw] bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-rose-500 p-2.5 rounded-2xl text-white shadow-lg shadow-rose-500/20">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase flex items-center gap-2">
                Flash Deals
              </h2>
              <p className="text-xs text-gray-500">Limited quantities. Offers end soon!</p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-1 text-slate-800 dark:text-slate-200 bg-gray-100 dark:bg-slate-800 px-4 py-2 rounded-2xl self-start sm:self-auto border border-gray-200/50 dark:border-gray-700/50 font-mono text-xs">
            <Clock className="w-3.5 h-3.5 text-rose-500 mr-1 animate-pulse" />
            <span className="font-extrabold">{timeLeft.hours.toString().padStart(2, '0')}</span>h :
            <span className="font-extrabold">{timeLeft.minutes.toString().padStart(2, '0')}</span>m :
            <span className="font-extrabold">{timeLeft.seconds.toString().padStart(2, '0')}</span>s
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {flashSale.map(prod => (
            <ProductCard
              key={prod.id}
              product={prod}
              onCompareToggle={handleCompareToggle}
              isCompared={comparedProducts.some(p => p.id === prod.id)}
            />
          ))}
        </div>
      </section>

      {/* 4. TRENDING PRODUCTS */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-500" /> Hot Trending
          </h2>
          <p className="text-xs text-gray-500">Popular items customers are purchasing right now</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {trending.map(prod => (
            <ProductCard
              key={prod.id}
              product={prod}
              onCompareToggle={handleCompareToggle}
              isCompared={comparedProducts.some(p => p.id === prod.id)}
            />
          ))}
        </div>
      </section>

      {/* 5. DYNAMIC OFFERS / BUNDLES */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Apple Bundle */}
        <div className="glass-premium rounded-3xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden bg-slate-900 text-white min-h-[220px]">
          <div className="space-y-2.5 z-10 max-w-xs text-left">
            <span className="text-[10px] uppercase bg-white/10 text-indigo-200 font-extrabold px-2.5 py-0.5 rounded-full">
              Apple Ecosystem
            </span>
            <h3 className="text-lg md:text-2xl font-black">Buy iPhone + MacBook</h3>
            <p className="text-[11px] text-slate-300">
              Get an extra 5% instant discount and standard Apple Care 2-year warranty free.
            </p>
          </div>
          <div className="pt-4 z-10 text-left">
            <button
              onClick={() => {
                navigate('/product/p1');
                showToast("Explore the iPhone 15 Pro, part of our premium bundle!", "info");
              }}
              className="bg-white text-slate-900 text-xs font-bold px-4.5 py-2 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
            >
              Explore Bundle
            </button>
          </div>
          <img
            src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400"
            alt="bundle"
            className="absolute right-[-10%] bottom-[-15%] w-48 h-48 object-cover opacity-60 rounded-full select-none"
          />
        </div>

        {/* Nike Run Bundle */}
        <div className="glass-premium rounded-3xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden bg-rose-950 text-white min-h-[220px]">
          <div className="space-y-2.5 z-10 max-w-xs text-left">
            <span className="text-[10px] uppercase bg-white/10 text-rose-200 font-extrabold px-2.5 py-0.5 rounded-full">
              Nike Run Club
            </span>
            <h3 className="text-lg md:text-2xl font-black">Buy Shoes + Hoodie</h3>
            <p className="text-[11px] text-slate-200">
              Score an additional 15% discount. Use checkout discount code <span className="font-extrabold text-amber-400">WELCOME10</span>.
            </p>
          </div>
          <div className="pt-4 z-10 text-left">
            <button
              onClick={() => {
                navigate('/products?brand=Nike');
                showToast("Filter by Nike brand to find eligible shoes & apparel!", "info");
              }}
              className="bg-white text-rose-950 text-xs font-bold px-4.5 py-2 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
            >
              Explore Bundle
            </button>
          </div>
          <img
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400"
            alt="nike"
            className="absolute right-[-10%] bottom-[-15%] w-48 h-48 object-cover opacity-60 rounded-full select-none"
          />
        </div>

      </section>

      {/* 6. NEW ARRIVALS & BEST SELLERS (Tabs-like Layout) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* New Arrivals */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-indigo-500 animate-spin" /> New Arrivals
            </h3>
            <Link to="/products?sortBy=newest" className="text-xs text-indigo-500 font-semibold hover:underline">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {newArrivals.map(prod => (
              <ProductCard
                key={prod.id}
                product={prod}
                onCompareToggle={handleCompareToggle}
                isCompared={comparedProducts.some(p => p.id === prod.id)}
              />
            ))}
          </div>
        </div>

        {/* Best Sellers */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-1.5">
              <Award className="w-5 h-5 text-amber-500" /> Best Sellers
            </h3>
            <Link to="/products?sortBy=popularity" className="text-xs text-indigo-500 font-semibold hover:underline">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bestSellers.map(prod => (
              <ProductCard
                key={prod.id}
                product={prod}
                onCompareToggle={handleCompareToggle}
                isCompared={comparedProducts.some(p => p.id === prod.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 7. AI RECOMMENDED PRODUCTS */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" /> AI Recommended for You
          </h2>
          <p className="text-xs text-gray-500">Custom recommendations based on search trends and profiles</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {aiRecommended.map(prod => (
            <ProductCard
              key={prod.id}
              product={prod}
              onCompareToggle={handleCompareToggle}
              isCompared={comparedProducts.some(p => p.id === prod.id)}
            />
          ))}
        </div>
      </section>

      {/* 8. RECENTLY VIEWED PRODUCTS */}
      {recentlyViewed.length > 0 && (
        <section className="space-y-6">
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-gray-500" /> Recently Viewed
            </h2>
            <p className="text-xs text-gray-500">Pick up right where you left off</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {recentlyViewed.map(prod => (
              <ProductCard
                key={prod.id}
                product={prod}
                onCompareToggle={handleCompareToggle}
                isCompared={comparedProducts.some(p => p.id === prod.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 9. TESTIMONIALS */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-gray-900 dark:text-white">Customer Reviews</h2>
          <p className="text-xs text-gray-500">Read verified reviews from our client base</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div 
              key={t.id}
              className="glass rounded-2xl p-5 border border-gray-200/50 dark:border-gray-800/50 flex flex-col justify-between text-left h-full"
            >
              <div className="space-y-3">
                <div className="flex items-center text-amber-400 gap-0.5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed italic">
                  "{t.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-150 dark:border-gray-800/50">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-9 h-9 object-cover rounded-full"
                />
                <div>
                  <h5 className="font-bold text-xs text-gray-900 dark:text-white">{t.name}</h5>
                  <span className="text-[10px] text-gray-400">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Global Product Comparison Drawer */}
      <CompareDrawer
        comparedProducts={comparedProducts}
        onRemove={id => dispatch(removeCompareProduct(id))}
        onClear={() => dispatch(clearCompareProducts())}
      />

    </div>
  );
};
