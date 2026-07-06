import React from 'react';
import { Star } from 'lucide-react';
import { TESTIMONIALS } from '../../constants';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="space-y-4">
      <div className="text-center space-y-1">
        <h2 className="text-xl md:text-2xl font-black tracking-tight text-text-primary">Customer Reviews</h2>
        <p className="text-xs text-gray-500">Read verified reviews from our client base</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map(t => (
          <div 
            key={t.id}
            className="glass rounded-2xl p-5 border border-gray-200/50 dark:border-gray-800/50 flex flex-col justify-between text-left h-full"
          >
            <div className="space-y-3">
              <div className="flex items-center text-amber-400 gap-0.5">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-[11px] text-text-secondary leading-relaxed italic">
                "{t.comment}"
              </p>
            </div>

            <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-150 dark:border-gray-800/50">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-9 h-9 object-cover rounded-full"
              />
              <div>
                <h5 className="font-bold text-xs text-text-primary">{t.name}</h5>
                <span className="text-[10px] text-gray-400">{t.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
