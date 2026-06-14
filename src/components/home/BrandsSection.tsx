import React from 'react';
import { Link } from 'react-router-dom';
import { Award } from 'lucide-react';

export const BrandsSection: React.FC = () => {
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
      name: 'Nike',
      logo: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 fill-current text-slate-900 dark:text-white transition-colors duration-300">
          <path d="M21 5.5C15 9.5 8 13.5 3 15.5c-1 .4-1.5-.1-.8-.8C5 12 11 7 19.5 3c1-.5 2.5.5 1.5 2.5z"/>
        </svg>
      )
    },
    {
      name: 'Samsung',
      logo: <span className="font-serif font-black tracking-tighter text-blue-700 dark:text-blue-400 text-base md:text-lg">SAMSUNG</span>
    },
    {
      name: 'Bose',
      logo: <span className="font-sans font-extrabold tracking-widest text-xs md:text-sm italic text-slate-900 dark:text-slate-100">BOSE</span>
    },
    {
      name: 'Sony',
      logo: <span className="font-mono font-bold tracking-[0.2em] text-sm md:text-base text-slate-950 dark:text-white">SONY</span>
    },
    {
      name: 'Adidas',
      logo: <span className="font-sans font-bold text-sm md:text-base lowercase text-slate-900 dark:text-slate-100">adidas</span>
    },
    {
      name: 'Puma',
      logo: <span className="font-sans font-black text-base md:text-lg italic tracking-tighter text-slate-900 dark:text-slate-100">PUMA</span>
    },
    {
      name: 'Dell',
      logo: (
        <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-slate-900 dark:border-white font-sans font-black text-[9px] tracking-tighter text-slate-900 dark:text-white">
          DELL
        </div>
      )
    },
    {
      name: 'HP',
      logo: (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-sans font-black text-xs italic">
          hp
        </div>
      )
    },
    {
      name: 'Lenovo',
      logo: (
        <div className="bg-red-600 dark:bg-red-700 text-white font-sans font-black text-[9px] uppercase px-1.5 py-0.5 tracking-wider">
          lenovo
        </div>
      )
    }
  ];

  return (
    <section className="space-y-6 w-full">
      <div>
        <h2 className="text-xl md:text-2xl font-black tracking-tight text-text-primary flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-500" /> Featured Brands
        </h2>
        <p className="text-xs text-text-secondary">Shop authentic products from our licensed global partners</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-4">
        {featuredBrands.map((brand, idx) => (
          <Link
            key={idx}
            to={`/products?brand=${encodeURIComponent(brand.name)}`}
            className="flex items-center justify-center h-20 rounded-2xl border border-gray-200 dark:border-gray-800 bg-bg-surface hover:shadow-lg hover:border-indigo-500/30 transition-all duration-300 hover:scale-108 active:scale-95 group p-2.5"
          >
            <span className="opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 select-none flex items-center justify-center w-full h-full">
              {brand.logo ? brand.logo : <span className="font-bold text-sm text-text-primary">{brand.name}</span>}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};
