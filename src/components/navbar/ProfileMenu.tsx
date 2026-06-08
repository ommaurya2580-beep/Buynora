import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  User, Shield, Briefcase, LogOut, LayoutDashboard,
  ShoppingBag, Heart, MapPin, CreditCard, Tag,
  Star, Bell, Headphones, HelpCircle, Settings,
  ChevronRight
} from 'lucide-react';
import { UserProfile } from '../../types';
import { ROLES } from '../../constants';

interface ProfileMenuProps {
  user: UserProfile | null;
  isAuthenticated: boolean;
  onLogout: () => void;
}

// Menu groups for CUSTOMER role
const CUSTOMER_MENU = [
  {
    group: 'My Account',
    items: [
      { to: '/dashboard', label: 'My Profile', icon: <User className="w-4 h-4" />, color: 'text-indigo-500' },
      { to: '/orders', label: 'My Orders', icon: <ShoppingBag className="w-4 h-4" />, color: 'text-emerald-500' },
      { to: '/wishlist', label: 'Wishlist', icon: <Heart className="w-4 h-4" />, color: 'text-rose-500' },
    ],
  },
  {
    group: 'Saved Info',
    items: [
      { to: '/dashboard?tab=addresses', label: 'Saved Addresses', icon: <MapPin className="w-4 h-4" />, color: 'text-amber-500' },
      { to: '/dashboard?tab=payments', label: 'Payment Methods', icon: <CreditCard className="w-4 h-4" />, color: 'text-blue-500' },
      { to: '/dashboard?tab=coupons', label: 'Coupons', icon: <Tag className="w-4 h-4" />, color: 'text-orange-500' },
      { to: '/dashboard?tab=rewards', label: 'Reward Points', icon: <Star className="w-4 h-4" />, color: 'text-yellow-500' },
    ],
  },
  {
    group: 'Support',
    items: [
      { to: '/dashboard?tab=notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" />, color: 'text-purple-500' },
      { to: '/contact', label: 'Customer Support', icon: <Headphones className="w-4 h-4" />, color: 'text-teal-500' },
      { to: '/faq', label: 'Help Center', icon: <HelpCircle className="w-4 h-4" />, color: 'text-cyan-500' },
      { to: '/dashboard?tab=settings', label: 'Settings', icon: <Settings className="w-4 h-4" />, color: 'text-gray-500' },
    ],
  },
];

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ user, isAuthenticated, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  // Derive dashboard config for SELLER / ADMIN
  const getNonCustomerDashboard = () => {
    if (!user) return null;
    if (user.role === ROLES.ADMIN)
      return { to: '/admin', label: 'Admin Dashboard', icon: <Shield className="w-4 h-4" />, color: 'text-rose-500' };
    if (user.role === ROLES.SELLER)
      return { to: '/seller', label: 'Seller Dashboard', icon: <Briefcase className="w-4 h-4" />, color: 'text-amber-500' };
    return null;
  };

  const roleBadgeClass =
    user?.role === ROLES.ADMIN
      ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
      : user?.role === ROLES.SELLER
      ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
      : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400';

  const isCustomer = !user?.role || user.role === ROLES.CUSTOMER;
  const nonCustomerDash = getNonCustomerDashboard();

  return (
    <div ref={containerRef} className="relative">
      {/* Avatar trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full border-2 border-transparent hover:border-indigo-500/40 overflow-hidden cursor-pointer h-9 w-9 transition-all"
      >
        <img
          src={
            isAuthenticated && user?.avatar
              ? user.avatar
              : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
          }
          alt="avatar"
          className="w-full h-full object-cover rounded-full"
        />
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 rounded-2xl glass shadow-2xl border border-gray-200/50 dark:border-gray-800/50 bg-bg-surface overflow-hidden z-50 animate-fade-in">

          {/* ── User Header ── */}
          <div className="px-4 py-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border-b border-gray-100 dark:border-gray-800/50 flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <img
                src={
                  isAuthenticated && user?.avatar
                    ? user.avatar
                    : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
                }
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500/30"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-bold text-text-primary truncate">
                {isAuthenticated ? user?.name : 'Welcome, Guest'}
              </h5>
              <p className="text-[10px] text-text-secondary truncate">
                {isAuthenticated ? user?.email : 'Sign in to access your account'}
              </p>
              {isAuthenticated && user?.role && (
                <span className={`inline-block mt-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${roleBadgeClass}`}>
                  {user.role}
                </span>
              )}
            </div>
          </div>

          {/* ── Menu body ── */}
          <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
            {isAuthenticated ? (
              <>
                {/* CUSTOMER: full grouped menu */}
                {isCustomer && CUSTOMER_MENU.map((section, si) => (
                  <div key={si} className={si > 0 ? 'border-t border-gray-100 dark:border-gray-800/50' : ''}>
                    <p className="px-4 pt-2.5 pb-1 text-[9px] font-black uppercase tracking-widest text-text-secondary/60">
                      {section.group}
                    </p>
                    <div className="px-2 pb-1 space-y-0.5">
                      {section.items.map(item => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 text-text-secondary hover:text-text-primary transition-colors group"
                        >
                          <span className={`flex-shrink-0 ${item.color} group-hover:scale-110 transition-transform`}>
                            {item.icon}
                          </span>
                          <span className="text-xs font-semibold flex-1">{item.label}</span>
                          <ChevronRight className="w-3 h-3 text-gray-300 dark:text-gray-700 group-hover:text-gray-400 transition-colors" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}

                {/* SELLER / ADMIN: single dashboard link */}
                {!isCustomer && nonCustomerDash && (
                  <div className="px-2 py-2 space-y-0.5">
                    <Link
                      to={nonCustomerDash.to}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 text-text-secondary hover:text-text-primary transition-colors group"
                    >
                      <span className={`flex-shrink-0 ${nonCustomerDash.color}`}>{nonCustomerDash.icon}</span>
                      <span className="text-xs font-semibold flex-1">{nonCustomerDash.label}</span>
                      <ChevronRight className="w-3 h-3 text-gray-300 dark:text-gray-700" />
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 text-text-secondary hover:text-text-primary transition-colors group"
                    >
                      <span className="flex-shrink-0 text-indigo-500"><LayoutDashboard className="w-4 h-4" /></span>
                      <span className="text-xs font-semibold flex-1">My Profile</span>
                      <ChevronRight className="w-3 h-3 text-gray-300 dark:text-gray-700" />
                    </Link>
                  </div>
                )}

                {/* Logout — always shown */}
                <div className="px-2 pb-2 pt-1 border-t border-gray-100 dark:border-gray-800/50">
                  <button
                    onClick={() => { setIsOpen(false); onLogout(); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 transition-colors group cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              /* Guest state */
              <div className="p-3">
                <Link
                  to="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 text-xs font-bold px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all hover:scale-[1.02] active:scale-95"
                >
                  Sign In / Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
