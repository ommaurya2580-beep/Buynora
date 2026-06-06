import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Star, ShoppingCart, Heart, ShieldAlert, Truck, RefreshCcw, 
  Play, MessageSquare, Plus, Check, MapPin, Sparkles, BarChart3, HelpCircle
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { 
  addToCart, addToWishlist, removeFromWishlist, 
  toggleCompareProduct, removeCompareProduct 
} from '../redux/cartSlice';
import { apiService } from '../services/api';
import { Product, Review, QnA } from '../services/mockDb';
import { useToast } from '../hooks/useToast';
import { formatCurrency } from '../utils/formatters';
import { ShimmerPDP } from '../components/Shimmer';
import { ProductCard } from '../components/ProductCard';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  // Redux States
  const wishlistItems = useAppSelector(state => state.cart.wishlistItems);
  const comparedProducts = useAppSelector(state => state.cart.comparedItems);
  const isInWishlist = wishlistItems.some(item => item.id === id);
  const isCompared = comparedProducts.some(item => item.id === id);

  // Component States
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%' });
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [zipCode, setZipCode] = useState('');
  const [deliveryEstimate, setDeliveryEstimate] = useState<string | null>(null);

  // Review Form States
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // QnA Form States
  const [questionText, setQuestionText] = useState('');
  const [submittingQuestion, setSubmittingQuestion] = useState(false);

  // Frequently Bought Together Bundle
  const [bundleProduct, setBundleProduct] = useState<Product | null>(null);
  const [includeBundleItem, setIncludeBundleItem] = useState(true);

  // Load product details
  useEffect(() => {
    const loadProductDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await apiService.getProductById(id);
        setProduct(data);
        setSelectedImage(data.images[0]);

        // Load similar products
        const recs = await apiService.getAiRecommendations(id);
        setSimilarProducts(recs.slice(0, 4));
        if (recs.length > 0) {
          setBundleProduct(recs[0]);
        }

        // Add to recently viewed in localStorage
        const viewed = localStorage.getItem('recentlyViewed');
        let viewedIds: string[] = viewed ? JSON.parse(viewed) : [];
        viewedIds = [id, ...viewedIds.filter(item => item !== id)].slice(0, 10);
        localStorage.setItem('recentlyViewed', JSON.stringify(viewedIds));

      } catch (e) {
        showToast("Product not found", "error");
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    loadProductDetails();
  }, [id, navigate]);

  if (loading || !product) {
    return <ShimmerPDP />;
  }

  // Hover zoom handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none', backgroundPosition: '0% 0%' });
  };

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

  // Delivery calculator simulation
  const handleZipCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipCode.trim() || zipCode.length < 5) {
      showToast("Please enter a valid zip code", "error");
      return;
    }
    const days = product.deliveryDays;
    const date = new Date();
    date.setDate(date.getDate() + days);
    const dateStr = date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
    setDeliveryEstimate(`Delivery guaranteed by ${dateStr} (${days} days)`);
  };

  // Add to Cart
  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: 1 }));
    showToast(`${product.name} added to cart!`, "success");
  };

  // Buy Now
  const handleBuyNow = () => {
    dispatch(addToCart({ product, quantity: 1 }));
    navigate('/checkout');
  };

  // Bundle Add
  const handleAddBundle = () => {
    dispatch(addToCart({ product, quantity: 1 }));
    if (bundleProduct && includeBundleItem) {
      dispatch(addToCart({ product: bundleProduct, quantity: 1 }));
    }
    showToast("Bundle items added to your cart!", "success");
  };

  // Review submission
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewTitle || !reviewComment) {
      showToast("Please fill in all review fields", "error");
      return;
    }
    setSubmittingReview(true);
    try {
      const added = await apiService.addReview(product.id, {
        userName: reviewName,
        userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
        verifiedPurchaser: true
      });
      setProduct(prev => prev ? {
        ...prev,
        reviews: [added, ...prev.reviews],
        ratingCount: prev.ratingCount + 1
      } : null);
      showToast("Review submitted successfully!", "success");
      setReviewName('');
      setReviewTitle('');
      setReviewComment('');
    } catch (err) {
      showToast("Failed to submit review", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Q&A submission
  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    setSubmittingQuestion(true);
    try {
      const added = await apiService.addQuestion(product.id, questionText);
      setProduct(prev => prev ? {
        ...prev,
        qna: [added, ...prev.qna]
      } : null);
      showToast("Question posted successfully!", "success");
      setQuestionText('');
    } catch (err) {
      showToast("Failed to post question", "error");
    } finally {
      setSubmittingQuestion(false);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* Product Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          
          {/* Main Image Viewport with Hover Zoom */}
          <div 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full aspect-[4/3] rounded-2xl overflow-hidden glass border border-gray-200/50 dark:border-gray-800/50 relative cursor-zoom-in bg-white dark:bg-slate-950/20"
          >
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {/* Magnifier glass layer */}
            <div 
              style={{
                ...zoomStyle,
                backgroundImage: `url(${selectedImage})`,
                backgroundSize: '200%',
                backgroundRepeat: 'no-repeat'
              }}
              className="absolute inset-0 pointer-events-none"
            />
          </div>

          {/* Thumbnails Row */}
          <div className="flex gap-3.5 overflow-x-auto py-1">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 cursor-pointer flex-shrink-0 transition-colors ${
                  selectedImage === img ? 'border-indigo-500' : 'border-transparent'
                }`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

        </div>

        {/* Right Column: Information Panel */}
        <div className="text-left space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">{product.brand}</span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-tight mt-1">{product.name}</h1>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center text-amber-400 gap-0.5">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-xs font-extrabold ml-1">{product.rating}</span>
              </div>
              <span className="text-xs text-gray-400">({product.ratingCount} Verified Reviews)</span>
            </div>
          </div>

          <div className="border-t border-b border-gray-150 dark:border-gray-800 py-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-3xl font-black text-gray-900 dark:text-white">
                {formatCurrency(product.price)}
              </span>
              {product.discountPercentage > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                  <span className="bg-rose-500/10 text-rose-500 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                    Save {product.discountPercentage}%
                  </span>
                </div>
              )}
            </div>

            <div className="text-right">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                product.availabilityStatus === 'In Stock' 
                  ? 'bg-emerald-500/10 text-emerald-500' 
                  : 'bg-amber-500/10 text-amber-500'
              }`}>
                {product.availabilityStatus}
              </span>
              <p className="text-[10px] text-gray-400 mt-1">Stock left: {product.stock} units</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            {product.longDescription || product.description}
          </p>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={handleAddToCart}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl cursor-pointer shadow-lg shadow-indigo-600/10 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3.5 rounded-xl cursor-pointer shadow-lg transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center"
            >
              Buy Now
            </button>
          </div>

          {/* Wishlist & Compare Toolbar */}
          <div className="flex gap-4 pt-2 border-b border-gray-150 dark:border-gray-800 pb-4">
            <button
              onClick={handleWishlistToggle}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-rose-500 transition-colors cursor-pointer"
            >
              <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
              {isInWishlist ? "Wishlisted" : "Add to Wishlist"}
            </button>
            <button
              onClick={handleCompareToggle}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-indigo-500 transition-colors cursor-pointer"
            >
              <BarChart3 className={`w-4 h-4 ${isCompared ? 'text-indigo-500' : ''}`} />
              {isCompared ? "Compared" : "Add to Compare"}
            </button>
          </div>

          {/* Delivery & Returns Panel */}
          <div className="space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400">Delivery Options</h5>
            <form onSubmit={handleZipCalculate} className="flex gap-2">
              <input
                type="text"
                maxLength={5}
                placeholder="Enter 5-digit zip code"
                value={zipCode}
                onChange={e => setZipCode(e.target.value.replace(/\D/g, ''))}
                className="bg-gray-150 dark:bg-slate-800 text-xs px-4 py-2 rounded-xl focus:border-indigo-500 outline-none flex-1 border border-transparent"
              />
              <button
                type="submit"
                className="bg-slate-200 hover:bg-slate-350 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
              >
                Check
              </button>
            </form>
            {deliveryEstimate && (
              <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1.5">
                <Truck className="w-4 h-4" /> {deliveryEstimate}
              </p>
            )}
            <div className="text-[11px] text-gray-400 space-y-1 pl-1">
              <p className="flex items-center gap-2"><Truck className="w-3.5 h-3.5" /> 30-Day Returns Policy</p>
              <p className="flex items-center gap-2"><RefreshCcw className="w-3.5 h-3.5" /> Free return shipping on exchanges</p>
            </div>
          </div>

        </div>

      </div>

      {/* Frequently Bought Together Bundle */}
      {bundleProduct && (
        <section className="glass p-6 rounded-3xl border border-indigo-500/10 bg-indigo-500/[0.01]">
          <h4 className="text-base font-bold text-gray-900 dark:text-white mb-4 text-left flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" /> Frequently Bought Together
          </h4>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Products Combo Link */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2.5">
                <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded-xl" />
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
                    className="w-4 h-4 rounded text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <img src={bundleProduct.images[0]} alt={bundleProduct.name} className="w-16 h-16 object-cover rounded-xl" />
                </label>
                <div className="text-left">
                  <span className="text-xs font-bold block truncate max-w-[120px]">{bundleProduct.name}</span>
                  <span className="text-xs text-indigo-500 font-extrabold">{formatCurrency(bundleProduct.price)}</span>
                </div>
              </div>
            </div>

            {/* Price Bundle checkout */}
            <div className="flex items-center gap-5">
              <div className="text-right">
                <span className="text-[10px] text-gray-400 block uppercase">Total Price</span>
                <span className="text-xl font-black text-gray-900 dark:text-white">
                  {formatCurrency(product.price + (includeBundleItem ? bundleProduct.price : 0))}
                </span>
              </div>
              <button
                onClick={handleAddBundle}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-5 rounded-xl cursor-pointer"
              >
                Add Bundle to Cart
              </button>
            </div>

          </div>
        </section>
      )}

      {/* Technical Specifications */}
      <section className="space-y-4 text-left">
        <h3 className="text-lg font-black text-gray-900 dark:text-white border-b border-gray-150 dark:border-gray-800 pb-2">
          Technical Specifications
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {Object.entries(product.specs).map(([key, val]) => (
            <div key={key} className="flex border-b border-gray-100 dark:border-gray-800/50 py-3 text-xs justify-between pr-4">
              <span className="font-semibold text-gray-400">{key}</span>
              <span className="font-bold text-gray-900 dark:text-white">{val}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Ratings & Reviews Section */}
      <section className="space-y-6 text-left">
        <h3 className="text-lg font-black text-gray-900 dark:text-white border-b border-gray-150 dark:border-gray-800 pb-2">
          Ratings & Reviews
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Reviews Scoreboard */}
          <div className="glass p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 space-y-4">
            <h4 className="text-sm font-bold text-gray-800 dark:text-white">Customer Rating Summary</h4>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black">{product.rating}</span>
              <span className="text-sm text-gray-400">/ 5</span>
            </div>
            <div className="flex items-center text-amber-400 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-current' : 'text-gray-200 dark:text-gray-700'}`} />
              ))}
            </div>
            <p className="text-[10px] text-gray-400">100% of reviews are verified purchases</p>
          </div>

          {/* Review Submission Form */}
          <form onSubmit={handleReviewSubmit} className="md:col-span-2 glass p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 space-y-4 bg-white/40 dark:bg-slate-900/40">
            <h4 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-indigo-500" /> Share Your Thoughts
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name"
                required
                value={reviewName}
                onChange={e => setReviewName(e.target.value)}
                className="bg-gray-150 dark:bg-slate-800 text-xs px-4 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Rating:</span>
                <select
                  value={reviewRating}
                  onChange={e => setReviewRating(parseInt(e.target.value))}
                  className="bg-gray-150 dark:bg-slate-800 text-xs px-3 py-2 rounded-xl border border-transparent focus:border-indigo-500 outline-none font-bold"
                >
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>

            <input
              type="text"
              placeholder="Headline Title"
              required
              value={reviewTitle}
              onChange={e => setReviewTitle(e.target.value)}
              className="bg-gray-150 dark:bg-slate-800 text-xs px-4 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
            />

            <textarea
              placeholder="Review Details..."
              required
              rows={3}
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
              className="bg-gray-150 dark:bg-slate-800 text-xs px-4 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full resize-none"
            />

            <button
              type="submit"
              disabled={submittingReview}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow cursor-pointer transition-all hover:scale-105"
            >
              {submittingReview ? "Submitting..." : "Post Review"}
            </button>
          </form>

        </div>

        {/* Reviews List */}
        <div className="space-y-4 mt-6">
          {product.reviews.map(rev => (
            <div key={rev.id} className="p-4 rounded-xl border border-gray-150 dark:border-gray-800 bg-white/20 dark:bg-slate-900/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <img src={rev.userAvatar} alt="avatar" className="w-8 h-8 rounded-full" />
                  <div>
                    <h5 className="text-xs font-bold">{rev.userName}</h5>
                    <span className="text-[9px] text-gray-400">{rev.date}</span>
                  </div>
                </div>
                <div className="flex items-center text-amber-400 gap-0.5">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
              </div>
              <h6 className="text-xs font-extrabold text-gray-800 dark:text-gray-100">{rev.title}</h6>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{rev.comment}</p>
            </div>
          ))}
        </div>

      </section>

      {/* Q&A Section */}
      <section className="space-y-6 text-left">
        <h3 className="text-lg font-black text-gray-900 dark:text-white border-b border-gray-150 dark:border-gray-800 pb-2 flex items-center gap-1.5">
          <HelpCircle className="w-5 h-5 text-indigo-500" /> Customer Questions & Answers
        </h3>

        {/* Ask Question Form */}
        <form onSubmit={handleQuestionSubmit} className="glass p-4 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 flex gap-3">
          <input
            type="text"
            placeholder="Have a question? Ask owners or the merchant..."
            required
            value={questionText}
            onChange={e => setQuestionText(e.target.value)}
            className="flex-1 bg-gray-150 dark:bg-slate-800 text-xs px-4 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none"
          />
          <button
            type="submit"
            disabled={submittingQuestion}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
          >
            {submittingQuestion ? "Posting..." : "Ask"}
          </button>
        </form>

        {/* Q&A List */}
        <div className="space-y-4">
          {product.qna.length === 0 ? (
            <p className="text-xs text-gray-400">No questions answered yet. Be the first to ask!</p>
          ) : (
            product.qna.map(q => (
              <div key={q.id} className="p-4 rounded-xl bg-gray-50 dark:bg-slate-900/20 space-y-2 border border-gray-100 dark:border-gray-800/50">
                <div className="flex items-start gap-2 text-xs font-bold text-gray-900 dark:text-white">
                  <span className="bg-indigo-500/10 text-indigo-500 text-[10px] px-1.5 py-0.5 rounded">Q</span>
                  <p>{q.question}</p>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400 pl-4">
                  <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-1.5 py-0.5 rounded">A</span>
                  <p>{q.answer}</p>
                </div>
              </div>
            ))
          )}
        </div>

      </section>

      {/* Similar Products */}
      <section className="space-y-6">
        <div className="text-left">
          <h3 className="text-lg font-black text-gray-900 dark:text-white border-b border-gray-150 dark:border-gray-800 pb-2">
            Similar Products You May Like
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {similarProducts.map(prod => (
            <ProductCard
              key={prod.id}
              product={prod}
              onCompareToggle={handleCompareToggle}
              isCompared={comparedProducts.some(p => p.id === prod.id)}
            />
          ))}
        </div>
      </section>

    </div>
  );
};
