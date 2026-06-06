import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, Heart, Bell, User, Search, Mic, Sun, Moon, 
  Menu, X, Sparkles, LogOut, Shield, Briefcase, ChevronDown, Check, Globe
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { logoutUser } from '../redux/authSlice';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../hooks/useToast';
import { formatCurrency } from '../utils/formatters';
import { apiService } from '../services/api';
import { VoiceSearch } from '../components/VoiceSearch';
import { NotificationCenter } from '../components/NotificationCenter';
import { ChatWidget } from '../components/ChatWidget';
import { categories } from '../services/mockDb';

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { theme, toggleTheme, isDark } = useTheme();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedLang, setSelectedLang] = useState('English');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const profileContainerRef = useRef<HTMLDivElement>(null);

  // Redux Selectors
  const { cartItems, wishlistItems } = useAppSelector(state => state.cart);
  const { user, isAuthenticated, notifications } = useAppSelector(state => state.auth);
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Search recommendations hook
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length > 1) {
        const list = await apiService.getSearchSuggestions(searchQuery);
        setSuggestions(list);
      } else {
        setSuggestions([]);
      }
    };
    const debounceTimer = setTimeout(fetchSuggestions, 150);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Click outside hooks
  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
      if (profileContainerRef.current && !profileContainerRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
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

  const handleVoiceSearchResult = (result: string) => {
    setSearchQuery(result);
    showToast(`Voice Search recognized: "${result}"`, 'success');
    navigate(`/products?search=${encodeURIComponent(result)}`);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    showToast("Successfully logged out!", "info");
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-secondary flex flex-col justify-between">
      {/* DOUBLE DECKER NAVBAR */}
      <header className="sticky top-0 z-50 w-full">
        {/* TOP PANEL: Promo Ticker, Lang, Currency, Dark Mode */}
        <div className="bg-slate-900 text-slate-300 text-[11px] font-medium py-2 px-4 md:px-8 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-1.5 text-white/90">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Summer Sale: Extra 20% off on Nike Air Max! Use code <span className="font-bold text-amber-400">SAVE20</span></span>
          </div>

          <div className="hidden sm:flex items-center gap-5 relative">
            {/* Language Selection */}
            <div className="relative">
              <button 
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)} 
                className="flex items-center gap-1 hover:text-white cursor-pointer select-none"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{selectedLang}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 bg-slate-950 border border-slate-800 rounded-lg p-1.5 w-28 flex flex-col gap-1 shadow-xl z-50">
                  {['English', 'Español', 'Deutsch'].map(lang => (
                    <button
                      key={lang}
                      onClick={() => {
                        setSelectedLang(lang);
                        setIsLangDropdownOpen(false);
                        showToast(`Language set to ${lang}`, 'info');
                      }}
                      className="flex items-center justify-between text-left text-[11px] px-2 py-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white cursor-pointer"
                    >
                      {lang} {selectedLang === lang && <Check className="w-3 h-3 text-indigo-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Currency Selector */}
            <div className="flex gap-2">
              {['USD', 'EUR', 'GBP', 'INR'].map(cur => (
                <button
                  key={cur}
                  onClick={() => {
                    setSelectedCurrency(cur);
                    localStorage.setItem('currency', cur);
                    // Dispatch custom event to tell pages to re-render currency
                    window.dispatchEvent(new Event('currencyChange'));
                  }}
                  className={`hover:text-white cursor-pointer font-bold ${selectedCurrency === cur ? 'text-indigo-400' : ''}`}
                >
                  {cur}
                </button>
              ))}
            </div>

            {/* Theme Toggler */}
            <button 
              onClick={toggleTheme}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* MAIN BAR: Logo, Menu, Search, Actions */}
        <nav className="glass bg-white/85 dark:bg-slate-900/85 border-b border-gray-200/50 dark:border-gray-800/50 px-4 md:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
                Buynora
              </span>
            </Link>

            {/* Mega Menu Categories (Desktop) */}
            <div className="hidden lg:flex items-center gap-6 text-sm font-bold text-gray-700 dark:text-gray-300">
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
          </div>

          {/* Search bar with Recommendations */}
          <div ref={searchContainerRef} className="hidden md:block flex-1 max-w-lg mx-6 relative">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
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
                  onClick={() => setIsVoiceSearchOpen(true)}
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

          {/* Action Icons Panel */}
          <div className="flex items-center gap-4">
            
            {/* Dark Mode Toggle (Mobile) */}
            <button 
              onClick={toggleTheme}
              className="sm:hidden p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notification Center Trigger */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 relative cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-rose-500 text-white text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center border border-white dark:border-slate-900">
                    {unreadCount}
                  </span>
                )}
              </button>
              <NotificationCenter 
                isOpen={isNotificationOpen} 
                onClose={() => setIsNotificationOpen(false)} 
              />
            </div>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 relative hidden sm:block"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-rose-500 text-white text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center border border-white dark:border-slate-900">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link
              to="/cart"
              className="p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-indigo-600 text-white text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center border border-white dark:border-slate-900">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile / Dashboard Selector */}
            <div ref={profileContainerRef} className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="p-1 rounded-full border-2 border-transparent hover:border-indigo-500/30 overflow-hidden cursor-pointer h-9 w-9"
              >
                <img
                  src={isAuthenticated && user?.avatar ? user.avatar : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"}
                  alt="avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl glass shadow-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white dark:bg-slate-900 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-800/50">
                    <h5 className="text-xs font-bold text-gray-900 dark:text-white">
                      {isAuthenticated ? user?.name : "Welcome Guest"}
                    </h5>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                      {isAuthenticated ? user?.email : "Sign in to manage orders"}
                    </p>
                  </div>
                  
                  <div className="p-2.5 space-y-1">
                    {isAuthenticated ? (
                      <>
                        <Link
                          to="/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 text-xs font-semibold px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                        >
                          <User className="w-4 h-4 text-gray-400" />
                          User Dashboard
                        </Link>
                        
                        <Link
                          to="/seller"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 text-xs font-semibold px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                        >
                          <Briefcase className="w-4 h-4 text-gray-400" />
                          Seller Dashboard
                        </Link>

                        <Link
                          to="/admin"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 text-xs font-semibold px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                        >
                          <Shield className="w-4 h-4 text-gray-400" />
                          Admin Dashboard
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-2.5 text-xs font-semibold px-3.5 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 rounded-lg transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </>
                    ) : (
                      <Link
                        to="/auth/login"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 text-xs font-bold px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-center justify-center transition-all"
                      >
                        Sign In / Register
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Search/Categories Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden glass border-b border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-slate-900 space-y-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-gray-900 dark:text-white pl-4 pr-12 py-2 rounded-xl text-xs border border-transparent focus:border-indigo-500 focus:bg-white outline-none"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-gray-400">
                <Search className="w-4 h-4" />
              </button>
            </form>

            <div className="flex flex-col gap-2.5 text-xs font-bold text-gray-700 dark:text-gray-300">
              <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-gray-100 dark:border-gray-800/50">Shop All</Link>
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  to={`/products?category=${encodeURIComponent(cat.name)}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2 border-b border-gray-100 dark:border-gray-800/50"
                >
                  {cat.name}
                </Link>
              ))}
              <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-gray-100 dark:border-gray-800/50">Wishlist</Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Outlet */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* About Column */}
          <div className="flex flex-col gap-3">
            <span className="text-xl font-black text-white tracking-tight">Buynora</span>
            <p className="leading-relaxed text-[11px] text-slate-500">
              Providing enterprise-grade modern shopping portals with advanced features, inspired by standard-defining brands like Apple, Nike, and Sony.
            </p>
            <span className="text-[10px] text-slate-600 mt-2">© 2026 Buynora Inc. All rights reserved.</span>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider">Shopping</h5>
            <div className="flex flex-col gap-2">
              <Link to="/products" className="hover:text-white transition-colors">Products Catalog</Link>
              <Link to="/products?discountOnly=true" className="hover:text-white transition-colors">Flash Sales</Link>
              <Link to="/products?category=Electronics" className="hover:text-white transition-colors">Smart Devices</Link>
              <Link to="/products?category=Footwear" className="hover:text-white transition-colors">Athletic Shoes</Link>
            </div>
          </div>

          {/* Policy Pages */}
          <div className="flex flex-col gap-3">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider">Information</h5>
            <div className="flex flex-col gap-2">
              <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
              <Link to="/faq" className="hover:text-white transition-colors">FAQ Support</Link>
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="flex flex-col gap-3">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider">Join Newsletter</h5>
            <p className="leading-relaxed text-[11px] text-slate-500">
              Subscribe to receive price drops, flash coupons, and customized product recommendations.
            </p>
            <form 
              onSubmit={e => {
                e.preventDefault();
                showToast("Subscribed to Newsletter!", "success");
              }}
              className="flex gap-2 mt-2"
            >
              <input
                type="email"
                required
                placeholder="Enter email address"
                className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-indigo-500 flex-1 w-full"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer shadow transition-all hover:scale-105 active:scale-95"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </footer>

      {/* Voice Search Modal */}
      <VoiceSearch
        isOpen={isVoiceSearchOpen}
        onClose={() => setIsVoiceSearchOpen(false)}
        onSearchResult={handleVoiceSearchResult}
      />

      {/* Floating Chatbot Widget */}
      <ChatWidget />
    </div>
  );
};
