/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { toggleCompareProduct, removeCompareProduct, clearCompareProducts } from '../redux/cartSlice';
import { Product } from '../types';
import { CompareDrawer } from '../components/CompareDrawer';
import { useToast } from '../hooks/useToast';
import { useProducts, useCategories } from '../hooks/useQueries';

// Subcomponents
import { HeroSection } from '../components/home/HeroSection';
import { CategoriesSection } from '../components/home/CategoriesSection';
import { FlashSaleSection } from '../components/home/FlashSaleSection';
import { TrendingSection } from '../components/home/TrendingSection';
import { OffersSection } from '../components/home/OffersSection';
import { ArrivalsSellersSection } from '../components/home/ArrivalsSellersSection';
import { RecommendationsSection } from '../components/home/RecommendationsSection';
import { RecentlyViewedSection } from '../components/home/RecentlyViewedSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';

export const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const comparedProducts = useAppSelector(state => state.cart.comparedItems);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // React Query queries
  const { data: categories = [] } = useCategories();
  const { data: allProductsRes } = useProducts({ limit: 100 });
  const allProducts = useMemo(() => allProductsRes?.products || [], [allProductsRes]);

  const { data: trendingRes } = useProducts({ isTrending: true, limit: 4 });
  const trending = trendingRes?.products || [];

  const { data: flashSaleRes } = useProducts({ isFlashSale: true, limit: 4 });
  const flashSale = flashSaleRes?.products || [];

  const { data: newArrivalsRes } = useProducts({ isNewArrival: true, limit: 4 });
  const newArrivals = newArrivalsRes?.products || [];

  const { data: bestSellersRes } = useProducts({ isBestSeller: true, limit: 4 });
  const bestSellers = bestSellersRes?.products || [];

  const { data: aiRecommendedRes } = useProducts({ isAiRecommended: true, limit: 4 });
  const aiRecommended = aiRecommendedRes?.products || [];

  // Fetch recently viewed items from localStorage matching against fetched products
  useEffect(() => {
    if (allProducts.length > 0) {
      const list = localStorage.getItem('recentlyViewed');
      if (list) {
        try {
          const ids: string[] = JSON.parse(list);
          const matched = ids.map(id => allProducts.find(p => p.id === id)).filter(Boolean) as Product[];
          setRecentlyViewed(matched.slice(0, 4));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [allProducts]);

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

      {/* 2. FEATURED CATEGORIES */}
      <CategoriesSection categories={categories} />

      {/* 3. FLASH SALE */}
      <FlashSaleSection 
        products={flashSale}
        comparedProducts={comparedProducts}
        onCompareToggle={handleCompareToggle}
      />

      {/* 4. TRENDING PRODUCTS */}
      <TrendingSection 
        products={trending}
        comparedProducts={comparedProducts}
        onCompareToggle={handleCompareToggle}
      />

      {/* 5. DYNAMIC OFFERS / BUNDLES */}
      <OffersSection />

      {/* 6. NEW ARRIVALS & BEST SELLERS */}
      <ArrivalsSellersSection 
        newArrivals={newArrivals}
        bestSellers={bestSellers}
        comparedProducts={comparedProducts}
        onCompareToggle={handleCompareToggle}
      />

      {/* 7. AI RECOMMENDED PRODUCTS */}
      <RecommendationsSection 
        products={aiRecommended}
        comparedProducts={comparedProducts}
        onCompareToggle={handleCompareToggle}
      />

      {/* 8. RECENTLY VIEWED PRODUCTS */}
      <RecentlyViewedSection 
        products={recentlyViewed}
        comparedProducts={comparedProducts}
        onCompareToggle={handleCompareToggle}
      />

      {/* 9. TESTIMONIALS */}
      <TestimonialsSection />

      {/* Global Product Comparison Drawer */}
      <CompareDrawer
        comparedProducts={comparedProducts}
        onRemove={id => dispatch(removeCompareProduct(id))}
        onClear={() => dispatch(clearCompareProducts())}
      />

    </div>
  );
};
