import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '../../../types';

export interface OrderState {
  orders: Order[];
}

const mockOrders: Order[] = [
  {
    id: "ORD-992384",
    items: [
      {
        product: {
          id: "p3",
          name: "WH-1000XM5 Headphones",
          brand: "Sony",
          category: "Electronics",
          subcategory: "Headphones",
          price: 348,
          originalPrice: 399,
          discountPercentage: 12,
          rating: 4.7,
          ratingCount: 2150,
          stock: 18,
          images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800"],
          specs: {},
          reviews: [],
          qna: [],
          description: "Premium headphones.",
          longDescription: "",
          isTrending: false, isNewArrival: false, isBestSeller: true, isFlashSale: false, isAiRecommended: true,
          availabilityStatus: "In Stock",
          returnPolicy: "",
          deliveryDays: 1
        },
        quantity: 1,
        selectedColor: "Silver"
      }
    ],
    subtotal: 348,
    discount: 0,
    tax: 27.84,
    shipping: 0,
    total: 375.84,
    shippingAddress: {
      id: "addr_1",
      name: "John Doe (Home)",
      line1: "123 Silicon Boulevard",
      city: "San Jose",
      state: "CA",
      zip: "95112",
      phone: "+1 (555) 019-2834",
      isDefault: true
    },
    paymentMethod: {
      id: "card_1",
      cardNumber: "•••• •••• •••• 4242",
      cardHolder: "JOHN DOE",
      expiry: "12/28",
      brand: "Visa"
    },
    date: "2026-06-04",
    expectedDelivery: "2026-06-05",
    status: "Delivered",
    trackingStep: 4,
    carrier: "FedEx Express",
    trackingNumber: "FDX-88291039-US"
  },
  {
    id: "ORD-991204",
    items: [
      {
        product: {
          id: "p5",
          name: "Premium Sportswear Hoodie",
          brand: "Nike",
          category: "Apparel",
          subcategory: "Hoodies",
          price: 85,
          originalPrice: 100,
          discountPercentage: 15,
          rating: 4.5,
          ratingCount: 340,
          stock: 50,
          images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800"],
          specs: {},
          reviews: [],
          qna: [],
          description: "Premium hoodie.",
          longDescription: "",
          isTrending: false, isNewArrival: true, isBestSeller: false, isFlashSale: false, isAiRecommended: true,
          availabilityStatus: "In Stock",
          returnPolicy: "",
          deliveryDays: 4
        },
        quantity: 2,
        selectedColor: "Black",
        selectedSize: "L"
      }
    ],
    subtotal: 170,
    discount: 17,
    tax: 12.24,
    shipping: 9.99,
    total: 175.23,
    shippingAddress: {
      id: "addr_1",
      name: "John Doe (Home)",
      line1: "123 Silicon Boulevard",
      city: "San Jose",
      state: "CA",
      zip: "95112",
      phone: "+1 (555) 019-2834",
      isDefault: true
    },
    paymentMethod: {
      id: "card_2",
      cardNumber: "•••• •••• •••• 5555",
      cardHolder: "JOHN DOE",
      expiry: "08/30",
      brand: "Mastercard"
    },
    date: "2026-06-05",
    expectedDelivery: "2026-06-09",
    status: "Shipped",
    trackingStep: 2,
    carrier: "UPS Ground",
    trackingNumber: "UPS-1Z99A99AA999999999"
  }
];

const initialState: OrderState = {
  orders: mockOrders
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<Order>) {
      state.orders.unshift(action.payload);
    },
    updateTracking(state, action: PayloadAction<{ orderId: string; step: number; status: Order['status'] }>) {
      const order = state.orders.find(o => o.id === action.payload.orderId);
      if (order) {
        order.trackingStep = action.payload.step;
        order.status = action.payload.status;
      }
    },
    cancelOrder(state, action: PayloadAction<string>) {
      const order = state.orders.find(o => o.id === action.payload);
      if (order) {
        order.status = 'Cancelled';
        order.trackingStep = 0;
      }
    }
  }
});

export const { addOrder, updateTracking, cancelOrder } = orderSlice.actions;

export default orderSlice.reducer;
