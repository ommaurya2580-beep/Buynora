import axios from 'axios';
import api from '../../../services/api';
import { Product, Review, QnA, Category } from '../../../types';
import { environment } from '../../../config/environment';

export interface FetchProductsParams {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  discountOnly?: boolean;
  inStockOnly?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFlashSale?: boolean;
  isAiRecommended?: boolean;
  sortBy?: string;
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

// Create a dedicated Axios instance for the real Product API (bypassing mock adapter in api.ts)
const realProductApi = axios.create({
  baseURL: environment.productUrl,
  timeout: 10000,
});

// Helper to map backend Product to frontend Product interface
const mapBackendProduct = (backendProduct: any): Product => {
  return {
    id: backendProduct.id,
    name: backendProduct.name,
    brand: backendProduct.brand || 'Generic',
    category: backendProduct.category || 'Uncategorized',
    subcategory: backendProduct.category || '',
    price: backendProduct.price || 0,
    originalPrice: backendProduct.price ? backendProduct.price * 1.2 : 0,
    discountPercentage: 20,
    rating: 4.5, // Default rating
    ratingCount: 120,
    stock: backendProduct.stockQuantity || 0,
    images: backendProduct.imageUrls && backendProduct.imageUrls.length > 0 
              ? backendProduct.imageUrls 
              : ['https://via.placeholder.com/400'],
    specs: {},
    reviews: [],
    qna: [],
    description: backendProduct.description || '',
    longDescription: backendProduct.description || '',
    isTrending: false,
    isNewArrival: true,
    isBestSeller: false,
    isFlashSale: false,
    isAiRecommended: false,
    availabilityStatus: backendProduct.stockQuantity > 0 ? 'In Stock' : 'Out of Stock',
    returnPolicy: '30 Days Return',
    deliveryDays: 3,
  };
};

export const productService = {
  async getProducts(params: FetchProductsParams): Promise<ProductsResponse> {
    try {
      // Pass pagination and filter parameters to the backend
      const backendParams: any = {};
      if (params.search) backendParams.name = params.search;
      if (params.category) backendParams.category = params.category;
      if (params.page) backendParams.page = params.page - 1; // Spring uses 0-based pagination
      if (params.limit) backendParams.size = params.limit;
      if (params.sortBy) backendParams.sortBy = params.sortBy;

      // Use real API to fetch products
      const res = await realProductApi.get('', { params: backendParams });
      
      let backendProducts = [];
      let totalElements = 0;
      let totalPages = 1;
      
      // Support both Spring Data Page object ({ content: [...] }) and flat array structures
      if (res.data && Array.isArray(res.data.content)) {
        backendProducts = res.data.content;
        totalElements = res.data.totalElements || backendProducts.length;
        totalPages = res.data.totalPages || 1;
      } else if (Array.isArray(res.data)) {
        backendProducts = res.data;
        totalElements = backendProducts.length;
      }
      
      const mappedProducts = backendProducts.map(mapBackendProduct);

      return {
        products: mappedProducts,
        totalCount: totalElements,
        page: params.page || 1,
        totalPages: totalPages,
        hasMore: (params.page || 1) < totalPages,
      };
    } catch (error) {
      console.error("Failed to fetch products from real API:", error);
      return { products: [], totalCount: 0, page: 1, totalPages: 1, hasMore: false };
    }
  },

  async getProductById(id: string): Promise<Product> {
    try {
      const res = await realProductApi.get(`/${id}`);
      return mapBackendProduct(res.data);
    } catch (error) {
      console.error("Failed to fetch product from real API:", error);
      throw error;
    }
  },

  // Fallback to mock API for features not yet implemented in backend
  async getSearchSuggestions(query: string): Promise<string[]> {
    const res = await api.get('/products/suggestions', { params: { search: query } });
    return res.data;
  },

  async getAiRecommendations(productId?: string): Promise<Product[]> {
    const url = productId ? `/products/${productId}/recommendations` : '/products/recommendations';
    const res = await api.get(url);
    return res.data;
  },

  async addReview(productId: string, reviewData: Omit<Review, 'id' | 'date' | 'likes'>): Promise<Review> {
    const res = await api.post(`/products/${productId}/reviews`, reviewData);
    return res.data;
  },

  async addQuestion(productId: string, questionText: string): Promise<QnA> {
    const res = await api.post(`/products/${productId}/questions`, { question: questionText });
    return res.data;
  },

  async getCategories(): Promise<Category[]> {
    const res = await api.get('/products/categories');
    return res.data;
  }
};
