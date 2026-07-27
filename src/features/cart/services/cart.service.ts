import axios from 'axios';
import { CartItem, Coupon } from '../../../types';

const API_URL = import.meta.env.VITE_CART_URL || 'http://3.95.240.195:8080/api/cart';

export interface CartBackendResponse {
  userId: string;
  items: CartItem[];
  subtotal: number;
}

export const cartService = {
  async getCart(userId: string): Promise<CartBackendResponse> {
    const res = await axios.get(`${API_URL}/${userId}`);
    return res.data;
  },

  async addToCart(userId: string, item: any): Promise<CartBackendResponse> {
    const res = await axios.post(`${API_URL}/${userId}/add`, item);
    return res.data;
  },

  async updateQuantity(userId: string, productId: string, color: string | undefined, size: string | undefined, quantity: number): Promise<CartBackendResponse> {
    const params = new URLSearchParams();
    params.append('productId', productId);
    if (color) params.append('color', color);
    if (size) params.append('size', size);
    params.append('quantity', quantity.toString());

    const res = await axios.put(`${API_URL}/${userId}/update?${params.toString()}`);
    return res.data;
  },

  async removeFromCart(userId: string, productId: string, color: string | undefined, size: string | undefined): Promise<CartBackendResponse> {
    const params = new URLSearchParams();
    params.append('productId', productId);
    if (color) params.append('color', color);
    if (size) params.append('size', size);

    const res = await axios.delete(`${API_URL}/${userId}/remove?${params.toString()}`);
    return res.data;
  },

  async clearCart(userId: string): Promise<void> {
    await axios.delete(`${API_URL}/${userId}/clear`);
  },

  async verifyCoupon(code: string): Promise<Coupon> {
    // Assuming product-service or order-service handles this
    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://3.95.240.195:8080/api/v1'}/coupons/verify`, { code });
    return res.data;
  }
};
