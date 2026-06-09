/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { toggleCompareProduct, removeCompareProduct, clearCompareProducts } from '../../../redux/cartSlice';
import { Product } from '../../../types';
import { CompareDrawer } from '../../../components/CompareDrawer';
import { useToast } from '../../../hooks/useToast';
import { useProducts, useCategories } from '../../../hooks/useQueries';

// Subcomponents
import { HeroSection } from '../../../components/home/HeroSection';
import { FlashSaleSection } from '../../../components/home/FlashSaleSection';
import { TrendingSection } from '../../../components/home/TrendingSection';
import { ArrivalsSellersSection } from '../../../components/home/ArrivalsSellersSection';
import { RecommendationsSection } from '../../../components/home/RecommendationsSection';
import { BrandsSection } from '../../../components/home/BrandsSection';
import { TestimonialsSection } from '../../../components/home/TestimonialsSection';
import { NewsletterSection } from '../../../components/home/NewsletterSection';

export const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const comparedProducts = useAppSelector(state => state.cart.comparedItems);

  // React Query queries
  const { data: categories = [] } = useCategories();
  const { data: allProductsRes } = useProducts({ limit: 100 });
  const allProducts = useMemo(() => allProductsRes?.products || [], [allProductsRes]);

  const { data: trendingRes } = useProducts({ isTrending: true, limit: 8 });
  const trending = trendingRes?.products || [];

  const { data: flashSaleRes } = useProducts({ isFlashSale: true, limit: 8 });
  const flashSale = flashSaleRes?.products || [];

  const { data: newArrivalsRes } = useProducts({ isNewArrival: true, limit: 8 });
  const newArrivals = newArrivalsRes?.products || [];

  const { data: bestSellersRes } = useProducts({ isBestSeller: true, limit: 8 });
  const bestSellers = bestSellersRes?.products || [];

  const { data: aiRecommendedRes } = useProducts({ isAiRecommended: true, limit: 8 });
  const aiRecommended = aiRecommendedRes?.products || [];

  // Recently viewed section has been moved to Navbar

  const handleCompareToggle = (product: Product) => {
    if (comparedProducts.some(p => p.id === product.id)) {
      dispatch(removeCompareProduct(product.id));
      showToast(`${product.name} removed from comparison list`, 'info');
    } else {
      if (comparedProducts.length >= 3) {
        showToast("You can compare up to 3 products at a time.", 'error');
        return;
      }
      dispatch(toggleCompareProduct(product));
      showToast(`${product.name} added to comparison list!`, 'success');
    }
  };

  return (
    <div className="space-y-16 pb-12">
      
      {/* 1. HERO CAROUSEL BANNER */}
      <HeroSection />

      {/* 2. AI RECOMMENDED PRODUCTS */}
      <RecommendationsSection 
        products={aiRecommended}
        comparedProducts={comparedProducts}
        onCompareToggle={handleCompareToggle}
      />

      {/* 3. HOT TRENDING */}
      <TrendingSection 
        products={trending}
        comparedProducts={comparedProducts}
        onCompareToggle={handleCompareToggle}
      />

      {/* 4. FLASH SALE */}
      <FlashSaleSection 
        products={flashSale}
        comparedProducts={comparedProducts}
        onCompareToggle={handleCompareToggle}
      />

      {/* 5. NEW ARRIVALS & BEST SELLERS (stacked full-width internally) */}
      <ArrivalsSellersSection 
        newArrivals={newArrivals}
        bestSellers={bestSellers}
        comparedProducts={comparedProducts}
        onCompareToggle={handleCompareToggle}
      />

      {/* 6. BRANDS */}
      <BrandsSection />

      {/* 7. TESTIMONIALS */}
      <TestimonialsSection />

      {/* 8. NEWSLETTER */}
      <NewsletterSection />

      {/* Global Product Comparison Drawer */}
      <CompareDrawer
        comparedProducts={comparedProducts}
        onRemove={id => dispatch(removeCompareProduct(id))}
        onClear={() => dispatch(clearCompareProducts())}
      />

    </div>
  );
};
