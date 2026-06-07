import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductRepository } from '../repositories/product.repository';
import { FetchProductsParams } from '../services/product.service';
import { Review } from '../../../types';

export const useProducts = (params: FetchProductsParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => ProductRepository.getProducts(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => ProductRepository.getProductById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => ProductRepository.getCategories(),
    staleTime: 1000 * 60 * 60,
  });
};

export const useRecommendations = (productId?: string) => {
  return useQuery({
    queryKey: ['recommendations', productId],
    queryFn: () => ProductRepository.getAiRecommendations(productId),
    staleTime: 1000 * 60 * 5,
  });
};

export const useSearchSuggestions = (query: string) => {
  return useQuery({
    queryKey: ['suggestions', query],
    queryFn: () => ProductRepository.getSearchSuggestions(query),
    enabled: query.trim().length > 1,
    staleTime: 1000 * 60 * 30,
  });
};

export const useAddReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, reviewData }: { productId: string; reviewData: Omit<Review, 'id' | 'date' | 'likes'> }) =>
      ProductRepository.addReview(productId, reviewData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

export const useAddQuestionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, questionText }: { productId: string; questionText: string }) =>
      ProductRepository.addQuestion(productId, questionText),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId] });
    }
  });
};
