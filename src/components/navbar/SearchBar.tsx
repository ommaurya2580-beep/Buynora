import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mic, Camera, Clock, X, TrendingUp, Folder, ArrowRight } from 'lucide-react';
import { useSearchSuggestions, useProducts, useCategories } from '../../hooks/useQueries';
import { useToast } from '../../hooks/useToast';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../types';

interface SearchBarProps {
  onVoiceSearchClick: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onVoiceSearchClick }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load recent searches on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('buynora_recent_searches');
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      } else {
        const defaults = ['Smartwatch', 'Wireless Earbuds', 'Leather Jacket'];
        setRecentSearches(defaults);
        localStorage.setItem('buynora_recent_searches', JSON.stringify(defaults));
      }
    } catch (e) {
      console.error('Failed to load recent searches', e);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 150);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Fetch data
  const { data: suggestions = [] } = useSearchSuggestions(debouncedQuery);
  const { data: categoriesData } = useCategories();
  const { data: productsData } = useProducts({
    search: debouncedQuery,
    limit: 5
  });

  const matchingProducts = productsData?.products || [];
  const matchingCategories = categoriesData?.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 3) || [];

  // Hide dropdown when clicking outside
  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  const saveSearchTerm = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...recentSearches.filter(s => s !== trimmed)].slice(0, 6);
    setRecentSearches(updated);
    localStorage.setItem('buynora_recent_searches', JSON.stringify(updated));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    saveSearchTerm(searchQuery);
    setShowSuggestions(false);
    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleSuggestionClick = (text: string) => {
    setSearchQuery(text);
    saveSearchTerm(text);
    setShowSuggestions(false);
    navigate(`/products?search=${encodeURIComponent(text)}`);
  };

  const handleCategoryClick = (categoryName: string) => {
    saveSearchTerm(categoryName);
    setShowSuggestions(false);
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  const handleProductClick = (product: Product) => {
    saveSearchTerm(product.name);
    setShowSuggestions(false);
    navigate(`/products/${product.id}`);
  };

  const handleDeleteRecent = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter(s => s !== text);
    setRecentSearches(updated);
    localStorage.setItem('buynora_recent_searches', JSON.stringify(updated));
  };

  const handleClearAllRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.setItem('buynora_recent_searches', JSON.stringify([]));
  };

  const handleImageSearchClick = () => {
    setIsScanning(true);
    // Simulate image scanning
    setTimeout(() => {
      setIsScanning(false);
      const matchedTerm = 'Premium Wireless Earbuds';
      setSearchQuery(matchedTerm);
      saveSearchTerm(matchedTerm);
      setShowSuggestions(false);
      showToast('Visual Search Found: Premium Wireless Earbuds (98% match)', 'success');
      navigate(`/products?search=${encodeURIComponent(matchedTerm)}`);
    }, 2000);
  };

  const trendingSearches = [
    'MacBook Pro',
    'Noise Cancelling Headphones',
    'Smart Fitness Tracker',
    'Mechanical Keyboard',
    'Designer Sneakers'
  ];

  return (
    <div ref={containerRef} className="hidden md:block flex-1 max-w-2xl mx-6 relative">
      <form onSubmit={handleSubmit} className="relative w-full">
        <input
          type="text"
          placeholder="Search premium electronics, footwear, apparel..."
          value={searchQuery}
          onFocus={() => setShowSuggestions(true)}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-bg-surface text-text-primary pl-4 pr-24 py-2.5 rounded-lg text-xs border border-gray-300 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200 shadow-sm"
        />
        
        <div className="absolute right-2 top-1.5 flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleImageSearchClick}
            className="p-1 text-gray-400 hover:text-primary cursor-pointer transition-colors"
            title="Image Search"
          >
            <Camera className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onVoiceSearchClick}
            className="p-1 text-gray-400 hover:text-primary cursor-pointer transition-colors"
            title="Voice Search"
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            type="submit"
            className="p-2 bg-white/10 dark:bg-slate-800/30 backdrop-blur-md border border-gray-300/30 dark:border-slate-700/30 hover:bg-[#00D9A6]/10 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,217,166,0.45)] hover:scale-105 active:scale-95 group flex items-center justify-center"
            title="Search"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#00D9A6] group-hover:text-[#38FFD3] transition-colors duration-300">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </button>
        </div>
      </form>

      {/* Suggestions Box */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-0 right-0 mt-2 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-800 bg-bg-surface/95 backdrop-blur-md overflow-hidden z-50 p-4 max-h-[480px] overflow-y-auto"
          >
            {searchQuery.trim() === '' ? (
              <div className="space-y-4">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Recent Searches
                      </h4>
                      <button
                        onClick={handleClearAllRecent}
                        className="text-[10px] text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {recentSearches.map((term, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSuggestionClick(term)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/40 text-text-primary text-[11px] font-medium rounded-full cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <span>{term}</span>
                          <button
                            onClick={(e) => handleDeleteRecent(e, term)}
                            className="p-0.5 text-gray-400 hover:text-red-500 rounded-full"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Searches */}
                <div>
                  <h4 className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1 mb-2">
                    <TrendingUp className="w-3 h-3" /> Trending Searches
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {trendingSearches.map((term, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(term)}
                        className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/40 text-text-primary text-[11px] font-medium rounded-full cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Category Suggestions */}
                {matchingCategories.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1 mb-2">
                      <Folder className="w-3 h-3" /> Match Categories
                    </h4>
                    <div className="space-y-1">
                      {matchingCategories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleCategoryClick(cat.name)}
                          className="w-full text-left text-xs font-semibold px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-text-primary rounded-lg flex items-center justify-between transition-colors cursor-pointer group"
                        >
                          <span className="flex items-center gap-2">
                            <Folder className="w-3.5 h-3.5 text-gray-400" />
                            <span>In <strong className="text-primary">{cat.name}</strong></span>
                          </span>
                          <span className="text-[10px] text-gray-400 group-hover:text-primary transition-colors flex items-center gap-0.5">
                            Browse items <ArrowRight className="w-3 h-3" />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product Suggestions */}
                {matchingProducts.length > 0 ? (
                  <div>
                    <h4 className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1 mb-2">
                      <Search className="w-3 h-3" /> Matching Products
                    </h4>
                    <div className="space-y-2">
                      {matchingProducts.map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => handleProductClick(prod)}
                          className="w-full text-left text-xs px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg flex items-center gap-3 transition-colors cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-slate-800"
                        >
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-slate-100 flex-shrink-0">
                            <img
                              src={prod.images[0]}
                              alt={prod.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] text-gray-400 font-medium">{prod.brand}</div>
                            <div className="font-semibold text-text-primary truncate text-xs">{prod.name}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-text-primary">${prod.price}</div>
                            {prod.discountPercentage > 0 && (
                              <div className="text-[10px] text-emerald-500 font-medium">-{prod.discountPercentage}%</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  debouncedQuery.length > 1 && (
                    <div className="text-center py-4 text-xs text-text-secondary">
                      No matching products found
                    </div>
                  )
                )}

                {/* Auto-suggested text matches */}
                {suggestions.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1 mb-1">
                      Related Search Terms
                    </h4>
                    <div className="space-y-0.5">
                      {suggestions.slice(0, 3).map((sug, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(sug)}
                          className="w-full text-left text-xs px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-text-secondary rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <Search className="w-3 h-3 text-gray-400" />
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Scanner Simulator Overlay */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass border border-white/20 p-6 rounded-2xl max-w-sm w-full text-center relative overflow-hidden bg-slate-900/80 text-white"
            >
              {/* Floating ambient light */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

              <h3 className="text-lg font-bold mb-1 flex items-center justify-center gap-2">
                <Camera className="w-5 h-5 text-purple-400" /> Visual Search AI
              </h3>
              <p className="text-xs text-slate-300 mb-6">Scanning image for matching products...</p>

              {/* Viewfinder simulation */}
              <div className="w-48 h-48 mx-auto rounded-xl border-2 border-dashed border-purple-500/50 relative overflow-hidden bg-slate-950 flex items-center justify-center mb-6">
                <img
                  src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=300"
                  alt="Earbuds"
                  className="w-40 h-40 object-cover rounded-lg opacity-80"
                />
                
                {/* Scanner Laser line */}
                <motion.div
                  initial={{ top: '0%' }}
                  animate={{ top: '100%' }}
                  transition={{
                    repeat: Infinity,
                    repeatType: 'reverse',
                    duration: 1.5,
                    ease: 'easeInOut'
                  }}
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-[0_0_10px_#c084fc] z-10"
                />
                
                {/* Corners of Viewfinder */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-purple-400" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-purple-400" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-purple-400" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-purple-400" />
              </div>

              {/* Progress and status */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold px-2">
                  <span>Uploading Image</span>
                  <span className="text-purple-400 animate-pulse">Analyzing...</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.8, ease: 'easeInOut' }}
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsScanning(false)}
                className="mt-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancel Scan
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
