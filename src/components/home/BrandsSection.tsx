import React from 'react';
import { Link } from 'react-router-dom';
import { Award } from 'lucide-react';

export const BrandsSection: React.FC = () => {
  const featuredBrands = [
    { name: 'Apple', logo: '', font: 'font-sans font-bold text-2xl text-slate-900 dark:text-white' },
    { name: 'Nike', logo: 'NIKE', font: 'italic font-black text-xl tracking-tight text-slate-800 dark:text-slate-100' },
    { name: 'Sony', logo: 'SONY', font: 'font-mono font-bold tracking-widest text-lg text-slate-950 dark:text-white' },
    { name: 'Samsung', logo: 'SAMSUNG', font: 'font-serif font-black tracking-tight text-blue-900 dark:text-blue-200 text-lg' },
    { name: 'Bose', logo: 'BOSE', font: 'font-sans font-extrabold tracking-widest text-base text-slate-900 dark:text-slate-100' },
    { name: 'Zara', logo: 'ZARA', font: 'font-serif font-normal tracking-[0.2em] text-lg text-slate-900 dark:text-white' },
    { name: 'Adidas', logo: 'adidas', font: 'font-sans font-bold text-lg lowercase text-slate-800 dark:text-slate-200' }
  ];

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-black tracking-tight text-text-primary flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-500" /> Featured Brands
        </h2>
        <p className="text-xs text-text-secondary">Shop authentic products from our licensed global partners</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        {featuredBrands.map((brand, idx) => (
          <Link
            key={idx}
            to={`/products?brand=${encodeURIComponent(brand.name)}`}
            className="flex items-center justify-center h-20 rounded-2xl border border-gray-200 dark:border-gray-800 bg-bg-surface hover:shadow-md hover:border-indigo-500/30 transition-all duration-300 hover:scale-105 active:scale-95 group p-4"
          >
            <span className={`${brand.font} opacity-75 group-hover:opacity-100 transition-opacity select-none`}>
              {brand.logo}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};
