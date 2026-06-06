import { products, categories, coupons, brands, Product, Coupon, Review, QnA } from './mockDb';

// Helper to simulate network latency
const delay = (ms: number = 400) => new Promise(resolve => setTimeout(resolve, ms));

export interface FetchProductsParams {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  discountOnly?: boolean;
  inStockOnly?: boolean;
  sortBy?: string; // 'popularity' | 'price-asc' | 'price-desc' | 'rating' | 'newest'
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  products: Product[];
  totalCount: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export const apiService = {
  // Get all filtered products (PLP)
  async getProducts(params: FetchProductsParams): Promise<ProductsResponse> {
    await delay();
    let filtered = [...products];

    // Search filter
    if (params.search) {
      const q = params.search.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (params.category && params.category !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase() === params.category!.toLowerCase());
    }

    // Brand filter
    if (params.brand && params.brand !== 'All') {
      filtered = filtered.filter(p => p.brand.toLowerCase() === params.brand!.toLowerCase());
    }

    // Price range filter
    if (params.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= params.minPrice!);
    }
    if (params.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= params.maxPrice!);
    }

    // Rating filter
    if (params.minRating !== undefined) {
      filtered = filtered.filter(p => p.rating >= params.minRating!);
    }

    // Discount filter
    if (params.discountOnly) {
      filtered = filtered.filter(p => p.discountPercentage > 0);
    }

    // Stock availability filter
    if (params.inStockOnly) {
      filtered = filtered.filter(p => p.stock > 0);
    }

    // Sorting
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

    // Pagination
    const page = params.page || 1;
    const limit = params.limit || 12;
    const startIndex = (page - 1) * limit;
    const paginatedProducts = filtered.slice(startIndex, startIndex + limit);
    const totalPages = Math.ceil(filtered.length / limit);

    return {
      products: paginatedProducts,
      totalCount: filtered.length,
      page,
      totalPages,
      hasMore: page < totalPages
    };
  },

  // Get single product details (PDP)
  async getProductById(id: string): Promise<Product> {
    await delay(300);
    const product = products.find(p => p.id === id);
    if (!product) {
      throw new Error("Product not found");
    }
    return { ...product };
  },

  // Smart Autocomplete Suggestions
  async getSearchSuggestions(query: string): Promise<string[]> {
    if (!query) return [];
    await delay(100);
    const q = query.toLowerCase().trim();
    const suggestionsSet = new Set<string>();

    products.forEach(p => {
      if (p.name.toLowerCase().includes(q)) suggestionsSet.add(p.name);
      if (p.brand.toLowerCase().startsWith(q)) suggestionsSet.add(p.brand);
      if (p.category.toLowerCase().startsWith(q)) suggestionsSet.add(p.category);
    });

    return Array.from(suggestionsSet).slice(0, 6);
  },

  // Fetch Recommended / AI products
  async getAiRecommendations(productId?: string): Promise<Product[]> {
    await delay(300);
    if (productId) {
      const pObj = products.find(p => p.id === productId);
      if (pObj) {
        // Recommend products from same category or brand
        return products
          .filter(p => p.id !== productId && (p.category === pObj.category || p.brand === pObj.brand))
          .slice(0, 6);
      }
    }
    // Default recommendations
    return products.filter(p => p.isAiRecommended).slice(0, 6);
  },

  // Add reviews to product
  async addReview(productId: string, reviewData: Omit<Review, 'id' | 'date' | 'likes'>): Promise<Review> {
    await delay(400);
    const p = products.find(prod => prod.id === productId);
    if (!p) throw new Error("Product not found");

    const newReview: Review = {
      ...reviewData,
      id: `review_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      likes: 0
    };

    p.reviews = [newReview, ...p.reviews];
    // Re-calculate rating
    const totalRating = p.reviews.reduce((acc, r) => acc + r.rating, 0);
    p.rating = parseFloat((totalRating / p.reviews.length).toFixed(1));
    p.ratingCount = p.reviews.length;

    return newReview;
  },

  // Add Q&A
  async addQuestion(productId: string, questionText: string): Promise<QnA> {
    await delay(300);
    const p = products.find(prod => prod.id === productId);
    if (!p) throw new Error("Product not found");

    const newQna: QnA = {
      id: `qna_${Date.now()}`,
      question: questionText,
      answer: "Thank you for your question. A seller representative will answer shortly.",
      date: new Date().toISOString().split('T')[0],
      votes: 0
    };

    p.qna = [newQna, ...p.qna];
    return newQna;
  },

  // Coupons
  async getCoupons(): Promise<Coupon[]> {
    await delay(200);
    return coupons;
  },

  async verifyCoupon(code: string): Promise<Coupon> {
    await delay(300);
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase().trim());
    if (!coupon) {
      throw new Error("Invalid Coupon Code");
    }
    return coupon;
  },

  // Seller Dashboard Analytics
  async getSellerAnalytics() {
    await delay(500);
    return {
      revenueData: [
        { month: 'Jan', sales: 4000, revenue: 2400 },
        { month: 'Feb', sales: 3000, revenue: 1398 },
        { month: 'Mar', sales: 2000, revenue: 9800 },
        { month: 'Apr', sales: 2780, revenue: 3908 },
        { month: 'May', sales: 1890, revenue: 4800 },
        { month: 'Jun', sales: 2390, revenue: 3800 },
        { month: 'Jul', sales: 3490, revenue: 4300 }
      ],
      productPerformance: [
        { name: 'iPhone 15 Pro', sales: 140 },
        { name: 'Air Max 270 SE', sales: 220 },
        { name: 'WH-1000XM5', sales: 90 },
        { name: 'MacBook Pro 14\"', sales: 50 }
      ],
      recentOrders: [
        { id: "ORD0092", customer: "Alex Mercer", date: "2026-06-05", amount: 999, status: "Shipped" },
        { id: "ORD0091", customer: "Sophia Martinez", date: "2026-06-05", amount: 150, status: "Processing" },
        { id: "ORD0090", customer: "Liam Neeson", date: "2026-06-04", amount: 348, status: "Delivered" }
      ],
      topMetrics: {
        totalRevenue: 28450,
        totalSales: 480,
        averageOrderValue: 59.27,
        totalProducts: products.length
      }
    };
  },

  // Admin Dashboard Analytics
  async getAdminStatistics() {
    await delay(500);
    return {
      usersCount: 1450,
      sellersCount: 84,
      totalSalesCount: 12840,
      totalRevenue: 492000,
      monthlyEarnings: [
        { name: 'Jan', earnings: 45000 },
        { name: 'Feb', earnings: 52000 },
        { name: 'Mar', earnings: 49000 },
        { name: 'Apr', earnings: 63000 },
        { name: 'May', earnings: 58000 },
        { name: 'Jun', earnings: 67000 }
      ],
      categorySales: [
        { name: 'Electronics', value: 45 },
        { name: 'Footwear', value: 25 },
        { name: 'Apparel', value: 15 },
        { name: 'Accessories', value: 10 },
        { name: 'Home & Living', value: 5 }
      ],
      systemAlerts: [
        { id: "a1", type: "info", text: "System memory load is healthy (34%)" },
        { id: "a2", type: "warning", text: "High traffic from Europe region detected" },
        { id: "a3", type: "success", text: "Weekly backup completed successfully" }
      ]
    };
  }
};
