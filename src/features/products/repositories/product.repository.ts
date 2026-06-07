import { productService, FetchProductsParams, ProductsResponse } from '../services/product.service';
import { Product, Review, QnA, Category } from '../../../types';

export const ProductRepository = {
  async getProducts(params: FetchProductsParams): Promise<ProductsResponse> {
    return productService.getProducts(params);
  },

  async getProductById(id: string): Promise<Product> {
    return productService.getProductById(id);
  },

  async getSearchSuggestions(query: string): Promise<string[]> {
    return productService.getSearchSuggestions(query);
  },

  async getAiRecommendations(productId?: string): Promise<Product[]> {
    return productService.getAiRecommendations(productId);
  },

  async addReview(productId: string, reviewData: Omit<Review, 'id' | 'date' | 'likes'>): Promise<Review> {
    return productService.addReview(productId, reviewData);
  },

  async addQuestion(productId: string, questionText: string): Promise<QnA> {
    return productService.addQuestion(productId, questionText);
  },

  async getCategories(): Promise<Category[]> {
    return productService.getCategories();
  }
};
