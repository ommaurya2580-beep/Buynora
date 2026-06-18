import React, { useState } from 'react';
import { 
  Plus, Edit3, Trash2, Save, Eye, ArrowUp, ArrowDown, ExternalLink,
  RefreshCw, Settings, Layout, Move, AlertCircle, Sparkles, Check, Smartphone, Tablet as TabletIcon, Monitor, Menu
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { 
  useNavigationItems, 
  useCreateNavItemMutation, 
  useUpdateNavItemMutation, 
  useDeleteNavItemMutation, 
  useReorderNavItemsMutation 
} from '../hooks/useNavigation';
import { useCategories } from '../../../../hooks/useQueries';
import { NavigationMenuItem, MenuHighlight } from '../types';
import { useToast } from '../../../../hooks/useToast';

const AVAILABLE_ICONS = ['Home', 'ShoppingBag', 'Heart', 'Tag', 'Sparkles', 'Smartphone', 'User', 'Settings', 'Info', 'HelpCircle'];

export const NavigationManager: React.FC = () => {
  const { showToast } = useToast();
  const { data: menuItems = [], isLoading, refetch } = useNavigationItems();
  const { data: categories = [] } = useCategories();

  const createMutation = useCreateNavItemMutation();
  const updateMutation = useUpdateNavItemMutation();
  const deleteMutation = useDeleteNavItemMutation();
  const reorderMutation = useReorderNavItemsMutation();

  // Local state
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [editingItem, setEditingItem] = useState<Partial<NavigationMenuItem> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newItem, setNewItem] = useState<Partial<NavigationMenuItem>>({
    name: '',
    slug: '',
    icon: '',
    menuType: 'CustomPage',
    categoryConnectionId: '',
    externalUrl: '',
    openInNewTab: false,
    showInDesktop: true,
    showInMobile: true,
    showInSidebar: true,
    highlight: 'None',
    badgeText: '',
    status: 'Active',
    displayOrder: 1
  });

  // Dragging state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  if (isLoading) {
    return <div className="py-20 text-center text-xs text-gray-400">Loading navigation menu...</div>;
  }

  const sortedItems = [...menuItems].sort((a, b) => a.displayOrder - b.displayOrder);

  // Form Submissions
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name) {
      showToast("Menu Name is required", "error");
      return;
    }

    // Determine slug based on menu type
    let finalSlug = newItem.slug || '';
    if (newItem.menuType === 'Category') {
      const selectedCat = categories.find(c => c.id === newItem.categoryConnectionId);
      finalSlug = selectedCat ? `/products?category=${encodeURIComponent(selectedCat.name)}` : '/products';
    } else if (newItem.menuType === 'External') {
      finalSlug = newItem.externalUrl || '';
    }

    const payload = {
      ...newItem,
      slug: finalSlug,
      displayOrder: sortedItems.length + 1
    } as Omit<NavigationMenuItem, 'id'>;

    createMutation.mutate(payload, {
      onSuccess: () => {
        showToast("Navigation item added!", "success");
        setIsCreating(false);
        setNewItem({
          name: '',
          slug: '',
          icon: '',
          menuType: 'CustomPage',
          categoryConnectionId: '',
          externalUrl: '',
          openInNewTab: false,
          showInDesktop: true,
          showInMobile: true,
          showInSidebar: true,
          highlight: 'None',
          badgeText: '',
          status: 'Active',
          displayOrder: 1
        });
        refetch();
      }
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.id || !editingItem.name) {
      showToast("Required fields missing", "error");
      return;
    }

    // Determine slug
    let finalSlug = editingItem.slug || '';
    if (editingItem.menuType === 'Category') {
      const selectedCat = categories.find(c => c.id === editingItem.categoryConnectionId);
      finalSlug = selectedCat ? `/products?category=${encodeURIComponent(selectedCat.name)}` : '/products';
    } else if (editingItem.menuType === 'External') {
      finalSlug = editingItem.externalUrl || '';
    }

    const updated = {
      ...editingItem,
      slug: finalSlug
    };

    updateMutation.mutate({ id: editingItem.id, item: updated }, {
      onSuccess: () => {
        showToast("Navigation item updated!", "success");
        setEditingItem(null);
        refetch();
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this navigation item?")) return;
    deleteMutation.mutate(id, {
      onSuccess: () => {
        showToast("Menu item deleted", "info");
        refetch();
      }
    });
  };

  const toggleStatus = (id: string, currentStatus: 'Active' | 'Disabled') => {
    const newStatus = currentStatus === 'Active' ? 'Disabled' : 'Active';
    updateMutation.mutate({ id, item: { status: newStatus } }, {
      onSuccess: () => {
        showToast(`Menu item is now ${newStatus}`, "success");
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

    const list = [...sortedItems];
    const [draggedItem] = list.splice(draggedIndex, 1);
    list.splice(index, 0, draggedItem);

    setDraggedIndex(null);

    const reorderedPayload = list.map((item, idx) => ({
      id: item.id,
      displayOrder: idx + 1
    }));

    reorderMutation.mutate(reorderedPayload, {
      onSuccess: () => {
        showToast("Navigation reordered!", "info");
        refetch();
      }
    });
  };

  // Helper to render Lucide icons dynamically
  const renderIcon = (iconName: string, className: string = "w-4 h-4") => {
    if (!iconName) return null;
    const IconComponent = (LucideIcons as any)[iconName];
    if (!IconComponent) return null;
    return <IconComponent className={className} />;
  };

  const activeDesktopItems = sortedItems.filter(item => item.status === 'Active' && item.showInDesktop);
  const activeMobileItems = sortedItems.filter(item => item.status === 'Active' && item.showInMobile);

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-text-primary tracking-tight">Navigation Menu Manager</h2>
          <p className="text-xs text-gray-400 font-medium">Configure primary header links, categories, and custom page badges</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="p-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-250 dark:hover:bg-slate-700 text-text-secondary rounded-xl cursor-pointer"
            title="Refresh navigation list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-text-inverted text-xs font-bold px-4 py-2.5 rounded-xl shadow cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" /> Add Menu Item
          </button>
        </div>
      </div>

      {/* Live Previews with Device Tabs */}
      <div className="glass border border-gray-200/50 dark:border-slate-800 p-5 rounded-3xl bg-white/20 dark:bg-slate-900/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200/50 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4.5 h-4.5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">Responsive Storefront Preview</span>
          </div>
          <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                previewMode === 'desktop' ? 'bg-white dark:bg-slate-900 shadow-sm text-text-primary' : 'text-gray-400'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" /> Desktop
            </button>
            <button
              onClick={() => setPreviewMode('tablet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                previewMode === 'tablet' ? 'bg-white dark:bg-slate-900 shadow-sm text-text-primary' : 'text-gray-400'
              }`}
            >
              <TabletIcon className="w-3.5 h-3.5" /> Tablet
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                previewMode === 'mobile' ? 'bg-white dark:bg-slate-900 shadow-sm text-text-primary' : 'text-gray-400'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Mobile
            </button>
          </div>
        </div>

        {/* Live Preview Shell */}
        <div className="flex justify-center bg-gray-50/50 dark:bg-slate-950/20 py-8 rounded-2xl border border-dashed border-gray-200 dark:border-slate-800">
          {previewMode === 'desktop' && (
            <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden text-left">
              {/* Fake Desktop Navbar */}
              <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-sm font-black text-primary tracking-tight">Buynora</span>
                
                {/* Dynamic Links */}
                <div className="flex items-center gap-5 select-none pl-4">
                  {activeDesktopItems.map(item => (
                    <div key={item.id} className="relative py-1 group cursor-pointer text-[10px] font-black uppercase tracking-wider text-text-secondary hover:text-primary transition-colors flex items-center gap-1">
                      {item.icon && renderIcon(item.icon, "w-3 h-3 text-gray-400")}
                      <span>{item.name}</span>
                      
                      {/* Custom Badges & Highlights */}
                      {item.highlight === 'NEW' && (
                        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-500 text-text-inverted text-[7px] font-black px-1 py-0.2 rounded uppercase scale-90">NEW</span>
                      )}
                      {item.highlight === 'SALE' && (
                        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-rose-500 text-text-inverted text-[7px] font-black px-1 py-0.2 rounded uppercase scale-90">SALE</span>
                      )}
                      {item.badgeText && (
                        <span className="bg-primary/15 text-primary text-[8px] font-bold px-1.5 py-0.2 rounded-full ml-1 scale-90 uppercase">{item.badgeText}</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="w-16 h-2 bg-gray-200 dark:bg-slate-800 rounded-full" />
              </div>
              <div className="h-12 bg-gray-50 dark:bg-slate-900/40 p-4 text-[10px] text-gray-400 italic">Desktop storefront menu initialized. Click admin settings to toggle visibility.</div>
            </div>
          )}

          {previewMode === 'tablet' && (
            <div className="w-[600px] bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden text-left">
              {/* Fake Tablet Navbar */}
              <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-sm font-black text-primary tracking-tight">Buynora</span>
                
                {/* Dynamic Links (limited or styled) */}
                <div className="flex items-center gap-4 select-none">
                  {activeDesktopItems.slice(0, 4).map(item => (
                    <div key={item.id} className="relative py-1 text-[9px] font-black uppercase tracking-wider text-text-secondary hover:text-primary transition-colors flex items-center gap-1">
                      <span>{item.name}</span>
                      {item.badgeText && (
                        <span className="bg-indigo-500/10 text-indigo-500 text-[7px] font-bold px-1 py-0.2 rounded ml-0.5 scale-90 uppercase">{item.badgeText}</span>
                      )}
                    </div>
                  ))}
                  {activeDesktopItems.length > 4 && (
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">More...</span>
                  )}
                </div>

                <div className="w-8 h-2 bg-gray-200 dark:bg-slate-800 rounded-full" />
              </div>
              <div className="h-10 bg-gray-50 dark:bg-slate-900/40 p-3 text-[10px] text-gray-400 italic">Tablet View (Width: 768px simulation).</div>
            </div>
          )}

          {previewMode === 'mobile' && (
            <div className="w-[320px] bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden text-left relative min-h-[240px]">
              {/* Fake Mobile Header */}
              <div className="p-3 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10 sticky top-0">
                <div className="flex items-center gap-2">
                  <Menu className="w-4 h-4 text-text-secondary" />
                  <span className="text-xs font-black text-primary tracking-tight">Buynora</span>
                </div>
                <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-slate-800" />
              </div>
              
              {/* Mobile Drawer Content */}
              <div className="p-4 space-y-3.5">
                <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Categories Menu</span>
                <div className="flex flex-col gap-2.5">
                  {activeMobileItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 dark:border-slate-800/50 text-[11px] font-bold text-text-secondary hover:text-primary transition-colors cursor-pointer">
                      <div className="flex items-center gap-2">
                        {item.icon && renderIcon(item.icon, "w-3.5 h-3.5 text-gray-400")}
                        <span>{item.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {item.highlight === 'NEW' && (
                          <span className="bg-indigo-500 text-text-inverted text-[6px] font-black px-1.5 py-0.2 rounded uppercase scale-90">NEW</span>
                        )}
                        {item.highlight === 'SALE' && (
                          <span className="bg-rose-500 text-text-inverted text-[6px] font-black px-1.5 py-0.2 rounded uppercase scale-90">SALE</span>
                        )}
                        {item.badgeText && (
                          <span className="bg-primary/15 text-primary text-[7px] font-black px-1 py-0.2 rounded scale-90 uppercase">{item.badgeText}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Drag & Drop Table list */}
      <div className="glass p-5 rounded-3xl border border-gray-150 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40">
        <h3 className="font-bold text-sm text-text-primary mb-3">Navigation Order Hierarchy</h3>
        
        <div className="space-y-3">
          {sortedItems.length === 0 ? (
            <div className="text-center py-10 text-xs text-gray-400 italic">No navigation links configured. Click "Add Menu Item" to start!</div>
          ) : (
            sortedItems.map((item, idx) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={() => handleDrop(idx)}
                className="p-3 border border-gray-205 dark:border-slate-800 rounded-xl bg-white/20 dark:bg-slate-900/10 flex items-center justify-between gap-4 cursor-grab active:cursor-grabbing hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Move className="w-4 h-4 text-gray-400 cursor-grab flex-shrink-0" />
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-slate-800 text-gray-500 border border-gray-200 dark:border-slate-700 flex-shrink-0">
                    {item.icon ? renderIcon(item.icon, "w-4 h-4") : <Layout className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-text-primary">{item.name}</span>
                      
                      {/* Highlights */}
                      {item.highlight !== 'None' && (
                        <span className={`text-[8px] px-1.5 py-0.2 rounded font-black uppercase ${
                          item.highlight === 'NEW' ? 'bg-indigo-500 text-white' : 'bg-rose-500 text-white'
                        }`}>
                          {item.highlight}
                        </span>
                      )}

                      {item.badgeText && (
                        <span className="bg-primary/10 text-primary text-[8px] font-bold px-1.5 py-0.2 rounded-full uppercase">{item.badgeText}</span>
                      )}

                      {/* Display Devices Indicators */}
                      <span className="text-[9px] text-gray-400">
                        ({[
                          item.showInDesktop ? 'Desktop' : null,
                          item.showInMobile ? 'Mobile' : null,
                          item.showInSidebar ? 'Sidebar' : null
                        ].filter(Boolean).join(', ')})
                      </span>
                    </div>
                    
                    <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">{item.slug}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => toggleStatus(item.id, item.status)}
                    className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                      item.status === 'Active' 
                        ? 'bg-emerald-550/10 text-emerald-500 hover:bg-emerald-550/20' 
                        : 'bg-gray-500/10 text-gray-400 hover:bg-gray-500/20'
                    }`}
                    title={item.status === 'Active' ? "Disable Menu" : "Enable Menu"}
                  >
                    {item.status === 'Active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => setEditingItem(item)}
                    className="p-1.5 bg-gray-100 dark:bg-slate-800 text-gray-500 hover:text-primary rounded-lg hover:bg-primary/10 cursor-pointer"
                    title="Edit Menu Settings"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 bg-gray-100 dark:bg-slate-800 text-gray-500 hover:text-rose-500 rounded-lg hover:bg-rose-500/10 cursor-pointer"
                    title="Delete Menu"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CREATE MENU ITEM MODAL */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bg-surface border border-gray-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left animate-fade-in max-h-[90vh] overflow-y-auto">
            <h3 className="font-extrabold text-base text-text-primary">New Navigation Menu Link</h3>
            
            <form onSubmit={handleCreate} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Menu Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FASHION"
                  value={newItem.name}
                  onChange={e => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
                />
              </div>

              {/* Menu Type Selector */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Menu Link Type</label>
                <select
                  value={newItem.menuType}
                  onChange={e => setNewItem(prev => ({ ...prev, menuType: e.target.value as any }))}
                  className="bg-gray-100 dark:bg-slate-800 text-xs px-3 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none font-bold w-full cursor-pointer"
                >
                  <option value="Category">Category Link (Connect to categories)</option>
                  <option value="CustomPage">Custom Shop Page Slug</option>
                  <option value="External">External Link URL</option>
                </select>
              </div>

              {/* Dynamic Type Config Options */}
              {newItem.menuType === 'Category' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Connect with Existing Category</label>
                  <select
                    value={newItem.categoryConnectionId || ''}
                    required
                    onChange={e => setNewItem(prev => ({ ...prev, categoryConnectionId: e.target.value }))}
                    className="bg-gray-100 dark:bg-slate-800 text-xs px-3 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none font-bold w-full cursor-pointer"
                  >
                    <option value="" disabled>-- Select Category --</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {newItem.menuType === 'CustomPage' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Custom Page Route Slug</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. /sale or /products?isNewArrival=true"
                    value={newItem.slug}
                    onChange={e => setNewItem(prev => ({ ...prev, slug: e.target.value }))}
                    className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full font-mono"
                  />
                </div>
              )}

              {newItem.menuType === 'External' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">External Link URL</label>
                  <input
                    type="url"
                    required
                    placeholder="e.g. https://example.com"
                    value={newItem.externalUrl || ''}
                    onChange={e => setNewItem(prev => ({ ...prev, externalUrl: e.target.value }))}
                    className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
                  />
                </div>
              )}

              {/* Icon & Highlights */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Menu Icon (Optional)</label>
                  <select
                    value={newItem.icon || ''}
                    onChange={e => setNewItem(prev => ({ ...prev, icon: e.target.value }))}
                    className="bg-gray-100 dark:bg-slate-800 text-xs px-3 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none font-bold w-full cursor-pointer"
                  >
                    <option value="">No Icon</option>
                    {AVAILABLE_ICONS.map(ic => (
                      <option key={ic} value={ic}>{ic}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Highlighter Badge</label>
                  <select
                    value={newItem.highlight || 'None'}
                    onChange={e => setNewItem(prev => ({ ...prev, highlight: e.target.value as any }))}
                    className="bg-gray-100 dark:bg-slate-800 text-xs px-3 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none font-bold w-full cursor-pointer"
                  >
                    <option value="None">No Highlights</option>
                    <option value="NEW">NEW (Indigo tag)</option>
                    <option value="SALE">SALE (Rose tag)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Custom Badge Text (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. HOT or 50% OFF"
                  maxLength={12}
                  value={newItem.badgeText || ''}
                  onChange={e => setNewItem(prev => ({ ...prev, badgeText: e.target.value }))}
                  className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
                />
              </div>

              {/* Display Toggles */}
              <div className="space-y-2 pt-2 border-t border-gray-150 dark:border-slate-800">
                <label className="text-[10px] font-bold text-gray-400 uppercase block">Display Device Visibility</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewItem(prev => ({ ...prev, showInDesktop: !prev.showInDesktop }))}
                    className={`py-1.5 text-[10px] font-black rounded-lg border transition-all cursor-pointer ${
                      newItem.showInDesktop ? 'border-primary bg-primary/10 text-primary' : 'border-gray-250 dark:border-slate-800 text-gray-400'
                    }`}
                  >
                    Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewItem(prev => ({ ...prev, showInMobile: !prev.showInMobile }))}
                    className={`py-1.5 text-[10px] font-black rounded-lg border transition-all cursor-pointer ${
                      newItem.showInMobile ? 'border-primary bg-primary/10 text-primary' : 'border-gray-250 dark:border-slate-800 text-gray-400'
                    }`}
                  >
                    Mobile
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewItem(prev => ({ ...prev, showInSidebar: !prev.showInSidebar }))}
                    className={`py-1.5 text-[10px] font-black rounded-lg border transition-all cursor-pointer ${
                      newItem.showInSidebar ? 'border-primary bg-primary/10 text-primary' : 'border-gray-250 dark:border-slate-800 text-gray-400'
                    }`}
                  >
                    Sidebar
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1.5">
                <input
                  type="checkbox"
                  id="newOpenNewTabNav"
                  checked={newItem.openInNewTab}
                  onChange={e => setNewItem(prev => ({ ...prev, openInNewTab: e.target.checked }))}
                  className="rounded border-gray-300 text-primary focus:ring-primary w-4.5 h-4.5 cursor-pointer"
                />
                <label htmlFor="newOpenNewTabNav" className="text-xs font-bold text-text-secondary cursor-pointer">Open external URL in new tab</label>
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

      {/* EDIT MENU ITEM MODAL */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bg-surface border border-gray-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left animate-fade-in max-h-[90vh] overflow-y-auto">
            <h3 className="font-extrabold text-base text-text-primary">Edit Menu Link</h3>
            
            <form onSubmit={handleUpdate} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Menu Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FASHION"
                  value={editingItem.name || ''}
                  onChange={e => setEditingItem(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
                />
              </div>

              {/* Menu Type Selector */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Menu Link Type</label>
                <select
                  value={editingItem.menuType || 'CustomPage'}
                  onChange={e => setEditingItem(prev => ({ ...prev, menuType: e.target.value as any }))}
                  className="bg-gray-100 dark:bg-slate-800 text-xs px-3 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none font-bold w-full cursor-pointer"
                >
                  <option value="Category">Category Link (Connect to categories)</option>
                  <option value="CustomPage">Custom Shop Page Slug</option>
                  <option value="External">External Link URL</option>
                </select>
              </div>

              {/* Dynamic Type Config Options */}
              {editingItem.menuType === 'Category' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Connect with Existing Category</label>
                  <select
                    value={editingItem.categoryConnectionId || ''}
                    required
                    onChange={e => setEditingItem(prev => ({ ...prev, categoryConnectionId: e.target.value }))}
                    className="bg-gray-100 dark:bg-slate-800 text-xs px-3 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none font-bold w-full cursor-pointer"
                  >
                    <option value="" disabled>-- Select Category --</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {editingItem.menuType === 'CustomPage' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Custom Page Route Slug</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. /sale or /products?isNewArrival=true"
                    value={editingItem.slug || ''}
                    onChange={e => setEditingItem(prev => ({ ...prev, slug: e.target.value }))}
                    className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full font-mono"
                  />
                </div>
              )}

              {editingItem.menuType === 'External' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">External Link URL</label>
                  <input
                    type="url"
                    required
                    placeholder="e.g. https://example.com"
                    value={editingItem.externalUrl || ''}
                    onChange={e => setEditingItem(prev => ({ ...prev, externalUrl: e.target.value }))}
                    className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
                  />
                </div>
              )}

              {/* Icon & Highlights */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Menu Icon (Optional)</label>
                  <select
                    value={editingItem.icon || ''}
                    onChange={e => setEditingItem(prev => ({ ...prev, icon: e.target.value }))}
                    className="bg-gray-100 dark:bg-slate-800 text-xs px-3 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none font-bold w-full cursor-pointer"
                  >
                    <option value="">No Icon</option>
                    {AVAILABLE_ICONS.map(ic => (
                      <option key={ic} value={ic}>{ic}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Highlighter Badge</label>
                  <select
                    value={editingItem.highlight || 'None'}
                    onChange={e => setEditingItem(prev => ({ ...prev, highlight: e.target.value as any }))}
                    className="bg-gray-100 dark:bg-slate-800 text-xs px-3 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none font-bold w-full cursor-pointer"
                  >
                    <option value="None">No Highlights</option>
                    <option value="NEW">NEW (Indigo tag)</option>
                    <option value="SALE">SALE (Rose tag)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Custom Badge Text (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. HOT or 50% OFF"
                  maxLength={12}
                  value={editingItem.badgeText || ''}
                  onChange={e => setEditingItem(prev => ({ ...prev, badgeText: e.target.value }))}
                  className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
                />
              </div>

              {/* Display Toggles */}
              <div className="space-y-2 pt-2 border-t border-gray-150 dark:border-slate-800">
                <label className="text-[10px] font-bold text-gray-400 uppercase block">Display Device Visibility</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingItem(prev => ({ ...prev, showInDesktop: !prev.showInDesktop }))}
                    className={`py-1.5 text-[10px] font-black rounded-lg border transition-all cursor-pointer ${
                      editingItem.showInDesktop ? 'border-primary bg-primary/10 text-primary' : 'border-gray-250 dark:border-slate-800 text-gray-400'
                    }`}
                  >
                    Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingItem(prev => ({ ...prev, showInMobile: !prev.showInMobile }))}
                    className={`py-1.5 text-[10px] font-black rounded-lg border transition-all cursor-pointer ${
                      editingItem.showInMobile ? 'border-primary bg-primary/10 text-primary' : 'border-gray-250 dark:border-slate-800 text-gray-400'
                    }`}
                  >
                    Mobile
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingItem(prev => ({ ...prev, showInSidebar: !prev.showInSidebar }))}
                    className={`py-1.5 text-[10px] font-black rounded-lg border transition-all cursor-pointer ${
                      editingItem.showInSidebar ? 'border-primary bg-primary/10 text-primary' : 'border-gray-250 dark:border-slate-800 text-gray-400'
                    }`}
                  >
                    Sidebar
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1.5">
                <input
                  type="checkbox"
                  id="editOpenNewTabNav"
                  checked={editingItem.openInNewTab || false}
                  onChange={e => setEditingItem(prev => ({ ...prev, openInNewTab: e.target.checked }))}
                  className="rounded border-gray-300 text-primary focus:ring-primary w-4.5 h-4.5 cursor-pointer"
                />
                <label htmlFor="editOpenNewTabNav" className="text-xs font-bold text-text-secondary cursor-pointer">Open external URL in new tab</label>
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
                  onClick={() => setEditingItem(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-755 text-text-secondary text-xs font-bold py-2.5 rounded-xl cursor-pointer"
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
