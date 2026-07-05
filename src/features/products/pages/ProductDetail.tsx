/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plus, Sparkles, Heart, Share2, Copy, Check, X, ShieldAlert, ShoppingBag } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { addToCart, toggleCompareProduct, removeCompareProduct } from '../../../redux/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../../redux/wishlistSlice';
import { Product } from '../../../types';
import { useProduct, useRecommendations, useAddReviewMutation, useAddQuestionMutation } from '../../../hooks/useQueries';
import { useToast } from '../../../hooks/useToast';
import { formatCurrency } from '../../../utils/formatters';
import { ShimmerPDP } from '../../../components/Shimmer';
import { ProductCard } from '../../../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { SmartAddToCart } from '../../../components/SmartAddToCart';

// PDP Subcomponents
import { ProductGallery } from '../../../components/pdp/ProductGallery';
import { ProductInfo } from '../../../components/pdp/ProductInfo';
import { SpecificationTabs } from '../../../components/pdp/SpecificationTabs';
import { ReviewSection } from '../../../components/pdp/ReviewSection';
import { QnaSection } from '../../../components/pdp/QnaSection';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  // Redux States
  const wishlistItems = useAppSelector(state => state.wishlist.wishlistItems);
  const comparedProducts = useAppSelector(state => state.cart.comparedItems);
  const isInWishlist = wishlistItems.some((item: Product) => item.id === id);
  const isCompared = comparedProducts.some(item => item.id === id);

  // Component States
  const [bundleProduct, setBundleProduct] = useState<Product | null>(null);
  const [includeBundleItem, setIncludeBundleItem] = useState(true);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const { data: product, isLoading: loadingProduct, error: productError } = useProduct(id || '');
  const { data: recommendations = [] } = useRecommendations(id);
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [limit, setLimit] = useState(6);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setLimit(2);
      } else if (window.innerWidth < 1024) {
        setLimit(4);
      } else {
        setLimit(6);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const visibleSimilarProducts = isExpanded ? recommendations : recommendations.slice(0, limit);
  const showSimilarMoreButton = recommendations.length > limit;

  const addReviewMutation = useAddReviewMutation();
  const addQuestionMutation = useAddQuestionMutation();

  const loading = loadingProduct;
  const submittingReview = addReviewMutation.isPending;
  const submittingQuestion = addQuestionMutation.isPending;

  // Sync bundle item from recommendations
  useEffect(() => {
    if (recommendations && recommendations.length > 0) {
      setBundleProduct(recommendations[0]);
    }
  }, [recommendations]);

  // Add to recently viewed on load
  useEffect(() => {
    if (id && product) {
      const viewed = localStorage.getItem('recentlyViewed');
      let viewedItems: any[] = viewed ? JSON.parse(viewed) : [];
      
      if (viewedItems.length > 0 && typeof viewedItems[0] === 'string') {
        viewedItems = [];
      }
      
      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        viewedAt: new Date().toISOString()
      };
      
      viewedItems = [newItem, ...viewedItems.filter((item: any) => item.id !== id)].slice(0, 5);
      localStorage.setItem('recentlyViewed', JSON.stringify(viewedItems));
      window.dispatchEvent(new Event('recentlyViewedUpdated'));
    }
  }, [id, product]);

  // Handle product fetch error
  useEffect(() => {
    if (productError) {
      showToast("Product not found", "error");
      navigate('/products');
    }
  }, [productError, navigate, showToast]);

  // QR Code Renderer in Modal
  useEffect(() => {
    if (!isShareOpen || !qrCanvasRef.current) return;
    const canvas = qrCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const size = canvas.width;
    const cellSize = size / 21;

    // Draw finder pattern (corners)
    const drawFinder = (startRow: number, startCol: number) => {
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(startCol * cellSize, startRow * cellSize, 7 * cellSize, 7 * cellSize);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect((startCol + 1) * cellSize, (startRow + 1) * cellSize, 5 * cellSize, 5 * cellSize);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect((startCol + 2) * cellSize, (startRow + 2) * cellSize, 3 * cellSize, 3 * cellSize);
    };

    drawFinder(0, 0);
    drawFinder(0, 14);
    drawFinder(14, 0);

    // Draw simulated QR modules
    ctx.fillStyle = '#0F172A';
    for (let r = 0; r < 21; r++) {
      for (let c = 0; c < 21; c++) {
        if (r < 8 && c < 8) continue;
        if (r < 8 && c > 13) continue;
        if (r > 13 && c < 8) continue;

        // Pseudo-random modules
        const hash = (r * 17 + c * 31) % 5;
        if (hash === 0 || hash === 2 || (r % 2 === 0 && c % 3 === 0)) {
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        }
      }
    }
  }, [isShareOpen]);

  if (loading || !product) {
    return <ShimmerPDP />;
  }

  // Wishlist toggle
  const handleWishlistToggle = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
      showToast("Removed from wishlist", "info");
    } else {
      dispatch(addToWishlist(product));
      showToast("Added to wishlist!", "success");
    }
  };

  // Compare toggle
  const handleCompareToggle = () => {
    if (isCompared) {
      dispatch(removeCompareProduct(product.id));
      showToast("Removed from comparison", "info");
    } else {
      if (comparedProducts.length >= 3) {
        showToast("You can compare up to 3 products at a time.", "error");
        return;
      }
      dispatch(toggleCompareProduct(product));
      showToast("Added to comparison drawer!", "success");
    }
  };

  // Add to Cart
  const handleAddToCart = (color?: string, size?: string) => {
    dispatch(addToCart({ 
      product, 
      quantity: 1, 
      color: color, 
      size: size 
    }));
    showToast(`${product.name} (${color || 'Default'}, ${size || 'Standard'}) added to cart!`, "success");
  };

  // Buy Now
  const handleBuyNow = (color?: string, size?: string) => {
    dispatch(addToCart({ 
      product, 
      quantity: 1, 
      color: color, 
      size: size 
    }));
    navigate('/checkout');
  };

  // Bundle Add
  const handleAddBundle = () => {
    dispatch(addToCart({ product, quantity: 1 }));
    let bundleText = product.name;
    if (bundleProduct && includeBundleItem) {
      dispatch(addToCart({ product: bundleProduct, quantity: 1 }));
      bundleText += ` + ${bundleProduct.name}`;
    }
    showToast(`Bundle added to your cart: ${bundleText}`, "success");
  };

  // Copy Link helper
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    showToast("Product link copied!", "success");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Review submission
  const handleReviewSubmit = (reviewData: { userName: string; rating: number; title: string; comment: string }) => {
    addReviewMutation.mutate({
      productId: product.id,
      reviewData: {
        ...reviewData,
        userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
        verifiedPurchaser: true
      }
    }, {
      onSuccess: () => {
        showToast("Review submitted successfully!", "success");
      },
      onError: () => {
        showToast("Failed to submit review", "error");
      }
    });
  };

  // Q&A submission
  const handleQuestionSubmit = (questionText: string) => {
    addQuestionMutation.mutate({
      productId: product.id,
      questionText
    }, {
      onSuccess: () => {
        showToast("Question posted successfully!", "success");
      },
      onError: () => {
        showToast("Failed to post question", "error");
      }
    });
  };

  return (
    <div className="space-y-12 pb-28 lg:pb-16 relative">
      
      {/* Product Sticky Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-12 w-full overflow-hidden">
          
          <ProductGallery images={product.images} name={product.name} category={product.category} />

          {/* Product Overview Section */}
          <div className="glass p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/80 bg-bg-surface/30 text-left">
            <div className="flex items-center justify-between mb-3 border-b border-gray-150 dark:border-slate-800/50 pb-2">
              <h4 className="text-sm font-black uppercase text-gray-400 tracking-wider">Product Highlights</h4>
              <button 
                onClick={() => setIsShareOpen(true)}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" /> Share Page
              </button>
            </div>
            
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-medium">
              {product.longDescription || product.description}
            </p>
            
            {/* Trust Badges Strip */}
            <div className="grid grid-cols-4 gap-3 mt-6 pt-5 border-t border-gray-150 dark:border-slate-800/55 text-center text-[10px] text-text-secondary font-bold">
              <div className="flex flex-col items-center space-y-1">
                <span className="text-lg">🛡️</span>
                <span>100% Genuine</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <span className="text-lg">✨</span>
                <span>Official Warranty</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <span className="text-lg">🔄</span>
                <span>30-Day Returns</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <span className="text-lg">🚚</span>
                <span>Fast Dispatch</span>
              </div>
            </div>
          </div>

          {/* Frequently Bought Together Bundle */}
          {bundleProduct && (
            <section className="glass p-6 rounded-3xl border border-indigo-500/10 bg-indigo-500/[0.01]">
              <h4 className="text-sm font-black text-text-primary mb-4 text-left flex items-center gap-2 uppercase tracking-wider text-gray-400">
                <Sparkles className="w-4 h-4 text-indigo-500" /> Frequently Bought Together
              </h4>
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Products Combo Details */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2.5">
                    <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded-xl border border-gray-200 dark:border-slate-800" />
                    <div className="text-left">
                      <span className="text-xs font-bold block truncate max-w-[120px]">{product.name}</span>
                      <span className="text-xs text-indigo-500 font-extrabold">{formatCurrency(product.price)}</span>
                    </div>
                  </div>

                  <Plus className="w-5 h-5 text-gray-400" />

                  <div className="flex items-center gap-2.5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeBundleItem}
                        onChange={e => setIncludeBundleItem(e.target.checked)}
                        className="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary cursor-pointer"
                      />
                      <img src={bundleProduct.images[0]} alt={bundleProduct.name} className="w-16 h-16 object-cover rounded-xl border border-gray-200 dark:border-slate-800" />
                    </label>
                    <div className="text-left">
                      <span className="text-xs font-bold block truncate max-w-[120px]">{bundleProduct.name}</span>
                      <span className="text-xs text-indigo-500 font-extrabold">{formatCurrency(bundleProduct.price)}</span>
                    </div>
                  </div>
                </div>

                {/* Bundle calculations */}
                <div className="flex items-center gap-5 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-gray-150 dark:border-slate-800/40 pt-4 md:pt-0">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-gray-400 block uppercase font-bold">Total Combo Price</span>
                    <span className="text-xl font-black text-text-primary">
                      {formatCurrency(product.price + (includeBundleItem ? bundleProduct.price : 0))}
                    </span>
                    {includeBundleItem && (
                      <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-500 block">
                        🎁 Combo savings of ₹500 included!
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleAddBundle}
                    className="bg-indigo-600 hover:bg-indigo-700 text-text-inverted text-xs font-bold py-2.5 px-5 rounded-xl cursor-pointer shadow-md transition-all hover:scale-105 active:scale-95"
                  >
                    Add Bundle
                  </button>
                </div>

              </div>
            </section>
          )}

          {/* Technical Specifications Accordion */}
          <SpecificationTabs specs={product.specs} />

          {/* Ratings & Reviews Section */}
          <ReviewSection
            reviews={product.reviews}
            rating={product.rating}
            onAddReview={handleReviewSubmit}
            submittingReview={submittingReview}
          />

          {/* Q&A Section */}
          <QnaSection
            qna={product.qna}
            onAddQuestion={handleQuestionSubmit}
            submittingQuestion={submittingQuestion}
          />

        </div>

        {/* Right Sticky Area (lg:col-span-5) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 w-full">
          <ProductInfo
            product={product}
            isInWishlist={isInWishlist}
            isCompared={isCompared}
            handleWishlistToggle={handleWishlistToggle}
            handleCompareToggle={handleCompareToggle}
            handleAddToCart={handleAddToCart}
            handleBuyNow={handleBuyNow}
          />
        </div>

      </div>

      {/* Similar Products */}
      <section className="space-y-6 w-full max-w-full pt-6">
        <div className="flex items-center justify-between border-b border-gray-150 dark:border-gray-800 pb-2">
          <h3 className="text-lg font-black text-text-primary">
            Similar Products You May Like
          </h3>
          {showSimilarMoreButton && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors bg-indigo-500/5 hover:bg-indigo-500/10 px-3.5 py-1.5 rounded-xl border border-indigo-500/10"
            >
              {isExpanded ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>

        <motion.div 
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5 w-full"
        >
          <AnimatePresence mode="popLayout">
            {visibleSimilarProducts.map(prod => (
              <motion.div
                key={prod.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <ProductCard
                  product={prod}
                  onCompareToggle={handleCompareToggle}
                  isCompared={comparedProducts.some(p => p.id === prod.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-gray-250/30 dark:border-slate-800/40 px-4 py-3 flex items-center justify-between gap-4 pb-safe-bottom shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        
        {/* Info label on left */}
        <div className="text-left max-w-[120px]">
          <span className="text-[10px] text-gray-400 block uppercase truncate font-bold">{product.brand}</span>
          <span className="text-xs font-black block truncate text-text-primary leading-none">{product.name}</span>
          <span className="text-xs font-extrabold text-primary">{formatCurrency(product.price)}</span>
        </div>

        {/* CTA Actions */}
        <div className="flex-1 flex items-center gap-2 justify-end">
          <button
            onClick={() => handleWishlistToggle()}
            className="p-3 rounded-xl border border-gray-200 dark:border-slate-850 text-gray-500 hover:text-rose-500 transition-colors bg-gray-50/50 dark:bg-slate-950/20 cursor-pointer"
          >
            <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
          
          <button
            onClick={() => setIsShareOpen(true)}
            className="p-3 rounded-xl border border-gray-200 dark:border-slate-850 text-gray-500 hover:text-indigo-500 transition-colors bg-gray-50/50 dark:bg-slate-950/20 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <div className="min-w-[100px]">
            <SmartAddToCart 
              product={product} 
              buttonPaddingClass="py-3 px-3.5" 
              colorClass="bg-primary hover:bg-primary-hover text-text-inverted text-xs font-black text-center rounded-xl" 
              iconSize={13} 
            />
          </div>
        </div>
      </div>

      {/* Share / QR Code Modal Overlay */}
      <AnimatePresence>
        {isShareOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-bg-surface dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center relative shadow-2xl space-y-5"
            >
              <button 
                onClick={() => setIsShareOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-500 hover:text-text-primary transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <h3 className="text-base font-black text-text-primary flex items-center justify-center gap-1.5 uppercase tracking-wider text-xs">
                  <Share2 className="w-4 h-4 text-primary" /> Share Product
                </h3>
                <p className="text-[11px] text-gray-400">Scan QR Code or copy page URL link to share</p>
              </div>

              {/* QR Code Canvas */}
              <div className="flex items-center justify-center bg-white p-4 rounded-2xl border border-gray-150 max-w-[180px] mx-auto shadow-inner">
                <canvas ref={qrCanvasRef} width={150} height={150} className="w-[150px] h-[150px] pointer-events-none" />
              </div>

              {/* Copy URL input */}
              <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={window.location.href}
                  className="bg-gray-150 dark:bg-slate-800 text-[10px] px-3.5 py-2.5 rounded-xl outline-none flex-1 border border-transparent select-all text-text-secondary truncate font-medium"
                />
                <button
                  onClick={handleCopyLink}
                  className="bg-primary hover:bg-primary-hover text-text-inverted p-2.5 rounded-xl cursor-pointer transition-all hover:scale-105"
                  title="Copy Link URL"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-350" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Socials buttons row */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] font-bold text-text-secondary">
                <a 
                  href={`https://api.whatsapp.com/send?text=Check out this premium ${product.name} on Buynora! ${window.location.href}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-center cursor-pointer transition-all active:scale-95"
                >
                  WhatsApp
                </a>
                <a 
                  href={`https://twitter.com/intent/tweet?text=Check out this premium ${product.name} on Buynora!&url=${window.location.href}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-sky-500/5 hover:bg-sky-500/10 border border-sky-500/10 text-sky-500 text-center cursor-pointer transition-all active:scale-95"
                >
                  Twitter
                </a>
                <button 
                  onClick={() => {
                    navigator.share({ title: product.name, text: product.description, url: window.location.href })
                      .catch(err => console.log(err));
                  }}
                  className="p-2.5 rounded-xl bg-gray-100 dark:bg-slate-800/80 hover:bg-gray-150 text-text-primary text-center cursor-pointer transition-all active:scale-95"
                >
                  System Share
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
