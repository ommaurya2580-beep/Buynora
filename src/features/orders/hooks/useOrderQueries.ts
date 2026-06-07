import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OrderRepository } from '../repositories/order.repository';
import { Order } from '../../../types';

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => OrderRepository.getOrders(),
    staleTime: 1000 * 60 * 2,
  });
};

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderData: Omit<Order, 'date' | 'status' | 'trackingStep'>) =>
      OrderRepository.createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });
};

export const useUpdateTrackingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, step, status }: { orderId: string; step: number; status: Order['status'] }) =>
      OrderRepository.updateTracking(orderId, step, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });
};

export const useCancelOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => OrderRepository.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });
};
