import React from 'react';
import { Megaphone, Sparkles, AlertCircle } from 'lucide-react';

interface Props {
  title: string;
}

const MarketingPlaceholder: React.FC<Props> = ({ title }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="glass p-10 rounded-3xl border border-gray-250/50 dark:border-slate-800/50 max-w-lg bg-white/40 dark:bg-slate-900/40 shadow-xl space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto animate-pulse">
          <Megaphone className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-black text-text-primary mb-2 tracking-tight">{title}</h2>
          <p className="text-xs text-gray-550 dark:text-gray-400 leading-relaxed">
            This module is connected to the enterprise marketing suite. Admins can configure custom notifications, segment push channels, and draft vouchers in coordination with running Hero campaigns.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400 text-[11px] font-semibold justify-center">
          <AlertCircle className="w-4 h-4" />
          <span>Configured via Mock API server. Integration active.</span>
        </div>
      </div>
    </div>
  );
};

export default MarketingPlaceholder;
