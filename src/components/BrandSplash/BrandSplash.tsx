import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParticleBackground } from './ParticleBackground';
import { LogoAnimation } from './LogoAnimation';
import './brandAnimation.css';

interface BrandSplashProps {
  onTransitionStart: () => void;
  onComplete: () => void;
}

type SplashStage = 'logo' | 'modern' | 'premium' | 'buynora' | 'transitioning' | 'complete';

export const BrandSplash: React.FC<BrandSplashProps> = ({ 
  onTransitionStart, 
  onComplete 
}) => {
  const [stage, setStage] = useState<SplashStage>('logo');
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Session storage check to prevent replay on navigation
    const isSplashShown = sessionStorage.getItem('buynora_splash_shown');
    if (isSplashShown === 'true') {
      onTransitionStart();
      onComplete();
      return;
    }

    // Mark as shown immediately to prevent double-mount replay in React StrictMode
    sessionStorage.setItem('buynora_splash_shown', 'true');
    setHasShown(true);

    // Timeline durations
    // 0s - 1.5s: Show only the Buynora logo in the center (logo stage)
    const t1 = setTimeout(() => {
      setStage('modern');
    }, 1500);

    // 1.5s - 2.5s: Show the first slogan "BUY MODERN"
    const t2 = setTimeout(() => {
      setStage('premium');
    }, 2500);

    // 2.5s - 3.5s: Transform "BUY MODERN" -> "BUY PREMIUM"
    const t3 = setTimeout(() => {
      setStage('buynora');
    }, 3500);

    // 3.5s - 4.5s: Transform "BUY PREMIUM" -> "BUYNORA"
    const t4 = setTimeout(() => {
      setStage('transitioning');
      onTransitionStart(); // Trigger navbar logo mount & homepage fade-in
    }, 4500);

    // 4.5s - 5.5s: Transition to website (background fades, logo slides to navbar)
    const t5 = setTimeout(() => {
      setStage('complete');
      onComplete(); // completely unmount overlay
    }, 5500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onTransitionStart, onComplete]);

  if (!hasShown || stage === 'complete') return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={stage === 'transitioning' ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 1.0, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden select-none"
    >
      {/* Deep Emerald Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#001F1A] to-[#000000]" />
      
      {/* Particle Overlay (only active during splash, disabled on transitioning to save performance) */}
      {stage !== 'transitioning' && <ParticleBackground />}

      {/* Ripple/wave behind the logo */}
      {stage !== 'transitioning' && (
        <div className="radial-wave absolute top-[43%] left-1/2 -translate-x-1/2 -translate-y-1/2" />
      )}

      {/* Center Group */}
      {stage !== 'transitioning' && (
        <div className="flex flex-col items-center justify-center z-10 gap-6">
          {/* Logo box with glowing border */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1.0, 
              opacity: 1,
              y: [0, -6, 0]
            }}
            transition={{ 
              scale: { duration: 1.5, ease: "easeOut" },
              opacity: { duration: 1.2, ease: "easeOut" },
              y: { repeat: Infinity, duration: 4, ease: "easeInOut" }
            }}
            className="emerald-glow-lg rounded-2xl bg-[#001F1A]/60 backdrop-blur-md p-5 border border-[#00D9A6]/20 relative shadow-[0_0_50px_rgba(0,217,166,0.15)] glass-reflection"
          >
            <LogoAnimation size={96} layoutId="logo-bag" />
          </motion.div>

          {/* Sub-text revealing / morphing */}
          <div className="h-16 flex items-center justify-center mt-2">
            <AnimatePresence mode="wait">
              {stage === 'modern' && (
                <motion.div
                  key="modern"
                  initial={{ opacity: 0, filter: 'blur(8px)', scale: 0.95 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', scale: 1.0 }}
                  exit={{ opacity: 0, filter: 'blur(8px)', scale: 0.95 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="text-2xl font-extrabold tracking-widest text-white font-sans drop-shadow-[0_0_10px_rgba(0,217,166,0.3)]"
                >
                  BUY <span className="text-[#00D9A6]">MODERN</span>
                </motion.div>
              )}

              {stage === 'premium' && (
                <motion.div
                  key="premium"
                  initial={{ opacity: 0, filter: 'blur(8px)', scale: 0.95 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', scale: 1.0 }}
                  exit={{ opacity: 0, filter: 'blur(8px)', scale: 0.95 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="text-2xl font-extrabold tracking-widest text-white font-sans drop-shadow-[0_0_10px_rgba(0,217,166,0.3)]"
                >
                  BUY <span className="text-[#00D9A6]">PREMIUM</span>
                </motion.div>
              )}

              {stage === 'buynora' && (
                <motion.div
                  key="buynora"
                  layoutId="logo-text"
                  initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', scale: 1.15 }}
                  exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="text-3.5xl font-black tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-[#00D9A6] via-[#38FFD3] to-[#007A5E] drop-shadow-[0_0_20px_rgba(0,217,166,0.6)] font-sans uppercase"
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
