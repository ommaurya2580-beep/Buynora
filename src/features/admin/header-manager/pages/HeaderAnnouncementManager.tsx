import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit3, Trash2, Copy, Play, Pause, Save, Eye, ArrowUp, ArrowDown,
  RefreshCw, Settings, Layout, Volume2, Move, AlertCircle, Sparkles, Check, ExternalLink
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { 
  useAnnouncements, 
  useCreateAnnouncementMutation, 
  useUpdateAnnouncementMutation, 
  useDeleteAnnouncementMutation, 
  useDuplicateAnnouncementMutation, 
  useUpdateTickerSettingsMutation 
} from '../hooks/useAnnouncements';
import { Announcement, TickerSettings } from '../types';
import { useToast } from '../../../../hooks/useToast';

const AVAILABLE_ICONS = ['Truck', 'Tag', 'Gift', 'Headphones', 'Zap', 'Star', 'RefreshCcw', 'AlertCircle', 'Heart', 'Megaphone'];

export const HeaderAnnouncementManager: React.FC = () => {
  const { showToast } = useToast();
  const { data, isLoading, refetch } = useAnnouncements();
  
  const createMutation = useCreateAnnouncementMutation();
  const updateMutation = useUpdateAnnouncementMutation();
  const deleteMutation = useDeleteAnnouncementMutation();
  const duplicateMutation = useDuplicateAnnouncementMutation();
  const updateSettingsMutation = useUpdateTickerSettingsMutation();

  // Local state for editing / creating
  const [editingAnn, setEditingAnn] = useState<Partial<Announcement> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newAnn, setNewAnn] = useState<Partial<Announcement>>({
    title: '',
    messageText: '',
    icon: 'Truck',
    textColor: '#E2E8F0',
    backgroundColor: '#1F2937',
    iconColor: '#34D399',
    linkUrl: '',
    openInNewTab: false,
    status: 'Active',
    displayOrder: 1
  });

  // Ticker settings local state (for instant preview rendering)
  const [tickerSettings, setTickerSettings] = useState<TickerSettings>({
    scrollSpeed: 'Normal',
    customSpeedMs: 25000,
    direction: 'R2L',
    pauseOnHover: true,
    autoplay: true,
    infiniteLoop: true,
    showAnnouncementBar: true
  });

  // Reorder dragging state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (data?.tickerSettings) {
      setTickerSettings(data.tickerSettings);
    }
  }, [data]);

  if (isLoading) {
    return <div className="py-20 text-center text-xs text-gray-400">Loading announcements database...</div>;
  }

  const announcementsList = [...(data?.announcements || [])].sort((a, b) => a.displayOrder - b.displayOrder);

  // CRUD Actions
  const handleSaveSettings = () => {
    updateSettingsMutation.mutate(tickerSettings, {
      onSuccess: () => {
        showToast("Ticker settings saved successfully!", "success");
        refetch();
      },
      onError: () => {
        showToast("Failed to save settings.", "error");
      }
    });
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnn.title || !newAnn.messageText) {
      showToast("Please fill in the title and message text.", "error");
      return;
    }

    const payload = {
      ...newAnn,
      displayOrder: announcementsList.length + 1
    } as Omit<Announcement, 'id'>;

    createMutation.mutate(payload, {
      onSuccess: () => {
        showToast("Announcement created!", "success");
        setIsCreating(false);
        setNewAnn({
          title: '',
          messageText: '',
          icon: 'Truck',
          textColor: '#E2E8F0',
          backgroundColor: '#1F2937',
          iconColor: '#34D399',
          linkUrl: '',
          openInNewTab: false,
          status: 'Active',
          displayOrder: 1
        });
        refetch();
      }
    });
  };

  const handleUpdateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnn || !editingAnn.id || !editingAnn.title || !editingAnn.messageText) {
      showToast("Required fields missing.", "error");
      return;
    }

    updateMutation.mutate({ id: editingAnn.id, announcement: editingAnn }, {
      onSuccess: () => {
        showToast("Announcement updated!", "success");
        setEditingAnn(null);
        refetch();
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;
    deleteMutation.mutate(id, {
      onSuccess: () => {
        showToast("Announcement deleted", "info");
        refetch();
      }
    });
  };

  const handleDuplicate = (id: string) => {
    duplicateMutation.mutate(id, {
      onSuccess: () => {
        showToast("Announcement duplicated!", "success");
        refetch();
      }
    });
  };

  const toggleStatus = (id: string, currentStatus: 'Active' | 'Disabled') => {
    const newStatus = currentStatus === 'Active' ? 'Disabled' : 'Active';
    updateMutation.mutate({ id, announcement: { status: newStatus } }, {
      onSuccess: () => {
        showToast(`Announcement is now ${newStatus}`, "success");
        refetch();
      }
    });
  };

  // Drag and Drop
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    
    const reorderedList = [...announcementsList];
    const [draggedItem] = reorderedList.splice(draggedIndex, 1);
    reorderedList.splice(index, 0, draggedItem);
    
    setDraggedIndex(null);

    // Save display order update mutations
    reorderedList.forEach((item, idx) => {
      const newOrder = idx + 1;
      if (item.displayOrder !== newOrder) {
        updateMutation.mutate({ id: item.id, announcement: { displayOrder: newOrder } });
      }
    });
    
    showToast("Display order updated!", "info");
    setTimeout(() => refetch(), 300);
  };

  // Helper to render Lucide icons dynamically
  const renderIcon = (iconName: string, className: string = "w-4 h-4") => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;
    return <IconComponent className={className} />;
  };

  // Calculate speed duration in seconds
  const getSpeedDuration = () => {
    if (tickerSettings.scrollSpeed === 'Slow') return '40s';
    if (tickerSettings.scrollSpeed === 'Fast') return '10s';
    if (tickerSettings.scrollSpeed === 'Custom' && tickerSettings.customSpeedMs) {
      return `${tickerSettings.customSpeedMs / 1000}s`;
    }
    return '25s'; // Normal
  };

  const activeAnnouncements = announcementsList.filter(ann => ann.status === 'Active');

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-text-primary tracking-tight">Header Announcement Manager</h2>
          <p className="text-xs text-gray-400 font-medium">Control announcements, discount promotions, support lines, and scroll animations</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="p-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-text-secondary rounded-xl cursor-pointer"
            title="Refresh database"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-text-inverted text-xs font-bold px-4 py-2.5 rounded-xl shadow cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" /> Add Announcement
          </button>
        </div>
      </div>

      {/* Live Preview Bar */}
      <div className="glass border border-gray-200/50 dark:border-slate-800 p-4 rounded-2xl bg-white/20 dark:bg-slate-900/20">
        <div className="flex items-center gap-2 mb-2">
          <Eye className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">Live Marquee Preview</span>
        </div>
        
        {tickerSettings.showAnnouncementBar ? (
          <div 
            className="w-full text-white h-[40px] flex items-center overflow-hidden relative"
            style={{ backgroundColor: '#1F2937' }}
          >
            {/* Left Fade */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#1F2937] to-transparent z-10 pointer-events-none" />
            
            {activeAnnouncements.length === 0 ? (
              <div className="w-full text-center text-xs text-gray-400 font-semibold italic z-20">No active announcements to display</div>
            ) : (
              <div 
                className={`flex w-max whitespace-nowrap`}
                style={{
                  animation: tickerSettings.autoplay ? `marquee ${getSpeedDuration()} linear infinite` : 'none',
                  animationPlayState: 'running',
                  animationDirection: tickerSettings.direction === 'L2R' ? 'reverse' : 'normal',
                }}
              >
                {/* Render announcements twice for infinite loop */}
                {[0, 1].map((loopIdx) => (
                  <div key={loopIdx} className="flex items-center gap-0 px-6">
                    {activeAnnouncements.map((ann, idx) => (
                      <React.Fragment key={`${ann.id}-${loopIdx}`}>
                        {idx > 0 && <span className="mx-6 text-white/20 text-lg leading-none select-none">·</span>}
                        <span 
                          className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide"
                          style={{ color: ann.textColor }}
                        >
                          <span style={{ color: ann.iconColor }}>
                            {renderIcon(ann.icon, "w-3.5 h-3.5 flex-shrink-0")}
                          </span>
                          {ann.messageText}
                          {ann.linkUrl && (
                            <ExternalLink className="w-2.5 h-2.5 text-white/40 ml-0.5" />
                          )}
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Right Fade */}
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#1F2937] to-transparent z-10 pointer-events-none" />
          </div>
        ) : (
          <div className="w-full h-[40px] bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center text-xs text-gray-400 italic rounded-xl">
            Ticker Announcement Bar is currently set to HIDDEN
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns: Announcement List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass p-5 rounded-2xl border border-gray-150 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40">
            <h3 className="font-bold text-sm text-text-primary mb-3">Configure Announcements</h3>
            
            <div className="space-y-3.5">
              {announcementsList.length === 0 ? (
                <div className="text-center py-10 text-xs text-gray-400 italic">No announcements configured. Click "Add Announcement" to build one!</div>
              ) : (
                announcementsList.map((ann, idx) => (
                  <div
                    key={ann.id}
                    draggable
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDrop={() => handleDrop(idx)}
                    className="p-3.5 border border-gray-205 dark:border-slate-800 rounded-xl bg-white/20 dark:bg-slate-900/10 flex items-center justify-between gap-4 cursor-grab active:cursor-grabbing hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Move className="w-4 h-4 text-gray-400 cursor-grab flex-shrink-0" />
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-slate-700" style={{ backgroundColor: ann.backgroundColor }}>
                        <span style={{ color: ann.iconColor }}>{renderIcon(ann.icon, "w-4 h-4")}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-text-primary">{ann.title}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase ${
                            ann.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-500/10 text-gray-400'
                          }`}>
                            {ann.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{ann.messageText}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => toggleStatus(ann.id, ann.status)}
                        className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                          ann.status === 'Active' 
                            ? 'bg-emerald-550/10 text-emerald-500 hover:bg-emerald-550/20' 
                            : 'bg-gray-500/10 text-gray-400 hover:bg-gray-500/20'
                        }`}
                        title={ann.status === 'Active' ? "Disable" : "Enable"}
                      >
                        {ann.status === 'Active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => setEditingAnn(ann)}
                        className="p-1.5 bg-gray-100 dark:bg-slate-800 text-gray-500 hover:text-primary rounded-lg hover:bg-primary/10 cursor-pointer"
                        title="Edit Text & Theme"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(ann.id)}
                        className="p-1.5 bg-gray-100 dark:bg-slate-800 text-gray-500 hover:text-indigo-550 rounded-lg hover:bg-indigo-500/10 cursor-pointer"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(ann.id)}
                        className="p-1.5 bg-gray-100 dark:bg-slate-800 text-gray-500 hover:text-rose-500 rounded-lg hover:bg-rose-500/10 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Columns: Control Settings Panel */}
        <div className="space-y-4">
          <div className="glass p-5 rounded-2xl border border-gray-150 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 space-y-4">
            <h3 className="font-bold text-sm text-text-primary flex items-center gap-1.5 border-b border-gray-200/50 dark:border-slate-800 pb-2">
              <Settings className="w-4 h-4 text-primary" /> Ticker Controls
            </h3>

            {/* Master Switch */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850/50 border border-gray-150 dark:border-slate-800">
              <div>
                <span className="font-bold text-xs text-text-primary block">SHOW ANNOUNCEMENT BAR</span>
                <span className="text-[9px] text-gray-400">Master visibility toggle on storefront</span>
              </div>
              <button
                onClick={() => setTickerSettings(prev => ({ ...prev, showAnnouncementBar: !prev.showAnnouncementBar }))}
                className={`w-12 h-6 rounded-full p-1 transition-all duration-300 cursor-pointer ${
                  tickerSettings.showAnnouncementBar ? 'bg-primary' : 'bg-gray-300 dark:bg-slate-800'
                }`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                  tickerSettings.showAnnouncementBar ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Scroll Speed */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Scroll Speed</label>
              <select
                value={tickerSettings.scrollSpeed}
                onChange={e => setTickerSettings(prev => ({ ...prev, scrollSpeed: e.target.value as any }))}
                className="bg-gray-100 dark:bg-slate-800 text-xs px-3 py-2 rounded-xl border border-transparent focus:border-indigo-500 outline-none font-bold w-full cursor-pointer"
              >
                <option value="Slow">Slow (40s loop)</option>
                <option value="Normal">Normal (25s loop)</option>
                <option value="Fast">Fast (10s loop)</option>
                <option value="Custom">Custom Milliseconds</option>
              </select>
            </div>

            {tickerSettings.scrollSpeed === 'Custom' && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Custom Scroll Duration (ms)</label>
                <input
                  type="number"
                  min={1000}
                  max={120000}
                  value={tickerSettings.customSpeedMs || 25000}
                  onChange={e => setTickerSettings(prev => ({ ...prev, customSpeedMs: Number(e.target.value) }))}
                  className="bg-gray-100 dark:bg-slate-800 text-xs px-3 py-2 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
                />
              </div>
            )}

            {/* Direction */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Scroll Direction</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTickerSettings(prev => ({ ...prev, direction: 'R2L' }))}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    tickerSettings.direction === 'R2L'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-250 dark:border-slate-800 text-gray-400'
                  }`}
                >
                  Right to Left
                </button>
                <button
                  type="button"
                  onClick={() => setTickerSettings(prev => ({ ...prev, direction: 'L2R' }))}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    tickerSettings.direction === 'L2R'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-250 dark:border-slate-800 text-gray-400'
                  }`}
                >
                  Left to Right
                </button>
              </div>
            </div>

            {/* Autoplay / Pause Toggles */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between py-1">
                <span className="text-xs font-semibold text-text-secondary">Pause on hover</span>
                <input
                  type="checkbox"
                  checked={tickerSettings.pauseOnHover}
                  onChange={e => setTickerSettings(prev => ({ ...prev, pauseOnHover: e.target.checked }))}
                  className="rounded border-gray-300 text-primary focus:ring-primary w-4.5 h-4.5 cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-xs font-semibold text-text-secondary">Autoplay marquee</span>
                <input
                  type="checkbox"
                  checked={tickerSettings.autoplay}
                  onChange={e => setTickerSettings(prev => ({ ...prev, autoplay: e.target.checked }))}
                  className="rounded border-gray-300 text-primary focus:ring-primary w-4.5 h-4.5 cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-xs font-semibold text-text-secondary">Infinite looping</span>
                <input
                  type="checkbox"
                  checked={tickerSettings.infiniteLoop}
                  onChange={e => setTickerSettings(prev => ({ ...prev, infiniteLoop: e.target.checked }))}
                  className="rounded border-gray-300 text-primary focus:ring-primary w-4.5 h-4.5 cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-text-inverted dark:text-slate-900 text-xs font-bold py-2.5 rounded-xl shadow cursor-pointer transition-all hover:scale-[1.01] active:scale-95 mt-2"
            >
              <Save className="w-4 h-4" /> Save Ticker Configuration
            </button>
          </div>
        </div>

      </div>

      {/* CREATE MODAL / FORM DRAWER */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bg-surface border border-gray-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left animate-fade-in">
            <h3 className="font-extrabold text-base text-text-primary">New Announcement</h3>
            
            <form onSubmit={handleCreateAnnouncement} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Announcement Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Free Shipping Message"
                  value={newAnn.title}
                  onChange={e => setNewAnn(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Message Text</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Free delivery on orders above ₹499"
                  value={newAnn.messageText}
                  onChange={e => setNewAnn(prev => ({ ...prev, messageText: e.target.value }))}
                  className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Icon Selector</label>
                  <select
                    value={newAnn.icon}
                    onChange={e => setNewAnn(prev => ({ ...prev, icon: e.target.value }))}
                    className="bg-gray-100 dark:bg-slate-800 text-xs px-3 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none font-bold w-full cursor-pointer"
                  >
                    {AVAILABLE_ICONS.map(ic => (
                      <option key={ic} value={ic}>{ic}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Link URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. /products?sale=true"
                    value={newAnn.linkUrl || ''}
                    onChange={e => setNewAnn(prev => ({ ...prev, linkUrl: e.target.value }))}
                    className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
                  />
                </div>
              </div>

              {/* Theme Settings */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Text Color</label>
                  <input
                    type="color"
                    value={newAnn.textColor}
                    onChange={e => setNewAnn(prev => ({ ...prev, textColor: e.target.value }))}
                    className="bg-gray-100 dark:bg-slate-800 w-full h-9 rounded-xl border border-transparent outline-none cursor-pointer p-0.5"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Background</label>
                  <input
                    type="color"
                    value={newAnn.backgroundColor}
                    onChange={e => setNewAnn(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    className="bg-gray-100 dark:bg-slate-800 w-full h-9 rounded-xl border border-transparent outline-none cursor-pointer p-0.5"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Icon Color</label>
                  <input
                    type="color"
                    value={newAnn.iconColor}
                    onChange={e => setNewAnn(prev => ({ ...prev, iconColor: e.target.value }))}
                    className="bg-gray-100 dark:bg-slate-800 w-full h-9 rounded-xl border border-transparent outline-none cursor-pointer p-0.5"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1.5">
                <input
                  type="checkbox"
                  id="newOpenNewTab"
                  checked={newAnn.openInNewTab}
                  onChange={e => setNewAnn(prev => ({ ...prev, openInNewTab: e.target.checked }))}
                  className="rounded border-gray-300 text-primary focus:ring-primary w-4.5 h-4.5 cursor-pointer"
                />
                <label htmlFor="newOpenNewTab" className="text-xs font-bold text-text-secondary cursor-pointer">Open link in new tab</label>
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-hover text-text-inverted text-xs font-bold py-2.5 rounded-xl cursor-pointer"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-705 text-text-secondary text-xs font-bold py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL / FORM DRAWER */}
      {editingAnn && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bg-surface border border-gray-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left animate-fade-in">
            <h3 className="font-extrabold text-base text-text-primary">Edit Announcement</h3>
            
            <form onSubmit={handleUpdateAnnouncement} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Announcement Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Free Shipping Message"
                  value={editingAnn.title || ''}
                  onChange={e => setEditingAnn(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Message Text</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Free delivery on orders above ₹499"
                  value={editingAnn.messageText || ''}
                  onChange={e => setEditingAnn(prev => ({ ...prev, messageText: e.target.value }))}
                  className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Icon Selector</label>
                  <select
                    value={editingAnn.icon || 'Truck'}
                    onChange={e => setEditingAnn(prev => ({ ...prev, icon: e.target.value }))}
                    className="bg-gray-100 dark:bg-slate-800 text-xs px-3 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none font-bold w-full cursor-pointer"
                  >
                    {AVAILABLE_ICONS.map(ic => (
                      <option key={ic} value={ic}>{ic}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Link URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. /products?sale=true"
                    value={editingAnn.linkUrl || ''}
                    onChange={e => setEditingAnn(prev => ({ ...prev, linkUrl: e.target.value }))}
                    className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
                  />
                </div>
              </div>

              {/* Theme Settings */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Text Color</label>
                  <input
                    type="color"
                    value={editingAnn.textColor || '#E2E8F0'}
                    onChange={e => setEditingAnn(prev => ({ ...prev, textColor: e.target.value }))}
                    className="bg-gray-100 dark:bg-slate-800 w-full h-9 rounded-xl border border-transparent outline-none cursor-pointer p-0.5"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Background</label>
                  <input
                    type="color"
                    value={editingAnn.backgroundColor || '#1F2937'}
                    onChange={e => setEditingAnn(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    className="bg-gray-100 dark:bg-slate-800 w-full h-9 rounded-xl border border-transparent outline-none cursor-pointer p-0.5"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Icon Color</label>
                  <input
                    type="color"
                    value={editingAnn.iconColor || '#34D399'}
                    onChange={e => setEditingAnn(prev => ({ ...prev, iconColor: e.target.value }))}
                    className="bg-gray-100 dark:bg-slate-800 w-full h-9 rounded-xl border border-transparent outline-none cursor-pointer p-0.5"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1.5">
                <input
                  type="checkbox"
                  id="editOpenNewTab"
                  checked={editingAnn.openInNewTab || false}
                  onChange={e => setEditingAnn(prev => ({ ...prev, openInNewTab: e.target.checked }))}
                  className="rounded border-gray-300 text-primary focus:ring-primary w-4.5 h-4.5 cursor-pointer"
                />
                <label htmlFor="editOpenNewTab" className="text-xs font-bold text-text-secondary cursor-pointer">Open link in new tab</label>
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-hover text-text-inverted text-xs font-bold py-2.5 rounded-xl cursor-pointer"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingAnn(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-705 text-text-secondary text-xs font-bold py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
