import React from 'react';
import { Mail } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export const NewsletterSection: React.FC = () => {
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showToast('Thank you for subscribing to our newsletter!', 'success');
    e.currentTarget.reset();
  };

  return (
    <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 to-indigo-950 p-6 md:p-10 text-white shadow-xl border border-white/5">
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
        <div className="bg-white/10 p-3 rounded-2xl inline-block border border-white/10">
          <Mail className="w-6 h-6 text-indigo-300" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl md:text-3xl font-black tracking-tight text-white">
            Join the Buynora Club
          </h2>
          <p className="text-xs md:text-sm text-slate-300 max-w-md mx-auto">
            Subscribe to receive flash discount coupons, price drop notifications, and weekly personalized recommendations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            required
            placeholder="Enter your email address"
            className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 outline-none focus:border-white/50 focus:bg-white/15 flex-1 transition-all"
          />
          <button
            type="submit"
            className="bg-accent hover:bg-accent-hover text-white text-sm font-bold px-6 py-3 rounded-xl cursor-pointer shadow transition-all hover:scale-105 active:scale-95 flex-shrink-0"
          >
            Subscribe Now
          </button>
        </form>
      </div>
    </section>
  );
};
