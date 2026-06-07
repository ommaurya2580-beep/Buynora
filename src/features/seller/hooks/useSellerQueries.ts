import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SellerRepository } from '../repositories/seller.repository';
import { Product } from '../../../types';

export const useSellerAnalytics = () => {
  return useQuery({
    queryKey: ['sellerAnalytics'],
    queryFn: () => SellerRepository.getAnalytics(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useAddProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (product: Omit<Product, 'id' | 'reviews' | 'qna'>) => SellerRepository.createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, product }: { id: string; product: Partial<Product> }) => SellerRepository.updateProduct(id, product),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => SellerRepository.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};
