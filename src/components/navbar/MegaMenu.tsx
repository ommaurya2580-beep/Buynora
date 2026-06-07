import React from 'react';
import { Link } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
}

interface MegaMenuProps {
  categories: Category[];
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ categories }) => {
  return (
    <div className="hidden lg:flex items-center gap-6 text-sm font-bold text-text-secondary">
      <Link to="/products" className="hover:text-indigo-500 transition-colors">Shop All</Link>
      {categories.slice(0, 4).map(cat => (
        <Link
          key={cat.id}
          to={`/products?category=${encodeURIComponent(cat.name)}`}
          className="hover:text-indigo-500 transition-colors"
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
};
