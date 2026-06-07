import api from '../../../services/api';
import { Product } from '../../../types';

export const wishlistService = {
  async syncWishlist(items: Product[]): Promise<{ success: boolean }> {
    const res = await api.post('/wishlist/sync', { items });
    return res.data;
  }
};
