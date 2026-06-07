import { adminService } from '../services/admin.service';
import { AdminStatistics, UserAccount, Seller, Coupon } from '../../../types';

export const AdminRepository = {
  async getStatistics(): Promise<AdminStatistics> {
    return adminService.getStatistics();
  },

  async toggleUserStatus(userId: string): Promise<{ success: boolean; user: UserAccount }> {
    return adminService.toggleUserStatus(userId);
  },

  async promoteUserToRole(userId: string, role: UserAccount['role']): Promise<{ success: boolean; user: UserAccount }> {
    return adminService.promoteUserToRole(userId, role);
  },

  async approveSeller(sellerId: string): Promise<{ success: boolean; seller: Seller }> {
    return adminService.approveSeller(sellerId);
  },

  async toggleSellerStatus(sellerId: string): Promise<{ success: boolean; seller: Seller }> {
    return adminService.toggleSellerStatus(sellerId);
  },

  async getCoupons(): Promise<Coupon[]> {
    return adminService.getCoupons();
  },

  async createCoupon(coupon: Coupon): Promise<Coupon> {
    return adminService.createCoupon(coupon);
  },

  async deleteCoupon(code: string): Promise<Coupon> {
    return adminService.deleteCoupon(code);
  },

  async verifyCoupon(code: string): Promise<Coupon> {
    return adminService.verifyCoupon(code);
  }
};
