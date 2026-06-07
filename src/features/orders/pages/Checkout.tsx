/* eslint-disable react-hooks/rules-of-hooks, react-hooks/purity */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Truck, CreditCard, ChevronRight, ShoppingBag, 
  CheckCircle, ArrowLeft, ArrowRight
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { clearCart } from '../../../redux/cartSlice';
import { addOrder } from '../../../redux/orderSlice';
import { Order } from '../../../types';
import { usePoints as usePointsAction } from '../../../redux/authSlice';
import { useToast } from '../../../hooks/useToast';
import { formatCurrency, generateTrackingNumber } from '../../../utils/formatters';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  // Redux Selectors
  const { cartItems, appliedCoupon, pointsApplied, pointsDiscount } = useAppSelector(state => state.cart);
  const { addresses, paymentMethods } = useAppSelector(state => state.auth);

  // States
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Shipping, 2: Delivery Method, 3: Payment, 4: Success
  const [selectedAddressId, setSelectedAddressId] = useState(addresses[0]?.id || '');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [selectedCardId, setSelectedCardId] = useState(paymentMethods[0]?.id || '');
  const [placedOrderId, setPlacedOrderId] = useState('');

  if (cartItems.length === 0 && step !== 4) {
    return (
      <div className="py-20 text-center space-y-4">
        <ShoppingBag className="w-12 h-12 text-text-secondary mx-auto" />
        <h3 className="font-bold text-text-primary">Checkout is empty</h3>
        <button onClick={() => navigate('/products')} className="bg-indigo-600 text-text-inverted px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer">
          Go To Shop
        </button>
      </div>
    );
  }

  // Calculation formulas
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  let couponDiscountVal = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      couponDiscountVal = subtotal * (appliedCoupon.value / 100);
    } else {
      couponDiscountVal = appliedCoupon.value;
    }
  }

  const finalPointsDiscount = Math.min(pointsDiscount, Math.max(0, subtotal - couponDiscountVal));
  const totalDiscount = couponDiscountVal + finalPointsDiscount;
  const tax = Math.max(0, (subtotal - totalDiscount) * 0.08);

  const baseShippingCost = subtotal > 150 ? 0 : 9.99;
  const shippingCost = shippingMethod === 'express' ? baseShippingCost + 15 : baseShippingCost;

  const finalOrderTotal = Math.max(0, subtotal - totalDiscount + tax + shippingCost);

  // Place Order handler
  const handlePlaceOrder = () => {
    const address = addresses.find(a => a.id === selectedAddressId);
    const card = paymentMethods.find(c => c.id === selectedCardId);

    if (!address || !card) {
      showToast("Please verify shipping details and payment card", "error");
      return;
    }

    const newOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const deliveryDays = shippingMethod === 'express' ? 1 : 3;
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + deliveryDays);

    const orderData: Order = {
      id: newOrderId,
      items: cartItems,
      subtotal,
      discount: totalDiscount,
      tax,
      shipping: shippingCost,
      total: finalOrderTotal,
      shippingAddress: address,
      paymentMethod: card,
      date: new Date().toISOString().split('T')[0],
      expectedDelivery: estDate.toISOString().split('T')[0],
      status: 'Processing',
      trackingStep: 1,
      carrier: shippingMethod === 'express' ? "DHL Express" : "USPS Priority",
      trackingNumber: generateTrackingNumber()
    };

    // Dispatch orders and deduct used points
    dispatch(addOrder(orderData));
    if (pointsApplied > 0) {
      dispatch(usePointsAction(pointsApplied));
    }
    
    // Clear shopping cart state
    dispatch(clearCart());
    
    setPlacedOrderId(newOrderId);
    setStep(4);

    // Fire Confetti explosion!
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });

    showToast("Order Placed Successfully!", "success");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16 text-left">
      
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-text-primary">Checkout</h1>
        <p className="text-xs text-gray-500">Secure 256-bit SSL encrypted checkout</p>
      </div>

      {/* Progress bar steps */}
      {step !== 4 && (
        <div className="flex items-center justify-between bg-bg-surface border border-gray-200/50 dark:border-gray-800/50 p-4 rounded-2xl glass shadow-sm text-xs font-bold">
          <button onClick={() => setStep(1)} className={`flex items-center gap-1.5 ${step >= 1 ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`}>
            <span className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center text-[10px]">1</span>
            Shipping Address
          </button>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <button onClick={() => step > 1 && setStep(2)} className={`flex items-center gap-1.5 ${step >= 2 ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`}>
            <span className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center text-[10px]">2</span>
            Shipping Speed
          </button>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <button onClick={() => step > 2 && setStep(3)} className={`flex items-center gap-1.5 ${step >= 3 ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`}>
            <span className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center text-[10px]">3</span>
            Payment Wallet
          </button>
        </div>
      )}

      {/* Double Column Grid */}
      {step !== 4 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Action Step */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Address Builder */}
            {step === 1 && (
              <div className="glass p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 space-y-5 bg-bg-surface/40">
                <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-500" /> Select Shipping Address
                </h3>
                
                <div className="space-y-3.5">
                  {addresses.map(addr => (
                    <label 
                      key={addr.id}
                      className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                        selectedAddressId === addr.id
                          ? 'border-indigo-500 bg-indigo-500/[0.02]'
                          : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={addr.id}
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-text-primary">{addr.name}</span>
                        <p className="text-gray-500 mt-1">{addr.line1}, {addr.line2 ? `${addr.line2}, ` : ''}{addr.city}, {addr.state} - {addr.zip}</p>
                        <span className="text-gray-400 block mt-1">Phone: {addr.phone}</span>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button onClick={() => navigate('/dashboard')} className="text-xs text-indigo-500 font-bold hover:underline cursor-pointer">
                    Manage Addresses
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    disabled={!selectedAddressId}
                    className="bg-indigo-600 hover:bg-indigo-700 text-text-inverted font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer shadow flex items-center gap-1.5"
                  >
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Shipping Options */}
            {step === 2 && (
              <div className="glass p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 space-y-5 bg-bg-surface/40">
                <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                  <Truck className="w-5 h-5 text-indigo-500" /> Select Delivery Option
                </h3>
                
                <div className="space-y-3.5">
                  <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    shippingMethod === 'standard' ? 'border-indigo-500 bg-indigo-500/[0.02]' : 'border-gray-200 dark:border-gray-800'
                  }`}>
                    <div className="flex items-center gap-3.5">
                      <input
                        type="radio"
                        name="shipping"
                        value="standard"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="text-xs text-left">
                        <span className="font-bold block text-text-primary">Standard Delivery (3-5 business days)</span>
                        <span className="text-gray-500">Free on orders above $150, otherwise $9.99</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-text-primary">
                      {baseShippingCost === 0 ? 'FREE' : formatCurrency(9.99)}
                    </span>
                  </label>

                  <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    shippingMethod === 'express' ? 'border-indigo-500 bg-indigo-500/[0.02]' : 'border-gray-200 dark:border-gray-800'
                  }`}>
                    <div className="flex items-center gap-3.5">
                      <input
                        type="radio"
                        name="shipping"
                        value="express"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="text-xs text-left">
                        <span className="font-bold block text-text-primary">Express Delivery (Next Day Air)</span>
                        <span className="text-gray-500">Expedited package handling and logistics tracking</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-text-primary">
                      {formatCurrency(baseShippingCost + 15)}
                    </span>
                  </label>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button onClick={() => setStep(1)} className="text-xs text-gray-500 font-bold hover:underline cursor-pointer flex items-center gap-1">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-text-inverted font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer shadow flex items-center gap-1.5"
                  >
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment Card selection */}
            {step === 3 && (
              <div className="glass p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 space-y-5 bg-bg-surface/40">
                <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-500" /> Select Payment Wallet
                </h3>
                
                <div className="space-y-3.5">
                  {paymentMethods.map(card => (
                    <label 
                      key={card.id}
                      className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                        selectedCardId === card.id ? 'border-indigo-500 bg-indigo-500/[0.02]' : 'border-gray-200 dark:border-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <input
                          type="radio"
                          name="card"
                          value={card.id}
                          checked={selectedCardId === card.id}
                          onChange={() => setSelectedCardId(card.id)}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="text-xs text-left">
                          <span className="font-bold block text-text-primary">
                            {card.brand} ending in {card.cardNumber.slice(-4)}
                          </span>
                          <span className="text-gray-400">Expires {card.expiry} | Holder: {card.cardHolder}</span>
                        </div>
                      </div>
                      <span className="text-xl font-bold text-text-secondary">💳</span>
                    </label>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button onClick={() => setStep(2)} className="text-xs text-gray-500 font-bold hover:underline cursor-pointer flex items-center gap-1">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={!selectedCardId}
                    className="bg-indigo-600 hover:bg-indigo-700 text-text-inverted font-bold text-xs px-6 py-3 rounded-xl cursor-pointer shadow-lg shadow-indigo-600/15"
                  >
                    Confirm & Place Order
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Side: Simple Order Summary Breakdown */}
          <div className="glass p-5 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 space-y-4 bg-bg-surface/40">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Order Totals</h4>
            
            <div className="divide-y divide-gray-100 dark:divide-gray-800/50 max-h-[160px] overflow-y-auto pr-1">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs py-2">
                  <span className="text-gray-500 truncate max-w-[150px]">{item.product.name}</span>
                  <span className="font-bold text-text-primary">
                    {item.quantity} × {formatCurrency(item.product.price)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs pt-3 border-t border-gray-150 dark:border-gray-800 text-text-secondary">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-emerald-500 font-semibold">
                  <span>Total Discount</span>
                  <span>-{formatCurrency(totalDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Sales Tax (8%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Cost</span>
                <span>{shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost)}</span>
              </div>
            </div>

            <div className="border-t border-gray-150 dark:border-gray-800 pt-3 flex justify-between items-baseline">
              <span className="text-xs font-bold text-text-primary">Grand Total</span>
              <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                {formatCurrency(finalOrderTotal)}
              </span>
            </div>
          </div>

        </div>
      ) : (
        /* 4. SUCCESS SCREEN */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-10 md:p-14 rounded-3xl border border-emerald-500/10 bg-emerald-500/[0.01] text-center space-y-6 max-w-xl mx-auto"
        >
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-full inline-block shadow">
            <CheckCircle className="w-14 h-14" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-text-primary">Order Confirmed!</h2>
            <p className="text-xs text-gray-500">
              Thank you for shopping at Buynora. Your order <span className="font-extrabold font-mono text-text-secondary">{placedOrderId}</span> has been created.
            </p>
          </div>

          <div className="p-5 bg-bg-surface/60 border border-gray-150 dark:border-gray-800 rounded-2xl text-left space-y-3.5 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Paid:</span>
              <span className="font-black text-text-primary">{formatCurrency(finalOrderTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Est. Arrival:</span>
              <span className="font-bold text-emerald-500">
                {new Date(Date.now() + (shippingMethod === 'express' ? 1 : 3) * 86400000).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-100 dark:border-gray-800 pt-2.5">
              <span className="text-gray-400">Tracking Number:</span>
              <span className="font-mono font-bold text-text-secondary">NORA-TRK-{(Math.floor(10000 + Math.random() * 90000))}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => navigate(`/track/${placedOrderId}`)}
              className="bg-indigo-600 hover:bg-indigo-700 text-text-inverted font-bold text-xs py-3 px-6 rounded-xl cursor-pointer shadow transition-all hover:scale-105"
            >
              Track Package Live
            </button>
            <button
              onClick={() => navigate('/products')}
              className="bg-gray-100 hover:bg-gray-250 dark:bg-slate-800 text-text-secondary font-bold text-xs py-3 px-6 rounded-xl cursor-pointer transition-all"
            >
              Continue Shopping
            </button>
          </div>

        </motion.div>
      )}

    </div>
  );
};
