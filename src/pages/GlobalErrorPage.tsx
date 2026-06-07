import React from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';
import { ROUTES } from '../constants';

interface GlobalErrorPageProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

export const GlobalErrorPage: React.FC<GlobalErrorPageProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-secondary text-center text-text-secondary">
      <div className="glass p-10 md:p-14 rounded-3xl border border-indigo-500/10 bg-white/80 dark:bg-slate-900/80 space-y-6 max-w-lg w-full shadow-2xl">
        <div className="p-4 bg-indigo-500/10 text-indigo-500 rounded-full inline-block">
          <ShieldAlert className="w-12 h-12" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-text-primary">Something went wrong</h2>
          <p className="text-xs text-text-secondary">
            An unexpected error occurred in the application. Please try reloading the page.
          </p>
          {error && (
            <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl text-left text-[11px] font-mono text-rose-550 dark:text-rose-400 overflow-x-auto max-h-24">
              {error.message}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          {resetErrorBoundary && (
            <button
              onClick={resetErrorBoundary}
              className="bg-indigo-600 hover:bg-indigo-700 text-text-inverted font-bold text-xs py-3 px-6 rounded-xl cursor-pointer shadow transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          )}
          <a
            href={ROUTES.HOME}
            className="bg-gray-150 dark:bg-slate-800 text-text-secondary hover:bg-gray-200 dark:hover:bg-slate-700 font-bold text-xs py-3 px-6 rounded-xl cursor-pointer transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Return Home
          </a>
        </div>
      </div>
    </div>
  );
};
