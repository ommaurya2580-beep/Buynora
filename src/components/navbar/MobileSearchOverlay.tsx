import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Mic, Camera, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onVoiceClick?: () => void;
}

export const MobileSearchOverlay: React.FC<MobileSearchOverlayProps> = ({ isOpen, onClose, onVoiceClick }) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  
  // Local storage search history
  const [history, setHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('buynora_search_history');
    return saved ? JSON.parse(saved) : ['iPhone 15 Pro', 'Sony Headphones'];
  });

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleSearch = (searchQuery: string) => {
    const q = searchQuery.trim();
    if (!q) return;

    // Save history
    const updated = [q, ...history.filter(item => item !== q)].slice(0, 5);
    setHistory(updated);
    localStorage.setItem('buynora_search_history', JSON.stringify(updated));

    onClose();
    navigate(`/products?search=${encodeURIComponent(q)}`);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('buynora_search_history');
  };

  const trendingSearches = [
    { label: 'Summer Sale', link: '/products?discountOnly=true' },
    { label: 'Nike Shoes', query: 'Nike' },
    { label: 'Smart Watches', query: 'Watch' }
  ];

  const popularCategories = [
    { label: 'Electronics', category: 'Electronics' },
    { label: 'Fashion', category: 'Apparel' },
    { label: 'Home Decor', category: 'Home & Living' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed inset-0 z-[100] bg-bg-primary flex flex-col"
        >
          {/* Header Row */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-200/50 dark:border-slate-800 bg-bg-surface/90 backdrop-blur-md sticky top-0">
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-150 dark:hover:bg-slate-800 text-text-secondary cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <form onSubmit={handleSubmit} className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search premium products..."
                className="w-full bg-slate-100 dark:bg-slate-800 text-text-primary pl-4 pr-10 py-2.5 rounded-xl text-xs border border-transparent focus:border-primary focus:bg-bg-surface outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            <div className="flex items-center gap-1.5">
              <button 
                type="button"
                onClick={() => {
                  onClose();
                  if (onVoiceClick) onVoiceClick();
                }}
                className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl text-text-secondary cursor-pointer"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button 
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/products');
                }}
                className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl text-text-secondary cursor-pointer"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 text-left max-w-lg mx-auto w-full">
            
            {/* Recent Searches */}
            {history.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Recent Searches</h4>
                  <button 
                    onClick={handleClearHistory}
                    className="text-[10px] font-bold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                </div>
                <div className="flex flex-col gap-1.5">
                  {history.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearch(item)}
                      className="flex items-center justify-between text-left text-xs font-bold py-2 px-3 bg-slate-50 dark:bg-slate-900/50 hover:bg-gray-100 dark:hover:bg-slate-800/80 rounded-xl text-text-secondary cursor-pointer"
                    >
                      <span>{item}</span>
                      <Search className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Searches */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Trending Searches</h4>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onClose();
                      if (item.link) navigate(item.link);
                      else if (item.query) navigate(`/products?search=${encodeURIComponent(item.query)}`);
                    }}
                    className="flex items-center gap-1 text-xs font-extrabold px-3.5 py-2 bg-slate-50 dark:bg-slate-900/50 hover:bg-gray-100 dark:hover:bg-slate-800 border border-gray-200/50 dark:border-slate-800 rounded-xl text-text-secondary cursor-pointer"
                  >
                    <span>🔥 {item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Categories */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Popular Categories</h4>
              <div className="grid grid-cols-3 gap-3">
                {popularCategories.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onClose();
                      navigate(`/products?category=${encodeURIComponent(item.category)}`);
                    }}
                    className="flex flex-col items-center justify-center p-3 text-center bg-slate-50 dark:bg-slate-900/50 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-800 cursor-pointer"
                  >
                    <span className="text-[11px] font-bold text-text-primary">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
