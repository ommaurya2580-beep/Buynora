export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/product/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  DASHBOARD: '/dashboard',
  TRACK_ORDER: '/track/:id',
  WISHLIST: '/wishlist',
  ABOUT: '/about',
  CONTACT: '/contact',
  FAQ: '/faq',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  SELLER_DASHBOARD: '/seller',
  ADMIN_DASHBOARD: '/admin',
  UNAUTHORIZED: '/unauthorized',
  AUTH: {
    ROOT: '/auth',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT: '/auth/forgot',
    VERIFY: '/auth/verify',
    RESET: '/auth/reset',
  }
};

export const ROLES = {
  CUSTOMER: 'CUSTOMER',
  SELLER: 'SELLER',
  ADMIN: 'ADMIN'
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$' },
  EUR: { code: 'EUR', symbol: '€' },
  GBP: { code: 'GBP', symbol: '£' },
  INR: { code: 'INR', symbol: '₹' }
} as const;

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' }
] as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
    SUGGESTIONS: '/products/suggestions',
    RECOMMENDATIONS: (id?: string) => id ? `/products/${id}/recommendations` : '/products/recommendations',
    ADD_REVIEW: (id: string) => `/products/${id}/reviews`,
    ADD_QUESTION: (id: string) => `/products/${id}/questions`,
  },
  COUPONS: {
    LIST: '/coupons',
    VERIFY: '/coupons/verify',
    CREATE: '/coupons/create',
    DELETE: (code: string) => `/coupons/${code}`,
  },
  ORDERS: {
    LIST: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    CREATE: '/orders/create',
    UPDATE_TRACKING: (id: string) => `/orders/${id}/tracking`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
  },
  SELLER: {
    ANALYTICS: '/seller/analytics',
  },
  ADMIN: {
    STATS: '/admin/statistics',
    BAN_USER: (id: string) => `/admin/users/${id}/ban`,
    PROMOTE_USER: (id: string) => `/admin/users/${id}/role`,
    APPROVE_SELLER: (id: string) => `/admin/sellers/${id}/approve`,
    TOGGLE_SELLER: (id: string) => `/admin/sellers/${id}/toggle`,
  }
};

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark'
} as const;

export interface TestimonialConstant {
  id: string;
  name: string;
  avatar: string;
  role: string;
  comment: string;
  rating: number;
}

export const TESTIMONIALS: TestimonialConstant[] = [
  {
    id: "t1",
    name: "Jessica Albright",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
    role: "Verified Customer",
    comment: "Buynora has changed the way I shop online. The glassmorphic design and smooth page transitions make it feel incredibly premium. Deliveries are lightning fast!",
    rating: 5
  },
  {
    id: "t2",
    name: "Robert Downey",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
    role: "Tech Enthusiast",
    comment: "The voice search is surprisingly accurate, and the checkout flow is seamless. Definitely inspired by the absolute best designs in the industry.",
    rating: 5
  },
  {
    id: "t3",
    name: "Aisha Patel",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
    role: "Designer",
    comment: "Stunning aesthetic options! The Dark Mode looks absolutely gorgeous with the glass cards. Recommend to everyone.",
    rating: 5
  }
];
