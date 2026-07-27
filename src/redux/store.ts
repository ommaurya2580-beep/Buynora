import { configureStore, Middleware } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice';
import notificationReducer from './notificationSlice';
import orderReducer from './orderSlice';
import sellerReducer from './sellerSlice';
import adminReducer from './adminSlice';
import { cartService } from '../features/cart/services/cart.service';

const cartSyncMiddleware: Middleware = store => next => action => {
  const result = next(action);
  const state = store.getState() as RootState;
  const user = state.auth.user;
  
  if (!user) return result;

  // @ts-ignore
  if (action.type && action.type.startsWith('cart/')) {
    // Only sync if it's an action that modifies cart items
    const type = (action as any).type;
    if (type === 'cart/addToCart') {
      const payload = (action as any).payload;
      cartService.addToCart(user.id, {
        productId: payload.product.id,
        quantity: payload.quantity,
        color: payload.color,
        size: payload.size,
        price: payload.product.price,
        name: payload.product.name,
        brand: payload.product.brand,
        imageUrl: payload.product.images[0]
      }).catch(console.error);
    } else if (type === 'cart/removeFromCart') {
      const payload = (action as any).payload;
      cartService.removeFromCart(user.id, payload.id, payload.color, payload.size).catch(console.error);
    } else if (type === 'cart/updateQuantity') {
      const payload = (action as any).payload;
      cartService.updateQuantity(user.id, payload.id, payload.color, payload.size, payload.quantity).catch(console.error);
    } else if (type === 'cart/clearCart') {
      cartService.clearCart(user.id).catch(console.error);
    }
  }

  return result;
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    notification: notificationReducer,
    order: orderReducer,
    seller: sellerReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(cartSyncMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
