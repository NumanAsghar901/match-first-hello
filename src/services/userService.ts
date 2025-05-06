
import { User } from '@/types';
import { mockData } from './mock/mockData';

// Local state for tracking the current user
let currentUserState: User | null = null;

export const UserService = {
  getCurrentUser: () => {
    return currentUserState;
  },

  setCurrentUser: (userId: string) => {
    currentUserState = mockData.users.find(user => user.id === userId) || null;
    return currentUserState;
  },

  getAllUsers: () => {
    return [...mockData.users];
  },

  getUserById: (userId: string) => {
    return mockData.users.find(user => user.id === userId);
  }
};
