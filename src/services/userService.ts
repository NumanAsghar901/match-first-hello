
import { User } from '@/types';
import { mockData, currentUser } from './mock/mockData';

export const UserService = {
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
  }
};
