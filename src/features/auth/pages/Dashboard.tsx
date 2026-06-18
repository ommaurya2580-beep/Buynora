import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  User, MapPin, CreditCard, History, Heart, Shield, Gift, Plus, Trash2
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { 
  updateProfile, addAddress, deleteAddress, addPayment, deletePayment
} from '../../../redux/authSlice';
import { addToCart } from '../../../redux/cartSlice';
import { removeFromWishlist } from '../../../redux/wishlistSlice';
import { Product } from '../../../types';
import { cancelOrder } from '../../../redux/orderSlice';
import { useToast } from '../../../hooks/useToast';
import { formatCurrency, formatDate } from '../../../utils/formatters';

type TabType = 'profile' | 'orders' | 'addresses' | 'payment' | 'wishlist' | 'security' | 'rewards';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  // Redux Selectors
  const { user, addresses, paymentMethods, loginHistory } = useAppSelector(state => state.auth);
  const { orders } = useAppSelector(state => state.order);
  const wishlistItems = useAppSelector(state => state.wishlist.wishlistItems);

  // States
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileView, setIsMobileView] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const tabParam = searchParams.get('tab') || 'profile';
  const activeTab: TabType = (
    tabParam === 'payments' ? 'payment' :
    tabParam === 'coupons' ? 'rewards' :
    tabParam === 'settings' ? 'profile' :
    tabParam === 'notifications' ? 'profile' :
    tabParam
  ) as TabType;

  const setActiveTab = (tab: TabType) => {
    setSearchParams({ tab: tab === 'payment' ? 'payments' : tab });
  };

  // Form States: Profile
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Form States: Address
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addrName, setAddrName] = useState('');
  const [addrLine1, setAddrLine1] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrZip, setAddrZip] = useState('');
  const [addrPhone, setAddrPhone] = useState('');

  // Form States: Card
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardBrand, setCardBrand] = useState<'Visa' | 'Mastercard' | 'Amex'>('Visa');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateProfile({ name, email, phone }));
    showToast("Profile updated successfully!", "success");
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrName || !addrLine1 || !addrCity || !addrState || !addrZip || !addrPhone) {
      showToast("Please fill in all address fields", "error");
      return;
    }
    dispatch(addAddress({
      name: addrName,
      line1: addrLine1,
      city: addrCity,
      state: addrState,
      zip: addrZip,
      phone: addrPhone,
      isDefault: addresses.length === 0
    }));
    showToast("Address added successfully!", "success");
    setAddrName('');
    setAddrLine1('');
    setAddrCity('');
    setAddrState('');
    setAddrZip('');
    setAddrPhone('');
    setShowAddressForm(false);
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardHolder || !cardExpiry) {
      showToast("Please fill in all card details", "error");
      return;
    }
    // Format card number to look like saved mock
    const formattedCard = `•••• •••• •••• ${cardNumber.replace(/\s/g, '').slice(-4)}`;
    dispatch(addPayment({
      cardNumber: formattedCard,
      cardHolder: cardHolder.toUpperCase(),
      expiry: cardExpiry,
      brand: cardBrand
    }));
    showToast("Card saved to wallet successfully!", "success");
    setCardNumber('');
    setCardHolder('');
    setCardExpiry('');
    setShowCardForm(false);
  };

  const handleMoveWishlistToCart = (prod: Product) => {
    dispatch(addToCart({ product: prod, quantity: 1 }));
    dispatch(removeFromWishlist(prod.id));
    showToast(`${prod.name} moved to cart!`, "success");
  };

  const handleCancelOrder = (orderId: string) => {
    dispatch(cancelOrder(orderId));
    showToast(`Order ${orderId} has been cancelled`, "info");
  };

  const menuItems = [
    { type: 'profile', label: 'My Profile', icon: User },
    { type: 'orders', label: 'Order History', icon: History },
    { type: 'addresses', label: 'My Addresses', icon: MapPin },
    { type: 'payment', label: 'Payment Wallet', icon: CreditCard },
    { type: 'wishlist', label: 'Wishlist Catalog', icon: Heart },
    { type: 'rewards', label: 'Rewards & Referrals', icon: Gift },
    { type: 'security', label: 'Security Logs', icon: Shield },
  ] as const;

  if (isMobileView && !searchParams.get('tab')) {
    return (
      <div className="w-full space-y-6 pb-20">
        <div>
          <h1 className="text-2xl font-black text-text-primary">My Account</h1>
          <p className="text-xs text-gray-500">Manage orders, addresses and reward details</p>
        </div>

        {/* User Card */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 text-white flex items-center gap-4 relative overflow-hidden shadow-xl">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="w-14 h-14 rounded-2xl bg-indigo-650 flex items-center justify-center font-black text-xl text-white shadow-md uppercase">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-base">{user?.name || 'User'}</span>
            <span className="text-xs text-slate-400">{user?.email}</span>
            <span className="inline-flex items-center gap-1 bg-indigo-500/20 text-indigo-300 text-[9px] font-black tracking-widest px-2.5 py-0.5 rounded-full w-max mt-1.5 border border-indigo-400/20 uppercase">
              Buynora Premium
            </span>
          </div>
        </div>

        {/* Menu List */}
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-gray-200/50 dark:border-gray-800/50 rounded-3xl p-4 flex flex-col gap-1.5 shadow-sm text-left">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.type}
                onClick={() => {
                  setActiveTab(item.type);
                  setShowAddressForm(false);
                  setShowCardForm(false);
                }}
                className="flex items-center justify-between px-4 py-3.5 text-xs font-bold text-text-secondary hover:text-text-primary rounded-2xl hover:bg-gray-150 dark:hover:bg-slate-800/40 cursor-pointer border-b border-gray-150/20 dark:border-slate-800/20 last:border-0 transition-colors"
              >
                <span className="flex items-center gap-3.5">
                  <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <span>{item.label}</span>
                </span>
                <span className="text-gray-400 font-light">&rarr;</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-16 text-left items-start">
      
      {/* Navigation sidebar */}
      <aside className="w-full lg:w-64 glass p-4 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 flex-shrink-0 bg-white/40 dark:bg-slate-900/40 hidden lg:block">
        <div className="flex flex-col gap-1 w-full">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.type;
            return (
              <button
                key={item.type}
                onClick={() => {
                  setActiveTab(item.type);
                  setShowAddressForm(false);
                  setShowCardForm(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl cursor-pointer transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-text-inverted shadow-lg shadow-indigo-600/10' 
                    : 'hover:bg-gray-100 dark:hover:bg-slate-800/50 text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 w-full glass p-6 md:p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 bg-bg-surface/40 min-h-[460px]">
        {isMobileView && (
          <button 
            onClick={() => setSearchParams({})}
            className="flex items-center gap-1.5 text-xs font-black text-indigo-650 dark:text-indigo-400 mb-6 cursor-pointer hover:underline"
          >
            &larr; Back to Account Menu
          </button>
        )}
        
        {/* TABS: PROFILE EDITOR */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-text-primary">Profile Details</h3>
              <p className="text-[11px] text-gray-400">Update your account email and personal coordinates</p>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="bg-gray-100 dark:bg-slate-800 text-xs px-4 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="bg-gray-100 dark:bg-slate-800 text-xs px-4 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400">Phone Coordinate</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="bg-gray-100 dark:bg-slate-800 text-xs px-4 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
                />
              </div>

              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-text-inverted text-xs font-bold py-2.5 px-5 rounded-xl shadow cursor-pointer transition-all hover:scale-105"
              >
                Save Details
              </button>
            </form>
          </div>
        )}

        {/* TABS: ORDER HISTORY */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-text-primary">Order History</h3>
              <p className="text-[11px] text-gray-400">Track current shipping status and check previous receipts</p>
            </div>

            <div className="space-y-4">
              {orders.length === 0 ? (
                <p className="text-xs text-gray-400">You haven't placed any orders yet.</p>
              ) : (
                orders.map(order => (
                  <div 
                    key={order.id} 
                    className="p-5 border border-gray-150 dark:border-gray-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/20 dark:bg-slate-900/20"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-text-primary">{order.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500' :
                          order.status === 'Cancelled' ? 'bg-rose-500/10 text-rose-500' :
                          'bg-indigo-500/10 text-indigo-500'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400">Placed on {formatDate(order.date)} | Total: <span className="font-bold text-text-secondary">{formatCurrency(order.total)}</span></p>
                      <p className="text-[11px] text-gray-500">Items: {order.items.map(item => `${item.product.name} (x${item.quantity})`).join(', ')}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/track/${order.id}`)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-text-inverted text-[11px] font-bold px-4 py-2 rounded-lg cursor-pointer"
                      >
                        Track Shipment
                      </button>
                      {order.status === 'Processing' && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 text-rose-600 text-[11px] font-bold px-4 py-2 rounded-lg cursor-pointer"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TABS: ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-text-primary">Shipping Addresses</h3>
                <p className="text-[11px] text-gray-400">Manage your shipping coordinates and default options</p>
              </div>
              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="bg-indigo-600 hover:bg-indigo-700 text-text-inverted text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add New
              </button>
            </div>

            {/* Address Builder Form */}
            {showAddressForm && (
              <form onSubmit={handleAddAddress} className="p-5 border border-indigo-500/10 rounded-2xl bg-indigo-500/[0.01] space-y-4 max-w-lg">
                <input
                  type="text"
                  placeholder="Address Label (e.g. Home, Office)"
                  required
                  value={addrName}
                  onChange={e => setAddrName(e.target.value)}
                  className="bg-gray-100 dark:bg-slate-800 text-xs px-4 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
                />
                <input
                  type="text"
                  placeholder="Street Address Line 1"
                  required
                  value={addrLine1}
                  onChange={e => setAddrLine1(e.target.value)}
                  className="bg-gray-100 dark:bg-slate-800 text-xs px-4 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    required
                    value={addrCity}
                    onChange={e => setAddrCity(e.target.value)}
                    className="bg-gray-100 dark:bg-slate-800 text-xs px-4 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    required
                    value={addrState}
                    onChange={e => setAddrState(e.target.value)}
                    className="bg-gray-100 dark:bg-slate-800 text-xs px-4 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Zip Code"
                    required
                    value={addrZip}
                    onChange={e => setAddrZip(e.target.value)}
                    className="bg-gray-100 dark:bg-slate-800 text-xs px-4 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    required
                    value={addrPhone}
                    onChange={e => setAddrPhone(e.target.value)}
                    className="bg-gray-100 dark:bg-slate-800 text-xs px-4 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-text-inverted text-xs font-bold py-2.5 px-5 rounded-xl cursor-pointer"
                  >
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="text-xs text-gray-500 hover:bg-gray-150 px-4 py-2.5 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map(addr => (
                <div 
                  key={addr.id}
                  className="p-5 border border-gray-150 dark:border-gray-800 rounded-2xl flex flex-col justify-between gap-4 relative bg-white/20 dark:bg-slate-900/20"
                >
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-text-primary">{addr.name}</span>
                      {addr.isDefault && (
                        <span className="bg-indigo-500/10 text-indigo-500 font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 mt-1">{addr.line1}, {addr.city}, {addr.state} - {addr.zip}</p>
                    <span className="text-gray-400 block">Phone: {addr.phone}</span>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800/50">
                    <button
                      onClick={() => dispatch(deleteAddress(addr.id))}
                      className="p-2 text-gray-400 hover:text-rose-500 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TABS: WALLET */}
        {activeTab === 'payment' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-text-primary">Credit Cards Wallet</h3>
                <p className="text-[11px] text-gray-400">Save and manage your checkout payment cards</p>
              </div>
              <button
                onClick={() => setShowCardForm(!showCardForm)}
                className="bg-indigo-600 hover:bg-indigo-700 text-text-inverted text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Card
              </button>
            </div>

            {/* Card Builder Form */}
            {showCardForm && (
              <form onSubmit={handleAddCard} className="p-5 border border-indigo-500/10 rounded-2xl bg-indigo-500/[0.01] space-y-4 max-w-lg">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    maxLength={16}
                    placeholder="Card Number (16 Digits)"
                    required
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value.replace(/\D/g, ''))}
                    className="bg-gray-100 dark:bg-slate-800 text-xs px-4 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
                  />
                  <select
                    value={cardBrand}
                    onChange={e => setCardBrand(e.target.value as 'Visa' | 'Mastercard' | 'Amex')}
                    className="bg-gray-100 dark:bg-slate-800 text-xs px-3 py-2 rounded-xl border border-transparent focus:border-indigo-500 outline-none font-bold"
                  >
                    <option value="Visa">Visa</option>
                    <option value="Mastercard">Mastercard</option>
                    <option value="Amex">Amex</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Card Holder Name"
                    required
                    value={cardHolder}
                    onChange={e => setCardHolder(e.target.value)}
                    className="bg-gray-100 dark:bg-slate-800 text-xs px-4 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
                  />
                  <input
                    type="text"
                    placeholder="Expiry (MM/YY)"
                    required
                    value={cardExpiry}
                    onChange={e => setCardExpiry(e.target.value)}
                    className="bg-gray-100 dark:bg-slate-800 text-xs px-4 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-text-inverted text-xs font-bold py-2.5 px-5 rounded-xl cursor-pointer"
                  >
                    Save Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCardForm(false)}
                    className="text-xs text-gray-500 hover:bg-gray-150 px-4 py-2.5 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map(card => (
                <div 
                  key={card.id}
                  className="p-5 border border-gray-150 dark:border-gray-800 rounded-2xl flex items-center justify-between bg-gradient-to-br from-slate-900 to-slate-950 text-text-inverted relative shadow-lg overflow-hidden h-36"
                >
                  <div className="space-y-4 flex flex-col justify-between h-full">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">{card.brand} Wallet</span>
                    <span className="text-sm font-black font-mono tracking-widest">{card.cardNumber}</span>
                    <div className="flex gap-8 text-[9px] uppercase text-slate-400 font-medium">
                      <div>
                        <span>Holder</span>
                        <p className="font-bold text-text-inverted mt-0.5">{card.cardHolder}</p>
                      </div>
                      <div>
                        <span>Expiry</span>
                        <p className="font-bold text-text-inverted mt-0.5">{card.expiry}</p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => dispatch(deletePayment(card.id))}
                    className="self-start p-1.5 hover:bg-white/10 rounded-full cursor-pointer text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TABS: WISHLIST CATALOG */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-text-primary">Wishlist Catalog</h3>
              <p className="text-[11px] text-gray-400">Products saved for purchasing later</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {wishlistItems.length === 0 ? (
                <p className="text-xs text-gray-400">Your wishlist is empty.</p>
              ) : (
                wishlistItems.map((item: Product) => (
                  <div 
                    key={item.id} 
                    className="p-4 rounded-xl border border-gray-150 dark:border-gray-800 flex flex-col justify-between h-full bg-white/20 dark:bg-slate-900/20"
                  >
                    <div className="space-y-3">
                      <img src={item.images[0]} alt={item.name} className="w-full aspect-square object-cover rounded-xl" />
                      <div className="text-left">
                        <span className="text-[10px] font-bold text-indigo-500 block uppercase">{item.brand}</span>
                        <h5 className="font-bold text-xs line-clamp-1">{item.name}</h5>
                        <span className="text-xs font-black">{formatCurrency(item.price)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                      <button
                        onClick={() => handleMoveWishlistToCart(item)}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-text-inverted text-xs font-bold py-2 rounded-lg cursor-pointer"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => dispatch(removeFromWishlist(item.id))}
                        className="p-2 text-gray-400 hover:text-rose-500 rounded-lg cursor-pointer animate-pulse"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TABS: REWARDS & REFERRALS */}
        {activeTab === 'rewards' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-text-primary">Rewards Hub</h3>
              <p className="text-[11px] text-gray-400">Redeem points for direct checkout cash discounts</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Points Card */}
              <div className="p-6 rounded-2xl border border-indigo-500/10 bg-indigo-500/[0.01] flex flex-col justify-between min-h-[140px]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Points Balance</span>
                  <Gift className="w-5 h-5 text-indigo-500 animate-bounce" />
                </div>
                <div className="my-3 text-left">
                  <span className="text-3xl font-black text-text-primary">{user?.points || 0}</span>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Equivalent to <span className="font-bold text-text-secondary">${((user?.points || 0) * 0.1).toFixed(2)}</span> cash discount
                  </p>
                </div>
              </div>

              {/* Referral Card */}
              <div className="p-6 rounded-2xl border border-purple-500/10 bg-purple-500/[0.01] flex flex-col justify-between min-h-[140px]">
                <span className="text-xs font-bold text-purple-500 uppercase tracking-widest">Your Referral Code</span>
                <div className="my-2.5 p-2.5 bg-gray-100 dark:bg-slate-800 rounded-xl font-mono text-center font-bold text-sm text-text-primary border border-gray-200/50 dark:border-gray-700/50 select-all cursor-pointer">
                  {user?.referralCode}
                </div>
                <p className="text-[10px] text-gray-400">Share with friends to earn 150 points ($15) per signup!</p>
              </div>

            </div>
          </div>
        )}

        {/* TABS: SECURITY LOGS */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-text-primary">Security & Login Logs</h3>
              <p className="text-[11px] text-gray-400">Audit previous browser sessions and access logins</p>
            </div>

            <div className="border border-gray-150 dark:border-gray-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100 dark:bg-slate-800 font-bold border-b border-gray-200 dark:border-gray-700">
                    <th className="p-3.5">Log Date</th>
                    <th className="p-3.5">Device Agent</th>
                    <th className="p-3.5">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {loginHistory.map((log, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/10">
                      <td className="p-3.5 text-gray-400">{log.date}</td>
                      <td className="p-3.5 font-semibold text-text-secondary">{log.device}</td>
                      <td className="p-3.5 font-mono text-gray-400">{log.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
