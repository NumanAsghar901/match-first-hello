
import { User, Match, Message, Notification, Gender } from '@/types';

// Mock data for testing
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Emma Johnson',
    age: 28,
    gender: 'female',
    bio: 'Love hiking, photography, and trying new restaurants.',
    images: ['/placeholder.svg', '/placeholder.svg'],
    location: 'New York, NY',
    interests: ['hiking', 'photography', 'food'],
    preferences: {
      minAge: 27,
      maxAge: 35,
      gender: 'male',
      interests: ['fitness', 'travel'],
      location: 'New York, NY',
      maxDistance: 25,
    },
    matchesRemaining: 2,
    lastMatchRequest: null,
  },
  {
    id: '2',
    name: 'Michael Davis',
    age: 31,
    gender: 'male',
    bio: 'Software engineer who enjoys fitness and travel.',
    images: ['/placeholder.svg', '/placeholder.svg'],
    location: 'Boston, MA',
    interests: ['fitness', 'travel', 'technology'],
    preferences: {
      minAge: 25,
      maxAge: 32,
      gender: 'female',
      interests: ['fitness', 'art'],
      location: 'Boston, MA',
      maxDistance: 20,
    },
    matchesRemaining: 2,
    lastMatchRequest: null,
  },
  {
    id: '3',
    name: 'Sophia Martinez',
    age: 27,
    gender: 'female',
    bio: 'Artist and yoga instructor seeking creative connections.',
    images: ['/placeholder.svg', '/placeholder.svg'],
    location: 'Chicago, IL',
    interests: ['art', 'yoga', 'music'],
    preferences: {
      minAge: 26,
      maxAge: 34,
      gender: 'male',
      interests: ['art', 'music'],
      location: 'Chicago, IL',
      maxDistance: 15,
    },
    matchesRemaining: 2,
    lastMatchRequest: null,
  },
  {
    id: '4',
    name: 'James Wilson',
    age: 33,
    gender: 'male',
    bio: 'Finance professional who loves cooking and wine tasting.',
    images: ['/placeholder.svg', '/placeholder.svg'],
    location: 'San Francisco, CA',
    interests: ['cooking', 'wine', 'hiking'],
    preferences: {
      minAge: 28,
      maxAge: 36,
      gender: 'female',
      interests: ['cooking', 'travel'],
      location: 'San Francisco, CA',
      maxDistance: 30,
    },
    matchesRemaining: 2,
    lastMatchRequest: null,
  },
  {
    id: '5',
    name: 'Olivia Lee',
    age: 29,
    gender: 'female',
    bio: 'Marketing specialist with a passion for literature and coffee.',
    images: ['/placeholder.svg', '/placeholder.svg'],
    location: 'Los Angeles, CA',
    interests: ['literature', 'coffee', 'beaches'],
    preferences: {
      minAge: 28,
      maxAge: 37,
      gender: 'male',
      interests: ['reading', 'outdoors'],
      location: 'Los Angeles, CA',
      maxDistance: 25,
    },
    matchesRemaining: 2,
    lastMatchRequest: null,
  },
  {
    id: '6',
    name: 'Daniel Brown',
    age: 30,
    gender: 'male',
    bio: 'Architect who enjoys rock climbing and craft beer.',
    images: ['/placeholder.svg', '/placeholder.svg'],
    location: 'Seattle, WA',
    interests: ['architecture', 'rock climbing', 'beer'],
    preferences: {
      minAge: 26,
      maxAge: 33,
      gender: 'female',
      interests: ['outdoors', 'design'],
      location: 'Seattle, WA',
      maxDistance: 20,
    },
    matchesRemaining: 2,
    lastMatchRequest: null,
  },
];

// Initialize mock data
const mockData = {
  users: MOCK_USERS,
  matches: [] as Match[],
  messages: [] as Message[],
  notifications: [] as Notification[],
};

// Current user (for testing/demo purposes)
let currentUser: User | null = null;

export const DataService = {
  // User operations
  getCurrentUser: () => {
    return currentUser;
  },

  setCurrentUser: (userId: string) => {
    currentUser = mockData.users.find(user => user.id === userId) || null;
    return currentUser;
  },

  getAllUsers: () => {
    return [...mockData.users];
  },

  getUserById: (userId: string) => {
    return mockData.users.find(user => user.id === userId);
  },

  // Match operations
  generateMatches: (userId: string): Match[] => {
    const user = mockData.users.find(u => u.id === userId);
    if (!user) return [];

    // Check if user has already requested matches today
    if (user.matchesRemaining <= 0) {
      return [];
    }

    // Check if user has unhandled matches
    const unhandledMatches = mockData.matches.filter(
      m => m.userId === userId && !m.contacted
    );
    if (unhandledMatches.length > 0) {
      return unhandledMatches;
    }

    // Find potential matches based on user preferences
    const potentialMatches = mockData.users.filter(u => {
      if (u.id === userId) return false;
      if (u.gender !== user.preferences.gender) return false;
      if (u.age < user.preferences.minAge || u.age > user.preferences.maxAge) return false;
      
      // Check if user was already matched before
      const alreadyMatched = mockData.matches.some(
        m => m.userId === userId && m.matchedUserId === u.id
      );
      if (alreadyMatched) return false;
      
      return true;
    });

    // Limit number based on gender
    const matchLimit = user.gender === 'female' ? 50 : 5;
    const matchesToCreate = potentialMatches.slice(0, matchLimit);
    
    // Create new matches
    const newMatches = matchesToCreate.map(matchUser => {
      const match: Match = {
        id: `match-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: userId,
        matchedUserId: matchUser.id,
        timestamp: new Date().toISOString(),
        viewed: false,
        contacted: false,
      };
      
      // Create notification for the potential match
      const notification: Notification = {
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: matchUser.id,
        type: 'match',
        relatedUserId: userId,
        content: `You've been selected as a potential match!`,
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      mockData.matches.push(match);
      mockData.notifications.push(notification);
      
      return match;
    });

    // Update user's match request count
    user.matchesRemaining -= 1;
    user.lastMatchRequest = new Date().toISOString();

    return newMatches.slice(0, 5); // Only return 5 matches to show to the user
  },

  getUserMatches: (userId: string): Match[] => {
    return mockData.matches
      .filter(match => match.userId === userId)
      .slice(0, 5); // Only show 5 matches
  },

  deleteMatch: (matchId: string): boolean => {
    const matchIndex = mockData.matches.findIndex(m => m.id === matchId);
    if (matchIndex !== -1) {
      mockData.matches.splice(matchIndex, 1);
      return true;
    }
    return false;
  },

  // Message operations
  sendMessage: (senderId: string, receiverId: string, content: string): Message | null => {
    const sender = mockData.users.find(u => u.id === senderId);
    const receiver = mockData.users.find(u => u.id === receiverId);
    
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
  },

  // Notification operations
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
