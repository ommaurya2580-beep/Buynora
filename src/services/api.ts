import axios, { InternalAxiosRequestConfig } from 'axios';
import { environment } from '../config/environment';
import { products, categories, coupons } from './mockDb';
import { Review, QnA, Order, UserAccount, Seller } from '../types';

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
    const token = localStorage.getItem('token');
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
  (error) => {
    if (environment.isDev) {
      console.error(`[HTTP Error]`, error.response || error.message);
    }
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
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

// Axios Mock Adapter Intercepting Requests
api.defaults.adapter = async (config) => {
  const url = config.url || '';
  const method = config.method?.toLowerCase() || 'get';
  const data = config.data ? JSON.parse(config.data) : null;
  const params = config.params || {};

  await new Promise((resolve) => setTimeout(resolve, 300));

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
