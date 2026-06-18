import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnnouncementRepository } from '../repositories/announcement.repository';
import { Announcement, TickerSettings } from '../types';

export const useAnnouncements = () => {
  return useQuery({
    queryKey: ['headerAnnouncements'],
    queryFn: () => AnnouncementRepository.getAnnouncements(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCreateAnnouncementMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (announcement: Omit<Announcement, 'id'>) =>
      AnnouncementRepository.createAnnouncement(announcement),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['headerAnnouncements'] });
    },
  });
};

export const useUpdateAnnouncementMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, announcement }: { id: string; announcement: Partial<Announcement> }) =>
      AnnouncementRepository.updateAnnouncement(id, announcement),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['headerAnnouncements'] });
    },
  });
};

export const useDeleteAnnouncementMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AnnouncementRepository.deleteAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['headerAnnouncements'] });
    },
  });
};

export const useDuplicateAnnouncementMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AnnouncementRepository.duplicateAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['headerAnnouncements'] });
    },
  });
};

export const useUpdateTickerSettingsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: TickerSettings) => AnnouncementRepository.updateTickerSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['headerAnnouncements'] });
    },
  });
};
