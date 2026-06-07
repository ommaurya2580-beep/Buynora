import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Heart, Bell, Sun, Moon, 
  Menu, X, Sparkles, Globe, ChevronDown, Check
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { logoutUser } from '../redux/authSlice';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../hooks/useToast';
import { VoiceSearch } from '../components/VoiceSearch';
import { NotificationCenter } from '../components/NotificationCenter';
import { ChatWidget } from '../components/ChatWidget';
import { useCategories } from '../hooks/useQueries';
import { UserNotification } from '../types';

// Navbar subcomponents
import { SearchBar } from '../components/navbar/SearchBar';
import { ProfileMenu } from '../components/navbar/ProfileMenu';
import { MegaMenu } from '../components/navbar/MegaMenu';
import { ThemeToggle } from '../components/navbar/ThemeToggle';

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { toggleTheme, isDark } = useTheme();

  const { data: categories = [] } = useCategories();

  // State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedLang, setSelectedLang] = useState('English');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // Redux Selectors
  const { cartItems } = useAppSelector(state => state.cart);
  const wishlistItems = useAppSelector(state => state.wishlist.wishlistItems);
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const notifications = useAppSelector(state => state.notification.notifications);
  const unreadCount = notifications.filter((n: UserNotification) => !n.isRead).length;
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleVoiceSearchResult = (result: string) => {
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
        <div className="bg-gradient-to-r from-[#1F2937] to-[#111827] dark:from-[#2874F0] dark:to-[#1A5ED8] text-white text-xs font-semibold h-[40px] px-4 md:px-8 flex items-center justify-between">
          
          {/* Marquee Container */}
          <div className="flex-1 overflow-hidden relative h-full flex items-center group">
            {/* Left fade gradient */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#1F2937] dark:from-[#2874F0] to-transparent z-10"></div>
            
            <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap">
              {/* First set of items */}
              <div className="flex gap-16 px-8 items-center">
                <span className="flex items-center gap-2 tracking-wide"><Sparkles className="w-4 h-4 text-amber-400" /> Free Shipping Above ₹499</span>
                <span className="tracking-wide">Use Code <span className="font-black text-amber-400 uppercase tracking-wider ml-1">SAVE20</span></span>
                <span className="tracking-wide text-slate-200 dark:text-blue-100">Easy Returns</span>
                <span className="tracking-wide text-slate-200 dark:text-blue-100">24x7 Support</span>
              </div>
              {/* Duplicate set for seamless looping */}
              <div className="flex gap-16 px-8 items-center" aria-hidden="true">
                <span className="flex items-center gap-2 tracking-wide"><Sparkles className="w-4 h-4 text-amber-400" /> Free Shipping Above ₹499</span>
                <span className="tracking-wide">Use Code <span className="font-black text-amber-400 uppercase tracking-wider ml-1">SAVE20</span></span>
                <span className="tracking-wide text-slate-200 dark:text-blue-100">Easy Returns</span>
                <span className="tracking-wide text-slate-200 dark:text-blue-100">24x7 Support</span>
              </div>
            </div>

            {/* Right fade gradient */}
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#111827] dark:from-[#1A5ED8] to-transparent z-10"></div>
          </div>

          {/* Right Section */}
          <div className="hidden sm:flex items-center gap-5 relative z-20 pl-6 border-l border-white/20 ml-4">
            {/* Language Selection */}
            <div className="relative">
              <button 
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)} 
                className="flex items-center gap-1 hover:text-text-inverted cursor-pointer select-none"
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
                      className="flex items-center justify-between text-left text-[11px] px-2 py-1 hover:bg-slate-800 rounded text-slate-300 hover:text-text-inverted cursor-pointer"
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
                  className={`hover:text-text-inverted cursor-pointer font-bold ${selectedCurrency === cur ? 'text-indigo-400' : ''}`}
                >
                  {cur}
                </button>
              ))}
            </div>

            {/* Theme Toggler */}
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          </div>
        </div>

        {/* MAIN BAR: Logo, Menu, Search, Actions */}
        <nav className="glass bg-white/85 dark:bg-slate-900/85 border-b border-gray-200/50 dark:border-gray-800/50 px-4 md:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-black text-primary tracking-tight">
                Buynora
              </span>
            </Link>

            {/* Mega Menu Categories (Desktop) */}
            <MegaMenu categories={categories} />
          </div>

          {/* Search bar with Recommendations */}
          <SearchBar onVoiceSearchClick={() => setIsVoiceSearchOpen(true)} />

          {/* Action Icons Panel */}
          <div className="flex items-center gap-4">
            
            {/* Dark Mode Toggle (Mobile) */}
            <button 
              onClick={toggleTheme}
              className="sm:hidden p-2 rounded-xl text-text-secondary hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notification Center Trigger */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-2.5 rounded-xl text-text-secondary hover:bg-gray-100 dark:hover:bg-slate-800 relative cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-rose-500 text-text-inverted text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center border border-white dark:border-slate-900">
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
              className="p-2.5 rounded-xl text-text-secondary hover:bg-gray-100 dark:hover:bg-slate-800 relative hidden sm:block"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-rose-500 text-text-inverted text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center border border-white dark:border-slate-900">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link
              to="/cart"
              className="p-2.5 rounded-xl text-text-secondary hover:bg-gray-100 dark:hover:bg-slate-800 relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-primary text-text-inverted text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center border border-white dark:border-slate-900">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile / Dashboard Selector */}
            <ProfileMenu user={user} isAuthenticated={isAuthenticated} onLogout={handleLogout} />

            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-text-secondary hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Search/Categories Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden glass border-b border-gray-200 dark:border-gray-800 p-4 bg-bg-surface space-y-4">
            <form 
              onSubmit={e => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const q = fd.get('q') as string;
                if (!q?.trim()) return;
                setIsMobileMenuOpen(false);
                navigate(`/products?search=${encodeURIComponent(q.trim())}`);
              }} 
              className="relative w-full"
            >
              <input
                type="text"
                name="q"
                placeholder="Search..."
                className="w-full bg-slate-100 dark:bg-slate-800 text-text-primary pl-4 pr-12 py-2 rounded-xl text-xs border border-transparent focus:border-indigo-500 focus:bg-white outline-none"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-gray-400">
                <ShoppingBag className="w-4 h-4" />
              </button>
            </form>

            <div className="flex flex-col gap-2.5 text-xs font-bold text-text-secondary">
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
            <span className="text-xl font-black text-text-inverted tracking-tight">Buynora</span>
            <p className="leading-relaxed text-[11px] text-slate-500">
              Providing enterprise-grade modern shopping portals with advanced features, inspired by standard-defining brands like Apple, Nike, and Sony.
            </p>
            <span className="text-[10px] text-slate-600 mt-2">© 2026 Buynora Inc. All rights reserved.</span>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h5 className="font-bold text-text-inverted text-xs uppercase tracking-wider">Shopping</h5>
            <div className="flex flex-col gap-2">
              <Link to="/products" className="hover:text-text-inverted transition-colors">Products Catalog</Link>
              <Link to="/products?discountOnly=true" className="hover:text-text-inverted transition-colors">Flash Sales</Link>
              <Link to="/products?category=Electronics" className="hover:text-text-inverted transition-colors">Smart Devices</Link>
              <Link to="/products?category=Footwear" className="hover:text-text-inverted transition-colors">Athletic Shoes</Link>
            </div>
          </div>

          {/* Policy Pages */}
          <div className="flex flex-col gap-3">
            <h5 className="font-bold text-text-inverted text-xs uppercase tracking-wider">Information</h5>
            <div className="flex flex-col gap-2">
              <Link to="/about" className="hover:text-text-inverted transition-colors">About Us</Link>
              <Link to="/contact" className="hover:text-text-inverted transition-colors">Contact Us</Link>
              <Link to="/faq" className="hover:text-text-inverted transition-colors">FAQ Support</Link>
              <Link to="/privacy" className="hover:text-text-inverted transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-text-inverted transition-colors">Terms & Conditions</Link>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="flex flex-col gap-3">
            <h5 className="font-bold text-text-inverted text-xs uppercase tracking-wider">Join Newsletter</h5>
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
                className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-text-inverted outline-none focus:border-indigo-500 flex-1 w-full"
              />
              <button
                type="submit"
                className="bg-accent hover:bg-accent-hover text-text-inverted text-xs font-bold px-4 py-2 rounded-md cursor-pointer shadow transition-all hover:scale-105 active:scale-95"
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
