
export type Gender = 'male' | 'female';

export interface UserPreference {
  minAge: number;
  maxAge: number;
  gender: Gender;
  interests: string[];
  location: string;
  maxDistance: number;
}

export interface User {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  bio: string;
  images: string[];
  location: string;
  interests: string[];
  preferences: UserPreference;
  matchesRemaining: number;
  lastMatchRequest: string | null;
}

export interface Match {
  id: string;
  userId: string;
  matchedUserId: string;
  timestamp: string;
  viewed: boolean;
  contacted: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'match' | 'message';
  relatedUserId: string;
  content: string;
  timestamp: string;
  read: boolean;
}
