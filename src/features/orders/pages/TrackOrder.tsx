import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Package, Truck, CheckCircle, Clock, ArrowLeft,
  MapPin, Check, RefreshCw
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { updateTracking } from '../../../redux/orderSlice';
import { useToast } from '../../../hooks/useToast';
import { formatDate } from '../../../utils/formatters';

export const TrackOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  // Find order in redux store
  const order = useAppSelector(state => state.order.orders.find(o => o.id === id));
  
  if (!order) {
    return (
      <div className="py-20 text-center space-y-4 text-left">
        <h3 className="font-bold text-gray-800 dark:text-white">Order not found</h3>
        <p className="text-xs text-gray-400">Please verify your order tracking ID and try again.</p>
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow">
          <ArrowLeft className="w-4 h-4" /> Go To Dashboard
        </Link>
      </div>
    );
  }

  // Simulated live status advancement for manual testing!
  const advanceStatus = () => {
    const nextStep = order.trackingStep + 1;
    let nextStatus = order.status;

    if (nextStep > 4) {
      showToast("Order is already marked as Delivered!", "info");
      return;
    }

    if (nextStep === 2) nextStatus = 'Shipped';
    else if (nextStep === 3) nextStatus = 'Out for Delivery';
    else if (nextStep === 4) nextStatus = 'Delivered';

    dispatch(updateTracking({ orderId: order.id, step: nextStep, status: nextStatus }));
    showToast(`Order status updated to: ${nextStatus}!`, "success");
  };

  const steps = [
    { label: 'Order Placed', desc: 'Your order was verified and submitted.', icon: CheckCircle },
    { label: 'Processing', desc: 'Items are being packaged in our warehouse.', icon: Clock },
    { label: 'Shipped', desc: 'Package passed to logistics carrier.', icon: Truck },
    { label: 'Delivered', desc: 'Package dropped at front door coordinate.', icon: Package }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-16 text-left">
      
      {/* Header back link */}
      <div>
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-indigo-500 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-3">Track Shipment</h1>
        <p className="text-xs text-gray-500">Live logistics tracking details for {order.id}</p>
      </div>

      {/* Manual Status Advancer widget (Dev Tooling!) */}
      <div className="glass p-4 rounded-2xl border border-indigo-500/10 bg-indigo-500/[0.01] flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest block">Sandbox Simulator</span>
          <p className="text-xs text-gray-500 mt-0.5">Test order updates in real-time by advancing delivery steps</p>
        </div>
        <button
          onClick={advanceStatus}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md transition-all hover:scale-105 active:scale-95 flex-shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Advance Status
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Steps timeline */}
        <div className="md:col-span-2 glass p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 bg-white dark:bg-slate-900/40">
          <div className="relative pl-6 space-y-8">
            
            {/* Center line */}
            <div className="absolute left-[13px] top-3.5 bottom-3.5 w-0.5 bg-gray-200 dark:bg-slate-800" />

            {steps.map((s, idx) => {
              const stepIndex = idx + 1;
              const isDone = order.trackingStep >= stepIndex;

              return (
                <div key={idx} className="relative flex gap-4">
                  {/* Indicator Dot */}
                  <div className={`absolute left-[-18px] top-1.5 p-1 rounded-full border-2 transition-all ${
                    isDone 
                      ? 'bg-indigo-600 border-indigo-600 text-white' 
                      : 'bg-white dark:bg-slate-950 border-gray-200 dark:border-gray-800 text-gray-400'
                  }`}>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>

                  <div className="pl-6 space-y-1">
                    <h4 className={`text-sm font-bold ${isDone ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                      {s.label}
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed pr-2">
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* Right Side: Shipping coordinates info */}
        <div className="space-y-6">
          <div className="glass p-5 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white dark:bg-slate-900/40 text-xs space-y-3.5">
            <h4 className="font-bold uppercase tracking-wider text-gray-400 text-[10px]">Shipment Details</h4>
            
            <div>
              <span className="text-gray-400">Carrier Partner:</span>
              <p className="font-bold mt-0.5">{order.carrier || "USPS Logistics"}</p>
            </div>

            <div>
              <span className="text-gray-400">Tracking Number:</span>
              <p className="font-mono font-bold mt-0.5 text-gray-700 dark:text-gray-300">{order.trackingNumber || "NORA-PENDING"}</p>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between items-baseline">
              <span className="text-gray-400">Estimated Delivery:</span>
              <span className="font-bold text-emerald-500">{formatDate(order.expectedDelivery)}</span>
            </div>
          </div>

          <div className="glass p-5 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white dark:bg-slate-900/40 text-xs space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-gray-400 text-[10px] flex items-center gap-1">
              <MapPin className="w-4.5 h-4.5" /> Destination Address
            </h4>
            <div className="text-left font-medium space-y-1">
              <span className="font-bold block text-gray-900 dark:text-white">{order.shippingAddress.name}</span>
              <p className="text-gray-500">{order.shippingAddress.line1}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zip}</p>
              <span className="text-gray-400 block pt-1">Phone: {order.shippingAddress.phone}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
