import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, Coupon, CartItem } from '../../../types';

export interface CartState {
  cartItems: CartItem[];
  savedForLater: CartItem[];
  comparedItems: Product[];
  appliedCoupon: Coupon | null;
  pointsDiscount: number;
  pointsApplied: number;
}

const initialState: CartState = {
  cartItems: [],
  savedForLater: [],
  comparedItems: [],
  appliedCoupon: null,
  pointsDiscount: 0,
  pointsApplied: 0
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<{ product: Product; quantity: number; color?: string; size?: string }>) {
      const { product, quantity, color, size } = action.payload;
      const existingIndex = state.cartItems.findIndex(
        item => item.product.id === product.id && 
        item.selectedColor === color && 
        item.selectedSize === size
      );

      if (existingIndex !== -1) {
        state.cartItems[existingIndex].quantity += quantity;
      } else {
        state.cartItems.push({
          product,
          quantity,
          selectedColor: color,
          selectedSize: size
        });
      }
    },
    removeFromCart(state, action: PayloadAction<{ id: string; color?: string; size?: string }>) {
      const { id, color, size } = action.payload;
      state.cartItems = state.cartItems.filter(
        item => !(item.product.id === id && item.selectedColor === color && item.selectedSize === size)
      );
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number; color?: string; size?: string }>) {
      const { id, quantity, color, size } = action.payload;
      const item = state.cartItems.find(
        item => item.product.id === id && item.selectedColor === color && item.selectedSize === size
      );
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
    },
    saveForLaterItem(state, action: PayloadAction<{ id: string; color?: string; size?: string }>) {
      const { id, color, size } = action.payload;
      const cartItemIndex = state.cartItems.findIndex(
        item => item.product.id === id && item.selectedColor === color && item.selectedSize === size
      );
      if (cartItemIndex !== -1) {
        const item = state.cartItems[cartItemIndex];
        state.cartItems.splice(cartItemIndex, 1);
        state.savedForLater.push(item);
      }
    },
    moveToCartFromSaved(state, action: PayloadAction<{ id: string; color?: string; size?: string }>) {
      const { id, color, size } = action.payload;
      const savedIndex = state.savedForLater.findIndex(
        item => item.product.id === id && item.selectedColor === color && item.selectedSize === size
      );
      if (savedIndex !== -1) {
        const item = state.savedForLater[savedIndex];
        state.savedForLater.splice(savedIndex, 1);
        state.cartItems.push(item);
      }
    },
    removeSavedItem(state, action: PayloadAction<{ id: string; color?: string; size?: string }>) {
      const { id, color, size } = action.payload;
      state.savedForLater = state.savedForLater.filter(
        item => !(item.product.id === id && item.selectedColor === color && item.selectedSize === size)
      );
    },
    // Coupon actions
    applyCartCoupon(state, action: PayloadAction<Coupon>) {
      state.appliedCoupon = action.payload;
    },
    removeCartCoupon(state) {
      state.appliedCoupon = null;
    },
    // Reward points actions
    applyCartPoints(state, action: PayloadAction<{ points: number; dollarValue: number }>) {
      state.pointsApplied = action.payload.points;
      state.pointsDiscount = action.payload.dollarValue;
    },
    removeCartPoints(state) {
      state.pointsApplied = 0;
      state.pointsDiscount = 0;
    },
    clearCart(state) {
      state.cartItems = [];
      state.appliedCoupon = null;
      state.pointsApplied = 0;
      state.pointsDiscount = 0;
    },
    toggleCompareProduct(state, action: PayloadAction<Product>) {
      const exists = state.comparedItems.some(item => item.id === action.payload.id);
      if (exists) {
        state.comparedItems = state.comparedItems.filter(item => item.id !== action.payload.id);
      } else {
        if (state.comparedItems.length < 3) {
          state.comparedItems.push(action.payload);
        }
      }
    },
    removeCompareProduct(state, action: PayloadAction<string>) {
      state.comparedItems = state.comparedItems.filter(item => item.id !== action.payload);
    },
    clearCompareProducts(state) {
      state.comparedItems = [];
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  saveForLaterItem,
  moveToCartFromSaved,
  removeSavedItem,
  applyCartCoupon,
  removeCartCoupon,
  applyCartPoints,
  removeCartPoints,
  clearCart,
  toggleCompareProduct,
  removeCompareProduct,
  clearCompareProducts
} = cartSlice.actions;

export default cartSlice.reducer;
