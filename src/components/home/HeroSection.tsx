import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

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

export const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(slideInterval);
  }, []);

  return (
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
            <h1 className="text-3xl sm:text-5xl font-black text-text-inverted leading-tight tracking-tight">
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
  );
};
