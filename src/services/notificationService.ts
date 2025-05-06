
import { Notification } from '@/types';
import { mockData } from './mock/mockData';

export const NotificationService = {
  getUserNotifications: (userId: string): Notification[] => {
    return mockData.notifications.filter(n => n.userId === userId);
  },
  
  markNotificationAsRead: (notificationId: string): boolean => {
    const notification = mockData.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      return true;
    }
    return false;
  }
};
