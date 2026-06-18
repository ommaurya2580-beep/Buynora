import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';
import { useAppSelector } from '../redux/store';
import { motion } from 'framer-motion';

interface MobileBottomNavProps {
  onSearchClick: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onSearchClick }) => {
  const location = useLocation();
  const path = location.pathname;

  const { cartItems } = useAppSelector(state => state.cart);
  const wishlistItems = useAppSelector(state => state.wishlist.wishlistItems);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const getActiveTab = () => {
    if (path === '/') return 'home';
    if (path === '/cart') return 'cart';
    if (path === '/wishlist') return 'wishlist';
    if (path === '/dashboard') return 'profile';
    return '';
  };

  const activeTab = getActiveTab();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, to: '/' },
    { id: 'search', label: 'Search', icon: Search, onClick: onSearchClick },
    { id: 'cart', label: 'Cart', icon: ShoppingBag, to: '/cart', badge: cartCount },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, to: '/wishlist', badge: wishlistCount },
    { id: 'profile', label: 'Profile', icon: User, to: '/dashboard' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-4 pb-safe-bottom bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-gray-200/50 dark:border-slate-800/60 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center h-16 max-w-md mx-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          const buttonContent = (
            <motion.div 
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center justify-center relative w-12 h-12 cursor-pointer"
            >
              <div className={`p-1.5 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'text-primary bg-primary/10 dark:bg-primary/20 scale-110 shadow-sm shadow-primary/5' 
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-450'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[9px] mt-0.5 font-bold tracking-wide transition-colors duration-300 ${
                isActive ? 'text-primary font-black' : 'text-gray-400 dark:text-gray-500'
              }`}>
                {item.label}
              </span>
              
              {/* Badge for cart/wishlist */}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-text-inverted text-[8px] font-black rounded-full h-4 w-4 flex items-center justify-center border border-white dark:border-slate-900 shadow">
                  {item.badge}
                </span>
              )}
            </motion.div>
          );

          if (item.onClick) {
            return (
              <button 
                key={item.id} 
                onClick={item.onClick}
                className="focus:outline-none"
              >
                {buttonContent}
              </button>
            );
          }

          return (
            <Link 
              key={item.id} 
              to={item.to} 
              className="focus:outline-none"
            >
              {buttonContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
