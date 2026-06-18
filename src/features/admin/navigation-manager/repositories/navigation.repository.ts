import { navigationService } from '../services/navigation.service';
import { NavigationMenuItem } from '../types';

export const NavigationRepository = {
  async getNavigationItems(): Promise<NavigationMenuItem[]> {
    return navigationService.getNavigationItems();
  },

  async createNavigationItem(item: Omit<NavigationMenuItem, 'id'>): Promise<NavigationMenuItem> {
    return navigationService.createNavigationItem(item);
  },

  async updateNavigationItem(id: string, item: Partial<NavigationMenuItem>): Promise<NavigationMenuItem> {
    return navigationService.updateNavigationItem(id, item);
  },

  async deleteNavigationItem(id: string): Promise<{ success: boolean; id: string }> {
    return navigationService.deleteNavigationItem(id);
  },

  async reorderNavigationItems(items: { id: string; displayOrder: number }[]): Promise<NavigationMenuItem[]> {
    return navigationService.reorderNavigationItems(items);
  }
};
