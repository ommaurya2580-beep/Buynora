import React from 'react';

export const ShimmerCard: React.FC = () => {
  return (
    <div className="glass rounded-2xl p-4 border border-gray-200/50 dark:border-gray-800/50 flex flex-col gap-3 animate-pulse">
      <div className="w-full aspect-square rounded-xl bg-gray-200 dark:bg-gray-800 shimmer-effect" />
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3 shimmer-effect" />
      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4 shimmer-effect" />
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-3.5 h-3.5 rounded-full bg-gray-200 dark:bg-gray-800 shimmer-effect" />
        ))}
      </div>
      <div className="flex justify-between items-center mt-2">
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4 shimmer-effect" />
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/3 shimmer-effect" />
      </div>
    </div>
  );
};

export const ShimmerGrid: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <ShimmerCard key={i} />
      ))}
    </div>
  );
};

export const ShimmerPDP: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
      <div className="flex flex-col gap-4">
        <div className="w-full aspect-[4/3] rounded-2xl bg-gray-200 dark:bg-gray-800 shimmer-effect" />
        <div className="flex gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-20 h-20 rounded-xl bg-gray-200 dark:bg-gray-800 shimmer-effect" />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4 shimmer-effect" />
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-3/4 shimmer-effect" />
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/3 shimmer-effect" />
        <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded w-full shimmer-effect" />
        <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/2 shimmer-effect" />
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mt-4 shimmer-effect" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full shimmer-effect" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6 shimmer-effect" />
        </div>
      </div>
    </div>
  );
};
