import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HeroCampaignRepository } from '../repositories/campaign.repository';
import { HeroCampaign, ABTest, AssetItem, CampaignTemplate, CampaignVersion } from '../types';

export const useCampaignsList = () => {
  return useQuery({
    queryKey: ['campaigns'],
    queryFn: () => HeroCampaignRepository.getCampaigns(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCampaign = (id: string | undefined) => {
  return useQuery({
    queryKey: ['campaign', id],
    queryFn: () => HeroCampaignRepository.getCampaign(id || ''),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateCampaignMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (campaign: Omit<HeroCampaign, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'clicks' | 'ctr' | 'revenue' | 'conversions'>) =>
      HeroCampaignRepository.createCampaign(campaign),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};

export const useUpdateCampaignMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, campaign }: { id: string; campaign: Partial<HeroCampaign> }) =>
      HeroCampaignRepository.updateCampaign(id, campaign),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['campaignVersions', variables.id] });
    },
  });
};

export const useDeleteCampaignMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => HeroCampaignRepository.deleteCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};

export const useDuplicateCampaignMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => HeroCampaignRepository.duplicateCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};

export const useCampaignAnalytics = () => {
  return useQuery({
    queryKey: ['campaignAnalytics'],
    queryFn: () => HeroCampaignRepository.getAnalytics(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// A/B Testing Hooks
export const useABTests = () => {
  return useQuery({
    queryKey: ['abTests'],
    queryFn: () => HeroCampaignRepository.getABTests(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateABTestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (abTest: Omit<ABTest, 'id' | 'createdAt' | 'updatedAt'>) =>
      HeroCampaignRepository.createABTest(abTest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['abTests'] });
    },
  });
};

export const useUpdateABTestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, abTest }: { id: string; abTest: Partial<ABTest> }) =>
      HeroCampaignRepository.updateABTest(id, abTest),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['abTests'] });
    },
  });
};

// Asset Library Hooks
export const useAssets = () => {
  return useQuery({
    queryKey: ['assets'],
    queryFn: () => HeroCampaignRepository.getAssets(),
    staleTime: 1000 * 60 * 10,
  });
};

export const useCreateAssetMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (asset: Omit<AssetItem, 'id' | 'createdAt'>) =>
      HeroCampaignRepository.createAsset(asset),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
};

export const useDeleteAssetMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => HeroCampaignRepository.deleteAsset(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
};

// Templates & Versions Hooks
export const useTemplates = () => {
  return useQuery({
    queryKey: ['campaignTemplates'],
    queryFn: () => HeroCampaignRepository.getTemplates(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useVersions = (campaignId: string | undefined) => {
  return useQuery({
    queryKey: ['campaignVersions', campaignId],
    queryFn: () => HeroCampaignRepository.getVersions(campaignId || ''),
    enabled: !!campaignId,
    staleTime: 1000 * 60 * 2,
  });
};

export const useRestoreVersionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (versionId: string) => HeroCampaignRepository.restoreVersion(versionId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign', data.id] });
      queryClient.invalidateQueries({ queryKey: ['campaignVersions', data.id] });
    },
  });
};
