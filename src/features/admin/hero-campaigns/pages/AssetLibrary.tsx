import React, { useState } from 'react';
import { 
  Folder, Plus, Search, Image as ImageIcon, Video as VideoIcon, 
  Trash2, Copy, FileText, Check, LayoutGrid, List, RefreshCw
} from 'lucide-react';
import { useAssets, useCreateAssetMutation, useDeleteAssetMutation } from '../hooks/useCampaigns';
import { useToast } from '../../../../hooks/useToast';

export const AssetLibrary: React.FC = () => {
  const { showToast } = useToast();
  const { data: assets = [], isLoading, refetch } = useAssets();
  
  const createMutation = useCreateAssetMutation();
  const deleteMutation = useDeleteAssetMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Upload Asset Form state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newType, setNewType] = useState<'image' | 'video' | 'background' | 'icon'>('image');
  const [newFolder, setNewFolder] = useState('General');
  const [newSize, setNewSize] = useState('1.5 MB');

  // Copy Asset URL helper
  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast("Media URL copied to clipboard!", "success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUrl.trim()) {
      showToast("Please fill in all fields", "warning");
      return;
    }

    createMutation.mutate({
      name: newName.trim(),
      url: newUrl.trim(),
      type: newType,
      folder: newFolder.trim() || 'General',
      size: newSize
    }, {
      onSuccess: () => {
        showToast("Asset uploaded and registered!", "success");
        setShowUploadModal(false);
        setNewName('');
        setNewUrl('');
        refetch();
      },
      onError: () => {
        showToast("Failed to upload asset.", "error");
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this asset? Any campaigns linking to this URL will display broken paths.")) return;
    deleteMutation.mutate(id, {
      onSuccess: () => {
        showToast("Asset deleted from library.", "info");
        refetch();
      }
    });
  };

  // Get folders list
  const folders = Array.from(new Set(assets.map(a => a.folder)));

  // Filter assets
  const filtered = assets.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = selectedFolder === 'All' || a.folder === selectedFolder;
    const matchesType = selectedType === 'All' || a.type === selectedType;
    return matchesSearch && matchesFolder && matchesType;
  });

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-text-primary tracking-tight">Asset Library</h2>
          <p className="text-xs text-gray-400">Manage, Upload & Reuse media files for Hero Banners & Video Campaigns</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="p-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-250 dark:hover:bg-slate-700 text-text-secondary rounded-xl transition-all cursor-pointer"
            title="Refresh assets"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-text-inverted text-xs font-bold px-4 py-2.5 rounded-xl shadow cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" /> Upload Asset
          </button>
        </div>
      </div>

      {/* Main Grid: Folder Sidebar + Assets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Folder Sidebar */}
        <div className="glass p-5 rounded-3xl border border-gray-200/50 dark:border-slate-850/50 bg-bg-surface/40 space-y-4 h-fit">
          <h4 className="font-extrabold text-[10px] uppercase tracking-wider text-gray-400">Folders</h4>
          <div className="space-y-1">
            <button
              onClick={() => setSelectedFolder('All')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedFolder === 'All'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'hover:bg-gray-100 dark:hover:bg-slate-800/60 text-gray-500 hover:text-text-primary'
              }`}
            >
              <span className="flex items-center gap-2">
                <Folder className="w-4 h-4" /> All Folders
              </span>
              <span className="text-[10px] opacity-75">{assets.length}</span>
            </button>

            {folders.map(folder => {
              const count = assets.filter(a => a.folder === folder).length;
              return (
                <button
                  key={folder}
                  onClick={() => setSelectedFolder(folder)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedFolder === folder
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'hover:bg-gray-100 dark:hover:bg-slate-800/60 text-gray-500 hover:text-text-primary'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <Folder className="w-4 h-4" /> {folder}
                  </span>
                  <span className="text-[10px] opacity-75">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-gray-150/40 dark:border-slate-800/40 space-y-3">
            <h4 className="font-extrabold text-[10px] uppercase tracking-wider text-gray-400">Media Type</h4>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
              {['All', 'image', 'video', 'background', 'icon'].map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-2.5 py-1.5 rounded-lg border text-center transition-all cursor-pointer capitalize ${
                    selectedType === type
                      ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400'
                      : 'border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Assets Grid */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search assets by file name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-white dark:bg-slate-900 text-xs px-10 py-3 rounded-2xl border border-gray-200/50 dark:border-slate-800/80 outline-none w-full"
            />
          </div>

          {isLoading ? (
            <div className="py-20 text-center text-xs text-gray-400">Loading library...</div>
          ) : filtered.length === 0 ? (
            <div className="glass p-16 text-center border border-dashed border-gray-300 dark:border-slate-800 rounded-3xl bg-white/20 dark:bg-slate-900/20">
              <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <h4 className="font-extrabold text-sm text-text-primary font-sans">No media assets found</h4>
              <p className="text-xs text-gray-500 mt-1">Try changing your search terms or upload a new image/video.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filtered.map(asset => (
                <div 
                  key={asset.id} 
                  className="glass rounded-2xl border border-gray-200/50 dark:border-slate-800/60 overflow-hidden bg-white/30 dark:bg-slate-900/30 group flex flex-col justify-between hover:shadow-lg transition-all"
                >
                  {/* Media Visual Area */}
                  <div className="h-36 bg-slate-950/20 dark:bg-slate-950/45 relative flex items-center justify-center overflow-hidden border-b border-gray-100 dark:border-slate-800/50">
                    
                    {asset.type === 'image' || asset.type === 'background' ? (
                      <img src={asset.url} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : asset.type === 'video' ? (
                      <video src={asset.url} className="w-full h-full object-cover" muted loop preload="none" />
                    ) : (
                      <ImageIcon className="w-10 h-10 text-gray-400" />
                    )}

                    {/* Badge type */}
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/60 text-white font-extrabold text-[9px] uppercase tracking-wide">
                      {asset.type}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="p-4 space-y-3 text-left">
                    <div className="min-h-[40px]">
                      <h5 className="font-bold text-xs text-text-primary line-clamp-1" title={asset.name}>
                        {asset.name}
                      </h5>
                      <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">{asset.size} • Folder: {asset.folder}</span>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 dark:border-slate-800/40 pt-3">
                      <button
                        onClick={() => handleCopyUrl(asset.url, asset.id)}
                        className="flex items-center gap-1 text-[10px] font-black text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                      >
                        {copiedId === asset.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy URL
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(asset.id)}
                        className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-gray-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Delete asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Upload Modal (Overlay Form) */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowUploadModal(false)} />
          <div className="relative glass bg-bg-surface border border-gray-250 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            
            <div className="flex justify-between items-center border-b border-gray-150/45 dark:border-slate-800/45 pb-3">
              <h3 className="text-sm font-black text-text-primary uppercase tracking-wider">Register Media Asset</h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-text-primary text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="flex flex-col gap-1 text-left">
                <label className="text-[10px] font-black text-gray-400 uppercase">Asset File Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. summer_banner_v2.jpg"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
                />
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label className="text-[10px] font-black text-gray-400 uppercase">Asset Source URL (HTTPS) *</label>
                <input
                  type="url"
                  required
                  placeholder="e.g. https://images.unsplash.com/photo-..."
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] font-black text-gray-400 uppercase">Media Type *</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none font-bold cursor-pointer"
                  >
                    <option value="image">🖼️ Image Asset</option>
                    <option value="video">🎥 Video File</option>
                    <option value="background">🎨 Background Pattern</option>
                    <option value="icon">🏷️ Brand Icon</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] font-black text-gray-400 uppercase">Virtual Folder Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Summer Promo"
                    value={newFolder}
                    onChange={e => setNewFolder(e.target.value)}
                    className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] font-black text-gray-400 uppercase">File size estimate</label>
                  <input
                    type="text"
                    placeholder="e.g. 1.2 MB"
                    value={newSize}
                    onChange={e => setNewSize(e.target.value)}
                    className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-text-inverted font-bold text-xs py-3 rounded-xl shadow cursor-pointer transition-all"
              >
                Register & Upload Asset
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
