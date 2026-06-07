import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, Shield, Briefcase, LogOut } from 'lucide-react';
import { UserProfile } from '../../types';

interface ProfileMenuProps {
  user: UserProfile | null;
  isAuthenticated: boolean;
  onLogout: () => void;
}

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

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full border-2 border-transparent hover:border-indigo-500/30 overflow-hidden cursor-pointer h-9 w-9"
      >
        <img
          src={isAuthenticated && user?.avatar ? user.avatar : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"}
          alt="avatar"
          className="w-full h-full object-cover rounded-full"
        />
      </button>

      {/* Profile Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 rounded-2xl glass shadow-2xl border border-gray-200/50 dark:border-gray-800/50 bg-bg-surface overflow-hidden z-50">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800/50">
            <h5 className="text-xs font-bold text-text-primary text-left">
              {isAuthenticated ? user?.name : "Welcome Guest"}
            </h5>
            <p className="text-[10px] text-text-secondary mt-0.5 truncate text-left">
              {isAuthenticated ? user?.email : "Sign in to manage orders"}
            </p>
          </div>
          
          <div className="p-2.5 space-y-1">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 text-xs font-semibold px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-text-secondary rounded-lg transition-colors text-left"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  User Dashboard
                </Link>
                
                <Link
                  to="/seller"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 text-xs font-semibold px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-text-secondary rounded-lg transition-colors text-left"
                >
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  Seller Dashboard
                </Link>

                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 text-xs font-semibold px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-text-secondary rounded-lg transition-colors text-left"
                >
                  <Shield className="w-4 h-4 text-gray-400" />
                  Admin Dashboard
                </Link>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left flex items-center gap-2.5 text-xs font-semibold px-3.5 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 text-xs font-bold px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-text-inverted rounded-lg text-center justify-center transition-all"
              >
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
