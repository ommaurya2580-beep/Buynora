import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mic } from 'lucide-react';
import { useSearchSuggestions } from '../../hooks/useQueries';

interface SearchBarProps {
  onVoiceSearchClick: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onVoiceSearchClick }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 150);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const { data: suggestions = [] } = useSearchSuggestions(debouncedQuery);

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
          className="w-full bg-bg-surface text-text-primary pl-4 pr-16 py-2.5 rounded-md text-xs border border-gray-300 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200"
        />
        
        <div className="absolute right-2 top-1.5 flex items-center gap-1.5">
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
            className="p-1 bg-accent hover:bg-accent-hover text-text-inverted rounded text-sm cursor-pointer transition-colors"
          >
            <Search className="w-5 h-5 p-0.5" />
          </button>
        </div>
      </form>

      {/* Suggestions Box */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 rounded-md shadow-lg border border-gray-200 dark:border-gray-800 bg-bg-surface overflow-hidden z-50">
          <div className="p-2 space-y-1">
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(sug)}
                className="w-full text-left text-xs font-semibold px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-text-secondary rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer"
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
