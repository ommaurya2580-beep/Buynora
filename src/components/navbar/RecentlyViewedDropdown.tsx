import React, { useRef, useEffect, useState } from 'react';
import { RotateCcw, Clock, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface RecentlyViewedItem {
  id: string;
  name: string;
  price: number;
  image: string;
  viewedAt: string;
}

interface RecentlyViewedDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RecentlyViewedDropdown: React.FC<RecentlyViewedDropdownProps> = ({ isOpen, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [recentItems, setRecentItems] = useState<RecentlyViewedItem[]>([]);

  const loadItems = () => {
    const viewed = localStorage.getItem('recentlyViewed');
    if (viewed) {
      try {
        const parsed = JSON.parse(viewed);
        if (parsed.length > 0 && typeof parsed[0] === 'object') {
          setRecentItems(parsed.slice(0, 5));
        } else {
          setRecentItems([]);
        }
      } catch (e) {
        setRecentItems([]);
      }
    } else {
      setRecentItems([]);
    }
  };

  useEffect(() => {
    loadItems();
    window.addEventListener('recentlyViewedUpdated', loadItems);
    return () => {
      window.removeEventListener('recentlyViewedUpdated', loadItems);
    };
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={containerRef}
      className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl glass shadow-2xl border border-gray-200/50 dark:border-gray-800/50 bg-bg-surface overflow-hidden z-[999] pointer-events-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800/50">
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-indigo-500" />
          <h4 className="text-sm font-bold text-text-primary">Recently Viewed Products</h4>
        </div>
      </div>

      {/* List */}
      <div className="max-h-[320px] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800/50">
        {recentItems.length === 0 ? (
          <div className="p-8 text-center text-xs text-text-secondary flex flex-col items-center justify-center gap-2">
            <Clock className="w-8 h-8 text-gray-300 dark:text-gray-700 mb-1" />
            <span>No recently viewed products</span>
          </div>
        ) : (
          recentItems.map((item) => (
            <Link 
              key={item.id} 
              to={`/product/${item.id}`}
              onClick={onClose}
              className="p-4 flex gap-3 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-gray-100 dark:border-gray-800" />
              </div>
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <h5 className="text-xs font-bold text-text-primary truncate">
                  {item.name}
                </h5>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-extrabold">
                    {formatCurrency(item.price)}
                  </span>
                  <span className="text-[9px] text-gray-400 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {formatDate(item.viewedAt)}
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Footer */}
      {recentItems.length > 0 && (
        <div className="p-3 border-t border-gray-100 dark:border-gray-800/50 bg-gray-50 dark:bg-slate-900">
          <Link 
            to="/products"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 text-xs font-bold text-text-primary py-2 hover:text-indigo-500 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            View All
          </Link>
        </div>
      )}
    </div>
  );
};
