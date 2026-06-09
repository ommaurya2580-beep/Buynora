import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PageLoader } from '../components/Shimmer';

// Layouts
import { MainLayout } from '../layouts/MainLayout';
import { SellerLayout } from '../layouts/SellerLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { AuthLayout } from '../layouts/AuthLayout';

// Dynamic / Lazy Loaded Pages
const Home = lazy(() => import('../features/products/pages/Home').then(m => ({ default: m.Home })));
const ProductListing = lazy(() => import('../features/products/pages/ProductListing').then(m => ({ default: m.ProductListing })));
const ProductDetail = lazy(() => import('../features/products/pages/ProductDetail').then(m => ({ default: m.ProductDetail })));
const Cart = lazy(() => import('../features/cart/pages/Cart').then(m => ({ default: m.Cart })));
const Checkout = lazy(() => import('../features/orders/pages/Checkout').then(m => ({ default: m.Checkout })));
const Dashboard = lazy(() => import('../features/auth/pages/Dashboard').then(m => ({ default: m.Dashboard })));
const TrackOrder = lazy(() => import('../features/orders/pages/TrackOrder').then(m => ({ default: m.TrackOrder })));
const Wishlist = lazy(() => import('../features/wishlist/pages/Wishlist').then(m => ({ default: m.Wishlist })));
const SellerDashboard = lazy(() => import('../features/seller/pages/SellerDashboard').then(m => ({ default: m.SellerDashboard })));
const AdminDashboard = lazy(() => import('../features/admin/pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const Auth = lazy(() => import('../features/auth/pages/Auth').then(m => ({ default: m.Auth })));
const StaticPages = lazy(() => import('../pages/StaticPages').then(m => ({ default: m.StaticPages })));
const NotFound = lazy(() => import('../pages/NotFound').then(m => ({ default: m.NotFound })));
const Unauthorized = lazy(() => import('../pages/Unauthorized').then(m => ({ default: m.Unauthorized })));

// Route Guards
import { ProtectedRoute } from './guards/ProtectedRoute';
import { PublicRoute } from './guards/PublicRoute';
import { AdminRoute } from './guards/AdminRoute';
import { SellerRoute } from './guards/SellerRoute';
import { CustomerRoute } from './guards/CustomerRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* 1. Main Navigation Shop Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<ProductListing />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          
          {/* Protected Routes */}
          <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="dashboard" element={<CustomerRoute><Dashboard /></CustomerRoute>} />
          <Route path="orders" element={<Navigate to="/dashboard?tab=orders" replace />} />
          <Route path="track/:id" element={<ProtectedRoute><TrackOrder /></ProtectedRoute>} />
          <Route path="wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          
          {/* Support Pages */}
          <Route path="about" element={<StaticPages />} />
          <Route path="contact" element={<StaticPages />} />
          <Route path="faq" element={<StaticPages />} />
          <Route path="privacy" element={<StaticPages />} />
          <Route path="terms" element={<StaticPages />} />

          {/* Security Fallbacks */}
          <Route path="unauthorized" element={<Unauthorized />} />

          {/* 404 Catch All */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* 2. Seller / Merchant Routes */}
        <Route path="/seller" element={<SellerRoute><SellerLayout /></SellerRoute>}>
          <Route index element={<SellerDashboard />} />
          <Route path="products" element={<SellerDashboard />} />
          <Route path="orders" element={<SellerDashboard />} />
        </Route>

        {/* 3. System Administrator Routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminDashboard />} />
          <Route path="sellers" element={<AdminDashboard />} />
          <Route path="categories" element={<AdminDashboard />} />
          <Route path="coupons" element={<AdminDashboard />} />
        </Route>

        {/* 4. Guest / Auth Routes */}
        <Route path="/auth" element={<PublicRoute><AuthLayout /></PublicRoute>}>
          <Route index element={<Navigate to="login" replace />} />
          <Route path="login" element={<Auth />} />
          <Route path="register" element={<Auth />} />
          <Route path="forgot" element={<Auth />} />
          <Route path="verify" element={<Auth />} />
          <Route path="reset" element={<Auth />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
