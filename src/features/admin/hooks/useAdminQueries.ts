import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminRepository } from '../repositories/admin.repository';
import { Coupon } from '../../../types';
import { UserRole } from '../../../constants';

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: () => AdminRepository.getStatistics(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useCoupons = () => {
  return useQuery({
    queryKey: ['coupons'],
    queryFn: () => AdminRepository.getCoupons(),
    staleTime: 1000 * 60 * 30,
  });
};

export const useBanUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => AdminRepository.toggleUserStatus(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    }
  });
};

export const usePromoteUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) => AdminRepository.promoteUserToRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    }
  });
};

export const useApproveSellerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sellerId: string) => AdminRepository.approveSeller(sellerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    }
  });
};

export const useToggleSellerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sellerId: string) => AdminRepository.toggleSellerStatus(sellerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    }
  });
};

export const useAddCouponMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (coupon: Coupon) => AdminRepository.createCoupon(coupon),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    }
  });
};

export const useDeleteCouponMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => AdminRepository.deleteCoupon(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    }
  });
};
