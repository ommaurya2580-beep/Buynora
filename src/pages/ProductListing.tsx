/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { toggleCompareProduct, removeCompareProduct, clearCompareProducts } from '../redux/cartSlice';
import { Product } from '../types';
import { useProducts, useCategories } from '../hooks/useQueries';
import { CompareDrawer } from '../components/CompareDrawer';
import { useToast } from '../hooks/useToast';
import { formatCurrency } from '../utils/formatters';

// Subcomponents
import { FiltersSidebar } from '../components/plp/FiltersSidebar';
import { SortControls } from '../components/plp/SortControls';
import { ProductGrid } from '../components/plp/ProductGrid';

export const ProductListing: React.FC = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // Redux
  const comparedProducts = useAppSelector(state => state.cart.comparedItems);

  // States
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [brand, setBrand] = useState(searchParams.get('brand') || 'All');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [minRating, setMinRating] = useState<number>(0);
  const [discountOnly, setDiscountOnly] = useState(searchParams.get('discountOnly') === 'true');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');
  const [page, setPage] = useState(1);

  // Sync state with URL search params when they change
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    const urlCat = searchParams.get('category');
    const urlBrand = searchParams.get('brand');
    const urlDiscount = searchParams.get('discountOnly') === 'true';

    if (urlSearch !== null) setSearch(urlSearch);
    if (urlCat !== null) setCategory(urlCat);
    if (urlBrand !== null) setBrand(urlBrand);
    if (urlDiscount !== null) setDiscountOnly(urlDiscount);
    setPage(1); // reset to page 1
  }, [searchParams]);

  // React Query hooks
  const { data: categoriesRes = [] } = useCategories();
  const { data: productsData, isFetching: loading } = useProducts({
    search: search || undefined,
    category: category !== 'All' ? category : undefined,
    brand: brand !== 'All' ? brand : undefined,
    minPrice,
    maxPrice,
    minRating: minRating > 0 ? minRating : undefined,
    discountOnly: discountOnly || undefined,
    inStockOnly: inStockOnly || undefined,
    sortBy,
    page,
    limit: 12
  });

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [category, brand, minPrice, maxPrice, minRating, discountOnly, inStockOnly, sortBy, search]);

  // Sync productsList with fetched productsData
  useEffect(() => {
    if (productsData) {
      if (page === 1) {
        setProductsList(productsData.products);
      } else {
        setProductsList(prev => {
          const prevIds = new Set(prev.map(p => p.id));
          const toAdd = productsData.products.filter(p => !prevIds.has(p.id));
          return [...prev, ...toAdd];
        });
      }
      setTotalCount(productsData.totalCount);
      setHasMore(productsData.hasMore);
    }
  }, [productsData, page]);

  const handleClearFilters = () => {
    setSearch('');
    setCategory('All');
    setBrand('All');
    setMinPrice(0);
    setMaxPrice(2000);
    setMinRating(0);
    setDiscountOnly(false);
    setInStockOnly(false);
    setSortBy('popularity');
    setSearchParams({});
    showToast("Filters cleared!", "info");
  };

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

  const uniqueBrands = ['All', 'Apple', 'Nike', 'Sony', 'Samsung', 'Bose', 'Zara', 'Adidas'];

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-16">
      
      {/* 1. FILTER SIDEBAR (Desktop) */}
      <FiltersSidebar
        category={category}
        setCategory={setCategory}
        brand={brand}
        setBrand={setBrand}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        minRating={minRating}
        setMinRating={setMinRating}
        discountOnly={discountOnly}
        setDiscountOnly={setDiscountOnly}
        inStockOnly={inStockOnly}
        setInStockOnly={setInStockOnly}
        categories={categoriesRes}
        uniqueBrands={uniqueBrands}
        handleClearFilters={handleClearFilters}
      />

      {/* 2. PRODUCTS DISPLAY CONTAINER */}
      <div className="flex-1 space-y-6">
        
        {/* Toolbar: Views, Sorting, Mobile Filter Button */}
        <SortControls
          search={search}
          category={category}
          totalCount={totalCount}
          sortBy={sortBy}
          setSortBy={setSortBy}
          viewMode={viewMode}
          setViewMode={setViewMode}
          setShowFiltersMobile={setShowFiltersMobile}
        />

        {/* Listings Grid/List */}
        <ProductGrid
          productsList={productsList}
          viewMode={viewMode}
          comparedProducts={comparedProducts}
          handleCompareToggle={handleCompareToggle}
          hasMore={hasMore}
          loading={loading}
          setPage={setPage}
          handleClearFilters={handleClearFilters}
        />

      </div>

      {/* 3. MOBILE FILTERS DRAWER */}
      {showFiltersMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowFiltersMobile(false)} />
          <div className="fixed top-0 bottom-0 left-0 w-80 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6 text-left">
              <div className="flex items-center justify-between border-b border-gray-150 pb-3">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Filters</h4>
                <button onClick={() => setShowFiltersMobile(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold uppercase text-gray-400">Categories</h5>
                <div className="flex flex-wrap gap-1.5">
                  {['All', ...categoriesRes.map(c => c.name)].map(catName => (
                    <button
                      key={catName}
                      onClick={() => setCategory(catName)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold border transition-colors ${
                        category === catName 
                          ? 'bg-indigo-500 text-white' 
                          : 'bg-gray-150 text-gray-600'
                      }`}
                    >
                      {catName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold uppercase text-gray-400">Brands</h5>
                <div className="flex flex-wrap gap-1.5">
                  {uniqueBrands.map(brandName => (
                    <button
                      key={brandName}
                      onClick={() => setBrand(brandName)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold border transition-colors ${
                        brand === brandName 
                          ? 'bg-indigo-500 text-white' 
                          : 'bg-gray-150 text-gray-600'
                      }`}
                    >
                      {brandName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold uppercase text-gray-400">Price Range</h5>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="50"
                  value={maxPrice}
                  onChange={e => setMaxPrice(parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
                <span className="text-xs font-bold">{formatCurrency(maxPrice)}</span>
              </div>
            </div>

            <button
              onClick={() => setShowFiltersMobile(false)}
              className="w-full bg-indigo-600 text-white text-xs font-bold py-3 rounded-xl mt-6 cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Global Product Comparison Drawer */}
      <CompareDrawer
        comparedProducts={comparedProducts}
        onRemove={id => dispatch(removeCompareProduct(id))}
        onClear={() => dispatch(clearCompareProducts())}
      />

    </div>
  );
};
