/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, Music } from 'lucide-react';
import { Modal } from './Modal';

interface VoiceSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchResult: (result: string) => void;
}

const voiceCommands = [
  "iphone",
  "nike shoes",
  "sony headphones",
  "macbook pro",
  "hoodies",
  "accessories"
];

export const VoiceSearch: React.FC<VoiceSearchProps> = ({ 
  isOpen, 
  onClose, 
  onSearchResult 
}) => {
  const [status, setStatus] = useState<'listening' | 'processing' | 'done'>('listening');
  const [resultText, setResultText] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    setStatus('listening');
    setResultText('Listening...');

    // Simulate speech detection
    const timer1 = setTimeout(() => {
      setStatus('processing');
      setResultText('Processing speech...');
      
      const randomCommand = voiceCommands[Math.floor(Math.random() * voiceCommands.length)];
      
      const timer2 = setTimeout(() => {
        setStatus('done');
        setResultText(`"${randomCommand}"`);
        
        const timer3 = setTimeout(() => {
          onSearchResult(randomCommand);
          onClose();
        }, 1000);
        
        return () => clearTimeout(timer3);
      }, 1500);

      return () => clearTimeout(timer2);
    }, 2500);

    return () => clearTimeout(timer1);
  }, [isOpen, onSearchResult, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Smart Voice Search" size="sm">
      <div className="flex flex-col items-center justify-center py-8 text-center">
        
        {/* Animated Visualizer */}
        <div className="relative mb-8 flex justify-center items-center h-32 w-32">
          {status === 'listening' && (
            <>
              <motion.div
                animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-indigo-500/20"
              />
              <motion.div
                animate={{ scale: [1, 2.3, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.8, delay: 0.6, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-indigo-500/10"
              />
            </>
          )}

          <div className={`p-6 rounded-full text-text-inverted shadow-xl ${
            status === 'processing' ? 'bg-amber-500 animate-bounce' : 
            status === 'done' ? 'bg-emerald-500' : 'bg-indigo-600'
          }`}>
            {status === 'processing' ? (
              <Music className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </div>
        </div>

        <h4 className="text-xl font-bold text-text-primary mb-2">
          {status === 'listening' ? 'Speak now...' : status === 'processing' ? 'Thinking...' : 'Search Term Found'}
        </h4>
        
        <p className="text-lg font-semibold text-indigo-500 dark:text-indigo-400 italic">
          {resultText}
        </p>

        <p className="text-xs text-gray-400 mt-6 max-w-[240px]">
          Try saying <span className="font-bold">"iphone"</span>, <span className="font-bold">"nike shoes"</span> or <span className="font-bold">"headphones"</span>.
        </p>
      </div>
    </Modal>
  );
};
