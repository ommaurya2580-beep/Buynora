import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const AuthLayout: React.FC = () => {
  // Sync the theme
  useTheme();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Abstract neon glow background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="p-6 flex items-center justify-between relative z-10 w-full max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs font-bold">
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </Link>
        <Link to="/" className="flex items-center gap-1">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <span className="text-xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Buynora
          </span>
        </Link>
      </header>

      {/* Main Form Holder */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-[10px] text-slate-500 relative z-10 border-t border-slate-800/40">
        <span>© 2026 Buynora E-Commerce. Protected by industry grade 256-bit encryption.</span>
      </footer>
    </div>
  );
};
