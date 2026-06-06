import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService, FetchProductsParams } from '../services/product.service';
import { orderService } from '../services/order.service';
import { sellerService } from '../services/seller.service';
import { adminService } from '../services/admin.service';
import { Product, Review, Order, Coupon } from '../types';
import { UserRole } from '../constants';

// 1. useProducts
export const useProducts = (params: FetchProductsParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getProducts(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (prev) => prev,
  });
};

// 2. useProduct
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// 3. useCategories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

// 4. useRecommendations
export const useRecommendations = (productId?: string) => {
  return useQuery({
    queryKey: ['recommendations', productId],
    queryFn: () => productService.getAiRecommendations(productId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// 5. useSearchSuggestions
export const useSearchSuggestions = (query: string) => {
  return useQuery({
    queryKey: ['suggestions', query],
    queryFn: () => productService.getSearchSuggestions(query),
    enabled: query.trim().length > 1,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

// 6. useOrders
export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getOrders(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// 7. useSellerAnalytics
export const useSellerAnalytics = () => {
  return useQuery({
    queryKey: ['sellerAnalytics'],
    queryFn: () => sellerService.getAnalytics(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// 8. useAdminStats
export const useAdminStats = () => {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: () => adminService.getStatistics(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// 9. useCoupons
export const useCoupons = () => {
  return useQuery({
    queryKey: ['coupons'],
    queryFn: () => adminService.getCoupons(),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

// Add Review Mutation
export const useAddReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, reviewData }: { productId: string; reviewData: Omit<Review, 'id' | 'date' | 'likes'> }) => 
      productService.addReview(productId, reviewData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

// Add Question Mutation
export const useAddQuestionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, questionText }: { productId: string; questionText: string }) =>
      productService.addQuestion(productId, questionText),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId] });
    }
  });
};

// Create Order Mutation
export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderData: Omit<Order, 'date' | 'status' | 'trackingStep'>) =>
      orderService.createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });
};

// Update Order Tracking Mutation (Sandbox)
export const useUpdateTrackingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, step, status }: { orderId: string; step: number; status: Order['status'] }) =>
      orderService.updateTracking(orderId, step, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });
};

// Cancel Order Mutation
export const useCancelOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => orderService.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });
};

// Admin Mutations
export const useBanUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => adminService.toggleUserStatus(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    }
  });
};

export const usePromoteUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) => adminService.promoteUserToRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    }
  });
};

export const useApproveSellerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sellerId: string) => adminService.approveSeller(sellerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    }
  });
};

export const useToggleSellerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sellerId: string) => adminService.toggleSellerStatus(sellerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    }
  });
};

// Product CRUD Mutations (Seller Dashboard)
export const useAddProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (product: Omit<Product, 'id' | 'reviews' | 'qna'>) => sellerService.createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, product }: { id: string; product: Partial<Product> }) => sellerService.updateProduct(id, product),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sellerService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

// Coupon CRUD Mutations (Admin Dashboard)
export const useAddCouponMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (coupon: Coupon) => adminService.createCoupon(coupon),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    }
  });
};

export const useDeleteCouponMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => adminService.deleteCoupon(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    }
  });
};
