import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, BarChart, Bar
} from 'recharts';
import { 
  TrendingUp, Eye, MousePointer, DollarSign, Activity, Percent,
  Calendar, ArrowRight, Award, ShieldAlert, Sparkles, RefreshCw
} from 'lucide-react';
import { useCampaignAnalytics, useABTests } from '../hooks/useCampaigns';
import { formatCurrency } from '../../../../utils/formatters';

export const CampaignAnalytics: React.FC = () => {
  const { data: analytics, isLoading: loadingAnalytics, refetch } = useCampaignAnalytics();
  const { data: abtests = [], isLoading: loadingAB } = useABTests();

  const [activeMetricTab, setActiveMetricTab] = useState<'views' | 'clicks' | 'ctr' | 'revenue'>('views');

  if (loadingAnalytics || loadingAB || !analytics) {
    return <div className="py-20 text-center text-xs text-gray-400">Loading Campaign Analytics...</div>;
  }

  const colors = ['#6366f1', '#ec4899', '#3b82f6', '#10b981', '#a855f7'];

  // Map charts based on active metric tab
  const getChartData = () => {
    switch (activeMetricTab) {
      case 'views':
        return {
          data: analytics.viewsTrend,
          key: 'views',
          color: '#6366f1',
          title: 'Daily Views Trend'
        };
      case 'clicks':
        return {
          data: analytics.clicksTrend,
          key: 'clicks',
          color: '#ec4899',
          title: 'Daily Clicks Trend'
        };
      case 'ctr':
        return {
          data: analytics.ctrTrend,
          key: 'ctr',
          color: '#a855f7',
          title: 'CTR Trend (%)'
        };
      case 'revenue':
        return {
          data: analytics.revenueTrend,
          key: 'revenue',
          color: '#10b981',
          title: 'Daily Revenue Generated'
        };
    }
  };

  const chartMeta = getChartData();

  return (
    <div className="space-y-8 text-left select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-text-primary tracking-tight">Campaign Intelligence</h2>
          <p className="text-xs text-gray-400">Deep-dive performance charts, CTR conversion analytics and A/B Test results</p>
        </div>
        <button
          onClick={() => { refetch(); }}
          className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-250 dark:hover:bg-slate-700 text-text-secondary text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-all"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Metrics
        </button>
      </div>

      {/* Overview Cards (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="glass p-5 rounded-2xl border border-gray-250/50 dark:border-slate-850/50 bg-bg-surface/40 flex justify-between items-center">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Impressions</span>
            <h3 className="text-xl font-black text-text-primary mt-1">{analytics.totalViews.toLocaleString()}</h3>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
            <Eye className="w-5 h-5" />
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-gray-250/50 dark:border-slate-850/50 bg-bg-surface/40 flex justify-between items-center">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Accumulated Clicks</span>
            <h3 className="text-xl font-black text-text-primary mt-1">{analytics.totalClicks.toLocaleString()}</h3>
          </div>
          <div className="p-3 bg-pink-500/10 text-pink-500 rounded-xl">
            <MousePointer className="w-5 h-5" />
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-gray-250/50 dark:border-slate-850/50 bg-bg-surface/40 flex justify-between items-center">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Average CTR</span>
            <h3 className="text-xl font-black text-violet-500 mt-1">{analytics.ctr}%</h3>
          </div>
          <div className="p-3 bg-violet-500/10 text-violet-500 rounded-xl">
            <Percent className="w-5 h-5" />
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-gray-250/50 dark:border-slate-850/50 bg-bg-surface/40 flex justify-between items-center">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tracked Revenue</span>
            <h3 className="text-xl font-black text-emerald-600 dark:text-emerald-450 mt-1">{formatCurrency(analytics.totalRevenue)}</h3>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Charts & Breakdown Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Metric Chart */}
        <div className="lg:col-span-2 glass p-6 rounded-3xl border border-gray-250/50 dark:border-slate-850/50 bg-bg-surface/40 flex flex-col justify-between space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150/40 dark:border-slate-800/40 pb-4">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-400">{chartMeta.title}</h4>
            <div className="flex bg-gray-100 dark:bg-slate-800/50 p-1 rounded-xl gap-1.5 w-fit text-[10px] font-bold">
              {(['views', 'clicks', 'ctr', 'revenue'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveMetricTab(tab)}
                  className={`px-3 py-1.5 rounded-lg uppercase transition-all cursor-pointer ${
                    activeMetricTab === tab 
                      ? 'bg-purple-600 text-white shadow-sm' 
                      : 'text-gray-400 hover:text-text-primary'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartMeta.data}>
                <defs>
                  <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartMeta.color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={chartMeta.color} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.06} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey={chartMeta.key} stroke={chartMeta.color} fillOpacity={1} fill="url(#colorMetric)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device breakdown & Top Performance Share */}
        <div className="glass p-6 rounded-3xl border border-gray-250/50 dark:border-slate-850/50 bg-bg-surface/40 flex flex-col justify-between">
          <div>
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-400 border-b border-gray-150/40 dark:border-slate-800/40 pb-4 mb-6">Device Impression Share</h4>
            <div className="h-44 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.deviceBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {analytics.deviceBreakdown.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-gray-500 pt-4 border-t border-gray-150/40 dark:border-slate-800/40 mt-4">
            {analytics.deviceBreakdown.map((d: any, idx: number) => (
              <div key={d.name} className="flex flex-col items-center">
                <span className="w-3 h-3 rounded-full mb-1" style={{ backgroundColor: colors[idx % colors.length] }} />
                <span>{d.name}</span>
                <span className="text-text-primary font-black mt-0.5">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* A/B Test In-Depth Conversion & Winner Panel */}
      <div className="glass p-6 rounded-3xl border border-gray-250/50 dark:border-slate-850/50 bg-bg-surface/40 space-y-6">
        <div className="border-b border-gray-150/40 dark:border-slate-800/40 pb-4 text-left">
          <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-400">A/B Testing Intelligence Reports</h4>
        </div>

        <div className="space-y-6">
          {abtests.map(ab => {
            const isWinnerA = ab.clicksA > ab.clicksB;
            const percentageLead = Math.abs(((ab.clicksA - ab.clicksB) / (ab.clicksB || 1)) * 100).toFixed(1);
            return (
              <div key={ab.id} className="p-6 bg-slate-50 dark:bg-slate-850/30 rounded-2xl border border-gray-150 dark:border-slate-800 space-y-6">
                
                {/* Test Meta Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                  <div>
                    <h5 className="font-extrabold text-sm text-text-primary">{ab.name}</h5>
                    <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">Split: {ab.trafficSplitA}% Variant A / {ab.trafficSplitB}% Variant B</span>
                  </div>
                  <div className="flex items-center gap-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-purple-500/20">
                    <Activity className="w-3.5 h-3.5" /> Test Running
                  </div>
                </div>

                {/* Grid performance comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Variant A (Sony) */}
                  <div className={`p-5 rounded-xl border text-left space-y-4 ${isWinnerA ? 'border-gray-200 dark:border-slate-800' : 'border-purple-500/30 bg-purple-500/5'}`}>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-text-secondary">Variant A (Sony Headphones)</span>
                      {!isWinnerA && <span className="flex items-center gap-1 text-[9px] bg-purple-500 text-white font-extrabold px-2 py-0.5 rounded uppercase"><Award className="w-3 h-3" /> Winning</span>}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-xs font-bold text-gray-500">
                      <div>
                        <span>Views</span>
                        <p className="text-text-primary font-black mt-1 text-sm">{ab.viewsA.toLocaleString()}</p>
                      </div>
                      <div>
                        <span>Clicks</span>
                        <p className="text-text-primary font-black mt-1 text-sm">{ab.clicksA.toLocaleString()}</p>
                      </div>
                      <div>
                        <span>CTR</span>
                        <p className="text-purple-500 font-black mt-1 text-sm">{((ab.clicksA / ab.viewsA) * 100).toFixed(2)}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Variant B (iPhone) */}
                  <div className={`p-5 rounded-xl border text-left space-y-4 ${!isWinnerA ? 'border-gray-200 dark:border-slate-800' : 'border-purple-500/30 bg-purple-500/5'}`}>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-text-secondary">Variant B (iPhone 15 Pro)</span>
                      {isWinnerA && <span className="flex items-center gap-1 text-[9px] bg-purple-500 text-white font-extrabold px-2 py-0.5 rounded uppercase"><Award className="w-3 h-3" /> Winning</span>}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-xs font-bold text-gray-500">
                      <div>
                        <span>Views</span>
                        <p className="text-text-primary font-black mt-1 text-sm">{ab.viewsB.toLocaleString()}</p>
                      </div>
                      <div>
                        <span>Clicks</span>
                        <p className="text-text-primary font-black mt-1 text-sm">{ab.clicksB.toLocaleString()}</p>
                      </div>
                      <div>
                        <span>CTR</span>
                        <p className="text-purple-500 font-black mt-1 text-sm">{((ab.clicksB / ab.viewsB) * 100).toFixed(2)}%</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Split winner notice */}
                <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-2xl flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 font-extrabold text-sm">
                    🏆
                  </div>
                  <div>
                    <h6 className="font-extrabold text-xs text-text-primary">Winner Auto-Detection</h6>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Based on conversion indicators, **Variant B (iPhone 15 Pro)** outperforms **Variant A** by **{percentageLead}%** higher click rate. Recommended action is to roll out Variant B globally.
                    </p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
