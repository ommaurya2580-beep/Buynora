import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Edit3, Trash2, Copy, Play, Pause, Archive, Eye, 
  ArrowUp, ArrowDown, Tablet, User, Globe, AlertCircle, RefreshCw
} from 'lucide-react';
import { 
  useCampaignsList, 
  useDeleteCampaignMutation, 
  useDuplicateCampaignMutation, 
  useUpdateCampaignMutation 
} from '../hooks/useCampaigns';
import { useToast } from '../../../../hooks/useToast';
import { formatCurrency } from '../../../../utils/formatters';

export const CampaignList: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data: campaigns = [], isLoading, refetch } = useCampaignsList();
  
  const deleteMutation = useDeleteCampaignMutation();
  const duplicateMutation = useDuplicateCampaignMutation();
  const updateMutation = useUpdateCampaignMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const handleDuplicate = (id: string) => {
    duplicateMutation.mutate(id, {
      onSuccess: () => {
        showToast("Campaign duplicated successfully!", "success");
        refetch();
      },
      onError: () => {
        showToast("Failed to duplicate campaign.", "error");
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this campaign? This cannot be undone.")) return;
    deleteMutation.mutate(id, {
      onSuccess: () => {
        showToast("Campaign deleted.", "info");
        refetch();
      },
      onError: () => {
        showToast("Failed to delete campaign.", "error");
      }
    });
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    updateMutation.mutate({ id, campaign: { status: newStatus as any } }, {
      onSuccess: () => {
        showToast(`Campaign status updated to ${newStatus}`, "success");
        refetch();
      },
      onError: () => {
        showToast("Failed to update status.", "error");
      }
    });
  };

  const handleIncreasePriority = (id: string, currentPriority: number) => {
    updateMutation.mutate({ id, campaign: { priority: Math.max(1, currentPriority - 1) } }, {
      onSuccess: () => {
        showToast("Priority elevated", "info");
        refetch();
      }
    });
  };

  const handleDecreasePriority = (id: string, currentPriority: number) => {
    updateMutation.mutate({ id, campaign: { priority: currentPriority + 1 } }, {
      onSuccess: () => {
        showToast("Priority adjusted down", "info");
        refetch();
      }
    });
  };

  // Filter campaigns
  const filtered = campaigns.filter(c => {
    const matchesSearch = c.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.campaignSlug.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesType = typeFilter === 'All' || c.campaignType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  }).sort((a, b) => a.priority - b.priority);

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-text-primary tracking-tight">All Campaigns</h2>
          <p className="text-xs text-gray-400">Total Banners: {filtered.length} configured in routing priority</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="p-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-250 dark:hover:bg-slate-700 text-text-secondary rounded-xl transition-all cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/admin/hero-campaigns/create"
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-text-inverted text-xs font-bold px-4 py-2.5 rounded-xl shadow cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" /> Create Campaign
          </Link>
        </div>
      </div>

      {/* Filters bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white/20 dark:bg-slate-900/20 p-4 border border-gray-150 dark:border-slate-800 rounded-2xl">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search campaigns by name, slug or description..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-gray-100 dark:bg-slate-800 text-xs px-10 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none font-bold cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Paused">Paused</option>
            <option value="Expired">Expired</option>
            <option value="Archived">Archived</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none font-bold cursor-pointer"
          >
            <option value="All">All Campaign Types</option>
            <option value="New Launch">New Launch</option>
            <option value="Flash Sale">Flash Sale</option>
            <option value="Mega Sale">Mega Sale</option>
            <option value="Festival Sale">Festival Sale</option>
            <option value="Brand Promotion">Brand Promotion</option>
            <option value="Price Drop">Price Drop</option>
            <option value="AI Recommendation">AI Recommendation</option>
            <option value="Collection Launch">Collection Launch</option>
            <option value="Video Campaign">Video Campaign</option>
            <option value="Custom Campaign">Custom Campaign</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-gray-400">Loading campaigns...</div>
      ) : filtered.length === 0 ? (
        <div className="glass p-12 text-center border border-dashed border-gray-300 dark:border-slate-800 rounded-3xl">
          <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <h4 className="font-extrabold text-sm text-text-primary">No campaigns match criteria</h4>
          <p className="text-xs text-gray-500 mt-1">Refine your search tags or add a new campaign to trigger display.</p>
        </div>
      ) : (
        <div className="border border-gray-150 dark:border-gray-800 rounded-2xl overflow-hidden bg-white/20 dark:bg-slate-900/20 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs min-w-[900px]">
            <thead>
              <tr className="bg-gray-100 dark:bg-slate-800 font-bold border-b border-gray-200 dark:border-gray-700 text-gray-400">
                <th className="p-3.5 w-[80px]">Preview</th>
                <th className="p-3.5">Campaign Name</th>
                <th className="p-3.5">Type & Priority</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-center">Views</th>
                <th className="p-3.5 text-center">Clicks</th>
                <th className="p-3.5 text-center">CTR</th>
                <th className="p-3.5 text-center">Revenue</th>
                <th className="p-3.5">Creator</th>
                <th className="p-3.5">Last Updated</th>
                <th className="p-3.5 text-center w-[160px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/10">
                  
                  {/* Preview Banner thumbnail */}
                  <td className="p-3.5">
                    <div className="w-14 h-10 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-850">
                      <img src={c.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  </td>

                  {/* Campaign Name */}
                  <td className="p-3.5">
                    <span className="font-bold text-text-primary block">{c.campaignName}</span>
                    <span className="text-[10px] text-gray-400 mt-0.5 font-mono block">/{c.campaignSlug}</span>
                  </td>

                  {/* Type and Priority */}
                  <td className="p-3.5">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/20 px-2 py-0.5 rounded">
                      {c.campaignType}
                    </span>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="font-bold text-gray-500">P: #{c.priority}</span>
                      <button
                        onClick={() => handleIncreasePriority(c.id, c.priority)}
                        className="p-0.5 hover:bg-gray-200 dark:hover:bg-slate-800 rounded text-gray-400 hover:text-text-primary cursor-pointer"
                        title="Elevate Priority"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDecreasePriority(c.id, c.priority)}
                        className="p-0.5 hover:bg-gray-200 dark:hover:bg-slate-800 rounded text-gray-400 hover:text-text-primary cursor-pointer"
                        title="Lower Priority"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="p-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      c.status === 'Published' ? 'bg-emerald-500/10 text-emerald-500' :
                      c.status === 'Scheduled' ? 'bg-blue-500/10 text-blue-500' :
                      c.status === 'Paused' ? 'bg-amber-500/10 text-amber-500' :
                      c.status === 'Draft' ? 'bg-gray-500/10 text-gray-400' :
                      'bg-rose-500/10 text-rose-500'
                    }`}>
                      {c.status}
                    </span>
                  </td>

                  {/* Metrics */}
                  <td className="p-3.5 text-center font-bold text-text-primary">{(c.views || 0).toLocaleString()}</td>
                  <td className="p-3.5 text-center font-bold text-text-primary">{(c.clicks || 0).toLocaleString()}</td>
                  <td className="p-3.5 text-center font-bold text-violet-500">{c.ctr}%</td>
                  <td className="p-3.5 text-center font-bold text-emerald-600 dark:text-emerald-450">{formatCurrency(c.revenue || 0)}</td>

                  {/* Author metadata */}
                  <td className="p-3.5 text-gray-500 font-semibold">{c.createdBy.split('@')[0]}</td>
                  
                  {/* UpdatedAt */}
                  <td className="p-3.5 text-gray-400">
                    {new Date(c.updatedAt).toLocaleDateString()}
                    <span className="text-[9px] block text-gray-500">{new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </td>

                  {/* Actions column */}
                  <td className="p-3.5">
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      <Link
                        to={`/admin/hero-campaigns/edit/${c.id}`}
                        className="p-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-950/20 text-gray-500 hover:text-purple-600 rounded-lg transition-colors cursor-pointer"
                        title="Edit campaign settings"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDuplicate(c.id)}
                        className="p-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-950/20 text-gray-500 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer"
                        title="Duplicate campaign"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      
                      {c.status === 'Published' ? (
                        <button
                          onClick={() => handleUpdateStatus(c.id, 'Paused')}
                          className="p-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/20 text-gray-500 hover:text-amber-600 rounded-lg transition-colors cursor-pointer"
                          title="Pause Campaign"
                        >
                          <Pause className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(c.id, 'Published')}
                          className="p-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/20 text-gray-500 hover:text-emerald-600 rounded-lg transition-colors cursor-pointer"
                          title="Publish/Resume Campaign"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => handleUpdateStatus(c.id, 'Archived')}
                        className="p-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-orange-100 dark:hover:bg-orange-950/20 text-gray-500 hover:text-orange-600 rounded-lg transition-colors cursor-pointer"
                        title="Archive Campaign"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/20 text-gray-500 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Delete Campaign"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
