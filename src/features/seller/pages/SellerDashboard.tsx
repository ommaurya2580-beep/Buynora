import React, { useState } from 'react';
import { 
  Plus, Edit2, Trash2, Box, TrendingUp,
  DollarSign, PackageCheck
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend 
} from 'recharts';
import { Product } from '../../../types';
import { useToast } from '../../../hooks/useToast';
import { formatCurrency } from '../../../utils/formatters';
import { Modal } from '../../../components/Modal';
import { 
  useProducts, 
  useSellerAnalytics, 
  useAddProductMutation, 
  useUpdateProductMutation, 
  useDeleteProductMutation 
} from '../../../hooks/useQueries';

export const SellerDashboard: React.FC = () => {
  const { showToast } = useToast();

  // States
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders'>('analytics');

  // Modal form states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [prodName, setProdName] = useState('');
  const [prodBrand, setProdBrand] = useState('');
  const [prodCat, setProdCat] = useState('Electronics');
  const [prodSub, setProdSub] = useState('');
  const [prodPrice, setProdPrice] = useState(0);
  const [prodOrig, setProdOrig] = useState(0);
  const [prodStock, setProdStock] = useState(10);
  const [prodImg, setProdImg] = useState('');
  const [prodDesc, setProdDesc] = useState('');

  // React Query hooks
  const { data: productsRes, isLoading: loadingProducts } = useProducts({ limit: 100 });
  const catalog = productsRes?.products || [];

  const { data: analyticsData, isLoading: loadingAnalytics } = useSellerAnalytics();

  const addProductMutation = useAddProductMutation();
  const updateProductMutation = useUpdateProductMutation();
  const deleteProductMutation = useDeleteProductMutation();

  const loading = loadingProducts || loadingAnalytics;

  const openAddModal = () => {
    setEditingProduct(null);
    setProdName('');
    setProdBrand('');
    setProdCat('Electronics');
    setProdSub('');
    setProdPrice(0);
    setProdOrig(0);
    setProdStock(10);
    setProdImg('');
    setProdDesc('');
    setShowProductModal(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdBrand(p.brand);
    setProdCat(p.category);
    setProdSub(p.subcategory);
    setProdPrice(p.price);
    setProdOrig(p.originalPrice);
    setProdStock(p.stock);
    setProdImg(p.images[0]);
    setProdDesc(p.description);
    setShowProductModal(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(id, {
        onSuccess: () => {
          showToast("Product deleted from catalog", "info");
        },
        onError: () => {
          showToast("Failed to delete product", "error");
        }
      });
    }
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodBrand || !prodSub || !prodImg) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    const discountPercentage = prodOrig > prodPrice 
      ? Math.round(((prodOrig - prodPrice) / prodOrig) * 100)
      : 0;

    if (editingProduct) {
      // Edit
      const updated: Partial<Product> = {
        name: prodName,
        brand: prodBrand,
        category: prodCat,
        subcategory: prodSub,
        price: prodPrice,
        originalPrice: prodOrig,
        discountPercentage,
        stock: prodStock,
        images: [prodImg, ...editingProduct.images.slice(1)],
        description: prodDesc,
        availabilityStatus: prodStock === 0 ? 'Out of Stock' : (prodStock < 5 ? 'Low Stock' : 'In Stock')
      };
      updateProductMutation.mutate({ id: editingProduct.id, product: updated }, {
        onSuccess: () => {
          showToast("Product updated successfully!", "success");
          setShowProductModal(false);
        },
        onError: () => {
          showToast("Failed to update product", "error");
        }
      });
    } else {
      // Add New
      const newProd: Omit<Product, 'id' | 'reviews' | 'qna'> = {
        name: prodName,
        brand: prodBrand,
        category: prodCat,
        subcategory: prodSub,
        price: prodPrice,
        originalPrice: prodOrig,
        discountPercentage,
        stock: prodStock,
        images: [prodImg],
        specs: { "Model Year": "2026", "Warranty": "1-Year Warranty" },
        rating: 5,
        ratingCount: 0,
        description: prodDesc,
        longDescription: prodDesc,
        isTrending: false,
        isNewArrival: true,
        isBestSeller: false,
        isFlashSale: false,
        isAiRecommended: false,
        availabilityStatus: prodStock === 0 ? 'Out of Stock' : (prodStock < 5 ? 'Low Stock' : 'In Stock'),
        returnPolicy: "30-day standard return policy.",
        deliveryDays: 3
      };
      addProductMutation.mutate(newProd, {
        onSuccess: () => {
          showToast("New product added to catalog!", "success");
          setShowProductModal(false);
        },
        onError: () => {
          showToast("Failed to add product", "error");
        }
      });
    }
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* Tab Selectors */}
      <div className="flex gap-2 border-b border-gray-150 dark:border-gray-800 pb-2">
        {['analytics', 'products', 'orders'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'analytics' | 'products' | 'orders')}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer capitalize ${
              activeTab === tab 
                ? 'bg-indigo-600 text-white' 
                : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TABS: ANALYTICS OVERVIEW */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {loading || !analyticsData ? (
            <div className="py-20 text-center text-xs text-gray-400">Loading analytics...</div>
          ) : (
            <>
              {/* Top KPI Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div className="glass p-5 rounded-2xl border border-gray-250/50 dark:border-gray-800/50 bg-white dark:bg-slate-900/40 text-left flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Sales</span>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mt-1">
                      {formatCurrency(analyticsData.topMetrics.totalRevenue)}
                    </h3>
                  </div>
                  <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>

                <div className="glass p-5 rounded-2xl border border-gray-250/50 dark:border-gray-800/50 bg-white dark:bg-slate-900/40 text-left flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Products Sold</span>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mt-1">
                      {analyticsData.topMetrics.totalSales} units
                    </h3>
                  </div>
                  <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
                    <PackageCheck className="w-5 h-5" />
                  </div>
                </div>

                <div className="glass p-5 rounded-2xl border border-gray-250/50 dark:border-gray-800/50 bg-white dark:bg-slate-900/40 text-left flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Average Order</span>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mt-1">
                      {formatCurrency(analyticsData.topMetrics.averageOrderValue)}
                    </h3>
                  </div>
                  <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>

                <div className="glass p-5 rounded-2xl border border-gray-250/50 dark:border-gray-800/50 bg-white dark:bg-slate-900/40 text-left flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Active Inventory</span>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mt-1">
                      {analyticsData.topMetrics.totalProducts} listings
                    </h3>
                  </div>
                  <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                    <Box className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Sales Chart using Recharts */}
              <div className="glass p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 bg-white dark:bg-slate-900/40">
                <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-6">Revenue and Sales Performance</h4>
                <div className="h-64 w-full text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData.revenueData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="month" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} name="Revenue ($)" />
                      <Line type="monotone" dataKey="sales" stroke="#8b5cf6" strokeWidth={2} name="Units Sold" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* TABS: PRODUCT INVENTORY CRUD */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Active Product Listings</h3>
              <p className="text-[11px] text-gray-400">Total active listings in global catalog: {catalog.length}</p>
            </div>
            <button
              onClick={openAddModal}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>

          <div className="border border-gray-150 dark:border-gray-800 rounded-2xl overflow-hidden bg-white/20 dark:bg-slate-900/20">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100 dark:bg-slate-800 font-bold border-b border-gray-200 dark:border-gray-700 text-gray-400">
                    <th className="p-3.5">Image</th>
                    <th className="p-3.5">Product Name</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Stock</th>
                    <th className="p-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {catalog.map(prod => (
                    <tr key={prod.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/10">
                      <td className="p-3.5">
                        <img src={prod.images[0]} alt="thumb" className="w-10 h-10 object-cover rounded-lg" />
                      </td>
                      <td className="p-3.5 font-bold text-gray-800 dark:text-white">
                        {prod.name}
                        <span className="block text-[10px] text-gray-400 font-medium">{prod.brand}</span>
                      </td>
                      <td className="p-3.5 text-gray-500">{prod.category}</td>
                      <td className="p-3.5 font-bold text-gray-900 dark:text-white">{formatCurrency(prod.price)}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          prod.stock === 0 ? 'bg-rose-500/15 text-rose-500' :
                          prod.stock < 5 ? 'bg-amber-500/15 text-amber-500' :
                          'bg-emerald-500/15 text-emerald-500'
                        }`}>
                          {prod.stock === 0 ? 'Out of Stock' : `${prod.stock} left`}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(prod)}
                            className="p-1.5 text-indigo-500 hover:bg-indigo-500/10 rounded-lg cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TABS: MERCHANT ORDER LOGS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Merchant Order Logs</h3>
            <p className="text-[11px] text-gray-400">View customer purchases containing your listed items</p>
          </div>

          {loading || !analyticsData ? (
            <div className="py-20 text-center text-xs text-gray-400">Loading order list...</div>
          ) : (
            <div className="border border-gray-150 dark:border-gray-800 rounded-2xl overflow-hidden bg-white/20 dark:bg-slate-900/20">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100 dark:bg-slate-800 font-bold border-b border-gray-200 dark:border-gray-700 text-gray-400">
                    <th className="p-3.5">Order ID</th>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Total Amount</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {analyticsData?.recentOrders.map((ord: { id: string; customer: string; date: string; amount: number; status: string }) => (
                    <tr key={ord.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/10">
                      <td className="p-3.5 font-bold font-mono text-gray-800 dark:text-white">{ord.id}</td>
                      <td className="p-3.5">{ord.customer}</td>
                      <td className="p-3.5 text-gray-400">{ord.date}</td>
                      <td className="p-3.5 font-bold">{formatCurrency(ord.amount)}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500' :
                          'bg-indigo-500/10 text-indigo-500'
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Product Add/Edit Modal */}
      <Modal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        title={editingProduct ? "Edit Product Details" : "Add Product to Global Catalog"}
        size="md"
      >
        <form onSubmit={handleProductSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Product Name *</label>
              <input
                type="text"
                required
                value={prodName}
                onChange={e => setProdName(e.target.value)}
                className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2 rounded-xl outline-none focus:border-indigo-500 border border-transparent"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Brand *</label>
              <input
                type="text"
                required
                value={prodBrand}
                onChange={e => setProdBrand(e.target.value)}
                className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2 rounded-xl outline-none focus:border-indigo-500 border border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Category *</label>
              <select
                value={prodCat}
                onChange={e => setProdCat(e.target.value)}
                className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none font-bold"
              >
                <option value="Electronics">Electronics</option>
                <option value="Footwear">Footwear</option>
                <option value="Apparel">Apparel</option>
                <option value="Accessories">Accessories</option>
                <option value="Home & Living">Home & Living</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Subcategory *</label>
              <input
                type="text"
                required
                placeholder="e.g. Smartphones, Sneakers"
                value={prodSub}
                onChange={e => setProdSub(e.target.value)}
                className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2 rounded-xl outline-none focus:border-indigo-500 border border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Sale Price ($) *</label>
              <input
                type="number"
                required
                value={prodPrice || ''}
                onChange={e => setProdPrice(parseFloat(e.target.value) || 0)}
                className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Original Price ($)</label>
              <input
                type="number"
                value={prodOrig || ''}
                onChange={e => setProdOrig(parseFloat(e.target.value) || 0)}
                className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Stock *</label>
              <input
                type="number"
                required
                value={prodStock || ''}
                onChange={e => setProdStock(parseInt(e.target.value) || 0)}
                className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Image URL *</label>
            <input
              type="url"
              required
              placeholder="Unsplash image URL address"
              value={prodImg}
              onChange={e => setProdImg(e.target.value)}
              className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2 rounded-xl outline-none focus:border-indigo-500 border border-transparent"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Description *</label>
            <textarea
              required
              rows={3}
              value={prodDesc}
              onChange={e => setProdDesc(e.target.value)}
              className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2 rounded-xl outline-none focus:border-indigo-500 border border-transparent resize-none"
            />
          </div>

          <div className="flex gap-2.5 justify-end pt-3">
            <button
              type="button"
              onClick={() => setShowProductModal(false)}
              className="text-xs text-gray-500 hover:bg-gray-100 px-4 py-2 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
            >
              {editingProduct ? "Save Changes" : "Create Listing"}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
