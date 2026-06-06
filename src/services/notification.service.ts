import api from './api';
import { UserNotification } from '../types';

export const notificationService = {
  async getNotifications(): Promise<UserNotification[]> {
    // Backend API preparation
    const res = await api.get('/notifications');
    return res.data;
  },

  async markAsRead(notificationId: string): Promise<{ success: boolean }> {
    const res = await api.post(`/notifications/${notificationId}/read`);
    return res.data;
  }
};
