
import { Match, Notification } from '@/types';
import { mockData } from './mock/mockData';
import { UserService } from './userService';

export const MatchService = {
  generateMatches: (userId: string): Match[] => {
    const user = UserService.getUserById(userId);
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
  }
};
