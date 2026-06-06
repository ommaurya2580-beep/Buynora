import { UserRole } from '../constants';

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
  role: UserRole;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  likes: number;
  verifiedPurchaser: boolean;
}

export interface QnA {
  id: string;
  question: string;
  answer: string;
  date: string;
  votes: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  ratingCount: number;
  stock: number;
  images: string[];
  specs: Record<string, string>;
  reviews: Review[];
  qna: QnA[];
  description: string;
  longDescription: string;
  isTrending: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isFlashSale: boolean;
  isAiRecommended: boolean;
  availabilityStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  returnPolicy: string;
  deliveryDays: number;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  description: string;
  minSpend?: number;
  expiryDate?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  date: string;
  expectedDelivery: string;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  trackingStep: number;
  carrier?: string;
  trackingNumber?: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  itemCount: number;
}

export interface Seller {
  id: string;
  name: string;
  email: string;
  status: 'Active' | 'Suspended' | 'Pending';
  sales: number;
  joiningDate: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Banned';
  joiningDate: string;
}

export interface SellerAnalytics {
  revenueData: { month: string; sales: number; revenue: number }[];
  productPerformance: { name: string; sales: number }[];
  recentOrders: { id: string; customer: string; date: string; amount: number; status: string }[];
  topMetrics: {
    totalRevenue: number;
    totalSales: number;
    averageOrderValue: number;
    totalProducts: number;
  };
}

export interface AdminStatistics {
  usersCount: number;
  sellersCount: number;
  totalSalesCount: number;
  totalRevenue: number;
  monthlyEarnings: { name: string; earnings: number }[];
  categorySales: { name: string; value: number }[];
  systemAlerts: { id: string; type: string; text: string }[];
  users: UserAccount[];
  sellers: Seller[];
}
