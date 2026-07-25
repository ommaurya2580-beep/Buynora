import axios from 'axios';
import api from '../../../services/api';
import { SellerAnalytics, Product } from '../../../types';
import { environment } from '../../../config/environment';

// Dedicated Axios instance for the real Product API
const realProductApi = axios.create({
  baseURL: environment.productUrl,
  timeout: 30000, // Uploads might take longer
});

export const sellerService = {
  // Mock Analytics for now since it's not in the real backend yet
  async getAnalytics(): Promise<SellerAnalytics> {
    const res = await api.get('/seller/analytics');
    return res.data;
  },

  async createProduct(product: Omit<Product, 'id' | 'reviews' | 'qna'>, imageFile: File | null): Promise<Product> {
    const formData = new FormData();
    
    // Map frontend product structure to backend product structure
    const backendProduct = {
      name: product.name,
      description: product.description || product.longDescription,
      price: product.price,
      stockQuantity: product.stock,
      category: product.category,
      brand: product.brand,
    };

    // Append JSON payload as string
    formData.append('product', JSON.stringify(backendProduct));

    // Append File if exists
    if (imageFile) {
      formData.append('images', imageFile);
    }

    // Use fetch instead of axios to avoid multipart boundary bugs on Vercel
    const response = await fetch(environment.productUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to add product:', errorText);
      throw new Error(`Failed to add product: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    // Note: If you implement update on backend, do similar mapping. For now fallback to mock.
    const res = await api.put(`/products/${id}`, product);
    return res.data;
  },

  async deleteProduct(id: string): Promise<Product> {
    // Delete product from real backend API
    const res = await realProductApi.delete(`/${id}`);
    return res.data;
  }
};
