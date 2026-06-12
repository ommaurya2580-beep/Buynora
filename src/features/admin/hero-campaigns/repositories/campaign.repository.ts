import { campaignService } from '../services/campaign.service';
import { HeroCampaign, ABTest, AssetItem, CampaignTemplate, CampaignVersion } from '../types';

export const HeroCampaignRepository = {
  async getCampaigns(): Promise<HeroCampaign[]> {
    return campaignService.getCampaigns();
  },

  async getCampaign(id: string): Promise<HeroCampaign> {
    return campaignService.getCampaign(id);
  },

  async createCampaign(campaign: Omit<HeroCampaign, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'clicks' | 'ctr' | 'revenue' | 'conversions'>): Promise<HeroCampaign> {
    return campaignService.createCampaign(campaign);
  },

  async updateCampaign(id: string, campaign: Partial<HeroCampaign>): Promise<HeroCampaign> {
    return campaignService.updateCampaign(id, campaign);
  },

  async deleteCampaign(id: string): Promise<{ success: boolean; id: string }> {
    return campaignService.deleteCampaign(id);
  },

  async duplicateCampaign(id: string): Promise<HeroCampaign> {
    return campaignService.duplicateCampaign(id);
  },

  async trackView(id: string): Promise<{ success: boolean }> {
    return campaignService.trackView(id);
  },

  async trackClick(id: string): Promise<{ success: boolean }> {
    return campaignService.trackClick(id);
  },

  async getAnalytics(): Promise<any> {
    return campaignService.getAnalytics();
  },

  async getABTests(): Promise<ABTest[]> {
    return campaignService.getABTests();
  },

  async createABTest(abTest: Omit<ABTest, 'id' | 'createdAt' | 'updatedAt'>): Promise<ABTest> {
    return campaignService.createABTest(abTest);
  },

  async updateABTest(id: string, abTest: Partial<ABTest>): Promise<ABTest> {
    return campaignService.updateABTest(id, abTest);
  },

  async getAssets(): Promise<AssetItem[]> {
    return campaignService.getAssets();
  },

  async createAsset(asset: Omit<AssetItem, 'id' | 'createdAt'>): Promise<AssetItem> {
    return campaignService.createAsset(asset);
  },

  async deleteAsset(id: string): Promise<{ success: boolean; id: string }> {
    return campaignService.deleteAsset(id);
  },

  async getTemplates(): Promise<CampaignTemplate[]> {
    return campaignService.getTemplates();
  },

  async getVersions(campaignId: string): Promise<CampaignVersion[]> {
    return campaignService.getVersions(campaignId);
  },

  async restoreVersion(versionId: string): Promise<HeroCampaign> {
    return campaignService.restoreVersion(versionId);
  }
};
