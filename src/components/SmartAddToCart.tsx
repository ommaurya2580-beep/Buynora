import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { addToCart, removeFromCart, updateQuantity } from '../redux/cartSlice';
import { Product } from '../types';
import { useToast } from '../hooks/useToast';

interface SmartAddToCartProps {
  product: Product;
  className?: string;
  buttonPaddingClass?: string; // e.g. "py-2" or "py-3.5"
  colorClass?: string; // e.g. "bg-accent hover:bg-accent-hover text-text-inverted"
  iconSize?: number; // e.g. 14 or 16
}

export const SmartAddToCart: React.FC<SmartAddToCartProps> = ({
  product,
  className = "",
  buttonPaddingClass = "py-2",
  colorClass = "bg-accent hover:bg-accent-hover text-text-inverted",
  iconSize = 14
}) => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  
  // Get quantity in cart for this product
  const cartItem = useAppSelector(state => 
    state.cart.cartItems.find(item => item.product.id === product.id)
  );
  
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleInitialAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) {
      showToast("Product is out of stock", "error");
      return;
    }
    dispatch(addToCart({ product, quantity: 1 }));
    showToast(`${product.name} added to cart!`, "success");
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity >= product.stock) {
      showToast(`Only ${product.stock} units in stock.`, "info");
      return;
    }
    dispatch(updateQuantity({ id: product.id, quantity: quantity + 1 }));
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity <= 1) {
      dispatch(removeFromCart({ id: product.id }));
      showToast(`${product.name} removed from cart`, "info");
    } else {
      dispatch(updateQuantity({ id: product.id, quantity: quantity - 1 }));
    }
  };

  if (product.stock <= 0) {
    return (
      <button
        disabled
        className={`w-full ${buttonPaddingClass} rounded-xl flex items-center justify-center gap-1.5 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed ${className}`}
      >
        <span className="text-xs font-bold">Out of Stock</span>
      </button>
    );
  }

  return (
    <motion.div 
      layout 
      className={`w-full overflow-hidden ${className}`}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <AnimatePresence mode="wait">
        {quantity === 0 ? (
          <motion.button
            key="add-to-cart"
            onClick={handleInitialAdd}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`w-full ${buttonPaddingClass} rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${colorClass}`}
          >
            <ShoppingCart size={iconSize} />
            <span className="text-xs font-bold">Add to Cart</span>
          </motion.button>
        ) : (
          <motion.div
            key="qty-counter"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`w-full ${buttonPaddingClass} rounded-xl flex items-center justify-between px-3 bg-[#00D9A6] text-white font-extrabold shadow-[0_0_15px_rgba(0,217,166,0.25)]`}
          >
            <button
              onClick={handleDecrement}
              className="p-1 rounded-lg hover:bg-white/20 active:scale-90 transition-all cursor-pointer flex items-center justify-center text-white"
              title="Decrease quantity"
            >
              <Minus size={iconSize} strokeWidth={3} />
            </button>
            
            <motion.span 
              key={quantity}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-xs font-black select-none tracking-wide"
            >
              {quantity}
            </motion.span>
            
            <button
              onClick={handleIncrement}
              className="p-1 rounded-lg hover:bg-white/20 active:scale-90 transition-all cursor-pointer flex items-center justify-center text-white"
              title="Increase quantity"
            >
              <Plus size={iconSize} strokeWidth={3} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
