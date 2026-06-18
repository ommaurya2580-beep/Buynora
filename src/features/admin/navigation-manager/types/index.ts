export type MenuHighlight = 'None' | 'NEW' | 'SALE';

export interface NavigationMenuItem {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  menuType: 'Category' | 'CustomPage' | 'External';
  categoryConnectionId?: string; // Connected category ID
  externalUrl?: string;
  openInNewTab: boolean;
  showInDesktop: boolean;
  showInMobile: boolean;
  showInSidebar: boolean;
  highlight: MenuHighlight;
  badgeText?: string;
  displayOrder: number;
  status: 'Active' | 'Disabled';
}
