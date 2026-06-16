import React from 'react';
import { motion } from 'framer-motion';

interface LogoAnimationProps {
  layoutId?: string;
  className?: string;
  size?: number;
}

export const LogoAnimation: React.FC<LogoAnimationProps> = ({ 
  layoutId = 'logo-bag',
  className = '',
  size = 64
}) => {
  return (
    <motion.div
      layoutId={layoutId}
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-[#00D9A6]"
      >
        {/* Draw the handle of the shopping bag */}
        <motion.path
          d="M8 10V6C8 3.79086 9.79086 2 12 2C14.2091 2 16 3.79086 16 6V10"
          stroke="url(#bag-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
        {/* Draw the body of the shopping bag */}
        <motion.path
          d="M6 9L3 12V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V12L18 9H6Z"
          stroke="url(#bag-gradient)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
        />
        
        {/* Curved accent line for a premium touch */}
        <motion.path
          d="M9 14C9 14 10.5 15.5 12 15.5C13.5 15.5 15 14 15 14"
          stroke="url(#bag-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.8 }}
        />

        <defs>
          <linearGradient id="bag-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#007A5E" />
            <stop offset="50%" stopColor="#00D9A6" />
            <stop offset="100%" stopColor="#38FFD3" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
};
