import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParticleBackground } from './ParticleBackground';
import { LogoAnimation } from './LogoAnimation';
import './brandAnimation.css';

interface BrandSplashProps {
  onTransitionStart: () => void;
  onComplete: () => void;
}

export const BrandSplash: React.FC<BrandSplashProps> = ({ 
  onTransitionStart, 
  onComplete 
}) => {
  const [scene, setScene] = useState(1);
  const [sloganText, setSloganText] = useState('BUY MODERN');
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

    // Timeline durations
    // Scene 1: Logo Reveal (0s - 1s)
    // Scene 2: Brand Text Reveal (1s - 2s)
    const t2 = setTimeout(() => {
      setScene(2);
    }, 1000);

    // Scene 3: Slogan Transformation (2s - 3s)
    const t3 = setTimeout(() => {
      setScene(3);
    }, 2000);

    // Morph "BUY MODERN" into "BUY PREMIUM" (2.6s)
    const t4 = setTimeout(() => {
      setSloganText('BUY PREMIUM');
    }, 2600);

    // Morph "BUY PREMIUM" into final logo text "BUYNORA" (3.2s)
    const t5 = setTimeout(() => {
      setSloganText('BUYNORA');
    }, 3200);

    // Scene 4: Transition into Website (3.8s)
    // Logo elements move to navbar, background fades
    const t6 = setTimeout(() => {
      setScene(4);
      onTransitionStart();
    }, 3800);

    // Complete unmount (4.6s)
    const t7 = setTimeout(() => {
      sessionStorage.setItem('buynora_splash_shown', 'true');
      onComplete();
    }, 4600);

    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
    };
  }, [onTransitionStart, onComplete]);

  if (!hasShown) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={scene === 4 ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden select-none"
    >
      {/* Deep Emerald Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#001F1A] to-[#000000]" />
      
      {/* Particle Overlay */}
      {scene < 4 && <ParticleBackground />}

      {/* Ripple/wave behind the logo */}
      {scene >= 1 && scene < 4 && (
        <div className="radial-wave absolute top-[43%] left-1/2 -translate-x-1/2 -translate-y-1/2" />
      )}

      {/* Center Group */}
      <AnimatePresence>
        {scene < 4 && (
          <motion.div
            key="splash-center"
            exit={{ 
              opacity: 0, 
              scale: 0.8,
              y: -50,
              filter: 'blur(10px)',
              transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] } 
            }}
            className="flex flex-col items-center justify-center z-10 gap-6"
          >
            {/* Logo box with glowing border */}
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1.0, opacity: 1 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="emerald-glow-lg rounded-2xl bg-[#001F1A]/60 backdrop-blur-md p-5 border border-[#00D9A6]/20 relative shadow-[0_0_50px_rgba(0,217,166,0.15)] glass-reflection"
            >
              <LogoAnimation size={96} layoutId="logo-bag" />
            </motion.div>

            {/* Sub-text revealing / morphing */}
            <div className="h-14 flex items-center justify-center mt-2">
              <AnimatePresence mode="wait">
                {scene === 2 && (
                  <motion.h1
                    key="buynora-reveal"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-3xl font-black tracking-[0.25em] text-white flex gap-1 font-sans"
                  >
                    {Array.from('BUYNORA').map((char, index) => (
                      <span
                        key={index}
                        className="letter-reveal text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#00D9A6]"
                        style={{ animationDelay: `${index * 0.08}s` }}
                      >
                        {char}
                      </span>
                    ))}
                  </motion.h1>
                )}

                {scene === 3 && (
                  <motion.div
                    key={sloganText}
                    initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.9 }}
                    animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                    exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
                    transition={{ duration: 0.45 }}
                    className={`text-2xl font-black tracking-widest text-center font-sans ${
                      sloganText === 'BUYNORA' 
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#00D9A6] via-[#38FFD3] to-[#007A5E] dissolve-glow text-3.5xl tracking-[0.25em]' 
                        : 'text-white'
                    }`}
                  >
                    {sloganText.split(' ').map((word, wIdx) => (
                      <span key={wIdx} className="mx-2">
                        {word === 'PREMIUM' || word === 'MODERN' ? (
                          <span className="text-[#00D9A6]">{word}</span>
                        ) : (
                          word
                        )}
                      </span>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ambient reflection glow on bottom */}
      <div className="absolute bottom-[-15%] w-[80vw] h-[35vh] bg-gradient-to-t from-[#007A5E]/15 to-transparent blur-[120px] pointer-events-none" />
    </motion.div>
  );
};
