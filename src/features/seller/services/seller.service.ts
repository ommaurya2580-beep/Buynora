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

    // Append JSON payload
    formData.append('product', new Blob([JSON.stringify(backendProduct)], { type: 'application/json' }));

    // Append File if exists
    if (imageFile) {
      formData.append('images', imageFile);
    }

    // Send multipart/form-data to the real backend
    const res = await realProductApi.post('', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // The backend returns a simple product, but the UI might need the full frontend Product format.
    // In this case, `useAddProductMutation` invalidates the 'products' query, so the UI will re-fetch
    // the whole list using the `product.service.ts` adapter, which works perfectly.
    return res.data;
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    // Note: If you implement update on backend, do similar mapping. For now fallback to mock.
    const res = await api.put(`/products/${id}`, product);
    return res.data;
  },

  async deleteProduct(id: string): Promise<Product> {
    // Assuming backend might not have DELETE yet, using mock.
    // If backend has DELETE /products/{id}, use realProductApi.delete(`/${id}`)
    const res = await api.delete(`/products/${id}`);
    return res.data;
  }
};
