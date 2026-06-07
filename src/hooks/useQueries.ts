export {
  useProducts,
  useProduct,
  useCategories,
  useRecommendations,
  useSearchSuggestions,
  useAddReviewMutation,
  useAddQuestionMutation
} from '../features/products/hooks/useProductQueries';

export {
  useOrders,
  useCreateOrderMutation,
  useUpdateTrackingMutation,
  useCancelOrderMutation
} from '../features/orders/hooks/useOrderQueries';

export {
  useSellerAnalytics,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation
} from '../features/seller/hooks/useSellerQueries';

export {
  useAdminStats,
  useCoupons,
  useBanUserMutation,
  usePromoteUserMutation,
  useApproveSellerMutation,
  useToggleSellerMutation,
  useAddCouponMutation,
  useDeleteCouponMutation
} from '../features/admin/hooks/useAdminQueries';

export {
  useVerifyCouponMutation
} from '../features/cart/hooks/useCartQueries';
