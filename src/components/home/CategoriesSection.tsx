import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  image: string;
  itemCount: number;
}

interface CategoriesSectionProps {
  categories: Category[];
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ categories }) => {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-text-primary">Shop by Category</h2>
          <p className="text-xs text-gray-500">Discover premium collections tailored to your lifestyle</p>
        </div>
        <Link to="/products" className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1">
          See All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.map(cat => (
          <Link
            key={cat.id}
            to={`/products?category=${encodeURIComponent(cat.name)}`}
            className="group relative h-40 rounded-md overflow-hidden bg-bg-surface border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent flex flex-col justify-end p-4" />
            <div className="absolute bottom-4 left-4 text-left">
              <span className="text-text-inverted font-bold text-sm tracking-wide block">{cat.name}</span>
              <span className="text-slate-300 text-[10px]">{cat.itemCount}+ Items</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
