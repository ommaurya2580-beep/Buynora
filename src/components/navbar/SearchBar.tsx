import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mic } from 'lucide-react';
import { productService } from '../../services/product.service';

interface SearchBarProps {
  onVoiceSearchClick: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onVoiceSearchClick }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length > 1) {
        const list = await productService.getSearchSuggestions(searchQuery);
        setSuggestions(list);
      } else {
        setSuggestions([]);
      }
    };
    const debounceTimer = setTimeout(fetchSuggestions, 150);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowSuggestions(false);
    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleSuggestionClick = (text: string) => {
    setSearchQuery(text);
    setShowSuggestions(false);
    navigate(`/products?search=${encodeURIComponent(text)}`);
  };

  return (
    <div ref={containerRef} className="hidden md:block flex-1 max-w-lg mx-6 relative">
      <form onSubmit={handleSubmit} className="relative w-full">
        <input
          type="text"
          placeholder="Search premium electronics, footwear, apparel..."
          value={searchQuery}
          onFocus={() => setShowSuggestions(true)}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-slate-100 dark:bg-slate-800/80 text-gray-900 dark:text-white pl-4 pr-16 py-2.5 rounded-full text-xs border border-transparent focus:border-indigo-500/50 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all duration-200 shadow-inner"
        />
        
        <div className="absolute right-3 top-1.5 flex items-center gap-1.5">
          <button
            type="button"
            onClick={onVoiceSearchClick}
            className="p-1 text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 cursor-pointer transition-colors"
            title="Voice Search"
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            type="submit"
            className="p-1 text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 cursor-pointer transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Suggestions Box */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 rounded-2xl glass shadow-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white dark:bg-slate-900 overflow-hidden z-50">
          <div className="p-2.5 space-y-1">
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(sug)}
                className="w-full text-left text-xs font-semibold px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-gray-700 dark:text-gray-300 rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-gray-400" />
                {sug}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
