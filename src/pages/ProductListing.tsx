import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  SlidersHorizontal, Grid, List, Search, Sliders, ChevronDown, Check, X,
  ArrowUpDown, Filter, Eye, RefreshCw
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { toggleCompareProduct, removeCompareProduct, clearCompareProducts } from '../redux/cartSlice';
import { apiService, FetchProductsParams } from '../services/api';
import { Product, categories } from '../services/mockDb';
import { ProductCard } from '../components/ProductCard';
import { CompareDrawer } from '../components/CompareDrawer';
import { ShimmerGrid } from '../components/Shimmer';
import { useToast } from '../hooks/useToast';
import { formatCurrency } from '../utils/formatters';

export const ProductListing: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // Redux
  const comparedProducts = useAppSelector(state => state.cart.comparedItems);

  // States
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
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

  // Load products when filters or pages update
  const fetchProductsData = async (isLoadMore: boolean = false) => {
    setLoading(true);
    try {
      const params: FetchProductsParams = {
        search: search || undefined,
        category: category !== 'All' ? category : undefined,
        brand: brand !== 'All' ? brand : undefined,
        minPrice,
        maxPrice,
        minRating: minRating > 0 ? minRating : undefined,
        discountOnly: discountOnly || undefined,
        inStockOnly: inStockOnly || undefined,
        sortBy,
        page: isLoadMore ? page + 1 : 1,
        limit: 12
      };

      const res = await apiService.getProducts(params);

      if (isLoadMore) {
        setProductsList(prev => [...prev, ...res.products]);
        setPage(prev => prev + 1);
      } else {
        setProductsList(res.products);
        setPage(1);
      }

      setTotalCount(res.totalCount);
      setTotalPages(res.totalPages);
      setHasMore(res.hasMore);
    } catch (e) {
      showToast("Error loading products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsData(false);
  }, [category, brand, minPrice, maxPrice, minRating, discountOnly, inStockOnly, sortBy, search]);

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
      <aside className="hidden lg:block w-64 flex-shrink-0 space-y-6">
        <div className="glass rounded-2xl p-5 border border-gray-200/50 dark:border-gray-800/50 bg-white/60 dark:bg-slate-900/60 text-left space-y-6">
          <div className="flex items-center justify-between border-b border-gray-150 dark:border-gray-800 pb-3">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-500" /> Filters
            </h4>
            <button
              onClick={handleClearFilters}
              className="text-[10px] text-indigo-500 font-extrabold hover:underline uppercase tracking-wide cursor-pointer"
            >
              Clear
            </button>
          </div>

          {/* Categories */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Categories</h5>
            <div className="flex flex-col gap-1.5">
              {['All', ...categories.map(c => c.name)].map(catName => (
                <button
                  key={catName}
                  onClick={() => setCategory(catName)}
                  className={`text-left text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer w-full ${
                    category === catName 
                      ? 'bg-indigo-500 text-white' 
                      : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {catName}
                </button>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Brands</h5>
            <div className="flex flex-col gap-1.5">
              {uniqueBrands.map(brandName => (
                <button
                  key={brandName}
                  onClick={() => setBrand(brandName)}
                  className={`text-left text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer w-full ${
                    brand === brandName 
                      ? 'bg-indigo-500 text-white' 
                      : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {brandName}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2.5">
            <div className="flex justify-between text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
              <span>Price Range</span>
              <span className="text-indigo-500 font-black">{formatCurrency(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={maxPrice}
              onChange={e => setMaxPrice(parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>$0</span>
              <span>$2,000</span>
            </div>
          </div>

          {/* Ratings Filter */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Min Rating</h5>
            <div className="flex gap-1">
              {[0, 3, 4, 4.5].map(rating => (
                <button
                  key={rating}
                  onClick={() => setMinRating(rating)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg font-bold border transition-colors cursor-pointer ${
                    minRating === rating 
                      ? 'bg-indigo-500 text-white border-indigo-500' 
                      : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {rating === 0 ? 'Any' : `${rating}★`}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Filters */}
          <div className="space-y-2.5 pt-3 border-t border-gray-150 dark:border-gray-800">
            <label className="flex items-center gap-2.5 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={discountOnly}
                onChange={e => setDiscountOnly(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              Discounted Only
            </label>
            <label className="flex items-center gap-2.5 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={e => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              In Stock Only
            </label>
          </div>
        </div>
      </aside>

      {/* 2. PRODUCTS DISPLAY CONTAINER */}
      <div className="flex-1 space-y-6">
        
        {/* Toolbar: Views, Sorting, Mobile Filter Button */}
        <div className="glass p-4 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/50 dark:bg-slate-900/50">
          
          {/* Header count info */}
          <div className="text-left w-full sm:w-auto">
            <h3 className="text-sm font-bold text-gray-800 dark:text-white">
              {search ? `Search results for "${search}"` : category !== 'All' ? `${category} Products` : 'All Products'}
            </h3>
            <span className="text-[10px] text-gray-400">{totalCount} premium items found</span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
            
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFiltersMobile(true)}
              className="lg:hidden flex items-center gap-1.5 bg-gray-100 dark:bg-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-700 cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" /> Filters
            </button>

            {/* Sorting */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-gray-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-xs font-bold rounded-xl px-3 py-2 outline-none cursor-pointer"
              >
                <option value="popularity">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>

            {/* Grid / List View Toggle */}
            <div className="hidden sm:flex items-center gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white dark:bg-slate-900 text-indigo-500 shadow-sm' : 'text-gray-400'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg cursor-pointer ${
                  viewMode === 'list' ? 'bg-white dark:bg-slate-900 text-indigo-500 shadow-sm' : 'text-gray-400'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Listings */}
        {loading && productsList.length === 0 ? (
          <ShimmerGrid count={8} />
        ) : productsList.length === 0 ? (
          <div className="glass p-12 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 text-center space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">No products match your current filters.</p>
            <button
              onClick={handleClearFilters}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Products grid / list */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {productsList.map(prod => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onCompareToggle={handleCompareToggle}
                    isCompared={comparedProducts.some(p => p.id === prod.id)}
                  />
                ))}
              </div>
            ) : (
              /* List Mode View */
              <div className="space-y-4">
                {productsList.map(prod => (
                  <div 
                    key={prod.id} 
                    className="glass p-4 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white dark:bg-slate-900/40 flex flex-col sm:flex-row gap-4 items-center"
                  >
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-32 h-32 object-cover rounded-xl"
                    />
                    <div className="flex-1 text-left space-y-1.5">
                      <span className="text-[10px] font-bold text-indigo-500 uppercase">{prod.brand}</span>
                      <h4 className="font-bold text-gray-900 dark:text-white">{prod.name}</h4>
                      <p className="text-xs text-gray-500 line-clamp-2">{prod.description}</p>
                      
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {formatCurrency(prod.price)}
                        </span>
                        {prod.discountPercentage > 0 && (
                          <span className="text-xs text-gray-400 line-through">
                            {formatCurrency(prod.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => navigate(`/product/${prod.id}`)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> Details
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Load More/Infinite Scroll Trigger */}
            {hasMore && (
              <div className="flex justify-center pt-6">
                <button
                  disabled={loading}
                  onClick={() => fetchProductsData(true)}
                  className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800 px-6 py-3 rounded-2xl text-xs font-bold shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    "Load More Products"
                  )}
                </button>
              </div>
            )}

          </div>
        )}

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
                  {['All', ...categories.map(c => c.name)].map(catName => (
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
