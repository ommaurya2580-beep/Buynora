import { cartService } from '../services/cart.service';
import { CartItem, Coupon } from '../../../types';

export const CartRepository = {
  async syncCart(items: CartItem[]): Promise<{ success: boolean }> {
    return cartService.syncCart(items);
  },

  async verifyCoupon(code: string): Promise<Coupon> {
    return cartService.verifyCoupon(code);
  }
};
