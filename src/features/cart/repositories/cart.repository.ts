import { cartService } from '../services/cart.service';
import { CartItem, Coupon } from '../../../types';

export const CartRepository = {

  async verifyCoupon(code: string): Promise<Coupon> {
    return cartService.verifyCoupon(code);
  }
};
