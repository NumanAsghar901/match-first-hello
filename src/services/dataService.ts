
import { UserService } from './userService';
import { MatchService } from './matchService';
import { MessageService } from './messageService';
import { NotificationService } from './notificationService';

// Combine and export all services from a single point
export const DataService = {
  // User operations
  getCurrentUser: UserService.getCurrentUser,
  setCurrentUser: UserService.setCurrentUser,
  getAllUsers: UserService.getAllUsers,
  getUserById: UserService.getUserById,

  // Match operations
  generateMatches: MatchService.generateMatches,
  getUserMatches: MatchService.getUserMatches,
  deleteMatch: MatchService.deleteMatch,

  // Message operations
  sendMessage: MessageService.sendMessage,
  getConversation: MessageService.getConversation,

  // Notification operations
  getUserNotifications: NotificationService.getUserNotifications,
  markNotificationAsRead: NotificationService.markNotificationAsRead
};
