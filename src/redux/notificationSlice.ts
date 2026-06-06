import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserNotification } from '../types';

export interface NotificationState {
  notifications: UserNotification[];
}

const initialNotifications: UserNotification[] = [
  {
    id: "n_1",
    type: "order",
    title: "Order Delivered!",
    message: "Your shipment for Sony WH-1000XM5 has been delivered to your front door.",
    date: "2026-06-04",
    isRead: false
  },
  {
    id: "n_2",
    type: "price_drop",
    title: "Price Drop Alert",
    message: "An item in your wishlist (Air Max 270 SE) dropped in price by $20!",
    date: "2026-06-03",
    isRead: true
  },
  {
    id: "n_3",
    type: "promo",
    title: "Exclusive Discount Inside",
    message: "Use code BIGNORA30 to get an extra 30% off on premium listings.",
    date: "2026-06-01",
    isRead: false
  }
];

const initialState: NotificationState = {
  notifications: initialNotifications,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Omit<UserNotification, 'id' | 'date' | 'isRead'>>) {
      state.notifications.unshift({
        ...action.payload,
        id: `n_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        isRead: false
      });
    },
    markNotificationRead(state, action: PayloadAction<string>) {
      const n = state.notifications.find(item => item.id === action.payload);
      if (n) {
        n.isRead = true;
      }
    },
    markAllNotificationsRead(state) {
      state.notifications.forEach(n => n.isRead = true);
    },
    clearNotifications(state) {
      state.notifications = [];
    }
  }
});

export const { addNotification, markNotificationRead, markAllNotificationsRead, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
