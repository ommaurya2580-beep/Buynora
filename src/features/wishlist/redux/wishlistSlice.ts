import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../../types';

export interface WishlistState {
  wishlistItems: Product[];
}

const loadWishlistFromStorage = (): Product[] => {
  try {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveWishlistToStorage = (items: Product[]) => {
  try {
    localStorage.setItem('wishlist', JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save wishlist to localStorage', e);
  }
};

const initialState: WishlistState = {
  wishlistItems: loadWishlistFromStorage(),
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<Product>) {
      if (!state.wishlistItems.some(item => item.id === action.payload.id)) {
        state.wishlistItems.push(action.payload);
        saveWishlistToStorage(state.wishlistItems);
      }
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.wishlistItems = state.wishlistItems.filter(item => item.id !== action.payload);
      saveWishlistToStorage(state.wishlistItems);
    },
    clearWishlist(state) {
      state.wishlistItems = [];
      saveWishlistToStorage(state.wishlistItems);
    }
  }
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
