import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award } from 'lucide-react';

export const BrandsSection: React.FC = () => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('buynora_brands_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (_) {}
    }
    return { autoplay: true, speed: 20 }; // default settings
  });

  useEffect(() => {
    const handleSettingsChange = () => {
      const saved = localStorage.getItem('buynora_brands_settings');
      if (saved) {
        try {
          setSettings(JSON.parse(saved));
        } catch (_) {}
      }
    };
    window.addEventListener('buynora_brands_settings_changed', handleSettingsChange);
    return () => {
      window.removeEventListener('buynora_brands_settings_changed', handleSettingsChange);
    };
  }, []);

  const featuredBrands = [
    {
      name: 'Apple',
      logo: (
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current text-slate-900 dark:text-white transition-colors duration-300">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-1.01 2.94.96.08 2.18-.52 2.84-1.33"/>
        </svg>
      )
    },
    {
      name: 'Samsung',
      logo: <span className="font-serif font-black tracking-tight text-[#1428A0] text-[13px] sm:text-sm md:text-base">SAMSUNG</span>
    },
    {
      name: 'Sony',
      logo: <span className="font-mono font-bold tracking-[0.2em] text-[11px] sm:text-xs md:text-sm text-slate-950 dark:text-white">SONY</span>
    },
    {
      name: 'Nike',
      logo: (
        <svg viewBox="0 0 24 24" className="w-10 h-10 fill-current text-[#F36B21] transition-colors duration-300">
          <path d="M21 5.5C15 9.5 8 13.5 3 15.5c-1 .4-1.5-.1-.8-.8C5 12 11 7 19.5 3c1-.5 2.5.5 1.5 2.5z"/>
        </svg>
      )
    },
    {
      name: 'Adidas',
      logo: <span className="font-sans font-bold text-xs sm:text-sm lowercase text-slate-900 dark:text-slate-100">adidas</span>
    },
    {
      name: 'Puma',
      logo: <span className="font-sans font-black text-xs sm:text-sm italic tracking-tighter text-slate-900 dark:text-slate-150">PUMA</span>
    },
    {
      name: 'HP',
      logo: (
        <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0096D6] text-white font-sans font-black text-[10px] sm:text-xs italic">
          hp
        </div>
      )
    },
    {
      name: 'Dell',
      logo: (
        <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#007DB8] font-sans font-black text-[8px] sm:text-[9px] tracking-tighter text-[#007DB8]">
          DELL
        </div>
      )
    },
    {
      name: 'Lenovo',
      logo: (
        <div className="bg-[#E11D48] text-white font-sans font-black text-[8px] sm:text-[9px] uppercase px-1.5 py-0.5 tracking-wider">
          lenovo
        </div>
      )
    },
    {
      name: 'Asus',
      logo: <span className="font-sans font-black tracking-tight text-[#00539B] text-xs sm:text-sm italic">ASUS</span>
    },
    {
      name: 'Boat',
      logo: (
        <span className="font-sans font-bold text-xs sm:text-sm tracking-tighter text-slate-900 dark:text-white">
          bo<span className="text-red-600 font-black">At</span>
        </span>
      )
    },
    {
      name: 'JBL',
      logo: <span className="font-sans font-black italic tracking-tighter text-[#FF6600] text-xs sm:text-sm md:text-base">JBL</span>
    },
    {
      name: 'LG',
      logo: (
        <div className="flex items-center gap-0.5">
          <div className="w-4.5 h-4.5 rounded-full border border-[#A50034] flex items-center justify-center text-[#A50034] font-black text-[7px] relative">
            <span className="absolute left-[2px] top-[1px]">L</span>
            <span className="absolute right-[2px] bottom-[1px]">G</span>
          </div>
          <span className="font-sans font-bold text-[#A50034] text-[10px] sm:text-xs">LG</span>
        </div>
      )
    },
    {
      name: 'Canon',
      logo: <span className="font-serif font-black tracking-tight text-[#C51118] text-xs sm:text-sm italic">Canon</span>
    },
    {
      name: 'Bose',
      logo: <span className="font-sans font-extrabold tracking-widest text-[9px] sm:text-[10px] md:text-xs italic text-slate-900 dark:text-slate-100">BOSE</span>
    },
    {
      name: 'OnePlus',
      logo: (
        <div className="flex items-center gap-0.5 bg-[#EB0028] text-white px-1.5 py-0.5 font-sans font-black text-[7px] sm:text-[8px] tracking-tight">
          ONEPLUS
        </div>
      )
    }
  ];

  return (
    <section className="space-y-4 w-full">
      <div>
        <h2 className="text-xl md:text-2xl font-black tracking-tight text-text-primary flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-550" /> Featured Brands
        </h2>
        <p className="text-xs text-text-secondary">Shop authentic products from our licensed global partners</p>
      </div>

      <div className="relative w-full overflow-hidden py-4 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-gray-150 dark:border-slate-800/80">
        {/* Left/Right Fading Shadows for Premium Look */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-bg-primary to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-bg-primary to-transparent z-10 pointer-events-none" />

        <div
          className={`flex w-max gap-4 ${
            settings.autoplay ? 'animate-marquee' : ''
          } ${settings.pauseOnHover ? 'hover:[animation-play-state:paused]' : ''}`}
          style={{
            animation: settings.autoplay ? `marquee ${settings.speed}s linear infinite` : 'none',
            animationPlayState: 'running',
          }}
        >
          {/* Double the list to loop seamlessly */}
          {[...featuredBrands, ...featuredBrands].map((brand, idx) => (
            <Link
              key={idx}
              to={`/products?brand=${encodeURIComponent(brand.name)}`}
              className="flex items-center justify-center w-[78px] sm:w-[112px] lg:w-[104px] h-14 sm:h-16 rounded-2xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-[0_8px_30px_rgba(99,102,241,0.08)] dark:hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] hover:border-indigo-500/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1 group px-2 flex-shrink-0"
            >
              <div className="opacity-75 group-hover:opacity-100 transition-all duration-300 filter grayscale group-hover:grayscale-0 flex items-center justify-center w-full h-full">
                {brand.logo}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
