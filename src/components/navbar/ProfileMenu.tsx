import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  User, Shield, Briefcase, LogOut, LayoutDashboard,
  ShoppingBag, Heart, MapPin, CreditCard, Tag,
  Star, Bell, Headphones, HelpCircle, Settings,
  ChevronRight, Package, BarChart2, DollarSign,
  ClipboardList, TrendingUp, Store
} from 'lucide-react';
import { UserProfile } from '../../types';
import { ROLES } from '../../constants';

interface ProfileMenuProps {
  user: UserProfile | null;
  isAuthenticated: boolean;
  onLogout: () => void;
}

// ── CUSTOMER menu groups ─────────────────────────────────────────────────────
const CUSTOMER_MENU = [
  {
    group: 'My Account',
    items: [
      { to: '/dashboard',               label: 'My Profile',       icon: <User className="w-4 h-4" />,         color: 'text-indigo-500' },
      { to: '/orders',                  label: 'My Orders',        icon: <ShoppingBag className="w-4 h-4" />,  color: 'text-emerald-500' },
      { to: '/wishlist',                label: 'Wishlist',         icon: <Heart className="w-4 h-4" />,        color: 'text-rose-500' },
    ],
  },
  {
    group: 'Saved Info',
    items: [
      { to: '/dashboard?tab=addresses', label: 'Saved Addresses',  icon: <MapPin className="w-4 h-4" />,       color: 'text-amber-500' },
      { to: '/dashboard?tab=payments',  label: 'Payment Methods',  icon: <CreditCard className="w-4 h-4" />,   color: 'text-blue-500' },
      { to: '/dashboard?tab=coupons',   label: 'Coupons',          icon: <Tag className="w-4 h-4" />,          color: 'text-orange-500' },
      { to: '/dashboard?tab=rewards',   label: 'Reward Points',    icon: <Star className="w-4 h-4" />,         color: 'text-yellow-500' },
    ],
  },
  {
    group: 'Support',
    items: [
      { to: '/dashboard?tab=notifications', label: 'Notifications',    icon: <Bell className="w-4 h-4" />,    color: 'text-purple-500' },
      { to: '/contact',                     label: 'Customer Support',  icon: <Headphones className="w-4 h-4" />, color: 'text-teal-500' },
      { to: '/faq',                         label: 'Help Center',       icon: <HelpCircle className="w-4 h-4" />, color: 'text-cyan-500' },
      { to: '/dashboard?tab=settings',      label: 'Settings',          icon: <Settings className="w-4 h-4" />,   color: 'text-gray-500' },
    ],
  },
];

// ── SELLER menu groups ────────────────────────────────────────────────────────
const SELLER_MENU = [
  {
    group: 'Seller Hub',
    items: [
      { to: '/seller',              label: 'Seller Profile',    icon: <Store className="w-4 h-4" />,         color: 'text-amber-500' },
      { to: '/seller',              label: 'Seller Dashboard',  icon: <LayoutDashboard className="w-4 h-4" />, color: 'text-indigo-500' },
    ],
  },
  {
    group: 'Catalog',
    items: [
      { to: '/seller?tab=products',   label: 'Products',    icon: <Package className="w-4 h-4" />,       color: 'text-blue-500' },
      { to: '/seller?tab=inventory',  label: 'Inventory',   icon: <ClipboardList className="w-4 h-4" />, color: 'text-cyan-500' },
    ],
  },
  {
    group: 'Sales & Finance',
    items: [
      { to: '/seller?tab=orders',    label: 'Orders',    icon: <ShoppingBag className="w-4 h-4" />,  color: 'text-emerald-500' },
      { to: '/seller?tab=revenue',   label: 'Revenue',   icon: <DollarSign className="w-4 h-4" />,   color: 'text-green-500' },
      { to: '/seller?tab=analytics', label: 'Analytics', icon: <BarChart2 className="w-4 h-4" />,    color: 'text-violet-500' },
      { to: '/seller?tab=coupons',   label: 'Coupons',   icon: <Tag className="w-4 h-4" />,          color: 'text-orange-500' },
    ],
  },
  {
    group: 'Help & Config',
    items: [
      { to: '/contact',             label: 'Support',   icon: <Headphones className="w-4 h-4" />,  color: 'text-teal-500' },
      { to: '/seller?tab=settings', label: 'Settings',  icon: <Settings className="w-4 h-4" />,    color: 'text-gray-500' },
    ],
  },
];

// ── Shared row renderer ───────────────────────────────────────────────────────
interface MenuItem { to: string; label: string; icon: React.ReactNode; color: string; }
interface MenuSection { group: string; items: MenuItem[]; }

const MenuGroup: React.FC<{ section: MenuSection; onClose: () => void; hasBorder?: boolean }> = ({
  section, onClose, hasBorder = false
}) => (
  <div className={hasBorder ? 'border-t border-gray-100 dark:border-gray-800/50' : ''}>
    <p className="px-4 pt-2.5 pb-1 text-[9px] font-black uppercase tracking-widest text-text-secondary/60">
      {section.group}
    </p>
    <div className="px-2 pb-1 space-y-0.5">
      {section.items.map(item => (
        <Link
          key={`${item.to}-${item.label}`}
          to={item.to}
          onClick={onClose}
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
);

// ── Main component ────────────────────────────────────────────────────────────
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

  const role = user?.role;

  const headerGradient =
    role === ROLES.ADMIN   ? 'from-rose-500/10 to-red-500/5' :
    role === ROLES.SELLER  ? 'from-amber-500/10 to-orange-500/5' :
                             'from-indigo-500/10 to-purple-500/5';

  const avatarBorder =
    role === ROLES.ADMIN   ? 'border-rose-500/30' :
    role === ROLES.SELLER  ? 'border-amber-500/30' :
                             'border-indigo-500/30';

  const roleBadgeClass =
    role === ROLES.ADMIN   ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400' :
    role === ROLES.SELLER  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' :
                             'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400';

  const avatarSrc = (isAuthenticated && user?.avatar)
    ? user.avatar
    : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100';

  const isSeller  = role === ROLES.SELLER;
  const isAdmin   = role === ROLES.ADMIN;
  const isCustomer = !role || role === ROLES.CUSTOMER;

  return (
    <div ref={containerRef} className="relative">
      {/* ── Avatar trigger ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full border-2 border-transparent hover:border-indigo-500/40 overflow-hidden cursor-pointer h-9 w-9 transition-all"
      >
        <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover rounded-full" />
      </button>

      {/* ── Dropdown panel ── */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 rounded-2xl glass shadow-2xl border border-gray-200/50 dark:border-gray-800/50 bg-bg-surface overflow-hidden z-50 animate-fade-in">

          {/* Header */}
          <div className={`px-4 py-4 bg-gradient-to-br ${headerGradient} border-b border-gray-100 dark:border-gray-800/50 flex items-center gap-3`}>
            <div className="relative flex-shrink-0">
              <img src={avatarSrc} alt="avatar" className={`w-12 h-12 rounded-full object-cover border-2 ${avatarBorder}`} />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h5 className="text-sm font-bold text-text-primary truncate">
                  {isAuthenticated ? user?.name : 'Welcome, Guest'}
                </h5>
                {/* Seller-specific verified badge */}
                {isSeller && (
                  <span className="flex items-center gap-0.5 text-[9px] font-black uppercase tracking-wide bg-amber-500 text-white px-1.5 py-0.5 rounded-full">
                    <TrendingUp className="w-2.5 h-2.5" /> Seller
                  </span>
                )}
                {isAdmin && (
                  <span className="flex items-center gap-0.5 text-[9px] font-black uppercase tracking-wide bg-rose-500 text-white px-1.5 py-0.5 rounded-full">
                    <Shield className="w-2.5 h-2.5" /> Admin
                  </span>
                )}
              </div>
              <p className="text-[10px] text-text-secondary truncate">
                {isAuthenticated ? user?.email : 'Sign in to access your account'}
              </p>
              {isAuthenticated && role && (
                <span className={`inline-block mt-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${roleBadgeClass}`}>
                  {role}
                </span>
              )}
            </div>
          </div>

          {/* Menu body */}
          <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
            {isAuthenticated ? (
              <>
                {/* CUSTOMER */}
                {isCustomer && CUSTOMER_MENU.map((section, si) => (
                  <MenuGroup key={si} section={section} onClose={() => setIsOpen(false)} hasBorder={si > 0} />
                ))}

                {/* SELLER */}
                {isSeller && SELLER_MENU.map((section, si) => (
                  <MenuGroup key={si} section={section} onClose={() => setIsOpen(false)} hasBorder={si > 0} />
                ))}

                {/* ADMIN: single hub link */}
                {isAdmin && (
                  <div className="px-2 py-2 space-y-0.5">
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 text-text-secondary hover:text-text-primary transition-colors group"
                    >
                      <span className="flex-shrink-0 text-rose-500"><Shield className="w-4 h-4" /></span>
                      <span className="text-xs font-semibold flex-1">Admin Dashboard</span>
                      <ChevronRight className="w-3 h-3 text-gray-300 dark:text-gray-700" />
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 text-text-secondary hover:text-text-primary transition-colors group"
                    >
                      <span className="flex-shrink-0 text-indigo-500"><User className="w-4 h-4" /></span>
                      <span className="text-xs font-semibold flex-1">My Profile</span>
                      <ChevronRight className="w-3 h-3 text-gray-300 dark:text-gray-700" />
                    </Link>
                    <Link
                      to="/admin?tab=settings"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 text-text-secondary hover:text-text-primary transition-colors group"
                    >
                      <span className="flex-shrink-0 text-gray-500"><Settings className="w-4 h-4" /></span>
                      <span className="text-xs font-semibold flex-1">Settings</span>
                      <ChevronRight className="w-3 h-3 text-gray-300 dark:text-gray-700" />
                    </Link>
                  </div>
                )}

                {/* Logout */}
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
              /* Guest */
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
