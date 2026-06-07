import { sellerService } from '../services/seller.service';
import { SellerAnalytics, Product } from '../../../types';

export const SellerRepository = {
  async getAnalytics(): Promise<SellerAnalytics> {
    return sellerService.getAnalytics();
  },

  async createProduct(product: Omit<Product, 'id' | 'reviews' | 'qna'>): Promise<Product> {
    return sellerService.createProduct(product);
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    return sellerService.updateProduct(id, product);
  },

  async deleteProduct(id: string): Promise<Product> {
    return sellerService.deleteProduct(id);
  }
};
