import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParticleBackground } from './ParticleBackground';
import { LogoAnimation } from './LogoAnimation';
import './brandAnimation.css';

interface BrandSplashProps {
  onTransitionStart: () => void;
  onComplete: () => void;
}

type SplashStage = 'bg' | 'logo' | 'hold' | 'transitioning' | 'complete';

export const BrandSplash: React.FC<BrandSplashProps> = ({ 
  onTransitionStart, 
  onComplete 
}) => {
  const [stage, setStage] = useState<SplashStage>('bg');
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Session storage check to prevent replay on navigation
    const isSplashShown = sessionStorage.getItem('buynora_splash_shown');
    if (isSplashShown === 'true') {
      onTransitionStart();
      onComplete();
      return;
    }

    setHasShown(true);

    // Timeline durations (total ~3.2s)
    // 0s - 0.8s: Full-screen background only
    const t1 = setTimeout(() => {
      setStage('logo'); // Reveal logo and "Buynora" name (0.8s - 2.0s)
    }, 800);

    // 2.0s - 2.5s: Hold logo + text
    const t2 = setTimeout(() => {
      setStage('hold');
    }, 2000);

    // 2.5s - 3.2s: Transition to website
    const t3 = setTimeout(() => {
      setStage('transitioning');
      sessionStorage.setItem('buynora_splash_shown', 'true');
      onTransitionStart(); // Trigger navbar logo mount & homepage fade-in
    }, 2500);

    // 3.2s+: Complete unmount
    const t4 = setTimeout(() => {
      onComplete(); // completely unmount overlay
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!hasShown || stage === 'complete') return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={stage === 'transitioning' ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden select-none"
    >
      {/* Deep Emerald Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#001F1A] via-[#003D33] to-[#00110E]" />
      
      {/* Soft moving green glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,217,166,0.08)_0%,transparent_70%)] animate-pulse-slow" />

      {/* Particle Overlay */}
      {stage !== 'transitioning' && <ParticleBackground />}

      {/* Ripple/wave behind the logo */}
      {stage !== 'transitioning' && stage !== 'bg' && (
        <div className="radial-wave absolute top-[43%] left-1/2 -translate-x-1/2 -translate-y-1/2" />
      )}

      {/* Center Group */}
      {stage !== 'transitioning' && (
        <div className="flex flex-col items-center justify-center z-10 gap-6">
          <AnimatePresence>
            {stage !== 'bg' && (
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={stage === 'hold' ? {
                  scale: 1.0,
                  opacity: 1,
                  y: 0
                } : {
                  scale: 1.0,
                  opacity: 1,
                  y: [0, -6, 0]
                }}
                transition={{ 
                  scale: { duration: 1.0, ease: "easeOut" },
                  opacity: { duration: 0.8, ease: "easeOut" },
                  y: { repeat: Infinity, duration: 4, ease: "easeInOut" }
                }}
                className="emerald-glow-lg rounded-2xl bg-[#001F1A]/60 backdrop-blur-md p-5 border border-[#00D9A6]/20 relative shadow-[0_0_50px_rgba(0,217,166,0.15)] glass-reflection"
              >
                <LogoAnimation size={96} layoutId="logo-bag" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sub-text revealing */}
          <div className="h-16 flex items-center justify-center mt-2">
            <AnimatePresence>
              {stage !== 'bg' && (
                <motion.div
                  key="buynora-text"
                  layoutId="logo-text"
                  initial={{ opacity: 0, filter: 'blur(8px)', scale: 0.95 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', scale: stage === 'hold' ? 1.0 : 1.03 }}
                  exit={{ opacity: 0, filter: 'blur(8px)' }}
                  transition={{ duration: 0.7, ease: "easeInOut", delay: 0.4 }}
                  className="text-3.5xl font-black tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#00D9A6] drop-shadow-[0_0_15px_rgba(0,217,166,0.4)] font-sans uppercase"
                >
                  BUYNORA
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* ambient reflection glow on bottom */}
      {stage !== 'transitioning' && (
        <div className="absolute bottom-[-15%] w-[80vw] h-[35vh] bg-gradient-to-t from-[#007A5E]/15 to-transparent blur-[120px] pointer-events-none" />
      )}
    </motion.div>
  );
};
