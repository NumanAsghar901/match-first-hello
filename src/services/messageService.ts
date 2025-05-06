
import { Message, Notification } from '@/types';
import { mockData } from './mock/mockData';
import { UserService } from './userService';

export const MessageService = {
  sendMessage: (senderId: string, receiverId: string, content: string): Message | null => {
    const sender = UserService.getUserById(senderId);
    const receiver = UserService.getUserById(receiverId);
    
    if (!sender || !receiver) return null;
    
    // Check if this is a first message
    const existingMessages = mockData.messages.filter(
      m => (m.senderId === senderId && m.receiverId === receiverId) || 
           (m.senderId === receiverId && m.receiverId === senderId)
    );
    
    const isFirstMessage = existingMessages.length === 0;
    
    // Apply the rule: Only females can initiate contact
    if (isFirstMessage && sender.gender === 'male') {
      return null; // Males cannot initiate contact
    }
    
    const message: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      senderId,
      receiverId,
      content,
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    // Create a notification for the receiver
    const notification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: receiverId,
      type: 'message',
      relatedUserId: senderId,
      content: isFirstMessage ? `${sender.name} sent you a first message!` : `New message from ${sender.name}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    // Update match status to contacted
    const match = mockData.matches.find(
      m => (m.userId === senderId && m.matchedUserId === receiverId) ||
           (m.userId === receiverId && m.matchedUserId === senderId)
    );
    
    if (match) {
      match.contacted = true;
    }
    
    mockData.messages.push(message);
    mockData.notifications.push(notification);
    
    return message;
  },
  
  getConversation: (userId1: string, userId2: string): Message[] => {
    return mockData.messages.filter(
      m => (m.senderId === userId1 && m.receiverId === userId2) || 
           (m.senderId === userId2 && m.receiverId === userId1)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }
};
