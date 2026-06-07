import { wishlistService } from '../services/wishlist.service';
import { Product } from '../../../types';

export const WishlistRepository = {
  async syncWishlist(items: Product[]): Promise<{ success: boolean }> {
    return wishlistService.syncWishlist(items);
  }
};
