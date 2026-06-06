/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-md w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => {
            const Icon = toast.type === 'success' ? CheckCircle : toast.type === 'error' ? AlertCircle : Info;
            const bgClass = 
              toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
              toast.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400' :
              'bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400';
            
            const accentClass = 
              toast.type === 'success' ? 'bg-emerald-500' :
              toast.type === 'error' ? 'bg-rose-500' :
              'bg-indigo-500';

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
                className={`glass flex items-start gap-3 p-4 rounded-xl shadow-lg border pointer-events-auto overflow-hidden relative ${bgClass}`}
              >
                <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1 text-sm font-medium pr-4">{toast.message}</div>
                <button 
                  onClick={() => removeToast(toast.id)} 
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
                <motion.div 
                  initial={{ width: '100%' }}
                  animate={{ width: 0 }}
                  transition={{ duration: 4, ease: 'linear' }}
                  className={`absolute bottom-0 left-0 h-1 ${accentClass}`}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
