import api from './api';
import { CartItem, Coupon } from '../types';

export const cartService = {
  async syncCart(items: CartItem[]): Promise<{ success: boolean }> {
    // Backend API preparation
    const res = await api.post('/cart/sync', { items });
    return res.data;
  },

  async verifyCoupon(code: string): Promise<Coupon> {
    const res = await api.post('/coupons/verify', { code });
    return res.data;
  }
};
