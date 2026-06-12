import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShieldAlert, Users, Store, Tag, ArrowLeft, LogOut,
  LayoutDashboard, Menu, X, Sun, Moon, FolderKanban,
  Sparkles, Megaphone, Bell, Send
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../hooks/useToast';
import { AnimatePresence, motion } from 'framer-motion';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleTheme, isDark } = useTheme();
  const { showToast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const coreItems = [
    { name: 'System Overview', tab: 'overview', path: '/admin?tab=overview', icon: LayoutDashboard },
    { name: 'User Management', tab: 'users', path: '/admin/users?tab=users', icon: Users },
    { name: 'Seller Management', tab: 'sellers', path: '/admin/sellers?tab=sellers', icon: Store },
    { name: 'Category Settings', tab: 'categories', path: '/admin/categories?tab=categories', icon: FolderKanban },
  ];

  const marketingItems = [
    { name: 'Hero Campaigns', path: '/admin/hero-campaigns', icon: Sparkles },
    { name: 'Promotions', path: '/admin/promotions', icon: Megaphone },
    { name: 'Coupons', tab: 'coupons', path: '/admin/coupons?tab=coupons', icon: Tag },
    { name: 'Notifications', path: '/admin/notifications', icon: Bell },
    { name: 'Push Campaigns', path: '/admin/push-campaigns', icon: Send },
  ];

  const currentTab = new URLSearchParams(location.search).get('tab') || 'overview';

  return (
    <div className="min-h-screen bg-bg-secondary flex text-text-secondary">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 glass border-r border-gray-200/50 dark:border-gray-800/50 justify-between p-6 bg-white/50 dark:bg-slate-900/50">
        <div className="space-y-8">
          {/* Logo / Title */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-600 rounded-xl text-text-inverted">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm tracking-wide">Admin Control</h4>
              <span className="text-[10px] text-gray-400">Buynora Core Panel</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <div>
              <p className="px-4 text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Core Panel</p>
              <div className="space-y-1">
                {coreItems.map(item => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.tab && !location.pathname.startsWith('/admin/hero-campaigns') && !location.pathname.startsWith('/admin/promotions') && !location.pathname.startsWith('/admin/notifications') && !location.pathname.startsWith('/admin/push-campaigns');
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
                        isActive 
                          ? 'bg-purple-600 text-text-inverted shadow-lg shadow-purple-600/10' 
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

            <div>
              <p className="px-4 text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Marketing</p>
              <div className="space-y-1">
                {marketingItems.map(item => {
                  const Icon = item.icon;
                  const isActive = item.tab 
                    ? currentTab === item.tab 
                    : location.pathname.startsWith(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
                        isActive 
                          ? 'bg-purple-600 text-text-inverted shadow-lg shadow-purple-600/10' 
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
              showToast("Exited administrator settings", "info");
              navigate('/');
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Exit Admin
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
            <h3 className="font-bold text-sm md:text-base">System Administration</h3>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 bg-gray-100 dark:bg-slate-850 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-bold">Alice Admin</span>
              <span className="text-[10px] bg-purple-500/10 text-purple-500 font-extrabold px-2 py-0.5 rounded-full uppercase">
                Owner
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
                    <ShieldAlert className="w-5 h-5 text-purple-500" />
                    <span className="font-extrabold text-sm">Admin Portal</span>
                  </div>
                  <button onClick={() => setIsSidebarOpen(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="px-4 text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Core Panel</p>
                    <div className="space-y-1">
                      {coreItems.map(item => {
                        const Icon = item.icon;
                        const isActive = currentTab === item.tab && !location.pathname.startsWith('/admin/hero-campaigns') && !location.pathname.startsWith('/admin/promotions') && !location.pathname.startsWith('/admin/notifications') && !location.pathname.startsWith('/admin/push-campaigns');
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
                              isActive 
                                ? 'bg-purple-600 text-text-inverted shadow-lg' 
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

                  <div>
                    <p className="px-4 text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Marketing</p>
                    <div className="space-y-1">
                      {marketingItems.map(item => {
                        const Icon = item.icon;
                        const isActive = item.tab 
                          ? currentTab === item.tab 
                          : location.pathname.startsWith(item.path);
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
                              isActive 
                                ? 'bg-purple-600 text-text-inverted shadow-lg' 
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
