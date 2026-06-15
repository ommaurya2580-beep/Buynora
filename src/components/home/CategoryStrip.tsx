import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CategoryItem {
  name: string;
  image: string;
  queryType: 'category' | 'search';
  queryValue: string;
}

export const CategoryStrip: React.FC = () => {
  const navigate = useNavigate();

  const categories: CategoryItem[] = [
    {
      name: 'Men Fashion',
      image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=150',
      queryType: 'search',
      queryValue: 'Men'
    },
    {
      name: 'Women Fashion',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      queryType: 'search',
      queryValue: 'Women'
    },
    {
      name: 'Footwear',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=150',
      queryType: 'category',
      queryValue: 'Footwear'
    },
    {
      name: 'Electronics',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=150',
      queryType: 'category',
      queryValue: 'Electronics'
    },
    {
      name: 'Beauty',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=150',
      queryType: 'search',
      queryValue: 'Beauty'
    },
    {
      name: 'Accessories',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=150',
      queryType: 'category',
      queryValue: 'Accessories'
    },
    {
      name: 'Bags',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=150',
      queryType: 'search',
      queryValue: 'Bag'
    },
    {
      name: 'Watches',
      image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=150',
      queryType: 'search',
      queryValue: 'Watch'
    },
    {
      name: 'Home Decor',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=150',
      queryType: 'category',
      queryValue: 'Home & Living'
    },
    {
      name: 'Sports',
      image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=150',
      queryType: 'search',
      queryValue: 'Sports'
    },
    {
      name: 'Groceries',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=150',
      queryType: 'search',
      queryValue: 'Groceries'
    },
    {
      name: 'Kids',
      image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=150',
      queryType: 'search',
      queryValue: 'Kids'
    }
  ];

  const handleClick = (item: CategoryItem) => {
    if (item.queryType === 'category') {
      navigate(`/products?category=${encodeURIComponent(item.queryValue)}`);
    } else {
      navigate(`/products?search=${encodeURIComponent(item.queryValue)}`);
    }
  };

  return (
    <div className="w-full bg-bg-surface dark:bg-slate-900/40 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-800/80 overflow-hidden">
      <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(cat)}
            className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer snap-start group outline-none"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-0.5 border-2 border-slate-200 dark:border-slate-800 group-hover:border-primary transition-all duration-300 transform group-hover:scale-105 active:scale-95 shadow-md">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover rounded-full"
                loading="lazy"
              />
            </div>
            <span className="text-[10px] md:text-xs font-semibold text-text-primary group-hover:text-primary transition-colors text-center max-w-[80px] truncate">
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
