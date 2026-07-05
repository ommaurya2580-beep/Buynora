import React, { useState } from 'react';
import { Search, Copy, Download, ChevronDown, ChevronUp, FileText, Check } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

interface SpecificationTabsProps {
  specs: Record<string, string>;
}

export const SpecificationTabs: React.FC<SpecificationTabsProps> = ({ specs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  // Categorize specs dynamically
  const getCategorizedSpecs = () => {
    const categories: Record<string, Record<string, string>> = {
      'General Info': {},
      'Performance & Hardware': {},
      'Physical Attributes': {},
      'Warranty & Support': {}
    };

    Object.entries(specs).forEach(([key, val]) => {
      const k = key.toLowerCase();
      if (k.includes('warranty') || k.includes('origin') || k.includes('policy')) {
        categories['Warranty & Support'][key] = val;
      } else if (k.includes('weight') || k.includes('material') || k.includes('dimension') || k.includes('size')) {
        categories['Physical Attributes'][key] = val;
      } else if (k.includes('processor') || k.includes('chip') || k.includes('battery') || k.includes('camera') || k.includes('display') || k.includes('ram')) {
        categories['Performance & Hardware'][key] = val;
      } else {
        categories['General Info'][key] = val;
      }
    });

    // Clean empty categories
    return Object.fromEntries(
      Object.entries(categories).filter(([_, content]) => Object.keys(content).length > 0)
    );
  };

  const categorized = getCategorizedSpecs();

  // Active accordion tabs
  const [expandedTabs, setExpandedTabs] = useState<Record<string, boolean>>({
    'General Info': true,
    'Performance & Hardware': true,
    'Physical Attributes': true,
    'Warranty & Support': true
  });

  const toggleTab = (cat: string) => {
    setExpandedTabs(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Copy Specifications to clipboard
  const handleCopySpecs = () => {
    const text = Object.entries(specs)
      .map(([key, val]) => `${key}: ${val}`)
      .join('\n');
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast("Specifications copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  // Simulated PDF download
  const handleDownloadPDF = () => {
    showToast("Spec sheet PDF generation started...", "info");
    setTimeout(() => {
      showToast("Download completed successfully!", "success");
    }, 1500);
  };

  return (
    <section className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-150 dark:border-gray-800 pb-3.5 gap-4">
        <h3 className="text-lg font-black text-text-primary">
          Technical Specifications
        </h3>
        
        {/* Actions bar */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopySpecs}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary transition-colors bg-gray-100 dark:bg-slate-800/80 hover:bg-gray-150 px-3 py-1.5 rounded-xl cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy Specs"}
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary transition-colors bg-gray-100 dark:bg-slate-800/80 hover:bg-gray-150 px-3 py-1.5 rounded-xl cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            PDF Spec Sheet
          </button>
        </div>
      </div>

      {/* Real-time search filter */}
      <div className="relative max-w-md">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          placeholder="Search technical specifications..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="bg-gray-150 dark:bg-slate-800 text-xs pl-9 pr-4 py-2.5 rounded-xl outline-none focus:border-primary border border-transparent w-full font-medium"
        />
      </div>

      {/* Categorized Spec Accordions */}
      <div className="space-y-4">
        {Object.entries(categorized).map(([catName, items]) => {
          // Filter items based on search term
          const filteredItems = Object.entries(items).filter(([k, v]) => 
            k.toLowerCase().includes(searchTerm.toLowerCase()) || 
            v.toLowerCase().includes(searchTerm.toLowerCase())
          );

          if (filteredItems.length === 0) return null;

          const isExpanded = expandedTabs[catName] ?? true;

          return (
            <div key={catName} className="glass rounded-2xl border border-gray-200/50 dark:border-gray-800/85 overflow-hidden shadow-sm">
              <button
                onClick={() => toggleTab(catName)}
                className="w-full flex items-center justify-between px-5 py-4 font-bold text-xs sm:text-sm text-text-primary hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer text-left uppercase tracking-wider"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-500" /> {catName}
                </span>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                  {filteredItems.map(([key, val]) => (
                    <div 
                      key={key} 
                      className="flex border-b border-gray-100 dark:border-slate-800/40 py-3.5 text-xs justify-between"
                    >
                      <span className="font-semibold text-gray-400 mr-4">{key}</span>
                      <span className="font-bold text-text-primary text-right">{val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
