import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { ROUTES } from '../constants';

export const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="glass p-10 md:p-14 rounded-3xl border border-rose-500/10 bg-white/70 dark:bg-slate-900/70 space-y-6 max-w-md w-full shadow-2xl">
        <div className="p-4 bg-rose-500/10 text-rose-500 rounded-full inline-block">
          <ShieldAlert className="w-14 h-14" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-text-primary">Access Denied</h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            You do not have the required permissions to view this portal. Please check your credentials or log in with an authorized account.
          </p>
        </div>

        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="bg-indigo-600 hover:bg-indigo-700 text-text-inverted font-bold text-xs py-3 px-6 rounded-xl cursor-pointer shadow transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </button>
      </div>
    </div>
  );
};
