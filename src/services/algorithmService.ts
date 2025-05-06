
import { User, Match, UserPreference } from '@/types';
import { DataService } from './dataService';

export const AlgorithmService = {
  /**
   * Calculate compatibility score between two users
   * @param user1 The first user
   * @param user2 The second user
   * @returns Score between 0-100
   */
  calculateCompatibility: (user1: User, user2: User): number => {
    let score = 0;
    
    // Age preference match
    const user1AgePref = user1.preferences;
    const user2AgePref = user2.preferences;
    
    const user1AgeMatch = user2.age >= user1AgePref.minAge && user2.age <= user1AgePref.maxAge;
    const user2AgeMatch = user1.age >= user2AgePref.minAge && user1.age <= user2AgePref.maxAge;
    
    if (user1AgeMatch) score += 15;
    if (user2AgeMatch) score += 15;
    
    // Gender preference match (should be automatic based on initial filtering)
    const genderMatch = user1.preferences.gender === user2.gender && user2.preferences.gender === user1.gender;
    if (genderMatch) score += 20;
    
    // Interest overlap
    const user1Interests = new Set(user1.interests);
    const user2Interests = new Set(user2.interests);
    
    let sharedInterests = 0;
    user1Interests.forEach(interest => {
      if (user2Interests.has(interest)) sharedInterests++;
    });
    
    // Score based on percentage of shared interests
    const interestScore = Math.min(30, Math.floor((sharedInterests / Math.max(user1Interests.size, user2Interests.size)) * 30));
    score += interestScore;
    
    // Location preference
    const sameLocation = user1.location.split(',')[0] === user2.location.split(',')[0];
    if (sameLocation) score += 20;
    
    return Math.min(100, score);
  },
  
  /**
   * Find matches for a user based on preferences and compatibility
   * @param userId User ID to find matches for
   * @returns Array of generated matches
   */
  findMatches: (userId: string): Match[] => {
    const user = DataService.getUserById(userId);
    if (!user) return [];
    
    // Check daily match limit
    if (user.matchesRemaining <= 0) return [];
    
    // Check if user has unhandled matches
    const existingMatches = DataService.getUserMatches(userId);
    const unhandledMatches = existingMatches.filter(m => !m.contacted);
    if (unhandledMatches.length > 0) return unhandledMatches;
    
    // Get all users that match basic criteria
    const allUsers = DataService.getAllUsers();
    const potentialMatches = allUsers.filter(potentialMatch => {
      // Skip self
      if (potentialMatch.id === userId) return false;
      
      // Basic filtering
      if (potentialMatch.gender !== user.preferences.gender) return false;
      if (potentialMatch.age < user.preferences.minAge || potentialMatch.age > user.preferences.maxAge) return false;
      
      // Check if already matched before
      const alreadyMatched = existingMatches.some(m => m.matchedUserId === potentialMatch.id);
      if (alreadyMatched) return false;
      
      return true;
    });
    
    // Calculate compatibility scores
    const scoredMatches = potentialMatches.map(match => ({
      user: match,
      score: this.calculateCompatibility(user, match)
    }));
    
    // Sort by compatibility score
    scoredMatches.sort((a, b) => b.score - a.score);
    
    // Get top matches based on gender
    const matchLimit = user.gender === 'female' ? 50 : 5;
    const topMatches = scoredMatches.slice(0, matchLimit);
    
    // Create actual matches in the data service
    return DataService.generateMatches(userId);
  }
};
