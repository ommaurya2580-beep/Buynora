import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, ShoppingBag, ArrowRight, Bookmark, MoveRight, 
  Tag, Gift, X
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { 
  removeFromCart, updateQuantity, saveForLaterItem, 
  moveToCartFromSaved, removeSavedItem, applyCartCoupon, 
  removeCartCoupon, applyCartPoints, removeCartPoints 
} from '../redux/cartSlice';
import { useToast } from '../hooks/useToast';
import { formatCurrency } from '../utils/formatters';
import { adminService } from '../services/admin.service';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const { cartItems, savedForLater, appliedCoupon, pointsApplied, pointsDiscount } = useAppSelector(state => state.cart);
  const user = useAppSelector(state => state.auth.user);

  // Local States
  const [couponCode, setCouponCode] = useState('');
  const [usePointsToggle, setUsePointsToggle] = useState(pointsApplied > 0);
  const [verifyingCoupon, setVerifyingCoupon] = useState(false);

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = subtotal * (appliedCoupon.value / 100);
    } else {
      discount = appliedCoupon.value;
    }
  }

  // Cap points discount by subtotal after coupon
  const pointsMaxDiscount = Math.max(0, subtotal - discount);
  const finalPointsDiscount = Math.min(pointsDiscount, pointsMaxDiscount);

  const totalDiscount = discount + finalPointsDiscount;
  const tax = Math.max(0, (subtotal - totalDiscount) * 0.08); // 8% sales tax
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 9.99; // Free shipping over $150
  const orderTotal = Math.max(0, subtotal - totalDiscount + tax + shipping);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setVerifyingCoupon(true);
    try {
      const coupon = await adminService.verifyCoupon(couponCode);
      if (subtotal < coupon.minOrderValue) {
        showToast(`This coupon requires a minimum purchase of ${formatCurrency(coupon.minOrderValue)}`, 'error');
        return;
      }
      dispatch(applyCartCoupon(coupon));
      showToast("Coupon applied successfully!", "success");
      setCouponCode('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Invalid coupon";
      showToast(errorMessage, "error");
    } finally {
      setVerifyingCoupon(false);
    }
  };

  const handlePointsCheckbox = (checked: boolean) => {
    setUsePointsToggle(checked);
    if (checked && user && user.points > 0) {
      // 1 point = $0.10 discount
      const dollarValue = parseFloat((user.points * 0.1).toFixed(2));
      dispatch(applyCartPoints({ points: user.points, dollarValue }));
      showToast(`Applied ${user.points} reward points for $${dollarValue} discount!`, 'success');
    } else {
      dispatch(removeCartPoints());
    }
  };

  const handleCheckoutRedirect = () => {
    if (cartItems.length === 0) {
      showToast("Your cart is empty", "error");
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="space-y-12 pb-16 text-left">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-indigo-500" /> Shopping Cart
        </h1>
        <p className="text-xs text-gray-500">Review your products before checking out</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.length === 0 ? (
            <div className="glass p-12 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 text-center space-y-4">
              <ShoppingBag className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto" />
              <h3 className="font-bold text-gray-800 dark:text-white">Your cart is empty</h3>
              <p className="text-xs text-gray-400">Explore premium shoes, computers and streetwear in our store.</p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-3 rounded-full shadow"
              >
                Browse Shop <MoveRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item, idx) => (
                <div 
                  key={idx}
                  className="glass p-4 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white dark:bg-slate-900/40 flex flex-col sm:flex-row gap-4 items-center justify-between"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-xl"
                  />
                  <div className="flex-1 text-left space-y-1">
                    <span className="text-[10px] font-bold text-indigo-500 uppercase">{item.product.brand}</span>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{item.product.name}</h4>
                    {item.selectedSize && (
                      <span className="text-[10px] text-gray-500 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-bold">
                        Size: {item.selectedSize}
                      </span>
                    )}
                  </div>

                  {/* Quantity and Prices */}
                  <div className="flex items-center gap-6 justify-between w-full sm:w-auto">
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl">
                      <button
                        onClick={() => dispatch(updateQuantity({ id: item.product.id, quantity: item.quantity - 1, color: item.selectedColor, size: item.selectedSize }))}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-bold px-1"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => dispatch(updateQuantity({ id: item.product.id, quantity: item.quantity + 1, color: item.selectedColor, size: item.selectedSize }))}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-bold px-1"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-gray-900 dark:text-white">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                      <p className="text-[10px] text-gray-400">({formatCurrency(item.product.price)} each)</p>
                    </div>

                    {/* Action Panel */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => dispatch(saveForLaterItem({ id: item.product.id, color: item.selectedColor, size: item.selectedSize }))}
                        className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-xl cursor-pointer"
                        title="Save for Later"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => dispatch(removeFromCart({ id: item.product.id, color: item.selectedColor, size: item.selectedSize }))}
                        className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl cursor-pointer"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Order Summary Panel */}
        {cartItems.length > 0 && (
          <div className="space-y-6">
            
            {/* Coupon Code Input */}
            <div className="glass p-5 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 space-y-3 bg-white dark:bg-slate-900/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-indigo-500" /> Apply Coupon
              </h4>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="WELCOME10, SAVE20"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  className="flex-1 bg-gray-150 dark:bg-slate-800 text-xs px-3.5 py-2 rounded-xl outline-none focus:border-indigo-500 border border-transparent font-mono"
                />
                <button
                  type="submit"
                  disabled={verifyingCoupon}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {appliedCoupon && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Coupon applied: <span className="font-bold font-mono">{appliedCoupon.code}</span></span>
                  <button onClick={() => dispatch(removeCartCoupon())} className="cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Reward Points */}
            {user && user.points > 0 && (
              <div className="glass p-5 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 space-y-3 bg-white dark:bg-slate-900/40">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-indigo-500 animate-bounce" /> Reward Points
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    You have <span className="font-bold">{user.points}</span> points ($${(user.points * 0.1).toFixed(2)})
                  </span>
                  <input
                    type="checkbox"
                    checked={usePointsToggle}
                    onChange={e => handlePointsCheckbox(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 border-gray-300"
                  />
                </div>
              </div>
            )}

            {/* Calculations Panel */}
            <div className="glass p-5 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 space-y-4 bg-white dark:bg-slate-900/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Order Summary</h4>
              
              <div className="space-y-2.5 text-xs text-gray-600 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-500 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                {finalPointsDiscount > 0 && (
                  <div className="flex justify-between text-emerald-500 font-semibold">
                    <span>Points Discount</span>
                    <span>-{formatCurrency(finalPointsDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Sales Tax (8%)</span>
                  <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Cost</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] text-gray-400 text-right">Free shipping on orders above $150</p>
                )}
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between items-baseline">
                <span className="text-sm font-bold text-gray-800 dark:text-white">Estimated Total</span>
                <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(orderTotal)}
                </span>
              </div>

              <button
                onClick={handleCheckoutRedirect}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl cursor-pointer shadow-lg shadow-indigo-600/10 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-xs"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>

      {/* 4. SAVED FOR LATER SECTION */}
      {savedForLater.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-lg font-black text-gray-900 dark:text-white border-b border-gray-150 dark:border-gray-800 pb-2">
            Saved for Later ({savedForLater.length})
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {savedForLater.map((item, idx) => (
              <div 
                key={idx}
                className="glass p-4 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 flex flex-col justify-between h-full bg-white dark:bg-slate-900/20"
              >
                <div className="space-y-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full aspect-square object-cover rounded-xl"
                  />
                  <div className="text-left space-y-1">
                    <span className="text-[10px] font-bold text-indigo-500 uppercase">{item.product.brand}</span>
                    <h5 className="font-bold text-xs line-clamp-1">{item.product.name}</h5>
                    <span className="text-xs font-black text-gray-900 dark:text-white">{formatCurrency(item.product.price)}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={() => dispatch(moveToCartFromSaved({ id: item.product.id, color: item.selectedColor, size: item.selectedSize }))}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-lg cursor-pointer"
                  >
                    Move to Cart
                  </button>
                  <button
                    onClick={() => dispatch(removeSavedItem({ id: item.product.id, color: item.selectedColor, size: item.selectedSize }))}
                    className="p-2 text-gray-400 hover:text-rose-500 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
