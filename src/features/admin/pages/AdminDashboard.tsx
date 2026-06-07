import React, { useState } from 'react';
import { 
  Users, Store, Trash2, DollarSign, Activity, AlertTriangle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { Coupon } from '../../../types';
import { useToast } from '../../../hooks/useToast';
import { formatCurrency } from '../../../utils/formatters';
import { 
  useAdminStats, 
  useCoupons, 
  useCategories,
  useBanUserMutation, 
  useApproveSellerMutation, 
  useToggleSellerMutation, 
  useAddCouponMutation, 
  useDeleteCouponMutation 
} from '../../../hooks/useQueries';

type TabType = 'overview' | 'users' | 'sellers' | 'categories' | 'coupons';

export const AdminDashboard: React.FC = () => {
  const { showToast } = useToast();

  // States
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Coupon Form
  const [couponCode, setCouponCode] = useState('');
  const [couponVal, setCouponVal] = useState(10);
  const [couponMin, setCouponMin] = useState(50);
  const [couponType, setCouponType] = useState<'percentage' | 'fixed'>('percentage');

  // React Query Hooks
  const { data: adminStats, isLoading: loadingStats } = useAdminStats();
  const { data: couponsList = [], isLoading: loadingCoupons } = useCoupons();
  const { data: categoriesRes = [] } = useCategories();

  const banUserMutation = useBanUserMutation();
  const approveSellerMutation = useApproveSellerMutation();
  const toggleSellerMutation = useToggleSellerMutation();
  const addCouponMutation = useAddCouponMutation();
  const deleteCouponMutation = useDeleteCouponMutation();

  const loading = loadingStats || loadingCoupons;

  const usersList = adminStats?.users || [];
  const sellersList = adminStats?.sellers || [];

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const newCoupon: Coupon = {
      code: couponCode.trim().toUpperCase(),
      discountType: couponType,
      value: couponVal,
      minOrderValue: couponMin,
      description: couponType === 'percentage' 
        ? `${couponVal}% OFF on orders above $${couponMin}`
        : `Flat $${couponVal} off on orders above $${couponMin}`
    };

    addCouponMutation.mutate(newCoupon, {
      onSuccess: () => {
        showToast(`Coupon ${newCoupon.code} created!`, "success");
        setCouponCode('');
      },
      onError: () => {
        showToast("Failed to create coupon", "error");
      }
    });
  };

  const colors = ['#6366f1', '#a855f7', '#ec4899', '#3b82f6', '#10b981'];

  return (
    <div className="space-y-8 text-left">
      
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-150 dark:border-gray-800 pb-2">
        {['overview', 'users', 'sellers', 'categories', 'coupons'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as TabType)}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer capitalize ${
              activeTab === tab 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TABS: SYSTEM OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {loading || !adminStats ? (
            <div className="py-20 text-center text-xs text-gray-400">Loading stats...</div>
          ) : (
            <>
              {/* KPI metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div className="glass p-5 rounded-2xl border border-gray-250/50 dark:border-gray-800/50 bg-white dark:bg-slate-900/40 text-left flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Overall Revenue</span>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mt-1">
                      {formatCurrency(adminStats.totalRevenue)}
                    </h3>
                  </div>
                  <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>

                <div className="glass p-5 rounded-2xl border border-gray-250/50 dark:border-gray-800/50 bg-white dark:bg-slate-900/40 text-left flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Customers</span>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mt-1">
                      {usersList.length} Accounts
                    </h3>
                  </div>
                  <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
                    <Users className="w-5 h-5" />
                  </div>
                </div>

                <div className="glass p-5 rounded-2xl border border-gray-250/50 dark:border-gray-800/50 bg-white dark:bg-slate-900/40 text-left flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Merchants</span>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mt-1">
                      {sellersList.length} Registered
                    </h3>
                  </div>
                  <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                    <Store className="w-5 h-5" />
                  </div>
                </div>

                <div className="glass p-5 rounded-2xl border border-gray-250/50 dark:border-gray-800/50 bg-white dark:bg-slate-900/40 text-left flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">System Load</span>
                    <h3 className="text-xl font-black text-emerald-500 mt-1">
                      Optimal
                    </h3>
                  </div>
                  <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                    <Activity className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Chart Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue trends chart */}
                <div className="lg:col-span-2 glass p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 bg-white dark:bg-slate-900/40">
                  <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-6 font-sans">Monthly Revenue Trends</h4>
                  <div className="h-64 w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={adminStats.monthlyEarnings}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                        <Bar dataKey="earnings" fill="#a855f7" radius={[6, 6, 0, 0]} name="Earnings ($)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Category Pie Chart */}
                <div className="glass p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 bg-white dark:bg-slate-900/40 flex flex-col justify-between">
                  <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-4">Category Share</h4>
                  <div className="h-44 w-full text-xs relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={adminStats.categorySales}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          dataKey="value"
                        >
                          {adminStats.categorySales.map((entry: { name: string; value: number }, index: number) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-gray-500 pt-4 border-t border-gray-100 dark:border-gray-800/50">
                    {adminStats.categorySales.map((c: { name: string; value: number }, idx: number) => (
                      <div key={c.name} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }} />
                        <span>{c.name} ({c.value}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* System Alerts */}
              <div className="glass p-5 rounded-2xl border border-gray-250/50 dark:border-gray-800/50 bg-white dark:bg-slate-900/40 text-xs space-y-3">
                <h4 className="font-bold uppercase tracking-wider text-gray-400 text-[10px] flex items-center gap-1">
                  <AlertTriangle className="w-4.5 h-4.5 text-amber-500 animate-pulse" /> Active System Notices
                </h4>
                <div className="space-y-2">
                  {adminStats.systemAlerts.map((alert: { id: string; type: string; text: string }) => (
                    <div key={alert.id} className="p-3 bg-gray-100 dark:bg-slate-800/50 rounded-xl flex items-center gap-2 border border-transparent dark:border-gray-850">
                      <span className={`w-2 h-2 rounded-full ${
                        alert.type === 'warning' ? 'bg-amber-500' :
                        alert.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                      }`} />
                      <span className="font-medium">{alert.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* TABS: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">User Accounts Database</h3>
            <p className="text-[11px] text-gray-400">Total registered user accounts: {usersList.length}</p>
          </div>

          <div className="border border-gray-150 dark:border-gray-800 rounded-2xl overflow-hidden bg-white/20 dark:bg-slate-900/20">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100 dark:bg-slate-800 font-bold border-b border-gray-200 dark:border-gray-700 text-gray-400">
                  <th className="p-3.5">Account User</th>
                  <th className="p-3.5">Security Role</th>
                  <th className="p-3.5">Joining Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {usersList.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/10">
                    <td className="p-3.5">
                      <span className="font-bold text-gray-800 dark:text-white">{u.name}</span>
                      <p className="text-[10px] text-gray-400 mt-0.5">{u.email}</p>
                    </td>
                    <td className="p-3.5 font-semibold text-gray-700 dark:text-gray-300">{u.role}</td>
                    <td className="p-3.5 text-gray-400">{u.joiningDate}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        u.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => {
                          banUserMutation.mutate(u.id, {
                            onSuccess: () => {
                              showToast(`User status toggled!`, "info");
                            },
                            onError: () => {
                              showToast("Failed to toggle user status", "error");
                            }
                          });
                        }}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer ${
                          u.status === 'Active' 
                            ? 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-600' 
                            : 'bg-emerald-55/10 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600'
                        }`}
                      >
                        {u.status === 'Active' ? 'Ban User' : 'Unban'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TABS: SELLER MANAGEMENT */}
      {activeTab === 'sellers' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Merchant Partners</h3>
            <p className="text-[11px] text-gray-400">Approve pending applications or modify statuses</p>
          </div>

          <div className="border border-gray-150 dark:border-gray-800 rounded-2xl overflow-hidden bg-white/20 dark:bg-slate-900/20">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100 dark:bg-slate-800 font-bold border-b border-gray-200 dark:border-gray-700 text-gray-400">
                  <th className="p-3.5">Merchant Store</th>
                  <th className="p-3.5">Authorized Email</th>
                  <th className="p-3.5">Joining Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {sellersList.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/10">
                    <td className="p-3.5 font-bold text-gray-850 dark:text-white">{s.name}</td>
                    <td className="p-3.5 text-gray-500">{s.email}</td>
                    <td className="p-3.5 text-gray-400">{s.joiningDate}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        s.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' :
                        s.status === 'Pending' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-rose-500/10 text-rose-500'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center justify-center gap-2">
                        {s.status === 'Pending' && (
                          <button
                            onClick={() => {
                              approveSellerMutation.mutate(s.id, {
                                onSuccess: () => {
                                  showToast(`${s.name} Approved!`, "success");
                                },
                                onError: () => {
                                  showToast("Failed to approve merchant", "error");
                                }
                              });
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => {
                            toggleSellerMutation.mutate(s.id, {
                              onSuccess: () => {
                                showToast("Merchant status toggled", "info");
                              },
                              onError: () => {
                                showToast("Failed to toggle merchant status", "error");
                              }
                            });
                          }}
                          className={`text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer ${
                            s.status === 'Active' 
                              ? 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-600' 
                              : 'bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 text-indigo-600'
                          }`}
                        >
                          {s.status === 'Active' ? 'Suspend' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TABS: CATEGORY SETTINGS */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Global Shop Categories</h3>
            <p className="text-[11px] text-gray-400">Inspect categories and counts in Buynora Catalog</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categoriesRes.map(cat => (
              <div 
                key={cat.id} 
                className="glass p-5 rounded-2xl border border-gray-250/50 dark:border-gray-800/50 bg-white/40 dark:bg-slate-900/40 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img src={cat.image} alt={cat.name} className="w-10 h-10 object-cover rounded-xl" />
                  <div className="text-left">
                    <h5 className="font-bold text-sm text-gray-900 dark:text-white">{cat.name}</h5>
                    <span className="text-[10px] text-gray-400">{cat.itemCount} active products</span>
                  </div>
                </div>
                <button
                  disabled
                  className="p-1.5 hover:bg-rose-500/10 text-gray-400 hover:text-rose-500 rounded-lg cursor-not-allowed"
                  title="Protected category"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TABS: COUPON SETTINGS */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Active Promotion Coupons</h3>
              <p className="text-[11px] text-gray-400">Total active promotional campaigns: {couponsList.length}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            
            {/* Create Coupon form */}
            <form onSubmit={handleAddCoupon} className="glass p-5 rounded-2xl border border-gray-250/50 dark:border-gray-800/50 space-y-4 bg-white/40 dark:bg-slate-900/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Create Coupon Code</h4>
              
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FLASH30"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Value *</label>
                  <input
                    type="number"
                    required
                    value={couponVal}
                    onChange={e => setCouponVal(parseInt(e.target.value) || 0)}
                    className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Type *</label>
                  <select
                    value={couponType}
                    onChange={e => setCouponType(e.target.value as 'percentage' | 'fixed')}
                    className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none font-bold"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Discount ($)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Min Order ($) *</label>
                <input
                  type="number"
                  required
                  value={couponMin}
                  onChange={e => setCouponMin(parseInt(e.target.value) || 0)}
                  className="bg-gray-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-3 rounded-xl shadow cursor-pointer transition-all"
              >
                Create Coupon
              </button>
            </form>

            {/* List */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {couponsList.map(c => (
                <div 
                  key={c.code}
                  className="p-5 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl flex justify-between items-center bg-white/10 dark:bg-slate-900/10"
                >
                  <div className="text-left space-y-1.5">
                    <span className="font-mono font-bold text-sm bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-md">
                      {c.code}
                    </span>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 mt-1">{c.description}</p>
                    <span className="text-[10px] text-gray-400 block">Min order: {formatCurrency(c.minOrderValue)}</span>
                  </div>
                  
                  <button
                    onClick={() => {
                      deleteCouponMutation.mutate(c.code, {
                        onSuccess: () => {
                          showToast(`Coupon ${c.code} deleted`, "info");
                        },
                        onError: () => {
                          showToast("Failed to delete coupon", "error");
                        }
                      });
                    }}
                    className="p-2 text-gray-400 hover:text-rose-500 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
