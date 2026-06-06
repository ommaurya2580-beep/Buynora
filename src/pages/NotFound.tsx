import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="py-20 text-center space-y-6 text-left max-w-md mx-auto">
      <div className="p-4 bg-indigo-500/10 text-indigo-500 rounded-full inline-block animate-bounce">
        <HelpCircle className="w-12 h-12" />
      </div>
      <h2 className="text-3xl font-black text-gray-900 dark:text-white">Page Not Found</h2>
      <p className="text-xs text-gray-500 max-w-xs mx-auto">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className="pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-3 rounded-full shadow"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>
      </div>
    </div>
  );
};
