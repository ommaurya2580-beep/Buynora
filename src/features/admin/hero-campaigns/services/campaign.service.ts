import api from '../../../../services/api';
import { HeroCampaign, ABTest, AssetItem, CampaignTemplate, CampaignVersion } from '../types';

export const campaignService = {
  async getCampaigns(): Promise<HeroCampaign[]> {
    const res = await api.get('/admin/hero-campaigns');
    return res.data;
  },

  async getCampaign(id: string): Promise<HeroCampaign> {
    const res = await api.get(`/admin/hero-campaigns/${id}`);
    return res.data;
  },

  async createCampaign(campaign: Omit<HeroCampaign, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'clicks' | 'ctr' | 'revenue' | 'conversions'>): Promise<HeroCampaign> {
    const res = await api.post('/admin/hero-campaigns', campaign);
    return res.data;
  },

  async updateCampaign(id: string, campaign: Partial<HeroCampaign>): Promise<HeroCampaign> {
    const res = await api.put(`/admin/hero-campaigns/${id}`, campaign);
    return res.data;
  },

  async deleteCampaign(id: string): Promise<{ success: boolean; id: string }> {
    const res = await api.delete(`/admin/hero-campaigns/${id}`);
    return res.data;
  },

  async duplicateCampaign(id: string): Promise<HeroCampaign> {
    const res = await api.post(`/admin/hero-campaigns/${id}/duplicate`);
    return res.data;
  },

  async trackView(id: string): Promise<{ success: boolean }> {
    const res = await api.post(`/admin/hero-campaigns/${id}/track-view`);
    return res.data;
  },

  async trackClick(id: string): Promise<{ success: boolean }> {
    const res = await api.post(`/admin/hero-campaigns/${id}/track-click`);
    return res.data;
  },

  async getAnalytics(): Promise<any> {
    const res = await api.get('/admin/hero-campaigns/analytics');
    return res.data;
  },

  // A/B Testing API Calls
  async getABTests(): Promise<ABTest[]> {
    const res = await api.get('/admin/hero-campaigns/ab-tests');
    return res.data;
  },

  async createABTest(abTest: Omit<ABTest, 'id' | 'createdAt' | 'updatedAt'>): Promise<ABTest> {
    const res = await api.post('/admin/hero-campaigns/ab-tests', abTest);
    return res.data;
  },

  async updateABTest(id: string, abTest: Partial<ABTest>): Promise<ABTest> {
    const res = await api.put(`/admin/hero-campaigns/ab-tests/${id}`, abTest);
    return res.data;
  },

  // Asset Library API Calls
  async getAssets(): Promise<AssetItem[]> {
    const res = await api.get('/admin/hero-campaigns/assets');
    return res.data;
  },

  async createAsset(asset: Omit<AssetItem, 'id' | 'createdAt'>): Promise<AssetItem> {
    const res = await api.post('/admin/hero-campaigns/assets', asset);
    return res.data;
  },

  async deleteAsset(id: string): Promise<{ success: boolean; id: string }> {
    const res = await api.delete(`/admin/hero-campaigns/assets/${id}`);
    return res.data;
  },

  // Templates & Versions API Calls
  async getTemplates(): Promise<CampaignTemplate[]> {
    const res = await api.get('/admin/hero-campaigns/templates');
    return res.data;
  },

  async getVersions(campaignId: string): Promise<CampaignVersion[]> {
    const res = await api.get(`/admin/hero-campaigns/${campaignId}/versions`);
    return res.data;
  },

  async restoreVersion(versionId: string): Promise<HeroCampaign> {
    const res = await api.post(`/admin/hero-campaigns/versions/${versionId}/restore`);
    return res.data;
  }
};
