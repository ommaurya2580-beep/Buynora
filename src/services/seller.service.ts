import api from './api';
import { SellerAnalytics, Product } from '../types';

export const sellerService = {
  async getAnalytics(): Promise<SellerAnalytics> {
    const res = await api.get('/seller/analytics');
    return res.data;
  },

  async createProduct(product: Omit<Product, 'id' | 'reviews' | 'qna'>): Promise<Product> {
    const res = await api.post('/products', product);
    return res.data;
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const res = await api.put(`/products/${id}`, product);
    return res.data;
  },

  async deleteProduct(id: string): Promise<Product> {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  }
};
