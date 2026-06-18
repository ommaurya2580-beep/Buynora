import api from '../../../../services/api';
import { NavigationMenuItem } from '../types';

export const navigationService = {
  async getNavigationItems(): Promise<NavigationMenuItem[]> {
    const res = await api.get('/admin/navigation-items');
    return res.data;
  },

  async createNavigationItem(item: Omit<NavigationMenuItem, 'id'>): Promise<NavigationMenuItem> {
    const res = await api.post('/admin/navigation-items', item);
    return res.data;
  },

  async updateNavigationItem(id: string, item: Partial<NavigationMenuItem>): Promise<NavigationMenuItem> {
    const res = await api.put(`/admin/navigation-items/${id}`, item);
    return res.data;
  },

  async deleteNavigationItem(id: string): Promise<{ success: boolean; id: string }> {
    const res = await api.delete(`/admin/navigation-items/${id}`);
    return res.data;
  },

  async reorderNavigationItems(items: { id: string; displayOrder: number }[]): Promise<NavigationMenuItem[]> {
    const res = await api.put('/admin/navigation-items/reorder', { items });
    return res.data;
  }
};
