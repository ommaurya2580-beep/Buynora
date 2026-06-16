import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const AuthLayout: React.FC = () => {
  // Sync the theme
  useTheme();

  return (
    <div className="min-h-screen bg-[#001F1A] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Abstract neon glow background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#00D9A6]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#007A5E]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="p-6 flex items-center justify-between relative z-10 w-full max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-text-inverted transition-colors text-xs font-bold">
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </Link>
        <Link to="/" className="flex items-center gap-2 group transition-all duration-300">
          <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-gradient-to-tr from-[#007A5E] to-[#00D9A6] p-1 shadow-[0_0_10px_rgba(0,217,166,0.3)] group-hover:scale-105 transition-all duration-300">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-white">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <span className="text-xl font-black bg-gradient-to-r from-[#00D9A6] via-[#38FFD3] to-[#007A5E] bg-clip-text text-transparent tracking-tight group-hover:scale-105 transition-all duration-300 select-none">
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
