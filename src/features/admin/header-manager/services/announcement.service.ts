import api from '../../../../services/api';
import { Announcement, TickerSettings, HeaderAnnouncementsPayload } from '../types';

export const announcementService = {
  async getAnnouncements(): Promise<HeaderAnnouncementsPayload> {
    const res = await api.get('/admin/announcements');
    return res.data;
  },

  async updateTickerSettings(settings: TickerSettings): Promise<TickerSettings> {
    const res = await api.put('/admin/announcements/settings', settings);
    return res.data;
  },

  async createAnnouncement(announcement: Omit<Announcement, 'id'>): Promise<Announcement> {
    const res = await api.post('/admin/announcements', announcement);
    return res.data;
  },

  async updateAnnouncement(id: string, announcement: Partial<Announcement>): Promise<Announcement> {
    const res = await api.put(`/admin/announcements/${id}`, announcement);
    return res.data;
  },

  async deleteAnnouncement(id: string): Promise<{ success: boolean; id: string }> {
    const res = await api.delete(`/admin/announcements/${id}`);
    return res.data;
  },

  async duplicateAnnouncement(id: string): Promise<Announcement> {
    const res = await api.post(`/admin/announcements/${id}/duplicate`);
    return res.data;
  }
};
