import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Plus, List, BarChart, HardDrive, AlertTriangle,
  Eye, MousePointer, TrendingUp, DollarSign, Activity, Settings, ShieldAlert
} from 'lucide-react';
import { useCampaignsList, useCampaignAnalytics } from '../hooks/useCampaigns';
import { formatCurrency } from '../../../../utils/formatters';

// Read emergency override settings from localStorage on first render (lazy initializer pattern)
const getStoredOverride = () => {
  try {
    const saved = localStorage.getItem('buynora_emergency_override');
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return null;
};

const CampaignDashboard: React.FC = () => {
  const { data: campaigns = [], isLoading: loadingCamps } = useCampaignsList();
  const { data: analytics, isLoading: loadingAnalytics } = useCampaignAnalytics();

  // Emergency Override System State — lazy initializers read from localStorage directly
  const stored = getStoredOverride();
  const [isOverrideEnabled, setIsOverrideEnabled] = useState<boolean>(() => stored?.enabled ?? false);
  const [overrideType, setOverrideType] = useState<string>(() => stored?.type ?? 'Emergency Notice');
  const [overrideTitle, setOverrideTitle] = useState<string>(() => stored?.title ?? 'System Upgrade in Progress');
  const [overrideSubtitle, setOverrideSubtitle] = useState<string>(() => stored?.subtitle ?? 'We are upgrading our payment systems. Services will resume shortly.');
  const [overrideBannerColor, setOverrideBannerColor] = useState<string>(() => stored?.color ?? 'bg-gradient-to-r from-red-600 to-amber-600');

  const saveOverrideSettings = (enabled: boolean = isOverrideEnabled) => {
    const obj = {
      enabled,
      type: overrideType,
      title: overrideTitle,
      subtitle: overrideSubtitle,
      color: overrideBannerColor
    };
    localStorage.setItem('buynora_emergency_override', JSON.stringify(obj));
    setIsOverrideEnabled(enabled);
  };

  const toggleOverride = () => {
    const nextVal = !isOverrideEnabled;
    saveOverrideSettings(nextVal);
  };

  if (loadingCamps || loadingAnalytics || !analytics) {
    return <div className="py-20 text-center text-xs text-gray-400">Loading Dashboard...</div>;
  }

  // Find Top Campaign
  const topCampaignName = campaigns.length > 0
    ? [...campaigns].sort((a, b) => (b.revenue || 0) - (a.revenue || 0))[0]?.campaignName
    : "None";

  return (
    <div className="space-y-8 text-left select-none">
      
      {/* Header and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-text-primary tracking-tight">Hero Campaign Dashboard</h2>
          <p className="text-xs text-gray-400">Enterprise Homepage Banner Control, Rotation & Target Engine</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/admin/hero-campaigns/create"
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-text-inverted text-xs font-bold px-4 py-2.5 rounded-xl shadow cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" /> Create Campaign
          </Link>
          <Link
            to="/admin/hero-campaigns/list"
            className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-250 dark:hover:bg-slate-700 text-text-secondary text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-all"
          >
            <List className="w-4 h-4" /> All Campaigns
          </Link>
          <Link
            to="/admin/hero-campaigns/analytics"
            className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-250 dark:hover:bg-slate-700 text-text-secondary text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-all"
          >
            <BarChart className="w-4 h-4" /> Advanced Analytics
          </Link>
          <Link
            to="/admin/hero-campaigns/assets"
            className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-250 dark:hover:bg-slate-700 text-text-secondary text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-all"
          >
            <HardDrive className="w-4 h-4" /> Asset Library
          </Link>
        </div>
      </div>

      {/* EMERGENCY OVERRIDE BOX */}
      <div className={`glass p-6 rounded-3xl border transition-all duration-300 ${isOverrideEnabled ? 'border-red-500 bg-red-500/10' : 'border-gray-200/50 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 text-left">
            <div className={`p-3 rounded-2xl flex-shrink-0 ${isOverrideEnabled ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-text-primary uppercase tracking-wider flex items-center gap-2">
                Emergency Override Mode {isOverrideEnabled && <span className="px-2 py-0.5 rounded bg-red-500 text-white font-black text-[9px]">ACTIVE</span>}
              </h4>
              <p className="text-xs text-gray-500 mt-1 max-w-xl leading-relaxed">
                Instantly swap out all running homepage campaigns with a single system notice, breaking news offer, or maintenance banner. Bypasses priority rules.
              </p>
            </div>
          </div>
          <div>
            <button
              onClick={toggleOverride}
              className={`font-bold text-xs px-5 py-3 rounded-2xl cursor-pointer transition-all ${
                isOverrideEnabled 
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20' 
                  : 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/10'
              }`}
            >
              {isOverrideEnabled ? 'Disable Override' : 'Enable Override'}
            </button>
          </div>
        </div>

        {/* Override configuration */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 border-t border-gray-250/20 pt-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase">Override Banner Type</label>
            <select
              value={overrideType}
              onChange={e => { setOverrideType(e.target.value); saveOverrideSettings(); }}
              className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none font-bold"
            >
              <option value="Maintenance Banner">🛠️ Maintenance Banner</option>
              <option value="Breaking Offer">🔥 Breaking Offer</option>
              <option value="Mega Sale">⚡ Emergency Mega Sale</option>
              <option value="Emergency Notice">⚠️ Emergency Notice</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-[10px] font-black text-gray-400 uppercase">Override Notice Message</label>
            <input
              type="text"
              value={overrideTitle}
              onChange={e => { setOverrideTitle(e.target.value); }}
              onBlur={() => saveOverrideSettings()}
              placeholder="Notice Heading"
              className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase">Banner Theme</label>
            <select
              value={overrideBannerColor}
              onChange={e => { setOverrideBannerColor(e.target.value); saveOverrideSettings(); }}
              className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none font-bold"
            >
              <option value="bg-gradient-to-r from-red-600 to-amber-600">🔴 Crimson Warning</option>
              <option value="bg-gradient-to-r from-blue-600 to-indigo-600">🔵 Deep Ocean Info</option>
              <option value="bg-gradient-to-r from-purple-600 to-pink-600">🟣 Purple Premium</option>
              <option value="bg-gradient-to-r from-slate-800 to-black">⚫ Stealth Night</option>
            </select>
          </div>
        </div>
        <div className="mt-3">
          <input
            type="text"
            value={overrideSubtitle}
            onChange={e => { setOverrideSubtitle(e.target.value); }}
            onBlur={() => saveOverrideSettings()}
            placeholder="Sub-notice / details message..."
            className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
          />
        </div>
      </div>

      {/* KPI metrics - 9 requested metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        
        <div className="glass p-5 rounded-2xl border border-gray-250/50 dark:border-slate-850/50 bg-bg-surface/40 flex justify-between items-center">
          <div>
            <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Total Campaigns</span>
            <h3 className="text-lg font-black text-text-primary mt-1">{analytics.totalCampaigns}</h3>
          </div>
          <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-lg">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-gray-250/50 dark:border-slate-850/50 bg-bg-surface/40 flex justify-between items-center">
          <div>
            <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Active Campaigns</span>
            <h3 className="text-lg font-black text-emerald-500 mt-1">{analytics.activeCampaigns}</h3>
          </div>
          <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-lg">
            <Activity className="w-4 h-4" />
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-gray-250/50 dark:border-slate-850/50 bg-bg-surface/40 flex justify-between items-center">
          <div>
            <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Scheduled</span>
            <h3 className="text-lg font-black text-blue-500 mt-1">{analytics.scheduledCampaigns}</h3>
          </div>
          <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-lg">
            <Settings className="w-4 h-4" />
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-gray-250/50 dark:border-slate-850/50 bg-bg-surface/40 flex justify-between items-center">
          <div>
            <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Expired</span>
            <h3 className="text-lg font-black text-gray-500 mt-1">{analytics.expiredCampaigns}</h3>
          </div>
          <div className="p-2.5 bg-gray-550/10 text-gray-400 rounded-lg">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-gray-250/50 dark:border-slate-850/50 bg-bg-surface/40 flex justify-between items-center">
          <div>
            <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Total Views</span>
            <h3 className="text-lg font-black text-text-primary mt-1">{analytics.totalViews.toLocaleString()}</h3>
          </div>
          <div className="p-2.5 bg-purple-500/10 text-purple-500 rounded-lg">
            <Eye className="w-4 h-4" />
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-gray-250/50 dark:border-slate-850/50 bg-bg-surface/40 flex justify-between items-center">
          <div>
            <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Total Clicks</span>
            <h3 className="text-lg font-black text-text-primary mt-1">{analytics.totalClicks.toLocaleString()}</h3>
          </div>
          <div className="p-2.5 bg-pink-500/10 text-pink-500 rounded-lg">
            <MousePointer className="w-4 h-4" />
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-gray-250/50 dark:border-slate-850/50 bg-bg-surface/40 flex justify-between items-center">
          <div>
            <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Avg. CTR</span>
            <h3 className="text-lg font-black text-violet-500 mt-1">{analytics.ctr}%</h3>
          </div>
          <div className="p-2.5 bg-violet-500/10 text-violet-500 rounded-lg">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-gray-250/50 dark:border-slate-850/50 bg-bg-surface/40 flex justify-between items-center">
          <div>
            <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Revenue</span>
            <h3 className="text-lg font-black text-emerald-600 dark:text-emerald-450 mt-1">{formatCurrency(analytics.totalRevenue)}</h3>
          </div>
          <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-lg">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-gray-250/50 dark:border-slate-850/50 bg-bg-surface/40 flex justify-between items-center">
          <div>
            <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Conversions</span>
            <h3 className="text-lg font-black text-text-primary mt-1">{analytics.totalConversions}</h3>
          </div>
          <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-lg">
            <Activity className="w-4 h-4" />
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-gray-250/50 dark:border-slate-850/50 bg-bg-surface/40 flex justify-between items-center">
          <div>
            <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Top Campaign</span>
            <h3 className="text-xs font-black text-purple-600 dark:text-purple-400 mt-1.5 truncate max-w-[120px]">{topCampaignName}</h3>
          </div>
          <div className="p-2.5 bg-rose-500/10 text-rose-500 rounded-lg">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>

      </div>

      {/* Main Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Campaign Mini list */}
        <div className="lg:col-span-2 glass p-6 rounded-3xl border border-gray-250/50 dark:border-slate-850/50 bg-bg-surface/40 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-150/40 dark:border-slate-800/40 pb-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-400">Current Campaign Priorities</h4>
            <Link to="/admin/hero-campaigns/list" className="text-[11px] text-purple-600 dark:text-purple-400 font-bold hover:underline">View All</Link>
          </div>
          
          <div className="divide-y divide-gray-100/50 dark:divide-slate-800/50">
            {campaigns.slice(0, 4).map((c) => (
              <div key={c.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 border border-gray-150 dark:border-slate-700">
                    <img src={c.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                    <h5 className="text-xs font-black text-text-primary">{c.campaignName}</h5>
                    <span className="text-[9px] bg-indigo-50/80 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold uppercase px-2 py-0.5 rounded tracking-wide mt-1 inline-block">
                      {c.campaignType}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-gray-400 font-semibold">Priority</p>
                    <p className="text-xs font-black text-text-secondary mt-0.5">#{c.priority}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-semibold">Status</p>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase mt-1 inline-block ${
                      c.status === 'Published' ? 'bg-emerald-500/10 text-emerald-500' :
                      c.status === 'Scheduled' ? 'bg-blue-500/10 text-blue-500' :
                      c.status === 'Draft' ? 'bg-gray-500/10 text-gray-500' :
                      'bg-rose-500/10 text-rose-500'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Config Tips / A/B Test Mini Board */}
        <div className="glass p-6 rounded-3xl border border-gray-250/50 dark:border-slate-850/50 bg-bg-surface/40 flex flex-col justify-between">
          <div>
            <div className="border-b border-gray-150/40 dark:border-slate-800/40 pb-3 mb-4">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-400">A/B Testing Active Status</h4>
            </div>
            
            <div className="space-y-4 text-left">
              <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                <span className="text-[9px] bg-indigo-500/10 text-indigo-500 font-black px-2 py-0.5 rounded uppercase">Active Test: ab_1</span>
                <h5 className="font-bold text-xs text-text-primary mt-2">Sony Headphones vs iPhone Banners</h5>
                <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-indigo-500/10 text-[10px]">
                  <div>
                    <span className="text-gray-400 font-semibold uppercase">Variant A (Sony)</span>
                    <p className="font-black text-text-primary mt-0.5">1,560 Views</p>
                    <p className="font-black text-emerald-600 dark:text-emerald-450">14.42% CTR</p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-semibold uppercase">Variant B (iPhone)</span>
                    <p className="font-black text-text-primary mt-0.5">2,600 Views</p>
                    <p className="font-black text-emerald-600 dark:text-emerald-450">16.15% CTR</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-[10px] font-bold text-emerald-700 dark:text-emerald-450 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 flex-shrink-0" />
                <span>Variant B is currently winning with +12% CTR performance.</span>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-150/40 dark:border-slate-800/40 mt-4 text-[10px] font-medium text-gray-400">
            Split traffic rule: 50% / 50%
          </div>
        </div>

      </div>

    </div>
  );
};

export default CampaignDashboard;
