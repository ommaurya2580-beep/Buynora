import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, ShoppingCart, LogOut, ArrowLeft,
  LayoutDashboard, Menu, X, Sun, Moon, Store
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../hooks/useToast';

export const SellerLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleTheme, isDark } = useTheme();
  const { showToast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarItems = [
    { name: 'Analytics Overview', tab: 'analytics', path: '/seller?tab=analytics', icon: LayoutDashboard },
    { name: 'Manage Products', tab: 'products', path: '/seller?tab=products', icon: Box },
    { name: 'Order Logs', tab: 'orders', path: '/seller?tab=orders', icon: ShoppingCart },
  ];

  const currentTab = new URLSearchParams(location.search).get('tab') || 'analytics';

  return (
    <div className="min-h-screen bg-bg-secondary flex text-text-secondary">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 glass border-r border-gray-200/50 dark:border-gray-800/50 justify-between p-6 bg-white/50 dark:bg-slate-900/50">
        <div className="space-y-8">
          {/* Logo / Title */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500 rounded-xl text-text-inverted">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm tracking-wide">Seller Portal</h4>
              <span className="text-[10px] text-gray-400">Buynora Merchants</span>
            </div>
          </div>
 
          {/* Navigation Links */}
          <div className="space-y-1.5">
            {sidebarItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.tab;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
                    isActive 
                      ? 'bg-indigo-600 text-text-inverted shadow-lg shadow-indigo-600/10' 
                      : 'hover:bg-gray-100 dark:hover:bg-slate-800/50 text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-3">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Store
          </Link>
          <button
            onClick={() => {
              showToast("Logged out of merchant portal", "info");
              navigate('/');
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Exit Merchant
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="glass bg-white/70 dark:bg-slate-900/70 border-b border-gray-200/50 dark:border-gray-800/50 p-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-sm md:text-base">Merchant Control Panel</h3>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 bg-gray-100 dark:bg-slate-850 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-bold">Bob Seller</span>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-500 font-extrabold px-2 py-0.5 rounded-full uppercase">
                Pro Merchant
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed top-0 bottom-0 left-0 w-64 bg-bg-surface border-r border-gray-200 dark:border-gray-800 p-6 flex flex-col justify-between"
            >
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Store className="w-5 h-5 text-indigo-500" />
                    <span className="font-extrabold text-sm">Seller Portal</span>
                  </div>
                  <button onClick={() => setIsSidebarOpen(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-1.5">
                  {sidebarItems.map(item => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.tab;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
                          isActive 
                            ? 'bg-indigo-600 text-text-inverted shadow-lg' 
                            : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  to="/"
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-500 rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Return to Store
                </Link>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
