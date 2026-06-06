import api from './api';
import { AdminStatistics, UserAccount, Seller, Coupon } from '../types';

export const adminService = {
  async getStatistics(): Promise<AdminStatistics> {
    const res = await api.get('/admin/statistics');
    return res.data;
  },

  async toggleUserStatus(userId: string): Promise<{ success: boolean; user: UserAccount }> {
    const res = await api.post(`/admin/users/${userId}/ban`);
    return res.data;
  },

  async promoteUserToRole(userId: string, role: UserAccount['role']): Promise<{ success: boolean; user: UserAccount }> {
    const res = await api.post(`/admin/users/${userId}/role`, { role });
    return res.data;
  },

  async approveSeller(sellerId: string): Promise<{ success: boolean; seller: Seller }> {
    const res = await api.post(`/admin/sellers/${sellerId}/approve`);
    return res.data;
  },

  async toggleSellerStatus(sellerId: string): Promise<{ success: boolean; seller: Seller }> {
    const res = await api.post(`/admin/sellers/${sellerId}/toggle`);
    return res.data;
  },

  async getCoupons(): Promise<Coupon[]> {
    const res = await api.get('/coupons');
    return res.data;
  },

  async createCoupon(coupon: Coupon): Promise<Coupon> {
    const res = await api.post('/coupons', coupon);
    return res.data;
  },

  async deleteCoupon(code: string): Promise<Coupon> {
    const res = await api.delete(`/coupons/${code}`);
    return res.data;
  },

  async verifyCoupon(code: string): Promise<Coupon> {
    const res = await api.post('/coupons/verify', { code });
    return res.data;
  }
};
