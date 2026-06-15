export type CampaignStatus = 
  | 'Draft' 
  | 'Pending Review' 
  | 'Approved' 
  | 'Published' 
  | 'Scheduled'
  | 'Paused' 
  | 'Rejected' 
  | 'Expired' 
  | 'Archived';

export type CampaignType =
  | 'New Launch'
  | 'Flash Sale'
  | 'Mega Sale'
  | 'Festival Sale'
  | 'Brand Promotion'
  | 'Price Drop'
  | 'AI Recommendation'
  | 'Collection Launch'
  | 'Video Campaign'
  | 'Custom Campaign';

export type ButtonActionType =
  | 'Open Product'
  | 'Open Category'
  | 'Open Brand'
  | 'Open Collection'
  | 'Open Seller Store'
  | 'Open External URL'
  | 'Open Custom Route';

export type RotationMode =
  | 'Single Hero'
  | 'Auto Carousel'
  | 'Manual Carousel'
  | 'Campaign Rotation';

export type AnimationSetting =
  | 'Fade'
  | 'Slide'
  | 'Zoom'
  | 'Parallax'
  | 'Scale'
  | '3D Transform'
  | 'Glass Effect';

export type DeviceType = 'Desktop' | 'Tablet' | 'Mobile';

export type UserTargetType =
  | 'Guest'
  | 'Logged In'
  | 'Customer'
  | 'Seller'
  | 'Admin'
  | 'Premium Member'
  | 'New User'
  | 'Returning User';

export interface GeoTarget {
  countries: string[];
  states: string[];
  cities: string[];
}

export interface VideoSettings {
  videoAutoplay: boolean;
  videoLoop: boolean;
  videoMute: boolean;
  videoPauseOnHover: boolean;
  videoShowControls: boolean;
  videoShowThumbnail: boolean;
  videoPreload: boolean;
}

export interface PricingSettings {
  enablePricing: boolean;
  price: number;
  oldPrice: number;
  discount: number;
  savingsAmount: number;
  emiOption: string;
  exchangeOffer: string;
  bankOffer: string;
  couponOffer: string;
  cashback: string;
}

export interface ButtonConfig {
  text: string;
  icon: string;
  color: string;
  link: string;
}

export interface HeroCampaign {
  id: string;
  campaignName: string;
  campaignSlug: string;
  internalNotes: string;
  description: string;
  tags: string[];
  priority: number;
  status: CampaignStatus;
  campaignType: CampaignType;

  // Media Assets
  imageUrl: string; // Desktop Image
  mobileImageUrl: string;
  tabletImageUrl: string;
  ultraWideImageUrl: string;
  heroProductImageUrl: string;
  backgroundImageUrl: string;

  // Videos
  videoUrl: string;
  videoUrlWebM: string;
  youtubeUrl: string;
  vimeoUrl: string;
  videoSettings: VideoSettings;

  // Content
  badge: string;
  title: string;
  subtitle: string;
  offerText: string;
  couponCode: string;
  termsConditions: string;

  // Pricing
  pricing: PricingSettings;

  // Buttons
  primaryButton: ButtonConfig;
  secondaryButton: ButtonConfig;
  buttonActionType: ButtonActionType;

  // Attachments
  attachedProductIds: string[];
  attachedCategoryIds: string[];
  attachedBrandId: string;

  // Scheduling
  startDate: string;
  endDate: string;
  timezone: string;
  autoPublish: boolean;
  autoExpire: boolean;

  // Rotation & Carousel Settings
  rotationMode: RotationMode;
  carouselAutoplay: boolean;
  carouselTransitionSpeed: number; // in ms
  carouselAnimationSpeed: number; // in ms
  carouselInfiniteLoop: boolean;
  carouselPauseOnHover: boolean;

  // Visual Effect Settings
  animationSetting: AnimationSetting;

  // Background Customizer Theme Settings
  backgroundTheme?: string;
  bgColor1?: string;
  bgColor2?: string;
  bgColor3?: string;
  gradientDirection?: string;
  glowIntensity?: string;
  backgroundBlur?: string;
  floatingLights?: boolean;
  ambientEffect?: boolean;

  // Targeting
  targetDevices: DeviceType[];
  targetUsers: UserTargetType[];
  targetGeo: GeoTarget;

  // A/B Testing Linkage
  enableABTest: boolean;
  abTestId?: string;

  // SEO
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;

  // Analytics Metrics
  views: number;
  clicks: number;
  ctr: number;
  revenue: number;
  conversions: number;

  // Meta
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ABTest {
  id: string;
  name: string;
  campaignAId: string;
  campaignBId: string;
  trafficSplitA: number; // e.g. 50 (for 50/50)
  trafficSplitB: number; // e.g. 50 (for 50/50)
  status: 'Draft' | 'Active' | 'Completed';
  
  // Accumulated performance for Variant A vs Variant B
  viewsA: number;
  clicksA: number;
  viewsB: number;
  clicksB: number;
  conversionsA: number;
  conversionsB: number;
  revenueA: number;
  revenueB: number;
  
  winner?: 'A' | 'B' | null;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  campaignData: Partial<HeroCampaign>;
}

export interface CampaignVersion {
  id: string;
  campaignId: string;
  versionNumber: number;
  changedBy: string;
  changeSummary: string;
  campaignData: string; // stringified HeroCampaign JSON
  createdAt: string;
}

export interface AssetItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'background' | 'icon';
  url: string;
  size: string; // e.g. "1.2 MB"
  folder: string; // e.g. "Summer Launch"
  createdAt: string;
}
