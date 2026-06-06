import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Address {
  id: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  brand: 'Visa' | 'Mastercard' | 'Amex';
}

export interface UserNotification {
  id: string;
  type: 'order' | 'price_drop' | 'system' | 'promo';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  referralCode: string;
  points: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  notifications: UserNotification[];
  loginHistory: { date: string; device: string; ip: string }[];
}

const initialAddresses: Address[] = [
  {
    id: "addr_1",
    name: "John Doe (Home)",
    line1: "123 Silicon Boulevard",
    line2: "Apt 4B",
    city: "San Jose",
    state: "CA",
    zip: "95112",
    phone: "+1 (555) 019-2834",
    isDefault: true
  },
  {
    id: "addr_2",
    name: "John Doe (Office)",
    line1: "500 Infinite Loop",
    city: "Cupertino",
    state: "CA",
    zip: "95014",
    phone: "+1 (555) 019-9988",
    isDefault: false
  }
];

const initialPayments: PaymentMethod[] = [
  {
    id: "card_1",
    cardNumber: "•••• •••• •••• 4242",
    cardHolder: "JOHN DOE",
    expiry: "12/28",
    brand: "Visa"
  },
  {
    id: "card_2",
    cardNumber: "•••• •••• •••• 5555",
    cardHolder: "JOHN DOE",
    expiry: "08/30",
    brand: "Mastercard"
  }
];

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

const initialState: AuthState = {
  isAuthenticated: true,
  user: {
    name: "John Doe",
    email: "john.doe@buynora.com",
    phone: "+1 (555) 019-2834",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
    referralCode: "NORA-JD99",
    points: 350
  },
  addresses: initialAddresses,
  paymentMethods: initialPayments,
  notifications: initialNotifications,
  loginHistory: [
    { date: "2026-06-06 10:00 AM", device: "Chrome / Windows 11", ip: "192.168.1.42" },
    { date: "2026-06-05 02:30 PM", device: "Safari / iPhone 15", ip: "172.56.21.99" }
  ]
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser(state, action: PayloadAction<UserProfile>) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logoutUser(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
    updateProfile(state, action: PayloadAction<Partial<UserProfile>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    addAddress(state, action: PayloadAction<Omit<Address, 'id'>>) {
      const id = `addr_${Date.now()}`;
      const newAddress = { ...action.payload, id };
      if (newAddress.isDefault) {
        state.addresses.forEach(addr => addr.isDefault = false);
      }
      state.addresses.push(newAddress);
    },
    updateAddress(state, action: PayloadAction<Address>) {
      const index = state.addresses.findIndex(addr => addr.id === action.payload.id);
      if (index !== -1) {
        if (action.payload.isDefault) {
          state.addresses.forEach(addr => addr.isDefault = false);
        }
        state.addresses[index] = action.payload;
      }
    },
    deleteAddress(state, action: PayloadAction<string>) {
      state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
      if (state.addresses.length > 0 && !state.addresses.some(addr => addr.isDefault)) {
        state.addresses[0].isDefault = true;
      }
    },
    addPayment(state, action: PayloadAction<Omit<PaymentMethod, 'id'>>) {
      const id = `card_${Date.now()}`;
      state.paymentMethods.push({ ...action.payload, id });
    },
    deletePayment(state, action: PayloadAction<string>) {
      state.paymentMethods = state.paymentMethods.filter(card => card.id !== action.payload);
    },
    markAllNotificationsRead(state) {
      state.notifications.forEach(n => n.isRead = true);
    },
    addNotification(state, action: PayloadAction<Omit<UserNotification, 'id' | 'date' | 'isRead'>>) {
      state.notifications.unshift({
        ...action.payload,
        id: `n_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        isRead: false
      });
    },
    addPoints(state, action: PayloadAction<number>) {
      if (state.user) {
        state.user.points += action.payload;
      }
    },
    usePoints(state, action: PayloadAction<number>) {
      if (state.user) {
        state.user.points = Math.max(0, state.user.points - action.payload);
      }
    }
  }
});

export const {
  loginUser,
  logoutUser,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  addPayment,
  deletePayment,
  markAllNotificationsRead,
  addNotification,
  addPoints,
  usePoints
} = authSlice.actions;

export default authSlice.reducer;
