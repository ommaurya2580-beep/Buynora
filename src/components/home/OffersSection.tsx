import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';

export const OffersSection: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
      
      {/* Apple Bundle */}
      <div className="rounded-3xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden bg-slate-900 border border-slate-800/80 shadow-md text-text-inverted min-h-[220px]">
        <div className="space-y-2.5 z-10 max-w-xs text-left">
          <span className="text-[10px] uppercase bg-white/10 text-indigo-200 font-extrabold px-2.5 py-0.5 rounded-full">
            Apple Ecosystem
          </span>
          <h3 className="text-lg md:text-2xl font-black">Buy iPhone + MacBook</h3>
          <p className="text-[11px] text-slate-300">
            Get an extra 5% instant discount and standard Apple Care 2-year warranty free.
          </p>
        </div>
        <div className="pt-4 z-10 text-left">
          <button
            onClick={() => {
              navigate('/product/p1');
              showToast("Explore the iPhone 15 Pro, part of our premium bundle!", "info");
            }}
            className="bg-white text-slate-900 text-xs font-bold px-4.5 py-2 rounded-xl hover:bg-gray-150 transition-all cursor-pointer"
          >
            Explore Bundle
          </button>
        </div>
        <img
          src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400"
          alt="bundle"
          className="absolute right-[-10%] bottom-[-15%] w-48 h-48 object-cover opacity-60 rounded-full select-none"
        />
      </div>

      {/* Nike Run Bundle */}
      <div className="rounded-3xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden bg-rose-950 border border-rose-900/80 shadow-md text-text-inverted min-h-[220px]">
        <div className="space-y-2.5 z-10 max-w-xs text-left">
          <span className="text-[10px] uppercase bg-white/10 text-rose-200 font-extrabold px-2.5 py-0.5 rounded-full">
            Nike Run Club
          </span>
          <h3 className="text-lg md:text-2xl font-black">Buy Shoes + Hoodie</h3>
          <p className="text-[11px] text-slate-200">
            Score an additional 15% discount. Use checkout discount code <span className="font-extrabold text-amber-400">WELCOME10</span>.
          </p>
        </div>
        <div className="pt-4 z-10 text-left">
          <button
            onClick={() => {
              navigate('/products?brand=Nike');
              showToast("Filter by Nike brand to find eligible shoes & apparel!", "info");
            }}
            className="bg-white text-rose-950 text-xs font-bold px-4.5 py-2 rounded-xl hover:bg-gray-150 transition-all cursor-pointer"
          >
            Explore Bundle
          </button>
        </div>
        <img
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400"
          alt="nike"
          className="absolute right-[-10%] bottom-[-15%] w-48 h-48 object-cover opacity-60 rounded-full select-none"
        />
      </div>

    </section>
  );
};
