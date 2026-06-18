export interface Announcement {
  id: string;
  title: string;
  messageText: string;
  icon: string; // 'Truck', 'Coupon', 'Gift', 'Support', 'Flash', 'Star', etc.
  textColor: string;
  backgroundColor: string;
  iconColor: string;
  linkUrl?: string;
  openInNewTab: boolean;
  displayOrder: number;
  status: 'Active' | 'Disabled';
}

export interface TickerSettings {
  scrollSpeed: 'Slow' | 'Normal' | 'Fast' | 'Custom';
  customSpeedMs?: number;
  direction: 'L2R' | 'R2L';
  pauseOnHover: boolean;
  autoplay: boolean;
  infiniteLoop: boolean;
  showAnnouncementBar: boolean;
}

export interface HeaderAnnouncementsPayload {
  announcements: Announcement[];
  tickerSettings: TickerSettings;
}
