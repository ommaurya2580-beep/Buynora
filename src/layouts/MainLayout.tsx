import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, Heart, Bell, Sun, Moon, 
  Menu, X, Sparkles, Globe, ChevronDown, Check,
  RotateCcw, Truck, Tag, RefreshCcw, HeadphonesIcon,
  MapPin, Navigation, Plus
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
import { RecentlyViewedDropdown } from '../components/navbar/RecentlyViewedDropdown';

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { toggleTheme, isDark } = useTheme();

  const { data: categories = [] } = useCategories();

  // State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isRecentlyViewedOpen, setIsRecentlyViewedOpen] = useState(false);
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(() => localStorage.getItem('currency') || 'INR');
  const [selectedLang, setSelectedLang] = useState('English');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // Redux Selectors
  const { cartItems } = useAppSelector(state => state.cart);
  const wishlistItems = useAppSelector(state => state.wishlist.wishlistItems);
  const { user, isAuthenticated, addresses = [] } = useAppSelector(state => state.auth);
  const notifications = useAppSelector(state => state.notification.notifications);
  const unreadCount = notifications.filter((n: UserNotification) => !n.isRead).length;
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Delivery Location Selector States
  const defaultAddress = addresses.find((a: any) => a.isDefault) || addresses[0];
  const [selectedAddress, setSelectedAddress] = useState<any>(() => {
    const saved = localStorage.getItem('buynora_selected_address');
    if (saved) return JSON.parse(saved);
    return defaultAddress || { id: 'default', name: 'Select Location', city: 'Select Delivery Location', line1: '', state: '' };
  });
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  // Sync with default address when loaded
  useEffect(() => {
    if (addresses.length > 0 && selectedAddress?.id === 'default') {
      const def = addresses.find((a: any) => a.isDefault) || addresses[0];
      setSelectedAddress(def);
      localStorage.setItem('buynora_selected_address', JSON.stringify(def));
    }
  }, [addresses, selectedAddress]);

  // Close on click outside
  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(e.target as Node)) {
        setIsLocationDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  const handleSelectAddress = (addr: any) => {
    setSelectedAddress(addr);
    localStorage.setItem('buynora_selected_address', JSON.stringify(addr));
    setIsLocationDropdownOpen(false);
    showToast(`Delivery location set to ${addr.city}`, 'success');
  };

  const handleUseCurrentLocation = () => {
    const mockAddr = { id: 'current', name: 'Current Location', city: 'Varanasi', line1: 'Assi Ghat Road', state: 'Uttar Pradesh' };
    handleSelectAddress(mockAddr);
  };

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
    <div className="min-h-screen bg-bg-secondary flex flex-col justify-between">
      {/* DOUBLE DECKER NAVBAR */}
      <header className="sticky top-0 z-50 w-full">
        {/* TOP PANEL: Promo Ticker, Lang, Currency, Dark Mode */}
        <div className="bg-[#1F2937] dark:bg-[#131921] text-white h-[40px] px-4 md:px-8 flex items-center justify-between border-b border-white/5">

          {/* Marquee Container */}
          <div className="flex-1 overflow-hidden relative h-full flex items-center group">
            {/* Left fade */}
            <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-[#1F2937] dark:from-[#131921] to-transparent z-10 pointer-events-none" />

            <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap">
              {[0, 1].map(i => (
                <div key={i} className="flex items-center gap-0 px-6" aria-hidden={i === 1}>

                  <span className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-slate-200">
                    <Truck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    Free Shipping above
                    <span className="text-white font-bold">₹499</span>
                  </span>

                  <span className="mx-6 text-white/15 text-lg leading-none select-none">·</span>

                  <span className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-slate-200">
                    <Tag className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    Use code
                    <span className="font-black text-amber-400 tracking-widest uppercase bg-amber-400/10 px-1.5 py-0.5 rounded text-[10px]">SAVE20</span>
                    for extra 20% off
                  </span>

                  <span className="mx-6 text-white/15 text-lg leading-none select-none">·</span>

                  <span className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-slate-200">
                    <RefreshCcw className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                    <span className="text-white font-semibold">Easy</span> 30-day Returns
                  </span>

                  <span className="mx-6 text-white/15 text-lg leading-none select-none">·</span>

                  <span className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-slate-200">
                    <HeadphonesIcon className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    <span className="text-white font-semibold">24×7</span> Customer Support
                  </span>

                  <span className="mx-6 text-white/15 text-lg leading-none select-none">·</span>

                </div>
              ))}
            </div>

            {/* Right fade */}
            <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[#1F2937] dark:from-[#131921] to-transparent z-10 pointer-events-none" />
          </div>

          {/* Right Section */}
          <div className="hidden sm:flex items-center gap-4 relative z-20 pl-5 border-l border-white/10 ml-4 text-[11px] font-medium text-slate-300">
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

            {/* Delivery Location Selector */}
            <div className="relative text-left" ref={locationDropdownRef}>
              <button 
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)} 
                className="flex items-center gap-1.5 hover:text-text-inverted cursor-pointer select-none py-1 px-2.5 rounded-lg hover:bg-white/5 transition-all text-slate-350"
              >
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <div className="flex flex-col text-left">
                  <span className="text-[8px] text-slate-450 block font-normal leading-none uppercase tracking-wide">Deliver to</span>
                  <span className="text-[10px] font-black text-white block mt-0.5 leading-none">
                    {selectedAddress?.city ? `${selectedAddress.city}, ${selectedAddress.state || ''}` : 'Select Location'}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>
              
              {isLocationDropdownOpen && (
                <div className="absolute right-0 mt-2 bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-xl p-3 w-64 flex flex-col gap-2 shadow-2xl z-50 animate-fade-in text-left">
                  <span className="font-bold text-[9px] text-slate-400 uppercase tracking-widest block border-b border-slate-900 pb-1.5 mb-1">
                    Select Delivery Location
                  </span>
                  
                  {/* Saved Addresses list */}
                  {addresses.length === 0 ? (
                    <div className="text-[10px] text-slate-500 py-1 italic">No saved addresses found.</div>
                  ) : (
                    <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                      {addresses.map((addr: any) => (
                        <button 
                          key={addr.id} 
                          onClick={() => handleSelectAddress(addr)} 
                          className={`w-full text-left p-2 rounded-lg hover:bg-slate-900 border transition-all cursor-pointer block ${
                            selectedAddress?.id === addr.id ? 'border-indigo-500/50 bg-slate-900/40' : 'border-slate-900'
                          }`}
                        >
                          <span className="font-bold text-[10px] text-white block">{addr.name}</span>
                          <span className="text-[9px] text-slate-405 block mt-0.5 truncate">{addr.line1}, {addr.city}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="border-t border-slate-900 pt-2 mt-1 flex flex-col gap-2">
                    <button 
                      onClick={handleUseCurrentLocation} 
                      className="flex items-center gap-1.5 text-[10px] font-black text-indigo-400 hover:text-indigo-305 py-1 cursor-pointer transition-colors"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>USE CURRENT LOCATION</span>
                    </button>
                    
                    <Link 
                      to="/dashboard?tab=addresses" 
                      onClick={() => setIsLocationDropdownOpen(false)}
                      className="flex items-center gap-1.5 text-[10px] font-black text-slate-350 hover:text-white py-1 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>MANAGE ADDRESSES</span>
                    </Link>
                  </div>
                </div>
              )}
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

            {/* Custom Modern Hybrid Navigation Categories */}
            <div className="hidden lg:flex items-center gap-5 text-sm font-extrabold text-text-secondary select-none">
              <Link to="/products?category=Men" className="hover:text-indigo-650 transition-colors uppercase tracking-wider text-[11px] font-sans">Men</Link>
              <Link to="/products?category=Women" className="hover:text-indigo-650 transition-colors uppercase tracking-wider text-[11px] font-sans">Women</Link>
              <Link to="/products?category=Electronics" className="hover:text-indigo-650 transition-colors uppercase tracking-wider text-[11px] font-sans">Electronics</Link>
              <Link to="/products?category=Apparel" className="hover:text-indigo-650 transition-colors uppercase tracking-wider text-[11px] font-sans">Fashion</Link>
              <Link to="/products?category=Footwear" className="hover:text-indigo-650 transition-colors uppercase tracking-wider text-[11px] font-sans">Footwear</Link>
              <Link to="/products?category=Accessories" className="hover:text-indigo-650 transition-colors uppercase tracking-wider text-[11px] font-sans">Accessories</Link>
            </div>
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

            {/* Recently Viewed Trigger */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsRecentlyViewedOpen(!isRecentlyViewedOpen)}
                className="p-2.5 rounded-xl text-text-secondary hover:bg-gray-100 dark:hover:bg-slate-800 relative cursor-pointer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <RecentlyViewedDropdown
                isOpen={isRecentlyViewedOpen}
                onClose={() => setIsRecentlyViewedOpen(false)}
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
      <main className={`flex-1 w-full ${location.pathname === '/' ? 'pt-2 pb-8 px-4 md:px-8 max-w-none w-full' : 'py-6 max-w-7xl mx-auto px-4 md:px-8'}`}>
        <Outlet />
      </main>


      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* About Column */}
          <div className="flex flex-col gap-3">
            <span className="text-xl font-black text-text-inverted tracking-tight">Buynora</span>
            <p className="leading-relaxed text-[11px] text-slate-400">
              Providing enterprise-grade modern shopping portals with advanced features, inspired by standard-defining brands like Apple, Nike, and Sony.
            </p>
            <span className="text-[10px] text-slate-400 mt-2">© 2026 Buynora Inc. All rights reserved.</span>
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
            <p className="leading-relaxed text-[11px] text-slate-400">
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
