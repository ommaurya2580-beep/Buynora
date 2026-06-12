import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Sparkles, Save, Eye, Layout, Monitor, Tablet as TabletIcon, Smartphone,
  Sun, Moon, Plus, Trash2, ArrowLeft, Calendar, ShieldCheck, HelpCircle, AlertCircle, Award
} from 'lucide-react';
import { 
  useCampaign, 
  useCreateCampaignMutation, 
  useUpdateCampaignMutation,
  useTemplates,
  useVersions,
  useRestoreVersionMutation
} from '../hooks/useCampaigns';
import { useProducts, useCategories } from '../../../../hooks/useQueries';
import { useToast } from '../../../../hooks/useToast';
import sonyHeadphonesImage from '../../../../assets/sony_headphones_podium.png';

const formatCurrency = (val: number) =>
  `₹${val.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

const CampaignCreate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { data: campaignData, isLoading: loadingCampaign } = useCampaign(id);
  const { data: templates = [] } = useTemplates();
  const { data: versions = [] } = useVersions(id);
  const { data: productsData } = useProducts({ limit: 100 });
  const { data: categories = [] } = useCategories();

  const createMutation = useCreateCampaignMutation();
  const updateMutation = useUpdateCampaignMutation();
  const restoreMutation = useRestoreVersionMutation();

  const productsList = productsData?.products || [];

  // Form Tabs
  const [activeFormTab, setActiveFormTab] = useState<'info' | 'media' | 'content' | 'pricing' | 'targeting' | 'scheduling' | 'abtest' | 'versions'>('info');

  // Preview options
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');

  // Form State
  const [form, setForm] = useState({
    campaignName: '',
    campaignSlug: '',
    internalNotes: '',
    description: '',
    tags: [] as string[],
    priority: 1,
    status: 'Draft' as any,
    campaignType: 'New Launch' as any,

    // Media
    imageUrl: '',
    mobileImageUrl: '',
    tabletImageUrl: '',
    ultraWideImageUrl: '',
    heroProductImageUrl: '',
    backgroundImageUrl: '',
    videoUrl: '',
    videoUrlWebM: '',
    youtubeUrl: '',
    vimeoUrl: '',
    videoSettings: {
      videoAutoplay: true,
      videoLoop: true,
      videoMute: true,
      videoPauseOnHover: true,
      videoShowControls: false,
      videoShowThumbnail: true,
      videoPreload: true
    },

    // Content
    badge: '🚀 NEW LAUNCH',
    title: '',
    subtitle: '',
    offerText: '',
    couponCode: '',
    termsConditions: '',

    // Pricing
    pricing: {
      enablePricing: false,
      price: 0,
      oldPrice: 0,
      discount: 0,
      savingsAmount: 0,
      emiOption: '',
      exchangeOffer: '',
      bankOffer: '',
      couponOffer: '',
      cashback: ''
    },

    // Buttons
    primaryButton: { text: 'Explore Now', icon: 'ArrowRight', color: 'bg-slate-900 dark:bg-white text-white dark:text-slate-950', link: '' },
    secondaryButton: { text: 'View Details', icon: 'Eye', color: 'border border-slate-200/40 text-slate-750 dark:text-slate-300', link: '' },
    buttonActionType: 'Open Product' as any,

    // Attachments
    attachedProductIds: [] as string[],
    attachedCategoryIds: [] as string[],
    attachedBrandId: '',

    // Scheduling
    startDate: '',
    endDate: '',
    timezone: 'GMT+5:30',
    autoPublish: true,
    autoExpire: true,

    // Rotation & Animations
    rotationMode: 'Auto Carousel' as any,
    carouselAutoplay: true,
    carouselTransitionSpeed: 6000,
    carouselAnimationSpeed: 400,
    carouselInfiniteLoop: true,
    carouselPauseOnHover: true,
    animationSetting: 'Fade' as any,

    // Targeting
    targetDevices: ['Desktop', 'Tablet', 'Mobile'] as any[],
    targetUsers: ['Guest', 'Logged In', 'Customer'] as any[],
    targetGeo: { countries: [] as string[], states: [] as string[], cities: [] as string[] },

    // A/B Testing
    enableABTest: false,
    abTestId: '',

    // SEO
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ''
  });

  // Load editing campaign details
  useEffect(() => {
    if (isEdit && campaignData) {
      setForm({
        ...form,
        ...campaignData,
        tags: campaignData.tags || [],
        targetDevices: campaignData.targetDevices || ['Desktop', 'Tablet', 'Mobile'],
        targetUsers: campaignData.targetUsers || ['Guest', 'Logged In', 'Customer'],
        targetGeo: campaignData.targetGeo || { countries: [], states: [], cities: [] },
        pricing: {
          ...form.pricing,
          ...(campaignData.pricing || {})
        },
        videoSettings: {
          ...form.videoSettings,
          ...(campaignData.videoSettings || {})
        },
        primaryButton: {
          ...form.primaryButton,
          ...(campaignData.primaryButton || {})
        },
        secondaryButton: {
          ...form.secondaryButton,
          ...(campaignData.secondaryButton || {})
        }
      });
    }
  }, [isEdit, campaignData]);

  // Sync Slug on Campaign Name Change
  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setForm(prev => ({
      ...prev,
      campaignName: name,
      campaignSlug: slug
    }));
  };

  // Pre-fill from template
  const handleLoadTemplate = (templateData: any) => {
    if (!window.confirm("Pre-filling from template will overwrite your current settings. Continue?")) return;
    setForm(prev => ({
      ...prev,
      ...templateData,
      pricing: { ...prev.pricing, ...(templateData.pricing || {}) },
      primaryButton: { ...prev.primaryButton, ...(templateData.primaryButton || {}) },
      secondaryButton: { ...prev.secondaryButton, ...(templateData.secondaryButton || {}) },
      videoSettings: { ...prev.videoSettings, ...(templateData.videoSettings || {}) }
    }));
    showToast("Template loaded!", "info");
  };

  // Version Restore
  const handleRestoreVersion = (versionId: string) => {
    if (!window.confirm("Are you sure you want to rollback to this version? All current unsaved changes will be lost.")) return;
    restoreMutation.mutate(versionId, {
      onSuccess: (data) => {
        showToast("Rollback completed successfully!", "success");
        setForm({ ...form, ...data });
      },
      onError: () => {
        showToast("Rollback failed.", "error");
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.campaignName.trim() || !form.campaignSlug.trim()) {
      showToast("Please input campaign name and slug.", "info");
      return;
    }

    const payload = {
      ...form,
      createdBy: campaignData?.createdBy || "admin@buynora.com",
    };

    if (isEdit) {
      updateMutation.mutate({ id: id!, campaign: payload }, {
        onSuccess: () => {
          showToast("Campaign updated successfully!", "success");
          navigate('/admin/hero-campaigns/list');
        },
        onError: () => {
          showToast("Failed to save changes.", "error");
        }
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          showToast("Campaign created successfully!", "success");
          navigate('/admin/hero-campaigns/list');
        },
        onError: () => {
          showToast("Failed to create campaign.", "error");
        }
      });
    }
  };

  if (isEdit && loadingCampaign) {
    return <div className="py-20 text-center text-xs text-gray-400">Loading Campaign Settings...</div>;
  }

  // Derive savings
  const computedSavings = form.pricing.oldPrice - form.pricing.price;

  return (
    <div className="space-y-6 text-left select-none pb-20">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => navigate('/admin/hero-campaigns/list')}
          className="p-2 bg-gray-150 dark:bg-slate-800 hover:bg-gray-250 dark:hover:bg-slate-700 rounded-xl cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-text-secondary" />
        </button>
        <div>
          <h2 className="text-xl font-black text-text-primary tracking-tight">
            {isEdit ? `Edit Campaign: ${form.campaignName}` : 'Create Hero Campaign'}
          </h2>
          <p className="text-xs text-gray-400">Assemble responsive banner layouts, video promotions, scheduling and targeting rules</p>
        </div>
      </div>

      {/* Main Grid: Form Left Pane + Live Preview Right Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT PANE - FORM TABS & SECTIONS */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Templates Quick Selector (only on create) */}
          {!isEdit && (
            <div className="glass p-5 rounded-3xl border border-gray-200/50 dark:border-slate-850/50 bg-bg-surface/40">
              <h4 className="font-extrabold text-[10px] uppercase tracking-wider text-indigo-500 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Pre-fill from Enterprise Templates
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {templates.map((tpl: any) => (
                  <button
                    key={tpl.id}
                    onClick={() => handleLoadTemplate(tpl.campaignData)}
                    className="p-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-purple-500 rounded-xl text-center cursor-pointer transition-colors"
                  >
                    <span className="text-xl block mb-1">{tpl.thumbnail}</span>
                    <span className="font-bold text-[10px] text-text-primary block leading-tight">{tpl.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form Tabs list */}
          <div className="flex bg-gray-100 dark:bg-slate-800/40 p-1 rounded-2xl gap-1 overflow-x-auto text-[10px] font-bold">
            {[
              { id: 'info', name: 'Information' },
              { id: 'media', name: 'Media / Video' },
              { id: 'content', name: 'Badge & Copy' },
              { id: 'pricing', name: 'Pricing' },
              { id: 'targeting', name: 'Targeting' },
              { id: 'scheduling', name: 'Scheduling' },
              { id: 'abtest', name: 'A/B Test' },
              ...(isEdit ? [{ id: 'versions', name: 'Versions' }] : [])
            ].map((tab: any) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFormTab(tab.id)}
                className={`px-3 py-2 rounded-xl uppercase transition-all cursor-pointer whitespace-nowrap ${
                  activeFormTab === tab.id 
                    ? 'bg-purple-600 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-text-primary'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Form body */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* TAB: INFORMATION */}
            {activeFormTab === 'info' && (
              <div className="glass p-6 rounded-3xl border border-gray-250/50 dark:border-slate-850/50 bg-bg-surface/40 space-y-4">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-400 border-b border-gray-150/40 dark:border-slate-800/40 pb-3 mb-2">Campaign Meta Information</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Campaign Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Summer Festival Special"
                      value={form.campaignName}
                      onChange={e => handleNameChange(e.target.value)}
                      className="bg-gray-100 dark:bg-slate-850 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Campaign Slug *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. summer-festival-special"
                      value={form.campaignSlug}
                      onChange={e => setForm({ ...form, campaignSlug: e.target.value })}
                      className="bg-gray-100 dark:bg-slate-850 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Campaign Type</label>
                    <select
                      value={form.campaignType}
                      onChange={e => setForm({ ...form, campaignType: e.target.value as any })}
                      className="bg-gray-100 dark:bg-slate-850 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none font-bold"
                    >
                      <option value="New Launch">🚀 New Launch</option>
                      <option value="Flash Sale">⚡ Flash Sale</option>
                      <option value="Mega Sale">🔥 Mega Sale</option>
                      <option value="Festival Sale">🎉 Festival Sale</option>
                      <option value="Brand Promotion">🏷️ Brand Promotion</option>
                      <option value="Price Drop">📉 Price Drop</option>
                      <option value="AI Recommendation">🧠 AI Recommendation</option>
                      <option value="Collection Launch">🧥 Collection Launch</option>
                      <option value="Video Campaign">🎥 Video Campaign</option>
                      <option value="Custom Campaign">🎨 Custom Campaign</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Priority Order</label>
                    <input
                      type="number"
                      min="1"
                      required
                      placeholder="e.g. 1"
                      value={form.priority}
                      onChange={e => setForm({ ...form, priority: parseInt(e.target.value) || 1 })}
                      className="bg-gray-100 dark:bg-slate-850 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Campaign Status</label>
                    <select
                      value={form.status}
                      onChange={e => setForm({ ...form, status: e.target.value as any })}
                      className="bg-gray-100 dark:bg-slate-850 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none font-bold"
                    >
                      <option value="Draft">📝 Draft</option>
                      <option value="Pending Review">🔍 Pending Review</option>
                      <option value="Approved">✅ Approved</option>
                      <option value="Published">🟢 Published</option>
                      <option value="Paused">🟡 Paused</option>
                      <option value="Expired">🔴 Expired</option>
                      <option value="Archived">📦 Archived</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase">Internal Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Write private notes on this campaign (audience, objectives)..."
                    value={form.internalNotes}
                    onChange={e => setForm({ ...form, internalNotes: e.target.value })}
                    className="bg-gray-100 dark:bg-slate-855 text-xs p-3.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full leading-relaxed resize-none"
                  />
                </div>

                {/* SEO */}
                <h5 className="font-extrabold text-[10px] text-gray-400 uppercase tracking-widest mt-6">SEO Metadata</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">Meta Title</label>
                    <input
                      type="text"
                      placeholder="SEO Title Tag"
                      value={form.metaTitle}
                      onChange={e => setForm({ ...form, metaTitle: e.target.value })}
                      className="bg-gray-100 dark:bg-slate-850 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">Meta Keywords</label>
                    <input
                      type="text"
                      placeholder="comma, separated, keywords"
                      value={form.metaKeywords}
                      onChange={e => setForm({ ...form, metaKeywords: e.target.value })}
                      className="bg-gray-100 dark:bg-slate-850 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 w-full"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Meta Description</label>
                  <textarea
                    rows={2}
                    placeholder="SEO description tag..."
                    value={form.metaDescription}
                    onChange={e => setForm({ ...form, metaDescription: e.target.value })}
                    className="bg-gray-100 dark:bg-slate-855 text-xs p-3.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full leading-relaxed resize-none"
                  />
                </div>

              </div>
            )}

            {/* TAB: MEDIA & VIDEO */}
            {activeFormTab === 'media' && (
              <div className="glass p-6 rounded-3xl border border-gray-250/50 dark:border-slate-855/50 bg-bg-surface/40 space-y-6">
                
                {/* Image assets */}
                <div className="space-y-4">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-400 border-b border-gray-150/40 dark:border-slate-800/40 pb-3">Banners & Layout Images</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-gray-500">
                    <div className="flex flex-col gap-1 text-left">
                      <span className="text-[10px] font-black text-gray-400 uppercase">Desktop Image (1400x480) *</span>
                      <input
                        type="url"
                        placeholder="Image URL link"
                        required
                        value={form.imageUrl}
                        onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                        className="bg-gray-100 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-1 text-left">
                      <span className="text-[10px] font-black text-gray-400 uppercase">Mobile Image (600x600)</span>
                      <input
                        type="url"
                        placeholder="Mobile banner URL link"
                        value={form.mobileImageUrl}
                        onChange={e => setForm({ ...form, mobileImageUrl: e.target.value })}
                        className="bg-gray-100 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-1 text-left">
                      <span className="text-[10px] font-black text-gray-400 uppercase">Tablet Image (1024x500)</span>
                      <input
                        type="url"
                        placeholder="Tablet banner URL link"
                        value={form.tabletImageUrl}
                        onChange={e => setForm({ ...form, tabletImageUrl: e.target.value })}
                        className="bg-gray-100 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-1 text-left">
                      <span className="text-[10px] font-black text-gray-400 uppercase">Ultra Wide Image (1920x600)</span>
                      <input
                        type="url"
                        placeholder="Ultra wide banner URL"
                        value={form.ultraWideImageUrl}
                        onChange={e => setForm({ ...form, ultraWideImageUrl: e.target.value })}
                        className="bg-gray-100 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-1 text-left">
                      <span className="text-[10px] font-black text-gray-400 uppercase">Hero Product Image (Transparent PNG)</span>
                      <input
                        type="url"
                        placeholder="Floating product image link"
                        value={form.heroProductImageUrl}
                        onChange={e => setForm({ ...form, heroProductImageUrl: e.target.value })}
                        className="bg-gray-100 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-1 text-left">
                      <span className="text-[10px] font-black text-gray-400 uppercase">Background Frame Canvas</span>
                      <input
                        type="url"
                        placeholder="Special backdrop pattern link"
                        value={form.backgroundImageUrl}
                        onChange={e => setForm({ ...form, backgroundImageUrl: e.target.value })}
                        className="bg-gray-100 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Video settings */}
                <div className="space-y-4">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-400 border-b border-gray-150/40 dark:border-slate-800/40 pb-3">Video Banner Settings</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-gray-400 uppercase">Upload MP4 Video URL</span>
                      <input
                        type="url"
                        placeholder="MP4 URL"
                        value={form.videoUrl}
                        onChange={e => setForm({ ...form, videoUrl: e.target.value })}
                        className="bg-gray-100 dark:bg-slate-850 text-xs px-3.5 py-2.5 rounded-xl border border-transparent w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-gray-400 uppercase">YouTube Streaming URL</span>
                      <input
                        type="url"
                        placeholder="YouTube watch/embed link"
                        value={form.youtubeUrl}
                        onChange={e => setForm({ ...form, youtubeUrl: e.target.value })}
                        className="bg-gray-100 dark:bg-slate-850 text-xs px-3.5 py-2.5 rounded-xl border border-transparent w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                    {[
                      { key: 'videoAutoplay', label: 'Autoplay' },
                      { key: 'videoLoop', label: 'Loop' },
                      { key: 'videoMute', label: 'Mute' },
                      { key: 'videoPauseOnHover', label: 'Pause on Hover' }
                    ].map(sett => (
                      <label key={sett.key} className="flex items-center gap-2 cursor-pointer text-xs font-bold text-text-secondary">
                        <input
                          type="checkbox"
                          checked={(form.videoSettings as any)[sett.key]}
                          onChange={e => setForm({
                            ...form,
                            videoSettings: {
                              ...form.videoSettings,
                              [sett.key]: e.target.checked
                            }
                          })}
                          className="w-4 h-4 rounded text-purple-600 border-gray-300 dark:border-slate-850"
                        />
                        <span>{sett.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB: CONTENT & COPY */}
            {activeFormTab === 'content' && (
              <div className="glass p-6 rounded-3xl border border-gray-250/50 dark:border-slate-855/50 bg-bg-surface/40 space-y-4">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-400 border-b border-gray-150/40 dark:border-slate-800/40 pb-3 mb-2">Typography & Badges Content</h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Small Pill Badge</label>
                    <input
                      type="text"
                      placeholder="e.g. FLASH SALE"
                      value={form.badge}
                      onChange={e => setForm({ ...form, badge: e.target.value })}
                      className="bg-gray-100 dark:bg-slate-850 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Main Heading Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="Heading Title Text"
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                      className="bg-gray-100 dark:bg-slate-850 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase">Sub Heading Subtitle</label>
                  <input
                    type="text"
                    placeholder="Short summary tagline..."
                    value={form.subtitle}
                    onChange={e => setForm({ ...form, subtitle: e.target.value })}
                    className="bg-gray-100 dark:bg-slate-850 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 w-full"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase">Description Paragraph</label>
                  <textarea
                    rows={3}
                    placeholder="Full detailed paragraph text showing in description..."
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="bg-gray-100 dark:bg-slate-855 text-xs p-3.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full leading-relaxed resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Promo Offer text</label>
                    <input
                      type="text"
                      placeholder="e.g. Save ₹2,500 today"
                      value={form.offerText}
                      onChange={e => setForm({ ...form, offerText: e.target.value })}
                      className="bg-gray-100 dark:bg-slate-850 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Promo Coupon Code</label>
                    <input
                      type="text"
                      placeholder="WELCOME10"
                      value={form.couponCode}
                      onChange={e => setForm({ ...form, couponCode: e.target.value.toUpperCase() })}
                      className="bg-gray-100 dark:bg-slate-850 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 w-full font-mono uppercase"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase">Terms & Conditions</label>
                  <input
                    type="text"
                    placeholder="Offer conditions disclaimer..."
                    value={form.termsConditions}
                    onChange={e => setForm({ ...form, termsConditions: e.target.value })}
                    className="bg-gray-100 dark:bg-slate-850 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 w-full"
                  />
                </div>

                {/* Primary & Secondary Buttons config */}
                <h5 className="font-extrabold text-[10px] text-gray-400 uppercase tracking-widest mt-6">CTA BUTTONS & ACTIONS</h5>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  
                  {/* Primary CTA */}
                  <div className="p-4 bg-gray-100/50 dark:bg-slate-850/50 border border-gray-150 dark:border-slate-800 rounded-2xl space-y-3">
                    <span className="text-[10px] font-black text-gray-400 uppercase">Primary CTA Button</span>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-gray-400 font-bold uppercase">Text</span>
                      <input
                        type="text"
                        value={form.primaryButton.text}
                        onChange={e => setForm({
                          ...form,
                          primaryButton: { ...form.primaryButton, text: e.target.value }
                        })}
                        className="bg-white dark:bg-slate-900 text-xs px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-800"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-gray-400 font-bold uppercase">Color class</span>
                      <input
                        type="text"
                        value={form.primaryButton.color}
                        onChange={e => setForm({
                          ...form,
                          primaryButton: { ...form.primaryButton, color: e.target.value }
                        })}
                        placeholder="bg-slate-900 dark:bg-white text-white"
                        className="bg-white dark:bg-slate-900 text-xs px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-800"
                      />
                    </div>
                  </div>

                  {/* Secondary CTA */}
                  <div className="p-4 bg-gray-100/50 dark:bg-slate-850/50 border border-gray-150 dark:border-slate-800 rounded-2xl space-y-3">
                    <span className="text-[10px] font-black text-gray-400 uppercase">Secondary CTA Button</span>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-gray-400 font-bold uppercase">Text</span>
                      <input
                        type="text"
                        value={form.secondaryButton.text}
                        onChange={e => setForm({
                          ...form,
                          secondaryButton: { ...form.secondaryButton, text: e.target.value }
                        })}
                        className="bg-white dark:bg-slate-900 text-xs px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-800"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-gray-400 font-bold uppercase">Color class</span>
                      <input
                        type="text"
                        value={form.secondaryButton.color}
                        onChange={e => setForm({
                          ...form,
                          secondaryButton: { ...form.secondaryButton, color: e.target.value }
                        })}
                        className="bg-white dark:bg-slate-900 text-xs px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-800"
                      />
                    </div>
                  </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Button Action Target</label>
                    <select
                      value={form.buttonActionType}
                      onChange={e => setForm({ ...form, buttonActionType: e.target.value as any })}
                      className="bg-gray-100 dark:bg-slate-850 text-xs px-3.5 py-2.5 rounded-xl border border-transparent outline-none font-bold"
                    >
                      <option value="Open Product">🛍️ Open Product Detail</option>
                      <option value="Open Category">📁 Open Category Listing</option>
                      <option value="Open Brand">✔️ Open Brand Showroom</option>
                      <option value="Open Custom Route">🛣️ Open Custom UI Route</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Primary Redirect URL</label>
                    <input
                      type="text"
                      placeholder="e.g. /product/p1"
                      value={form.primaryButton.link}
                      onChange={e => setForm({
                        ...form,
                        primaryButton: { ...form.primaryButton, link: e.target.value },
                        secondaryButton: { ...form.secondaryButton, link: e.target.value }
                      })}
                      className="bg-gray-100 dark:bg-slate-850 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 w-full"
                    />
                  </div>
                </div>

              </div>
            )}

            {/* TAB: PRICING */}
            {activeFormTab === 'pricing' && (
              <div className="glass p-6 rounded-3xl border border-gray-250/50 dark:border-slate-855/50 bg-bg-surface/40 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-150/40 dark:border-slate-800/40 pb-3 mb-2">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-400">Pricing & Commercial offers</h4>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.pricing.enablePricing}
                      onChange={e => setForm({
                        ...form,
                        pricing: {
                          ...form.pricing,
                          enablePricing: e.target.checked
                        }
                      })}
                      className="w-4 h-4 rounded text-purple-600 border-gray-300 dark:border-slate-850"
                    />
                    <span className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-wide">Enable Pricing Display</span>
                  </label>
                </div>

                {form.pricing.enablePricing && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Current Sale Price</label>
                        <input
                          type="number"
                          value={form.pricing.price}
                          onChange={e => {
                            const val = parseFloat(e.target.value) || 0;
                            const old = form.pricing.oldPrice || val;
                            const disc = old > 0 ? Math.round(((old - val) / old) * 100) : 0;
                            setForm({
                              ...form,
                              pricing: {
                                ...form.pricing,
                                price: val,
                                discount: disc,
                                savingsAmount: old - val
                              }
                            });
                          }}
                          className="bg-gray-100 dark:bg-slate-850 text-xs px-3.5 py-2.5 rounded-xl border"
                        />
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Original Retail Price</label>
                        <input
                          type="number"
                          value={form.pricing.oldPrice}
                          onChange={e => {
                            const val = parseFloat(e.target.value) || 0;
                            const pr = form.pricing.price;
                            const disc = val > 0 ? Math.round(((val - pr) / val) * 100) : 0;
                            setForm({
                              ...form,
                              pricing: {
                                ...form.pricing,
                                oldPrice: val,
                                discount: disc,
                                savingsAmount: val - pr
                              }
                            });
                          }}
                          className="bg-gray-100 dark:bg-slate-850 text-xs px-3.5 py-2.5 rounded-xl border"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Discount Percentage (%)</label>
                        <input
                          type="text"
                          disabled
                          value={`${form.pricing.discount}% OFF`}
                          className="bg-gray-200 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border text-gray-500 font-bold"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Savings Value</label>
                        <input
                          type="text"
                          disabled
                          value={formatCurrency(computedSavings)}
                          className="bg-gray-200 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border text-emerald-500 font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">EMI Installment text</label>
                        <input
                          type="text"
                          placeholder="e.g. ₹2,000/month No-cost EMI"
                          value={form.pricing.emiOption}
                          onChange={e => setForm({
                            ...form,
                            pricing: { ...form.pricing, emiOption: e.target.value }
                          })}
                          className="bg-gray-100 dark:bg-slate-850 text-xs px-3.5 py-2.5 rounded-xl border w-full"
                        />
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Exchange Trade-In text</label>
                        <input
                          type="text"
                          placeholder="e.g. Get up to ₹5,000 off on exchange"
                          value={form.pricing.exchangeOffer}
                          onChange={e => setForm({
                            ...form,
                            pricing: { ...form.pricing, exchangeOffer: e.target.value }
                          })}
                          className="bg-gray-100 dark:bg-slate-850 text-xs px-3.5 py-2.5 rounded-xl border w-full"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Partner Bank offers</label>
                        <input
                          type="text"
                          placeholder="e.g. 10% instant discount on HDFC"
                          value={form.pricing.bankOffer}
                          onChange={e => setForm({
                            ...form,
                            pricing: { ...form.pricing, bankOffer: e.target.value }
                          })}
                          className="bg-gray-100 dark:bg-slate-850 text-xs px-3.5 py-2.5 rounded-xl border w-full"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Cashback Credit deals</label>
                        <input
                          type="text"
                          placeholder="e.g. ₹500 cashback as Amazon Pay balance"
                          value={form.pricing.cashback}
                          onChange={e => setForm({
                            ...form,
                            pricing: { ...form.pricing, cashback: e.target.value }
                          })}
                          className="bg-gray-100 dark:bg-slate-850 text-xs px-3.5 py-2.5 rounded-xl border w-full"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Catalog Attachments */}
                <h5 className="font-extrabold text-[10px] text-gray-400 uppercase tracking-widest mt-6">Product & Catalog Attachment Links</h5>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">Featured Product ID</label>
                    <select
                      value={form.attachedProductIds[0] || ''}
                      onChange={e => setForm({ ...form, attachedProductIds: e.target.value ? [e.target.value] : [] })}
                      className="bg-gray-100 dark:bg-slate-850 text-xs px-3.5 py-2.5 rounded-xl border cursor-pointer font-bold"
                    >
                      <option value="">Select Featured Product</option>
                      {productsList.map(p => (
                        <option key={p.id} value={p.id}>{p.brand} - {p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">Attached Category ID</label>
                    <select
                      value={form.attachedCategoryIds[0] || ''}
                      onChange={e => setForm({ ...form, attachedCategoryIds: e.target.value ? [e.target.value] : [] })}
                      className="bg-gray-100 dark:bg-slate-850 text-xs px-3.5 py-2.5 rounded-xl border cursor-pointer font-bold"
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">Attached Brand ID</label>
                    <select
                      value={form.attachedBrandId}
                      onChange={e => setForm({ ...form, attachedBrandId: e.target.value })}
                      className="bg-gray-100 dark:bg-slate-850 text-xs px-3.5 py-2.5 rounded-xl border cursor-pointer font-bold"
                    >
                      <option value="">Select Brand</option>
                      <option value="b_apple">Apple</option>
                      <option value="b_nike">Nike</option>
                      <option value="b_sony">Sony</option>
                      <option value="b_adidas">Adidas</option>
                      <option value="b_zara">Zara</option>
                    </select>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: TARGETING */}
            {activeFormTab === 'targeting' && (
              <div className="glass p-6 rounded-3xl border border-gray-250/50 dark:border-slate-855/50 bg-bg-surface/40 space-y-6">
                
                {/* Devices */}
                <div className="space-y-3">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-400 border-b border-gray-150/40 dark:border-slate-800/40 pb-2">Device Visibility Target</h4>
                  <div className="flex gap-4">
                    {['Desktop', 'Tablet', 'Mobile'].map(device => {
                      const isChecked = form.targetDevices.includes(device);
                      return (
                        <label key={device} className="flex items-center gap-2 cursor-pointer text-xs font-bold text-text-secondary">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={e => {
                              const list = e.target.checked 
                                ? [...form.targetDevices, device]
                                : form.targetDevices.filter(d => d !== device);
                              setForm({ ...form, targetDevices: list });
                            }}
                            className="w-4 h-4 rounded text-purple-600 border-gray-300 dark:border-slate-850"
                          />
                          <span>{device}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Users Role */}
                <div className="space-y-3">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-400 border-b border-gray-150/40 dark:border-slate-800/40 pb-2">User Audience targeting</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {['Guest', 'Logged In', 'Customer', 'Seller', 'Admin', 'Premium Member', 'New User', 'Returning User'].map(userType => {
                      const isChecked = form.targetUsers.includes(userType);
                      return (
                        <label key={userType} className="flex items-center gap-2 cursor-pointer text-xs font-bold text-text-secondary">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={e => {
                              const list = e.target.checked 
                                ? [...form.targetUsers, userType]
                                : form.targetUsers.filter(u => u !== userType);
                              setForm({ ...form, targetUsers: list });
                            }}
                            className="w-4 h-4 rounded text-purple-600 border-gray-300 dark:border-slate-850"
                          />
                          <span>{userType}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Geo Targeting */}
                <div className="space-y-3">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-400 border-b border-gray-150/40 dark:border-slate-800/40 pb-2">Geo-Location filters</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-gray-400 uppercase">Countries</span>
                      <input
                        type="text"
                        placeholder="e.g. India, USA"
                        value={form.targetGeo.countries.join(', ')}
                        onChange={e => setForm({
                          ...form,
                          targetGeo: {
                            ...form.targetGeo,
                            countries: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                          }
                        })}
                        className="bg-gray-100 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-gray-400 uppercase">States</span>
                      <input
                        type="text"
                        placeholder="e.g. California, UP"
                        value={form.targetGeo.states.join(', ')}
                        onChange={e => setForm({
                          ...form,
                          targetGeo: {
                            ...form.targetGeo,
                            states: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                          }
                        })}
                        className="bg-gray-100 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-gray-400 uppercase">Cities</span>
                      <input
                        type="text"
                        placeholder="e.g. New York, Mumbai"
                        value={form.targetGeo.cities.join(', ')}
                        onChange={e => setForm({
                          ...form,
                          targetGeo: {
                            ...form.targetGeo,
                            cities: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                          }
                        })}
                        className="bg-gray-100 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border"
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: SCHEDULING & ROTATION */}
            {activeFormTab === 'scheduling' && (
              <div className="glass p-6 rounded-3xl border border-gray-250/50 dark:border-slate-855/50 bg-bg-surface/40 space-y-6">
                
                {/* Dates */}
                <div className="space-y-4">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-400 border-b border-gray-150/40 dark:border-slate-800/40 pb-2">Scheduling Lifecycles</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase">Campaign Launch Date</span>
                      <input
                        type="date"
                        value={form.startDate}
                        onChange={e => setForm({ ...form, startDate: e.target.value })}
                        className="bg-gray-100 dark:bg-slate-850 text-xs px-3.5 py-2.5 rounded-xl border font-bold"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase">Campaign Expiry Date</span>
                      <input
                        type="date"
                        value={form.endDate}
                        onChange={e => setForm({ ...form, endDate: e.target.value })}
                        className="bg-gray-100 dark:bg-slate-850 text-xs px-3.5 py-2.5 rounded-xl border font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-text-secondary">
                      <input
                        type="checkbox"
                        checked={form.autoPublish}
                        onChange={e => setForm({ ...form, autoPublish: e.target.checked })}
                        className="w-4 h-4 rounded text-purple-600 border-gray-300 dark:border-slate-850"
                      />
                      <span>Auto Publish Launch</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-text-secondary">
                      <input
                        type="checkbox"
                        checked={form.autoExpire}
                        onChange={e => setForm({ ...form, autoExpire: e.target.checked })}
                        className="w-4 h-4 rounded text-purple-600 border-gray-300 dark:border-slate-850"
                      />
                      <span>Auto Expire Banner</span>
                    </label>
                  </div>
                </div>

                {/* Rotation Engine settings */}
                <div className="space-y-4">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-400 border-b border-gray-150/40 dark:border-slate-800/40 pb-2">Multi-Hero Rotation Config</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase">Rotation Mode</span>
                      <select
                        value={form.rotationMode}
                        onChange={e => setForm({ ...form, rotationMode: e.target.value as any })}
                        className="bg-gray-100 dark:bg-slate-850 text-xs px-3.5 py-2.5 rounded-xl border font-bold"
                      >
                        <option value="Single Hero">Single Hero Display</option>
                        <option value="Auto Carousel">Auto Rotating Carousel</option>
                        <option value="Manual Carousel">Manual Arrow Navigation</option>
                        <option value="Campaign Rotation">Weighted Rotation engine</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase">Animation setting</span>
                      <select
                        value={form.animationSetting}
                        onChange={e => setForm({ ...form, animationSetting: e.target.value as any })}
                        className="bg-gray-100 dark:bg-slate-850 text-xs px-3.5 py-2.5 rounded-xl border font-bold"
                      >
                        <option value="Fade">Cross Dissolve Fade</option>
                        <option value="Slide">Slide Left/Right</option>
                        <option value="Zoom">Zoom scale out</option>
                        <option value="Parallax">Parallax depth shift</option>
                        <option value="Scale">Smooth Scale</option>
                        <option value="3D Transform">3D Extruded podium shift</option>
                        <option value="Glass Effect">Glassmorphic Blur transition</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase">Transition Speed (ms)</span>
                      <input
                        type="number"
                        placeholder="6000"
                        value={form.carouselTransitionSpeed}
                        onChange={e => setForm({ ...form, carouselTransitionSpeed: parseInt(e.target.value) || 6000 })}
                        className="bg-gray-100 dark:bg-slate-850 text-xs px-3.5 py-2.5 rounded-xl border"
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: A/B TESTING */}
            {activeFormTab === 'abtest' && (
              <div className="glass p-6 rounded-3xl border border-gray-250/50 dark:border-slate-855/50 bg-bg-surface/40 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-150/40 dark:border-slate-800/40 pb-3 mb-2">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-400 font-sans">A/B Traffic split configuration</h4>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.enableABTest}
                      onChange={e => setForm({ ...form, enableABTest: e.target.checked })}
                      className="w-4 h-4 rounded text-purple-600 border-gray-300 dark:border-slate-850"
                    />
                    <span className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-wide">Enable A/B Test Variant</span>
                  </label>
                </div>

                {form.enableABTest && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-2xl text-xs leading-relaxed text-text-secondary flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-text-primary block mb-0.5">How A/B Testing Works</span>
                        When enabled, the homepage routing engine will dynamically split traffic between this campaign and the secondary variant selected below. Performance indices (CTR, clicks, revenue) are compiled side-by-side.
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Target split ratio</label>
                        <select
                          value={form.abTestId}
                          onChange={e => setForm({ ...form, abTestId: e.target.value })}
                          className="bg-gray-100 dark:bg-slate-850 text-xs px-3.5 py-2.5 rounded-xl border font-bold"
                        >
                          <option value="">Select Split preset</option>
                          <option value="split_50">⚖️ 50% A / 50% B (Equal Split)</option>
                          <option value="split_70">📈 70% A / 30% B (Conservative)</option>
                          <option value="split_custom">🛠️ Custom traffic split</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Variant B Campaign ID</label>
                        <input
                          type="text"
                          placeholder="e.g. camp_p1"
                          value={form.abTestId ? 'camp_p1' : ''}
                          disabled
                          className="bg-gray-200 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border text-gray-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: VERSIONS ROLLBACK */}
            {isEdit && activeFormTab === 'versions' && (
              <div className="glass p-6 rounded-3xl border border-gray-250/50 dark:border-slate-855/50 bg-bg-surface/40 space-y-4">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-400 border-b border-gray-150/40 dark:border-slate-800/40 pb-3 mb-2 font-sans">Version Control History</h4>
                
                {versions.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-6">No previous versions saved yet.</p>
                ) : (
                  <div className="space-y-3">
                    {versions.map((v: any) => (
                      <div key={v.id} className="p-3 bg-white/10 dark:bg-slate-900/10 rounded-xl border border-dashed border-gray-200 dark:border-slate-800 flex justify-between items-center text-xs text-left">
                        <div>
                          <span className="font-bold text-text-primary block">Version #{v.versionNumber}</span>
                          <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">{v.changeSummary}</span>
                          <span className="text-[9px] text-gray-500 mt-1 block">Saved by {v.changedBy} on {new Date(v.createdAt).toLocaleString()}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRestoreVersion(v.id)}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 text-indigo-600 font-bold rounded-lg cursor-pointer transition-colors"
                        >
                          Rollback
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-2.5 pt-4">
              <button
                type="submit"
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-text-inverted font-bold text-xs px-6 py-3 rounded-2xl shadow cursor-pointer transition-all"
              >
                <Save className="w-4 h-4" /> Save Campaign Changes
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setForm(prev => ({ ...prev, status: 'Draft' }));
                  showToast("Campaign draft updated. Remember to submit to save changes.", "info");
                }}
                className="flex items-center gap-2 bg-gray-150 dark:bg-slate-800 hover:bg-gray-250 dark:hover:bg-slate-700 text-text-secondary font-bold text-xs px-5 py-3 rounded-2xl cursor-pointer transition-all"
              >
                Save Draft
              </button>
            </div>

          </form>
        </div>

        {/* RIGHT PANE - LIVE INTERACTIVE PREVIEW */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          
          <div className="flex items-center justify-between border-b border-gray-150/40 dark:border-slate-800/40 pb-3 text-left">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-400">Interactive Preview Banner</h4>
            
            <div className="flex items-center gap-4">
              
              {/* Responsive Device selectors */}
              <div className="flex items-center gap-1.5 text-gray-450">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer ${previewDevice === 'desktop' ? 'text-purple-600 dark:text-purple-400 bg-gray-150 dark:bg-slate-800' : ''}`}
                  title="Desktop Preview"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewDevice('tablet')}
                  className={`p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer ${previewDevice === 'tablet' ? 'text-purple-600 dark:text-purple-400 bg-gray-150 dark:bg-slate-800' : ''}`}
                  title="Tablet Preview"
                >
                  <TabletIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer ${previewDevice === 'mobile' ? 'text-purple-600 dark:text-purple-400 bg-gray-150 dark:bg-slate-800' : ''}`}
                  title="Mobile Preview"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>

              {/* Theme Toggle selector */}
              <button
                onClick={() => setPreviewTheme(previewTheme === 'light' ? 'dark' : 'light')}
                className="p-1.5 rounded-lg bg-gray-100 dark:bg-slate-850 hover:bg-gray-200 dark:hover:bg-slate-800 cursor-pointer text-text-secondary"
                title="Toggle preview theme"
              >
                {previewTheme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
              </button>

            </div>
          </div>

          {/* PREVIEW FRAME RENDERER */}
          <div className="flex justify-center items-center w-full">
            <div 
              className={`border border-gray-200/90 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl relative transition-all duration-300 ${
                previewDevice === 'desktop' ? 'w-full h-[320px]' :
                previewDevice === 'tablet' ? 'w-[380px] h-[340px]' :
                'w-[260px] h-[480px]'
              } ${previewTheme === 'dark' ? 'dark bg-slate-900 text-white' : 'bg-white text-slate-900'}`}
            >
              
              {/* Inside Banners replica */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFFFFF] via-[#F7F8FC] via-[#EEF2FF] to-[#F6F3FF] dark:from-[#0F172A] dark:via-[#111827] dark:via-[#1E293B] dark:to-[#312E81] transition-all duration-500 z-0" />
              
              {/* Background image override */}
              {form.backgroundImageUrl && (
                <img src={form.backgroundImageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-35 dark:opacity-20 z-0 pointer-events-none" />
              )}

              {/* Glowing Orb */}
              <div className="absolute -top-20 -left-20 w-48 h-48 bg-indigo-200/25 dark:bg-indigo-900/15 rounded-full blur-[40px] z-0" />

              {/* Actual Banner View representation */}
              <div className="w-full h-full relative z-10 p-6 flex flex-col justify-between overflow-y-auto select-text">
                
                {/* Content section */}
                <div className="space-y-2.5 text-left">
                  
                  {/* Badge */}
                  {form.badge && (
                    <div className="inline-block px-2.5 py-0.5 text-[8px] font-black uppercase bg-indigo-50/80 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100/60 dark:border-indigo-900/30 rounded-full w-fit">
                      {form.badge}
                    </div>
                  )}

                  {/* Title / Heading */}
                  <h3 className={`font-black tracking-tight leading-tight ${
                    previewDevice === 'mobile' ? 'text-lg' : 'text-xl'
                  }`}>
                    {form.title || 'Campaign Banners Heading'}
                  </h3>

                  {/* Subtitle */}
                  {form.subtitle && (
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 whitespace-pre-line leading-relaxed">
                      {form.subtitle}
                    </p>
                  )}

                  {/* Pricing metrics */}
                  {form.pricing.enablePricing && (
                    <div className="pt-1.5 space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-black text-sm">{formatCurrency(form.pricing.price)}</span>
                        <span className="text-[10px] text-gray-400 line-through">{formatCurrency(form.pricing.oldPrice)}</span>
                        <span className="text-[8px] bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded font-black">
                          {form.pricing.discount}% OFF
                        </span>
                      </div>
                      {computedSavings > 0 && (
                        <span className="text-[9px] text-emerald-600 font-extrabold block">Save {formatCurrency(computedSavings)}</span>
                      )}
                    </div>
                  )}

                </div>

                {/* Media area for Mobile vs Tablet/Desktop placement */}
                <div className="my-3 flex justify-center items-center relative h-24">
                  {form.videoUrl ? (
                    <div className="w-full h-full rounded-xl overflow-hidden border bg-slate-950 flex items-center justify-center text-[10px] font-bold text-gray-400">
                      🎥 Video Player Active
                    </div>
                  ) : (
                    <>
                      {/* CSS Podium and Image representation */}
                      <div className="absolute bottom-1 w-28 h-6 bg-slate-200/50 dark:bg-slate-800/80 rounded-[50%] blur-[2px]" />
                      <img 
                        src={form.imageUrl || sonyHeadphonesImage} 
                        alt="" 
                        className="max-h-24 object-contain drop-shadow-lg z-10 hover:scale-105 transition-transform" 
                      />
                    </>
                  )}
                </div>

                {/* Action CTA Buttons */}
                <div className="flex items-center gap-2 pt-2.5">
                  {form.primaryButton.text && (
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-full font-black text-[9px] tracking-wide shadow transition-all ${form.primaryButton.color}`}
                    >
                      {form.primaryButton.text}
                    </button>
                  )}
                  {form.secondaryButton.text && (
                    <button
                      type="button"
                      className={`px-3 py-2 rounded-full font-bold text-[9px] border border-gray-250 dark:border-slate-700 transition-all ${form.secondaryButton.color}`}
                    >
                      {form.secondaryButton.text}
                    </button>
                  )}
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default CampaignCreate;
