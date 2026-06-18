import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NavigationRepository } from '../repositories/navigation.repository';
import { NavigationMenuItem } from '../types';

export const useNavigationItems = () => {
  return useQuery({
    queryKey: ['navigationItems'],
    queryFn: () => NavigationRepository.getNavigationItems(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCreateNavItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (item: Omit<NavigationMenuItem, 'id'>) =>
      NavigationRepository.createNavigationItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigationItems'] });
    },
  });
};

export const useUpdateNavItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, item }: { id: string; item: Partial<NavigationMenuItem> }) =>
      NavigationRepository.updateNavigationItem(id, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigationItems'] });
    },
  });
};

export const useDeleteNavItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => NavigationRepository.deleteNavigationItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigationItems'] });
    },
  });
};

export const useReorderNavItemsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: { id: string; displayOrder: number }[]) =>
      NavigationRepository.reorderNavigationItems(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigationItems'] });
    },
  });
};
