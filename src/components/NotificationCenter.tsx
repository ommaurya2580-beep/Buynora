import React, { useRef, useEffect } from 'react';
import { Bell, ShoppingBag, Percent, TrendingDown, Info, Circle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { markAllNotificationsRead } from '../redux/notificationSlice';
import { formatDate } from '../utils/formatters';
import { UserNotification } from '../types';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(state => state.notification.notifications);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-indigo-500" />;
      case 'price_drop':
        return <TrendingDown className="w-4 h-4 text-rose-500" />;
      case 'promo':
        return <Percent className="w-4 h-4 text-emerald-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div 
      ref={containerRef}
      className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl glass shadow-2xl border border-gray-200/50 dark:border-gray-800/50 bg-bg-surface overflow-hidden z-[999] pointer-events-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800/50">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-500" />
          <h4 className="text-sm font-bold text-text-primary">Notification Hub</h4>
        </div>
        <button
          onClick={() => dispatch(markAllNotificationsRead())}
          className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
        >
          Mark all read
        </button>
      </div>

      {/* List */}
      <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800/50">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-text-secondary">
            No notifications yet.
          </div>
        ) : (
          notifications.map((n: UserNotification) => (
            <div 
              key={n.id} 
              className={`p-4 flex gap-3 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors ${
                !n.isRead ? 'bg-indigo-500/[0.02]' : ''
              }`}
            >
              <div className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 self-start flex-shrink-0">
                {getIcon(n.type)}
              </div>
              <div className="flex-1 flex flex-col gap-0.5">
                <div className="flex items-center justify-between gap-2">
                  <h5 className={`text-xs font-bold text-text-primary ${!n.isRead ? 'pr-2' : ''}`}>
                    {n.title}
                  </h5>
                  {!n.isRead && (
                    <Circle className="w-1.5 h-1.5 fill-indigo-600 text-indigo-600 flex-shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  {n.message}
                </p>
                <span className="text-[9px] text-gray-400 mt-1">
                  {formatDate(n.date)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
