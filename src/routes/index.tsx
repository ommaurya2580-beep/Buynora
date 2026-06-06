import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { MainLayout } from '../layouts/MainLayout';
import { SellerLayout } from '../layouts/SellerLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { AuthLayout } from '../layouts/AuthLayout';

// Pages
import { Home } from '../pages/Home';
import { ProductListing } from '../pages/ProductListing';
import { ProductDetail } from '../pages/ProductDetail';
import { Cart } from '../pages/Cart';
import { Checkout } from '../pages/Checkout';
import { Dashboard } from '../pages/Dashboard';
import { TrackOrder } from '../pages/TrackOrder';
import { Wishlist } from '../pages/Wishlist';
import { SellerDashboard } from '../pages/SellerDashboard';
import { AdminDashboard } from '../pages/AdminDashboard';
import { Auth } from '../pages/Auth';
import { StaticPages } from '../pages/StaticPages';
import { NotFound } from '../pages/NotFound';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. Main Navigation Shop Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<ProductListing />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="track/:id" element={<TrackOrder />} />
        <Route path="wishlist" element={<Wishlist />} />
        
        {/* Support Pages */}
        <Route path="about" element={<StaticPages />} />
        <Route path="contact" element={<StaticPages />} />
        <Route path="faq" element={<StaticPages />} />
        <Route path="privacy" element={<StaticPages />} />
        <Route path="terms" element={<StaticPages />} />

        {/* 404 Catch All */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* 2. Seller / Merchant Routes */}
      <Route path="/seller" element={<SellerLayout />}>
        <Route index element={<SellerDashboard />} />
        <Route path="products" element={<SellerDashboard />} />
        <Route path="orders" element={<SellerDashboard />} />
      </Route>

      {/* 3. System Administrator Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminDashboard />} />
        <Route path="sellers" element={<AdminDashboard />} />
        <Route path="categories" element={<AdminDashboard />} />
        <Route path="coupons" element={<AdminDashboard />} />
      </Route>

      {/* 4. Guest / Auth Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login" element={<Auth />} />
        <Route path="register" element={<Auth />} />
        <Route path="forgot" element={<Auth />} />
        <Route path="verify" element={<Auth />} />
        <Route path="reset" element={<Auth />} />
      </Route>
    </Routes>
  );
};
