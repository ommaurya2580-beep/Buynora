import React from 'react';

interface SpecificationTabsProps {
  specs: Record<string, string>;
}

export const SpecificationTabs: React.FC<SpecificationTabsProps> = ({ specs }) => {
  return (
    <section className="space-y-4 text-left">
      <h3 className="text-lg font-black text-text-primary border-b border-gray-150 dark:border-gray-800 pb-2">
        Technical Specifications
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {Object.entries(specs).map(([key, val]) => (
          <div key={key} className="flex border-b border-gray-100 dark:border-gray-800/50 py-3 text-xs justify-between pr-4">
            <span className="font-semibold text-gray-400">{key}</span>
            <span className="font-bold text-text-primary">{val}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
