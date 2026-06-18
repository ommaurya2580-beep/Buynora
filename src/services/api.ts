import axios, { InternalAxiosRequestConfig } from 'axios';
import { environment } from '../config/environment';
import { products, categories, coupons, Announcement, TickerSettings, NavigationMenuItem } from './mockDb';
import { Review, QnA, Order, UserAccount, Seller } from '../types';
import { TokenManager } from '../features/auth/services/tokenManager';
import { RefreshTokenManager } from '../features/auth/services/refreshTokenManager';

const api = axios.create({
  baseURL: environment.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject JWT and Log Requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = TokenManager.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (environment.isDev) {
      console.log(`[HTTP Request] ${config.method?.toUpperCase()} ${config.url}`, config.params || config.data || '');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Log Responses and Handle Common Errors
api.interceptors.response.use(
  (response) => {
    if (environment.isDev) {
      console.log(`[HTTP Response] ${response.status} ${response.config.url}`, response.data);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (environment.isDev) {
      console.error(`[HTTP Error]`, error.response || error.message);
    }
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await RefreshTokenManager.refreshAccessToken();
        if (newAccessToken) {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return api(originalRequest);
        }
      } catch (refreshError) {
        TokenManager.clearAll();
        return Promise.reject(refreshError);
      }
      TokenManager.clearAll();
    }
    return Promise.reject(error);
  }
);

// Helper for Mock Responses
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockResponse = (status: number, data: any, config?: any) => {
  return {
    data,
    status,
    statusText: status >= 200 && status < 300 ? 'OK' : 'Bad Request',
    headers: {},
    config: config || {},
    request: {},
  };
};

// In-memory lists for checkout tracking since Redux will be client-only
const activeOrders: Order[] = [
  {
    id: "ORD-992384",
    items: [
      {
        product: products[2] || products[0],
        quantity: 1,
        selectedColor: "Silver"
      }
    ],
    subtotal: 348,
    discount: 0,
    tax: 27.84,
    shipping: 0,
    total: 375.84,
    shippingAddress: {
      id: "addr_1",
      name: "John Doe (Home)",
      line1: "123 Silicon Boulevard",
      city: "San Jose",
      state: "CA",
      zip: "95112",
      phone: "+1 (555) 019-2834",
      isDefault: true
    },
    paymentMethod: {
      id: "card_1",
      cardNumber: "•••• •••• •••• 4242",
      cardHolder: "JOHN DOE",
      expiry: "12/28",
      brand: "Visa"
    },
    date: "2026-06-04",
    expectedDelivery: "2026-06-05",
    status: "Delivered",
    trackingStep: 4,
    carrier: "FedEx Express",
    trackingNumber: "FDX-88291039-US"
  },
  {
    id: "ORD-991204",
    items: [
      {
        product: products[4] || products[1],
        quantity: 2,
        selectedColor: "Black",
        selectedSize: "L"
      }
    ],
    subtotal: 170,
    discount: 17,
    tax: 12.24,
    shipping: 9.99,
    total: 175.23,
    shippingAddress: {
      id: "addr_1",
      name: "John Doe (Home)",
      line1: "123 Silicon Boulevard",
      city: "San Jose",
      state: "CA",
      zip: "95112",
      phone: "+1 (555) 019-2834",
      isDefault: true
    },
    paymentMethod: {
      id: "card_2",
      cardNumber: "•••• •••• •••• 5555",
      cardHolder: "JOHN DOE",
      expiry: "08/30",
      brand: "Mastercard"
    },
    date: "2026-06-05",
    expectedDelivery: "2026-06-09",
    status: "Shipped",
    trackingStep: 2,
    carrier: "UPS Ground",
    trackingNumber: "UPS-1Z99A99AA999999999"
  }
];

const mockSellersList: Seller[] = [
  { id: "s1", name: "Alpha Tech Ltd", email: "sales@alphatech.com", status: "Active", sales: 120, joiningDate: "2025-01-15" },
  { id: "s2", name: "Nike Official Store", email: "retail@nike.com", status: "Active", sales: 340, joiningDate: "2025-03-10" },
  { id: "s3", name: "GadgetWorld", email: "support@gadgetworld.com", status: "Pending", sales: 0, joiningDate: "2026-06-01" },
  { id: "s4", name: "Luxe Apparel", email: "luxe@apparel.com", status: "Suspended", sales: 15, joiningDate: "2025-09-20" }
];

const mockUsersList: UserAccount[] = [
  { id: "u1", name: "John Doe", email: "john.doe@buynora.com", role: "CUSTOMER", status: "Active", joiningDate: "2025-05-15" },
  { id: "u2", name: "Jane Smith", email: "jane.smith@gmail.com", role: "CUSTOMER", status: "Active", joiningDate: "2025-11-02" },
  { id: "u3", name: "Alice Admin", email: "admin@buynora.com", role: "ADMIN", status: "Active", joiningDate: "2025-01-01" },
  { id: "u4", name: "Bob Seller", email: "seller@buynora.com", role: "SELLER", status: "Active", joiningDate: "2025-02-12" },
  { id: "u5", name: "Spammer Steve", email: "steve@spam.com", role: "CUSTOMER", status: "Banned", joiningDate: "2026-05-28" }
];

// ==========================================
// HERO CAMPAIGN MANAGER MOCK DATABASE HELPERS
// ==========================================
const getStoredCampaigns = (): any[] => {
  const stored = localStorage.getItem('buynora_hero_campaigns');
  if (stored) return JSON.parse(stored);
  
  const defaults = [
    {
      id: "camp_p3",
      campaignName: "Sony Noise Cancellation Launch",
      campaignSlug: "sony-wh-1000xm5-launch",
      internalNotes: "Launch campaign for Sony Headphones, featuring premium ANC technology.",
      description: "Industry-leading noise canceling over-ear headphones with premium sound quality.",
      tags: ["Electronics", "Sony", "Audio"],
      priority: 1,
      status: "Published",
      campaignType: "New Launch",
      backgroundTheme: "Midnight Blue",
      bgColor1: "#0F172A",
      bgColor2: "#1E3A8A",
      bgColor3: "#172554",
      gradientDirection: "to-br",
      glowIntensity: "medium",
      backgroundBlur: "medium",
      floatingLights: true,
      ambientEffect: true,
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
      mobileImageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=500",
      tabletImageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=600",
      ultraWideImageUrl: "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&q=80&w=1200",
      heroProductImageUrl: "",
      backgroundImageUrl: "",
      videoUrl: "",
      videoUrlWebM: "",
      youtubeUrl: "",
      vimeoUrl: "",
      videoSettings: {
        videoAutoplay: true,
        videoLoop: true,
        videoMute: true,
        videoPauseOnHover: true,
        videoShowControls: false,
        videoShowThumbnail: true,
        videoPreload: true
      },
      badge: "🚀 NEW LAUNCH",
      title: "Sony WH-1000XM5",
      subtitle: "Hear Every Detail.\nBlock Every Distraction.",
      offerText: "Introductory Offer: Flat 37% Off",
      couponCode: "SAVE20",
      termsConditions: "Valid on online transactions. Limited stock.",
      pricing: {
        enablePricing: true,
        price: 24999,
        oldPrice: 39999,
        discount: 37,
        savingsAmount: 15000,
        emiOption: "No Cost EMI starting from ₹2,083/month",
        exchangeOffer: "Exchange up to ₹3,000",
        bankOffer: "10% Instant Discount on HDFC Cards",
        couponOffer: "Use code SAVE20 for extra ₹500 off",
        cashback: "₹1,000 Amazon Pay Cashback"
      },
      primaryButton: { text: "Explore Now", icon: "ArrowRight", color: "bg-slate-900 dark:bg-white text-white dark:text-slate-950", link: "/product/p3" },
      secondaryButton: { text: "View Details", icon: "Eye", color: "border border-slate-200/40 text-slate-750 dark:text-slate-300", link: "/product/p3" },
      buttonActionType: "Open Product",
      attachedProductIds: ["p3"],
      attachedCategoryIds: ["c_electronics"],
      attachedBrandId: "b_sony",
      startDate: "2026-06-01",
      endDate: "2026-08-31",
      timezone: "GMT+5:30",
      autoPublish: true,
      autoExpire: true,
      rotationMode: "Auto Carousel",
      carouselAutoplay: true,
      carouselTransitionSpeed: 6000,
      carouselAnimationSpeed: 400,
      carouselInfiniteLoop: true,
      carouselPauseOnHover: true,
      animationSetting: "Fade",
      targetDevices: ["Desktop", "Tablet", "Mobile"],
      targetUsers: ["Guest", "Logged In", "Customer", "Seller", "Admin", "Premium Member", "New User", "Returning User"],
      targetGeo: { countries: ["India", "USA"], states: [], cities: [] },
      enableABTest: false,
      metaTitle: "Sony WH-1000XM5 Breathtaking Sound",
      metaDescription: "Buy Sony WH-1000XM5 headphones with industry leading ANC.",
      metaKeywords: "sony, headphones, noise cancellation, anc",
      views: 3120,
      clicks: 450,
      ctr: 14.42,
      revenue: 11249550,
      conversions: 450,
      createdBy: "admin@buynora.com",
      createdAt: "2026-06-01T10:00:00Z",
      updatedAt: "2026-06-01T10:00:00Z"
    },
    {
      id: "camp_p1",
      campaignName: "iPhone 15 Pro Titanium",
      campaignSlug: "iphone-15-pro-titanium",
      internalNotes: "Main Apple showcase for iPhone 15 Pro",
      description: "Experience the next level of mobile technology with the iPhone 15 Pro.",
      tags: ["Electronics", "Apple", "Smartphones"],
      priority: 2,
      status: "Published",
      campaignType: "Brand Promotion",
      backgroundTheme: "Apple Silver",
      bgColor1: "#E2E8F0",
      bgColor2: "#F8FAFC",
      bgColor3: "#CBD5E1",
      gradientDirection: "to-br",
      glowIntensity: "low",
      backgroundBlur: "low",
      floatingLights: false,
      ambientEffect: true,
      imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800",
      mobileImageUrl: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=500",
      tabletImageUrl: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&q=80&w=600",
      ultraWideImageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=1200",
      heroProductImageUrl: "",
      backgroundImageUrl: "",
      videoUrl: "",
      videoUrlWebM: "",
      youtubeUrl: "",
      vimeoUrl: "",
      videoSettings: {
        videoAutoplay: true,
        videoLoop: true,
        videoMute: true,
        videoPauseOnHover: true,
        videoShowControls: false,
        videoShowThumbnail: true,
        videoPreload: true
      },
      badge: "🚀 NEW LAUNCH",
      title: "iPhone 15 Pro",
      subtitle: "Titanium design. A17 Pro chip.\nPro camera system.",
      offerText: "Get up to ₹6,000 Instant Savings",
      couponCode: "",
      termsConditions: "Applicable on bank credit cards.",
      pricing: {
        enablePricing: true,
        price: 79999,
        oldPrice: 89999,
        discount: 11,
        savingsAmount: 10000,
        emiOption: "No Cost EMI available",
        exchangeOffer: "Exchange benefits up to ₹15,000",
        bankOffer: "₹5,000 Instant Discount on ICICI Cards",
        couponOffer: "",
        cashback: ""
      },
      primaryButton: { text: "Explore Now", icon: "ArrowRight", color: "bg-slate-900 dark:bg-white text-white dark:text-slate-950", link: "/product/p1" },
      secondaryButton: { text: "View Details", icon: "Eye", color: "border border-slate-200/40 text-slate-750 dark:text-slate-300", link: "/product/p1" },
      buttonActionType: "Open Product",
      attachedProductIds: ["p1"],
      attachedCategoryIds: ["c_electronics"],
      attachedBrandId: "b_apple",
      startDate: "2026-06-01",
      endDate: "2026-08-31",
      timezone: "GMT+5:30",
      autoPublish: true,
      autoExpire: true,
      rotationMode: "Auto Carousel",
      carouselAutoplay: true,
      carouselTransitionSpeed: 6000,
      carouselAnimationSpeed: 400,
      carouselInfiniteLoop: true,
      carouselPauseOnHover: true,
      animationSetting: "Slide",
      targetDevices: ["Desktop", "Tablet", "Mobile"],
      targetUsers: ["Guest", "Logged In", "Customer", "Seller", "Admin", "Premium Member", "New User", "Returning User"],
      targetGeo: { countries: [], states: [], cities: [] },
      enableABTest: false,
      metaTitle: "Buy iPhone 15 Pro Titanium",
      metaDescription: "Get the iPhone 15 Pro with aerospace grade titanium at Buynora.",
      metaKeywords: "iphone, apple, titanium",
      views: 5200,
      clicks: 840,
      ctr: 16.15,
      revenue: 67199160,
      conversions: 840,
      createdBy: "admin@buynora.com",
      createdAt: "2026-06-01T10:00:00Z",
      updatedAt: "2026-06-01T10:00:00Z"
    },
    {
      id: "camp_p4",
      campaignName: "MacBook Pro M3 Sale",
      campaignSlug: "macbook-pro-m3-sale",
      internalNotes: "High performance laptops campaign",
      description: "MacBook Pro 14-inch with M3 chip, delivering speed and efficiency.",
      tags: ["Electronics", "Apple", "Laptops"],
      priority: 3,
      status: "Published",
      campaignType: "Mega Sale",
      imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
      mobileImageUrl: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=500",
      tabletImageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600",
      ultraWideImageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1200",
      heroProductImageUrl: "",
      backgroundImageUrl: "",
      videoUrl: "",
      videoUrlWebM: "",
      youtubeUrl: "",
      vimeoUrl: "",
      videoSettings: {
        videoAutoplay: true,
        videoLoop: true,
        videoMute: true,
        videoPauseOnHover: true,
        videoShowControls: false,
        videoShowThumbnail: true,
        videoPreload: true
      },
      badge: "🚀 NEW LAUNCH",
      title: "MacBook Pro 14\" M3",
      subtitle: "Mind-blowing performance.\nStunning Liquid Retina XDR display.",
      offerText: "Save up to ₹25,000 instantly",
      couponCode: "BIGNORA30",
      termsConditions: "T&C apply. Limited period offer.",
      pricing: {
        enablePricing: true,
        price: 144900,
        oldPrice: 169900,
        discount: 14,
        savingsAmount: 25000,
        emiOption: "No Cost EMI starts at ₹12,075/month",
        exchangeOffer: "Get up to ₹20,000 off on exchange",
        bankOffer: "₹8,000 cashback on SBI cards",
        couponOffer: "Save extra ₹2,000 with coupon BIGNORA30",
        cashback: "₹5,000 store credits"
      },
      primaryButton: { text: "Explore Now", icon: "ArrowRight", color: "bg-slate-900 dark:bg-white text-white dark:text-slate-950", link: "/product/p4" },
      secondaryButton: { text: "View Details", icon: "Eye", color: "border border-slate-200/40 text-slate-750 dark:text-slate-300", link: "/product/p4" },
      buttonActionType: "Open Product",
      attachedProductIds: ["p4"],
      attachedCategoryIds: ["c_electronics"],
      attachedBrandId: "b_apple",
      startDate: "2026-06-01",
      endDate: "2026-08-31",
      timezone: "GMT+5:30",
      autoPublish: true,
      autoExpire: true,
      rotationMode: "Auto Carousel",
      carouselAutoplay: true,
      carouselTransitionSpeed: 6000,
      carouselAnimationSpeed: 400,
      carouselInfiniteLoop: true,
      carouselPauseOnHover: true,
      animationSetting: "Zoom",
      targetDevices: ["Desktop", "Tablet"],
      targetUsers: ["Logged In", "Customer", "Premium Member"],
      targetGeo: { countries: ["India"], states: [], cities: [] },
      enableABTest: false,
      metaTitle: "MacBook Pro 14 M3 Special Deal",
      metaDescription: "Purchase Apple MacBook Pro 14 inch M3 with heavy discounts.",
      metaKeywords: "macbook, apple, m3 laptop",
      views: 1800,
      clicks: 220,
      ctr: 12.22,
      revenue: 31878000,
      conversions: 220,
      createdBy: "admin@buynora.com",
      createdAt: "2026-06-01T10:00:00Z",
      updatedAt: "2026-06-01T10:00:00Z"
    },
    {
      id: "camp_p2",
      campaignName: "Nike Air Max Comfort",
      campaignSlug: "nike-air-max-comfort",
      internalNotes: "Sneakers fashion promotional banner",
      description: "Step into the future. Unmatched all-day comfort.",
      tags: ["Footwear", "Nike", "Sneakers"],
      priority: 4,
      status: "Published",
      campaignType: "Flash Sale",
      backgroundTheme: "Rose Gold",
      bgColor1: "#FFF1F2",
      bgColor2: "#FDA4AF",
      bgColor3: "#F43F5E",
      gradientDirection: "to-br",
      glowIntensity: "medium",
      backgroundBlur: "low",
      floatingLights: true,
      ambientEffect: true,
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
      mobileImageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=500",
      tabletImageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=600",
      ultraWideImageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1200",
      heroProductImageUrl: "",
      backgroundImageUrl: "",
      videoUrl: "",
      videoUrlWebM: "",
      youtubeUrl: "",
      vimeoUrl: "",
      videoSettings: {
        videoAutoplay: true,
        videoLoop: true,
        videoMute: true,
        videoPauseOnHover: true,
        videoShowControls: false,
        videoShowThumbnail: true,
        videoPreload: true
      },
      badge: "🚀 NEW LAUNCH",
      title: "Air Max 270 SE",
      subtitle: "Step into the future.\nUnmatched all-day comfort.",
      offerText: "Flat 16% Off for limited time",
      couponCode: "WELCOME10",
      termsConditions: "No minimum purchase required.",
      pricing: {
        enablePricing: true,
        price: 12499,
        oldPrice: 14999,
        discount: 16,
        savingsAmount: 2500,
        emiOption: "EMIs starting from ₹600/month",
        exchangeOffer: "",
        bankOffer: "Additional 5% cashback on Axis cards",
        couponOffer: "Use WELCOME10 for extra 10% off",
        cashback: "₹500 Nike Gift Card"
      },
      primaryButton: { text: "Explore Now", icon: "ArrowRight", color: "bg-slate-900 dark:bg-white text-white dark:text-slate-950", link: "/product/p2" },
      secondaryButton: { text: "View Details", icon: "Eye", color: "border border-slate-200/40 text-slate-750 dark:text-slate-300", link: "/product/p2" },
      buttonActionType: "Open Product",
      attachedProductIds: ["p2"],
      attachedCategoryIds: ["c_footwear"],
      attachedBrandId: "b_nike",
      startDate: "2026-06-01",
      endDate: "2026-08-31",
      timezone: "GMT+5:30",
      autoPublish: true,
      autoExpire: true,
      rotationMode: "Auto Carousel",
      carouselAutoplay: true,
      carouselTransitionSpeed: 6000,
      carouselAnimationSpeed: 400,
      carouselInfiniteLoop: true,
      carouselPauseOnHover: true,
      animationSetting: "3D Transform",
      targetDevices: ["Desktop", "Tablet", "Mobile"],
      targetUsers: ["Guest", "Logged In", "Customer", "Seller", "Admin", "Premium Member", "New User", "Returning User"],
      targetGeo: { countries: [], states: [], cities: [] },
      enableABTest: false,
      metaTitle: "Nike Air Max 270 SE Sports Shoe Shop",
      metaDescription: "Purchase Nike Air Max 270 SE running shoes with great cushion support.",
      metaKeywords: "nike, shoes, running, sneakers",
      views: 4050,
      clicks: 580,
      ctr: 14.32,
      revenue: 7249420,
      conversions: 580,
      createdBy: "admin@buynora.com",
      createdAt: "2026-06-01T10:00:00Z",
      updatedAt: "2026-06-01T10:00:00Z"
    },
    {
      id: "camp_p5",
      campaignName: "Nike Sportswear Hoodie Launch",
      campaignSlug: "nike-sportswear-hoodie-launch",
      internalNotes: "Premium apparel collection",
      description: "Cozy premium fleece. Perfect everyday comfort.",
      tags: ["Apparel", "Nike", "Hoodies"],
      priority: 5,
      status: "Published",
      campaignType: "Collection Launch",
      backgroundTheme: "Soft Purple",
      bgColor1: "#F5F3FF",
      bgColor2: "#EDE9FE",
      bgColor3: "#DDD6FE",
      gradientDirection: "to-br",
      glowIntensity: "medium",
      backgroundBlur: "low",
      floatingLights: true,
      ambientEffect: true,
      imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800",
      mobileImageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=500",
      tabletImageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600",
      ultraWideImageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1200",
      heroProductImageUrl: "",
      backgroundImageUrl: "",
      videoUrl: "",
      videoUrlWebM: "",
      youtubeUrl: "",
      vimeoUrl: "",
      videoSettings: {
        videoAutoplay: true,
        videoLoop: true,
        videoMute: true,
        videoPauseOnHover: true,
        videoShowControls: false,
        videoShowThumbnail: true,
        videoPreload: true
      },
      badge: "🚀 NEW LAUNCH",
      title: "Premium Sportswear Hoodie",
      subtitle: "Cozy premium fleece.\nPerfect everyday comfort.",
      offerText: "Special 30% Off Launch Discount",
      couponCode: "SAVE20",
      termsConditions: "Valid on all hoodie sizes.",
      pricing: {
        enablePricing: true,
        price: 3499,
        oldPrice: 4999,
        discount: 30,
        savingsAmount: 1500,
        emiOption: "",
        exchangeOffer: "",
        bankOffer: "₹200 cashback on PayTM wallet",
        couponOffer: "Apply WELCOME10 for extra 10% discount",
        cashback: ""
      },
      primaryButton: { text: "Explore Now", icon: "ArrowRight", color: "bg-slate-900 dark:bg-white text-white dark:text-slate-950", link: "/product/p5" },
      secondaryButton: { text: "View Details", icon: "Eye", color: "border border-slate-200/40 text-slate-750 dark:text-slate-300", link: "/product/p5" },
      buttonActionType: "Open Product",
      attachedProductIds: ["p5"],
      attachedCategoryIds: ["c_apparel"],
      attachedBrandId: "b_nike",
      startDate: "2026-06-01",
      endDate: "2026-08-31",
      timezone: "GMT+5:30",
      autoPublish: true,
      autoExpire: true,
      rotationMode: "Auto Carousel",
      carouselAutoplay: true,
      carouselTransitionSpeed: 6000,
      carouselAnimationSpeed: 400,
      carouselInfiniteLoop: true,
      carouselPauseOnHover: true,
      animationSetting: "Fade",
      targetDevices: ["Desktop", "Tablet", "Mobile"],
      targetUsers: ["Guest", "Logged In", "Customer", "Seller", "Admin", "Premium Member", "New User", "Returning User"],
      targetGeo: { countries: [], states: [], cities: [] },
      enableABTest: false,
      metaTitle: "Buy Premium Sportswear Hoodie online",
      metaDescription: "Original Nike pullovers with high quality fleece.",
      metaKeywords: "hoodie, nike, clothing",
      views: 2900,
      clicks: 390,
      ctr: 13.45,
      revenue: 1364610,
      conversions: 390,
      createdBy: "admin@buynora.com",
      createdAt: "2026-06-01T10:00:00Z",
      updatedAt: "2026-06-01T10:00:00Z"
    }
  ];
  localStorage.setItem('buynora_hero_campaigns', JSON.stringify(defaults));
  return defaults;
};

const getStoredABTests = (): any[] => {
  const stored = localStorage.getItem('buynora_ab_tests');
  if (stored) return JSON.parse(stored);
  const defaults = [
    {
      id: "ab_1",
      name: "Sony vs iPhone Promo test",
      campaignAId: "camp_p3",
      campaignBId: "camp_p1",
      trafficSplitA: 50,
      trafficSplitB: 50,
      status: "Active",
      viewsA: 1560,
      clicksA: 225,
      viewsB: 2600,
      clicksB: 420,
      conversionsA: 225,
      conversionsB: 420,
      revenueA: 5624775,
      revenueB: 33599580,
      winner: null,
      createdAt: "2026-06-02T10:00:00Z",
      updatedAt: "2026-06-05T12:00:00Z"
    }
  ];
  localStorage.setItem('buynora_ab_tests', JSON.stringify(defaults));
  return defaults;
};

const getStoredAssets = (): any[] => {
  const stored = localStorage.getItem('buynora_campaign_assets');
  if (stored) return JSON.parse(stored);
  const defaults = [
    { id: "ast_1", name: "sony_headphones_main.png", type: "image", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800", size: "840 KB", folder: "Sony Launch", createdAt: "2026-06-01" },
    { id: "ast_2", name: "iphone_podium_gray.jpg", type: "image", url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800", size: "1.1 MB", folder: "Apple Fall", createdAt: "2026-06-01" },
    { id: "ast_3", name: "nike_red_shoe_banner.png", type: "image", url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800", size: "620 KB", folder: "Nike Run", createdAt: "2026-06-01" },
    { id: "ast_4", name: "macbook_lifestyle.jpg", type: "image", url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800", size: "1.4 MB", folder: "Apple Laptop", createdAt: "2026-06-01" },
    { id: "ast_5", name: "hoodie_studio_shot.jpg", type: "image", url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800", size: "910 KB", folder: "Nike Clothing", createdAt: "2026-06-01" },
    { id: "ast_6", name: "cosmic_stars_background.jpg", type: "background", url: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&q=80&w=800", size: "1.8 MB", folder: "Backgrounds", createdAt: "2026-06-02" },
    { id: "ast_7", name: "gradient_indigo_sunset.jpg", type: "background", url: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=800", size: "450 KB", folder: "Backgrounds", createdAt: "2026-06-02" }
  ];
  localStorage.setItem('buynora_campaign_assets', JSON.stringify(defaults));
  return defaults;
};

const getStoredTemplates = (): any[] => {
  return [
    {
      id: "tpl_apple",
      name: "Apple Style Hero",
      description: "Sleek typography, minimal dark-mode ambient glows, highlighting primary product image floating on 3D podium.",
      thumbnail: "🍎",
      category: "Tech",
      campaignData: {
        badge: "🚀 PREMIUM PRODUCT",
        title: "Apple Showcase",
        subtitle: "Design that pushes boundaries.\nFeatures that change everything.",
        imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800",
        campaignType: "Brand Promotion",
        animationSetting: "Fade",
        rotationMode: "Single Hero"
      }
    },
    {
      id: "tpl_amazon",
      name: "Amazon Sale Hero",
      description: "Bold badges, heavy coupon highlights, red-to-orange warm energetic gradients, price strike-throughs and EMI options.",
      thumbnail: "📦",
      category: "Sales",
      campaignData: {
        badge: "⚡ FLASH SALE",
        title: "BIG DEAL SPECTACULAR",
        subtitle: "Unbelievable price drops for 24 hours only.",
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
        campaignType: "Flash Sale",
        animationSetting: "Slide",
        pricing: {
          enablePricing: true,
          price: 999,
          oldPrice: 1999,
          discount: 50,
          savingsAmount: 1000,
          emiOption: "No Cost EMI available",
          exchangeOffer: "",
          bankOffer: "10% instant discount on major cards",
          couponOffer: "",
          cashback: ""
        }
      }
    },
    {
      id: "tpl_flipkart",
      name: "Flipkart Sale Hero",
      description: "Festive banners with heavy focus on discounts, savings tags, and yellow-blue bright consumer color palettes.",
      thumbnail: "🛍️",
      category: "Sales",
      campaignData: {
        badge: "🎉 FESTIVAL BONANZA",
        title: "Dhamaka Offers",
        subtitle: "Bring home happiness with our lowest prices ever.",
        campaignType: "Festival Sale",
        animationSetting: "Zoom"
      }
    },
    {
      id: "tpl_video",
      name: "Video Campaign Hero",
      description: "Brings cinematic experiences right to your home page banner, supporting custom files or streaming URLs.",
      thumbnail: "🎬",
      category: "Media",
      campaignData: {
        badge: "🎥 VIDEO EXCLUSIVE",
        title: "Cinematic Product Tour",
        subtitle: "Watch the latest launch video details.",
        campaignType: "Video Campaign",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
      }
    }
  ];
};

const getStoredVersions = (campaignId: string): any[] => {
  const key = `buynora_versions_${campaignId}`;
  const stored = localStorage.getItem(key);
  if (stored) return JSON.parse(stored);
  
  const defaults = [
    {
      id: `ver_${campaignId}_1`,
      campaignId,
      versionNumber: 1,
      changedBy: "admin@buynora.com",
      changeSummary: "Initial campaign creation",
      campaignData: JSON.stringify({ id: campaignId }),
      createdAt: "2026-06-01T10:00:00Z"
    }
  ];
  localStorage.setItem(key, JSON.stringify(defaults));
  return defaults;
};

const getStoredAnnouncements = (): Announcement[] => {
  const stored = localStorage.getItem('buynora_announcements');
  if (stored) return JSON.parse(stored);
  const defaults: Announcement[] = [
    {
      id: "ann_1",
      title: "Free Shipping",
      messageText: "Free Shipping above ₹499",
      icon: "Truck",
      textColor: "#E2E8F0",
      backgroundColor: "#1F2937",
      iconColor: "#34D399",
      displayOrder: 1,
      openInNewTab: false,
      status: "Active"
    },
    {
      id: "ann_2",
      title: "Coupon Code",
      messageText: "Use code SAVE20 for extra 20% off",
      icon: "Coupon",
      textColor: "#E2E8F0",
      backgroundColor: "#1F2937",
      iconColor: "#FBBF24",
      displayOrder: 2,
      openInNewTab: false,
      status: "Active"
    },
    {
      id: "ann_3",
      title: "Easy Returns",
      messageText: "Easy 30-day Returns",
      icon: "Gift",
      textColor: "#E2E8F0",
      backgroundColor: "#1F2937",
      iconColor: "#38BDF8",
      displayOrder: 3,
      openInNewTab: false,
      status: "Active"
    },
    {
      id: "ann_4",
      title: "24x7 Customer Support",
      messageText: "24×7 Customer Support",
      icon: "Support",
      textColor: "#E2E8F0",
      backgroundColor: "#1F2937",
      iconColor: "#818CF8",
      displayOrder: 4,
      openInNewTab: false,
      status: "Active"
    }
  ];
  localStorage.setItem('buynora_announcements', JSON.stringify(defaults));
  return defaults;
};

const getStoredTickerSettings = (): TickerSettings => {
  const stored = localStorage.getItem('buynora_ticker_settings');
  if (stored) return JSON.parse(stored);
  const defaults: TickerSettings = {
    scrollSpeed: "Normal",
    customSpeedMs: 25000,
    direction: "R2L",
    pauseOnHover: true,
    autoplay: true,
    infiniteLoop: true,
    showAnnouncementBar: true
  };
  localStorage.setItem('buynora_ticker_settings', JSON.stringify(defaults));
  return defaults;
};

const getStoredNavigationItems = (): NavigationMenuItem[] => {
  const stored = localStorage.getItem('buynora_navigation_items');
  if (stored) return JSON.parse(stored);
  const defaults: NavigationMenuItem[] = [
    {
      id: "nav_1",
      name: "MEN",
      slug: "/products?category=Men",
      menuType: "CustomPage",
      openInNewTab: false,
      showInDesktop: true,
      showInMobile: true,
      showInSidebar: true,
      highlight: "None",
      displayOrder: 1,
      status: "Active"
    },
    {
      id: "nav_2",
      name: "WOMEN",
      slug: "/products?category=Women",
      menuType: "CustomPage",
      openInNewTab: false,
      showInDesktop: true,
      showInMobile: true,
      showInSidebar: true,
      highlight: "None",
      displayOrder: 2,
      status: "Active"
    },
    {
      id: "nav_3",
      name: "ELECTRONICS",
      slug: "/products?category=Electronics",
      menuType: "Category",
      categoryConnectionId: "c_electronics",
      openInNewTab: false,
      showInDesktop: true,
      showInMobile: true,
      showInSidebar: true,
      highlight: "None",
      displayOrder: 3,
      status: "Active"
    },
    {
      id: "nav_4",
      name: "FASHION",
      slug: "/products?category=Apparel",
      menuType: "Category",
      categoryConnectionId: "c_apparel",
      openInNewTab: false,
      showInDesktop: true,
      showInMobile: true,
      showInSidebar: true,
      highlight: "None",
      displayOrder: 4,
      status: "Active"
    },
    {
      id: "nav_5",
      name: "FOOTWEAR",
      slug: "/products?category=Footwear",
      menuType: "Category",
      categoryConnectionId: "c_footwear",
      openInNewTab: false,
      showInDesktop: true,
      showInMobile: true,
      showInSidebar: true,
      highlight: "None",
      displayOrder: 5,
      status: "Active"
    },
    {
      id: "nav_6",
      name: "ACCESSORIES",
      slug: "/products?category=Accessories",
      menuType: "Category",
      categoryConnectionId: "c_accessories",
      openInNewTab: false,
      showInDesktop: true,
      showInMobile: true,
      showInSidebar: true,
      highlight: "None",
      displayOrder: 6,
      status: "Active"
    }
  ];
  localStorage.setItem('buynora_navigation_items', JSON.stringify(defaults));
  return defaults;
};

// Axios Mock Adapter Intercepting Requests
api.defaults.adapter = async (config) => {
  const url = config.url || '';
  const method = config.method?.toLowerCase() || 'get';
  const data = config.data ? JSON.parse(config.data) : null;
  const params = config.params || {};

  await new Promise((resolve) => setTimeout(resolve, 300));

  // ==========================================
  // HEADER ANNOUNCEMENTS MOCK ENDPOINTS
  // ==========================================
  if (method === 'get' && url === '/admin/announcements') {
    return mockResponse(200, {
      announcements: getStoredAnnouncements(),
      tickerSettings: getStoredTickerSettings()
    });
  }

  if (method === 'put' && url === '/admin/announcements/settings') {
    localStorage.setItem('buynora_ticker_settings', JSON.stringify(data));
    return mockResponse(200, data);
  }

  if (method === 'post' && url === '/admin/announcements') {
    const list = getStoredAnnouncements();
    const newAnn = {
      ...data,
      id: `ann_${Date.now()}`
    };
    list.push(newAnn);
    localStorage.setItem('buynora_announcements', JSON.stringify(list));
    return mockResponse(200, newAnn);
  }

  const singleAnnMatch = url.match(/^\/admin\/announcements\/([^/]+)$/);
  if (method === 'put' && singleAnnMatch) {
    const annId = singleAnnMatch[1];
    const list = getStoredAnnouncements();
    const idx = list.findIndex(ann => ann.id === annId);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      localStorage.setItem('buynora_announcements', JSON.stringify(list));
      return mockResponse(200, list[idx]);
    }
    return mockResponse(404, { message: 'Announcement not found' });
  }

  if (method === 'delete' && singleAnnMatch) {
    const annId = singleAnnMatch[1];
    const list = getStoredAnnouncements();
    const filtered = list.filter(ann => ann.id !== annId);
    localStorage.setItem('buynora_announcements', JSON.stringify(filtered));
    return mockResponse(200, { success: true, id: annId });
  }

  const duplicateAnnMatch = url.match(/^\/admin\/announcements\/([^/]+)\/duplicate$/);
  if (method === 'post' && duplicateAnnMatch) {
    const annId = duplicateAnnMatch[1];
    const list = getStoredAnnouncements();
    const orig = list.find(ann => ann.id === annId);
    if (!orig) return mockResponse(404, { message: 'Announcement not found' });
    const duplicated = {
      ...orig,
      id: `ann_${Date.now()}`,
      title: `${orig.title} (Copy)`,
      displayOrder: list.length + 1
    };
    list.push(duplicated);
    localStorage.setItem('buynora_announcements', JSON.stringify(list));
    return mockResponse(200, duplicated);
  }

  // ==========================================
  // NAVIGATION MENU MANAGER MOCK ENDPOINTS
  // ==========================================
  if (method === 'get' && url === '/admin/navigation-items') {
    const items = getStoredNavigationItems();
    return mockResponse(200, items.sort((a, b) => a.displayOrder - b.displayOrder));
  }

  if (method === 'post' && url === '/admin/navigation-items') {
    const list = getStoredNavigationItems();
    const newItem = {
      ...data,
      id: `nav_${Date.now()}`
    };
    list.push(newItem);
    localStorage.setItem('buynora_navigation_items', JSON.stringify(list));
    return mockResponse(200, newItem);
  }

  if (method === 'put' && url === '/admin/navigation-items/reorder') {
    const list = getStoredNavigationItems();
    const reorders: { id: string; displayOrder: number }[] = data.items;
    reorders.forEach(item => {
      const found = list.find(nav => nav.id === item.id);
      if (found) {
        found.displayOrder = item.displayOrder;
      }
    });
    localStorage.setItem('buynora_navigation_items', JSON.stringify(list));
    return mockResponse(200, list.sort((a, b) => a.displayOrder - b.displayOrder));
  }

  const singleNavMatch = url.match(/^\/admin\/navigation-items\/([^/]+)$/);
  if (method === 'put' && singleNavMatch) {
    const navId = singleNavMatch[1];
    const list = getStoredNavigationItems();
    const idx = list.findIndex(nav => nav.id === navId);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      localStorage.setItem('buynora_navigation_items', JSON.stringify(list));
      return mockResponse(200, list[idx]);
    }
    return mockResponse(404, { message: 'Navigation item not found' });
  }

  if (method === 'delete' && singleNavMatch) {
    const navId = singleNavMatch[1];
    const list = getStoredNavigationItems();
    const filtered = list.filter(nav => nav.id !== navId);
    localStorage.setItem('buynora_navigation_items', JSON.stringify(filtered));
    return mockResponse(200, { success: true, id: navId });
  }

  // ==========================================
  // HERO CAMPAIGN MANAGER MOCK ENDPOINTS
  // ==========================================
  if (method === 'get' && url === '/admin/hero-campaigns') {
    return mockResponse(200, getStoredCampaigns());
  }

  if (method === 'get' && url === '/admin/hero-campaigns/analytics') {
    const camps = getStoredCampaigns();
    const totalViews = camps.reduce((acc, c) => acc + (c.views || 0), 0);
    const totalClicks = camps.reduce((acc, c) => acc + (c.clicks || 0), 0);
    const totalRevenue = camps.reduce((acc, c) => acc + (c.revenue || 0), 0);
    const totalConversions = camps.reduce((acc, c) => acc + (c.conversions || 0), 0);
    const ctr = totalViews > 0 ? parseFloat(((totalClicks / totalViews) * 100).toFixed(2)) : 0;
    
    const viewsTrend = [
      { name: 'Mon', views: 2400 },
      { name: 'Tue', views: 1398 },
      { name: 'Wed', views: 9800 },
      { name: 'Thu', views: 3908 },
      { name: 'Fri', views: 4800 },
      { name: 'Sat', views: 3800 },
      { name: 'Sun', views: 4300 }
    ];
    const clicksTrend = [
      { name: 'Mon', clicks: 240 },
      { name: 'Tue', clicks: 139 },
      { name: 'Wed', clicks: 980 },
      { name: 'Thu', clicks: 390 },
      { name: 'Fri', clicks: 480 },
      { name: 'Sat', clicks: 380 },
      { name: 'Sun', clicks: 430 }
    ];
    const ctrTrend = [
      { name: 'Mon', ctr: 10.0 },
      { name: 'Tue', ctr: 9.94 },
      { name: 'Wed', ctr: 10.0 },
      { name: 'Thu', ctr: 9.97 },
      { name: 'Fri', ctr: 10.0 },
      { name: 'Sat', ctr: 10.0 },
      { name: 'Sun', ctr: 10.0 }
    ];
    const revenueTrend = [
      { name: 'Mon', revenue: 24000 },
      { name: 'Tue', revenue: 13980 },
      { name: 'Wed', revenue: 98000 },
      { name: 'Thu', revenue: 39080 },
      { name: 'Fri', revenue: 48000 },
      { name: 'Sat', revenue: 38000 },
      { name: 'Sun', revenue: 43000 }
    ];

    const deviceBreakdown = [
      { name: 'Desktop', value: 55 },
      { name: 'Mobile', value: 35 },
      { name: 'Tablet', value: 10 }
    ];

    return mockResponse(200, {
      totalCampaigns: camps.length,
      activeCampaigns: camps.filter(c => c.status === 'Published').length,
      scheduledCampaigns: camps.filter(c => c.status === 'Scheduled').length,
      expiredCampaigns: camps.filter(c => c.status === 'Expired').length,
      totalViews,
      totalClicks,
      ctr,
      totalRevenue,
      totalConversions,
      viewsTrend,
      clicksTrend,
      ctrTrend,
      revenueTrend,
      deviceBreakdown,
      campaignPerformance: camps.map(c => ({
        id: c.id,
        name: c.campaignName,
        views: c.views || 0,
        clicks: c.clicks || 0,
        ctr: c.ctr || 0,
        revenue: c.revenue || 0
      }))
    });
  }

  if (method === 'get' && url === '/admin/hero-campaigns/ab-tests') {
    return mockResponse(200, getStoredABTests());
  }

  if (method === 'post' && url === '/admin/hero-campaigns/ab-tests') {
    const abtests = getStoredABTests();
    const newTest = {
      ...data,
      id: `ab_${Date.now()}`,
      viewsA: 0, clicksA: 0, conversionsA: 0, revenueA: 0,
      viewsB: 0, clicksB: 0, conversionsB: 0, revenueB: 0,
      winner: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    abtests.unshift(newTest);
    localStorage.setItem('buynora_ab_tests', JSON.stringify(abtests));
    return mockResponse(200, newTest);
  }

  const abTestIdMatch = url.match(/^\/admin\/hero-campaigns\/ab-tests\/([^/]+)$/);
  if (method === 'put' && abTestIdMatch) {
    const abId = abTestIdMatch[1];
    const abtests = getStoredABTests();
    const idx = abtests.findIndex(ab => ab.id === abId);
    if (idx !== -1) {
      abtests[idx] = { ...abtests[idx], ...data, updatedAt: new Date().toISOString() };
      localStorage.setItem('buynora_ab_tests', JSON.stringify(abtests));
      return mockResponse(200, abtests[idx]);
    }
    return mockResponse(404, { message: 'AB test not found' });
  }

  if (method === 'get' && url === '/admin/hero-campaigns/assets') {
    return mockResponse(200, getStoredAssets());
  }

  if (method === 'post' && url === '/admin/hero-campaigns/assets') {
    const assets = getStoredAssets();
    const newAsset = {
      ...data,
      id: `ast_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    assets.unshift(newAsset);
    localStorage.setItem('buynora_campaign_assets', JSON.stringify(assets));
    return mockResponse(200, newAsset);
  }

  const assetIdMatch = url.match(/^\/admin\/hero-campaigns\/assets\/([^/]+)$/);
  if (method === 'delete' && assetIdMatch) {
    const assetId = assetIdMatch[1];
    const assets = getStoredAssets();
    const idx = assets.findIndex(ast => ast.id === assetId);
    if (idx !== -1) {
      assets.splice(idx, 1);
      localStorage.setItem('buynora_campaign_assets', JSON.stringify(assets));
      return mockResponse(200, { success: true, id: assetId });
    }
    return mockResponse(404, { message: 'Asset not found' });
  }

  if (method === 'get' && url === '/admin/hero-campaigns/templates') {
    return mockResponse(200, getStoredTemplates());
  }

  const duplicateMatch = url.match(/^\/admin\/hero-campaigns\/([^/]+)\/duplicate$/);
  if (method === 'post' && duplicateMatch) {
    const id = duplicateMatch[1];
    const camps = getStoredCampaigns();
    const orig = camps.find(c => c.id === id);
    if (!orig) return mockResponse(404, { message: 'Campaign not found' });

    const duplicated = {
      ...orig,
      id: `camp_${Date.now()}`,
      campaignName: `${orig.campaignName} (Copy)`,
      campaignSlug: `${orig.campaignSlug}-copy-${Date.now().toString().slice(-4)}`,
      views: 0,
      clicks: 0,
      ctr: 0,
      revenue: 0,
      conversions: 0,
      status: "Draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    camps.push(duplicated);
    localStorage.setItem('buynora_hero_campaigns', JSON.stringify(camps));
    return mockResponse(200, duplicated);
  }

  const viewTrackMatch = url.match(/^\/admin\/hero-campaigns\/([^/]+)\/track-view$/);
  if (method === 'post' && viewTrackMatch) {
    const id = viewTrackMatch[1];
    const camps = getStoredCampaigns();
    const camp = camps.find(c => c.id === id);
    if (camp) {
      camp.views = (camp.views || 0) + 1;
      localStorage.setItem('buynora_hero_campaigns', JSON.stringify(camps));
      return mockResponse(200, { success: true });
    }
    return mockResponse(404, { message: 'Campaign not found' });
  }

  const clickTrackMatch = url.match(/^\/admin\/hero-campaigns\/([^/]+)\/track-click$/);
  if (method === 'post' && clickTrackMatch) {
    const id = clickTrackMatch[1];
    const camps = getStoredCampaigns();
    const camp = camps.find(c => c.id === id);
    if (camp) {
      camp.clicks = (camp.clicks || 0) + 1;
      camp.ctr = camp.views > 0 ? parseFloat(((camp.clicks / camp.views) * 100).toFixed(2)) : 0;
      localStorage.setItem('buynora_hero_campaigns', JSON.stringify(camps));
      return mockResponse(200, { success: true });
    }
    return mockResponse(404, { message: 'Campaign not found' });
  }

  const versionsMatch = url.match(/^\/admin\/hero-campaigns\/([^/]+)\/versions$/);
  if (method === 'get' && versionsMatch) {
    const cId = versionsMatch[1];
    return mockResponse(200, getStoredVersions(cId));
  }

  const restoreMatch = url.match(/^\/admin\/hero-campaigns\/versions\/([^/]+)\/restore$/);
  if (method === 'post' && restoreMatch) {
    const verId = restoreMatch[1];
    let matchedVersion: any = null;
    const camps = getStoredCampaigns();
    
    for (let c of camps) {
      const versions = getStoredVersions(c.id);
      const found = versions.find(v => v.id === verId);
      if (found) {
        matchedVersion = found;
        break;
      }
    }

    if (matchedVersion) {
      const restoredData = JSON.parse(matchedVersion.campaignData);
      const campIdx = camps.findIndex(c => c.id === restoredData.id);
      if (campIdx !== -1) {
        camps[campIdx] = {
          ...camps[campIdx],
          ...restoredData,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem('buynora_hero_campaigns', JSON.stringify(camps));
        return mockResponse(200, camps[campIdx]);
      }
    }
    return mockResponse(404, { message: 'Version or campaign not found' });
  }

  if (method === 'post' && url === '/admin/hero-campaigns') {
    const camps = getStoredCampaigns();
    const newCamp = {
      ...data,
      id: data.id || `camp_${Date.now()}`,
      views: 0,
      clicks: 0,
      ctr: 0,
      revenue: 0,
      conversions: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    camps.push(newCamp);
    localStorage.setItem('buynora_hero_campaigns', JSON.stringify(camps));
    
    const versions = getStoredVersions(newCamp.id);
    versions.push({
      id: `ver_${newCamp.id}_${Date.now()}`,
      campaignId: newCamp.id,
      versionNumber: versions.length + 1,
      changedBy: newCamp.createdBy || "admin@buynora.com",
      changeSummary: "Campaign created",
      campaignData: JSON.stringify(newCamp),
      createdAt: new Date().toISOString()
    });
    localStorage.setItem(`buynora_versions_${newCamp.id}`, JSON.stringify(versions));

    return mockResponse(200, newCamp);
  }

  const singleCampPutMatch = url.match(/^\/admin\/hero-campaigns\/([^/]+)$/);
  if (method === 'put' && singleCampPutMatch) {
    const cId = singleCampPutMatch[1];
    const camps = getStoredCampaigns();
    const idx = camps.findIndex(c => c.id === cId);
    if (idx !== -1) {
      const original = camps[idx];
      camps[idx] = {
        ...original,
        ...data,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('buynora_hero_campaigns', JSON.stringify(camps));

      const versions = getStoredVersions(cId);
      versions.push({
        id: `ver_${cId}_${Date.now()}`,
        campaignId: cId,
        versionNumber: versions.length + 1,
        changedBy: data.createdBy || "admin@buynora.com",
        changeSummary: `Campaign updated`,
        campaignData: JSON.stringify(camps[idx]),
        createdAt: new Date().toISOString()
      });
      localStorage.setItem(`buynora_versions_${cId}`, JSON.stringify(versions));

      return mockResponse(200, camps[idx]);
    }
    return mockResponse(404, { message: 'Campaign not found' });
  }

  const singleCampGetMatch = url.match(/^\/admin\/hero-campaigns\/([^/]+)$/);
  if (method === 'get' && singleCampGetMatch) {
    const cId = singleCampGetMatch[1];
    const camps = getStoredCampaigns();
    const camp = camps.find(c => c.id === cId);
    if (camp) {
      return mockResponse(200, camp);
    }
    return mockResponse(404, { message: 'Campaign not found' });
  }

  const singleCampDeleteMatch = url.match(/^\/admin\/hero-campaigns\/([^/]+)$/);
  if (method === 'delete' && singleCampDeleteMatch) {
    const cId = singleCampDeleteMatch[1];
    const camps = getStoredCampaigns();
    const idx = camps.findIndex(c => c.id === cId);
    if (idx !== -1) {
      camps.splice(idx, 1);
      localStorage.setItem('buynora_hero_campaigns', JSON.stringify(camps));
      return mockResponse(200, { success: true, id: cId });
    }
    return mockResponse(404, { message: 'Campaign not found' });
  }

  // 1. GET /products
  if (method === 'get' && url === '/products') {
    let filtered = [...products];

    if (params.search) {
      const q = params.search.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    if (params.category && params.category !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase() === params.category.toLowerCase());
    }

    if (params.brand && params.brand !== 'All') {
      filtered = filtered.filter(p => p.brand.toLowerCase() === params.brand.toLowerCase());
    }

    if (params.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= Number(params.minPrice));
    }
    if (params.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= Number(params.maxPrice));
    }

    if (params.minRating !== undefined) {
      filtered = filtered.filter(p => p.rating >= Number(params.minRating));
    }

    if (params.discountOnly) {
      filtered = filtered.filter(p => p.discountPercentage > 0);
    }

    if (params.inStockOnly) {
      filtered = filtered.filter(p => p.stock > 0);
    }

    if (params.isTrending) {
      filtered = filtered.filter(p => p.isTrending);
    }
    if (params.isNewArrival) {
      filtered = filtered.filter(p => p.isNewArrival);
    }
    if (params.isBestSeller) {
      filtered = filtered.filter(p => p.isBestSeller);
    }
    if (params.isFlashSale) {
      filtered = filtered.filter(p => p.isFlashSale);
    }
    if (params.isAiRecommended) {
      filtered = filtered.filter(p => p.isAiRecommended);
    }

    if (params.sortBy) {
      switch (params.sortBy) {
        case 'popularity':
          filtered.sort((a, b) => b.ratingCount - a.ratingCount);
          break;
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          filtered.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
          break;
      }
    }

    const page = Number(params.page || 1);
    const limit = Number(params.limit || 12);
    const startIndex = (page - 1) * limit;
    const paginatedProducts = filtered.slice(startIndex, startIndex + limit);
    const totalPages = Math.ceil(filtered.length / limit);

    return mockResponse(200, {
      products: paginatedProducts,
      totalCount: filtered.length,
      page,
      totalPages,
      hasMore: page < totalPages,
    });
  }

  // GET /products/categories
  if (method === 'get' && url === '/products/categories') {
    return mockResponse(200, categories);
  }

  // 2. GET /products/suggestions
  if (method === 'get' && url === '/products/suggestions') {
    const query = (params.search || '').toLowerCase().trim();
    if (!query) return mockResponse(200, []);
    const suggestionsSet = new Set<string>();

    products.forEach(p => {
      if (p.name.toLowerCase().includes(query)) suggestionsSet.add(p.name);
      if (p.brand.toLowerCase().startsWith(query)) suggestionsSet.add(p.brand);
      if (p.category.toLowerCase().startsWith(query)) suggestionsSet.add(p.category);
    });

    return mockResponse(200, Array.from(suggestionsSet).slice(0, 6));
  }

  // 3. GET /products/recommendations & /products/:id/recommendations
  if (method === 'get' && (url === '/products/recommendations' || url.match(/^\/products\/([^/]+)\/recommendations$/))) {
    const match = url.match(/^\/products\/([^/]+)\/recommendations$/);
    const productId = match ? match[1] : undefined;

    if (productId) {
      const pObj = products.find(p => p.id === productId);
      if (pObj) {
        const matching = products
          .filter(p => p.id !== productId && (p.category === pObj.category || p.brand === pObj.brand))
          .slice(0, 6);
        return mockResponse(200, matching);
      }
    }
    const defaultRecs = products.filter(p => p.isAiRecommended).slice(0, 6);
    return mockResponse(200, defaultRecs);
  }

  // 4. GET /products/:id
  const productMatch = url.match(/^\/products\/([^/]+)$/);
  if (method === 'get' && productMatch) {
    const id = productMatch[1];
    const product = products.find(p => p.id === id);
    if (!product) return mockResponse(404, { message: 'Product not found' });
    return mockResponse(200, { ...product });
  }

  // 5. POST /products/:id/reviews
  const reviewMatch = url.match(/^\/products\/([^/]+)\/reviews$/);
  if (method === 'post' && reviewMatch) {
    const id = reviewMatch[1];
    const p = products.find(prod => prod.id === id);
    if (!p) return mockResponse(404, { message: 'Product not found' });

    const newReview: Review = {
      ...data,
      id: `review_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
    };

    p.reviews = [newReview, ...p.reviews];
    const totalRating = p.reviews.reduce((acc, r) => acc + r.rating, 0);
    p.rating = parseFloat((totalRating / p.reviews.length).toFixed(1));
    p.ratingCount = p.reviews.length;

    return mockResponse(200, newReview);
  }

  // 6. POST /products/:id/questions
  const questionMatch = url.match(/^\/products\/([^/]+)\/questions$/);
  if (method === 'post' && questionMatch) {
    const id = questionMatch[1];
    const p = products.find(prod => prod.id === id);
    if (!p) return mockResponse(404, { message: 'Product not found' });

    const newQna: QnA = {
      id: `qna_${Date.now()}`,
      question: data.question,
      answer: "Thank you for your question. A seller representative will answer shortly.",
      date: new Date().toISOString().split('T')[0],
      votes: 0,
    };

    p.qna = [newQna, ...p.qna];
    return mockResponse(200, newQna);
  }

  // 7. GET /coupons
  if (method === 'get' && url === '/coupons') {
    return mockResponse(200, coupons);
  }

  // 8. POST /coupons/verify
  if (method === 'post' && url === '/coupons/verify') {
    const coupon = coupons.find(c => c.code.toUpperCase() === data.code.toUpperCase().trim());
    if (!coupon) return mockResponse(400, { message: 'Invalid Coupon Code' });
    return mockResponse(200, coupon);
  }

  // 9. GET /seller/analytics
  if (method === 'get' && url === '/seller/analytics') {
    return mockResponse(200, {
      revenueData: [
        { month: 'Jan', sales: 4000, revenue: 2400 },
        { month: 'Feb', sales: 3000, revenue: 1398 },
        { month: 'Mar', sales: 2000, revenue: 9800 },
        { month: 'Apr', sales: 2780, revenue: 3908 },
        { month: 'May', sales: 1890, revenue: 4800 },
        { month: 'Jun', sales: 2390, revenue: 3800 },
        { month: 'Jul', sales: 3490, revenue: 4300 },
      ],
      productPerformance: [
        { name: 'iPhone 15 Pro', sales: 140 },
        { name: 'Air Max 270 SE', sales: 220 },
        { name: 'WH-1000XM5', sales: 90 },
        { name: 'MacBook Pro 14"', sales: 50 },
      ],
      recentOrders: [
        { id: "ORD0092", customer: "Alex Mercer", date: "2026-06-05", amount: 999, status: "Shipped" },
        { id: "ORD0091", customer: "Sophia Martinez", date: "2026-06-05", amount: 150, status: "Processing" },
        { id: "ORD0090", customer: "Liam Neeson", date: "2026-06-04", amount: 348, status: "Delivered" },
      ],
      topMetrics: {
        totalRevenue: 28450,
        totalSales: 480,
        averageOrderValue: 59.27,
        totalProducts: products.length,
      },
    });
  }

  // 10. GET /admin/statistics
  if (method === 'get' && url === '/admin/statistics') {
    return mockResponse(200, {
      usersCount: mockUsersList.length,
      sellersCount: mockSellersList.length,
      totalSalesCount: 12840,
      totalRevenue: 492000,
      monthlyEarnings: [
        { name: 'Jan', earnings: 45000 },
        { name: 'Feb', earnings: 52000 },
        { name: 'Mar', earnings: 49000 },
        { name: 'Apr', earnings: 63000 },
        { name: 'May', earnings: 58000 },
        { name: 'Jun', earnings: 67000 },
      ],
      categorySales: [
        { name: 'Electronics', value: 45 },
        { name: 'Footwear', value: 25 },
        { name: 'Apparel', value: 15 },
        { name: 'Accessories', value: 10 },
        { name: 'Home & Living', value: 5 },
      ],
      systemAlerts: [
        { id: "a1", type: "info", text: "System memory load is healthy (34%)" },
        { id: "a2", type: "warning", text: "High traffic from Europe region detected" },
        { id: "a3", type: "success", text: "Weekly backup completed successfully" },
      ],
      users: mockUsersList,
      sellers: mockSellersList,
    });
  }

  // 11. POST /auth/login
  if (method === 'post' && url === '/auth/login') {
    const { email } = data;
    let role: 'CUSTOMER' | 'SELLER' | 'ADMIN' = 'CUSTOMER';
    let name = 'John Doe';
    let avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150';

    if (email === 'admin@buynora.com') {
      role = 'ADMIN';
      name = 'Alice Admin';
      avatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150';
    } else if (email === 'seller@buynora.com') {
      role = 'SELLER';
      name = 'Bob Seller';
      avatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150';
    }

    const mockToken = `mock-jwt-token-for-${role}`;
    return mockResponse(200, {
      token: mockToken,
      user: {
        name,
        email,
        phone: "+1 (555) 019-2834",
        avatar,
        referralCode: "NORA-" + email.split('@')[0].toUpperCase(),
        points: 350,
        role,
      },
    });
  }

  // 12. GET /orders
  if (method === 'get' && url === '/orders') {
    return mockResponse(200, activeOrders);
  }

  // 13. POST /orders/create
  if (method === 'post' && url === '/orders/create') {
    const newOrder: Order = {
      ...data,
      id: data.id || `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Processing',
      trackingStep: 1,
    };
    activeOrders.unshift(newOrder);
    return mockResponse(200, newOrder);
  }

  // 14. POST /orders/:id/tracking
  const trackingMatch = url.match(/^\/orders\/([^/]+)\/tracking$/);
  if (method === 'post' && trackingMatch) {
    const id = trackingMatch[1];
    const ord = activeOrders.find(o => o.id === id);
    if (!ord) return mockResponse(404, { message: 'Order not found' });
    ord.trackingStep = data.step;
    ord.status = data.status;
    return mockResponse(200, ord);
  }

  // 15. POST /orders/:id/cancel
  const cancelMatch = url.match(/^\/orders\/([^/]+)\/cancel$/);
  if (method === 'post' && cancelMatch) {
    const id = cancelMatch[1];
    const ord = activeOrders.find(o => o.id === id);
    if (!ord) return mockResponse(404, { message: 'Order not found' });
    ord.status = 'Cancelled';
    ord.trackingStep = 0;
    return mockResponse(200, ord);
  }

  // 16. Admin Actions (Mocking CRUD Mutations directly in the database)
  const userBanMatch = url.match(/^\/admin\/users\/([^/]+)\/ban$/);
  if (method === 'post' && userBanMatch) {
    const id = userBanMatch[1];
    const u = mockUsersList.find(usr => usr.id === id);
    if (u) {
      u.status = u.status === 'Active' ? 'Banned' : 'Active';
    }
    return mockResponse(200, { success: true, user: u });
  }

  const userRoleMatch = url.match(/^\/admin\/users\/([^/]+)\/role$/);
  if (method === 'post' && userRoleMatch) {
    const id = userRoleMatch[1];
    const u = mockUsersList.find(usr => usr.id === id);
    if (u) {
      u.role = data.role;
    }
    return mockResponse(200, { success: true, user: u });
  }

  const sellerApproveMatch = url.match(/^\/admin\/sellers\/([^/]+)\/approve$/);
  if (method === 'post' && sellerApproveMatch) {
    const id = sellerApproveMatch[1];
    const s = mockSellersList.find(sel => sel.id === id);
    if (s) {
      s.status = 'Active';
    }
    return mockResponse(200, { success: true, seller: s });
  }

  const sellerToggleMatch = url.match(/^\/admin\/sellers\/([^/]+)\/toggle$/);
  if (method === 'post' && sellerToggleMatch) {
    const id = sellerToggleMatch[1];
    const s = mockSellersList.find(sel => sel.id === id);
    if (s) {
      s.status = s.status === 'Active' ? 'Suspended' : 'Active';
    }
    return mockResponse(200, { success: true, seller: s });
  }

  // 17. Product & Coupon CRUD
  if (method === 'post' && url === '/products') {
    const newProd = { ...data, id: data.id || `p_${Date.now()}` };
    products.unshift(newProd);
    return mockResponse(200, newProd);
  }

  const prodIdMatch = url.match(/^\/products\/([^/]+)$/);
  if (method === 'put' && prodIdMatch) {
    const id = prodIdMatch[1];
    const idx = products.findIndex(p => p.id === id);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...data };
      return mockResponse(200, products[idx]);
    }
    return mockResponse(404, { message: 'Product not found' });
  }

  if (method === 'delete' && prodIdMatch) {
    const id = prodIdMatch[1];
    const idx = products.findIndex(p => p.id === id);
    if (idx !== -1) {
      const deleted = products.splice(idx, 1)[0];
      return mockResponse(200, deleted);
    }
    return mockResponse(404, { message: 'Product not found' });
  }

  if (method === 'post' && url === '/coupons') {
    coupons.unshift(data);
    return mockResponse(200, data);
  }

  const couponCodeMatch = url.match(/^\/coupons\/([^/]+)$/);
  if (method === 'delete' && couponCodeMatch) {
    const code = couponCodeMatch[1];
    const idx = coupons.findIndex(c => c.code.toUpperCase() === code.toUpperCase().trim());
    if (idx !== -1) {
      const deleted = coupons.splice(idx, 1)[0];
      return mockResponse(200, deleted);
    }
    return mockResponse(404, { message: 'Coupon not found' });
  }

  return mockResponse(404, { message: 'Mock endpoint not found' });
};

export default api;
