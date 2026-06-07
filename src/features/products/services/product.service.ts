import api from '../../../services/api';
import { Product, Review, QnA, Category } from '../../../types';

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

export const productService = {
  async getProducts(params: FetchProductsParams): Promise<ProductsResponse> {
    const res = await api.get('/products', { params });
    return res.data;
  },

  async getProductById(id: string): Promise<Product> {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },

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
