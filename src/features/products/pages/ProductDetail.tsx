/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Sparkles } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { addToCart, toggleCompareProduct, removeCompareProduct } from '../../../redux/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../../redux/wishlistSlice';
import { Product } from '../../../types';
import { useProduct, useRecommendations, useAddReviewMutation, useAddQuestionMutation } from '../../../hooks/useQueries';
import { useToast } from '../../../hooks/useToast';
import { formatCurrency } from '../../../utils/formatters';
import { ShimmerPDP } from '../../../components/Shimmer';
import { ProductCard } from '../../../components/ProductCard';

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

  // React Query queries
  const { data: product, isLoading: loadingProduct, error: productError } = useProduct(id || '');
  const { data: recommendations = [] } = useRecommendations(id);
  const similarProducts = recommendations.slice(0, 4);

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
      let viewedIds: string[] = viewed ? JSON.parse(viewed) : [];
      viewedIds = [id, ...viewedIds.filter(item => item !== id)].slice(0, 10);
      localStorage.setItem('recentlyViewed', JSON.stringify(viewedIds));
    }
  }, [id, product]);

  // Handle product fetch error
  useEffect(() => {
    if (productError) {
      showToast("Product not found", "error");
      navigate('/products');
    }
  }, [productError, navigate, showToast]);

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
    <div className="space-y-12 pb-16">
      
      {/* Product Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left Column: Image Gallery */}
        <ProductGallery images={product.images} name={product.name} />

        {/* Right Column: Information Panel */}
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

      {/* Frequently Bought Together Bundle */}
      {bundleProduct && (
        <section className="glass p-6 rounded-3xl border border-indigo-500/10 bg-indigo-500/[0.01]">
          <h4 className="text-base font-bold text-text-primary mb-4 text-left flex items-center gap-2">
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
                <span className="text-xl font-black text-text-primary">
                  {formatCurrency(product.price + (includeBundleItem ? bundleProduct.price : 0))}
                </span>
              </div>
              <button
                onClick={handleAddBundle}
                className="bg-indigo-600 hover:bg-indigo-700 text-text-inverted text-xs font-bold py-2.5 px-5 rounded-xl cursor-pointer"
              >
                Add Bundle to Cart
              </button>
            </div>

          </div>
        </section>
      )}

      {/* Technical Specifications */}
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

      {/* Similar Products */}
      <section className="space-y-6">
        <div className="text-left">
          <h3 className="text-lg font-black text-text-primary border-b border-gray-150 dark:border-gray-800 pb-2">
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
