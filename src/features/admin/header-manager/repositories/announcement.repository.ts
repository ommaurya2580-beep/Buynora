import { announcementService } from '../services/announcement.service';
import { Announcement, TickerSettings, HeaderAnnouncementsPayload } from '../types';

export const AnnouncementRepository = {
  async getAnnouncements(): Promise<HeaderAnnouncementsPayload> {
    return announcementService.getAnnouncements();
  },

  async updateTickerSettings(settings: TickerSettings): Promise<TickerSettings> {
    return announcementService.updateTickerSettings(settings);
  },

  async createAnnouncement(announcement: Omit<Announcement, 'id'>): Promise<Announcement> {
    return announcementService.createAnnouncement(announcement);
  },

  async updateAnnouncement(id: string, announcement: Partial<Announcement>): Promise<Announcement> {
    return announcementService.updateAnnouncement(id, announcement);
  },

  async deleteAnnouncement(id: string): Promise<{ success: boolean; id: string }> {
    return announcementService.deleteAnnouncement(id);
  },

  async duplicateAnnouncement(id: string): Promise<Announcement> {
    return announcementService.duplicateAnnouncement(id);
  }
};
