
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Match, Message, Notification } from '@/types';
import { DataService } from '@/services/dataService';
import { AlgorithmService } from '@/services/algorithmService';
import { useToast } from '@/components/ui/use-toast';

interface AppContextType {
  currentUser: User | null;
  matches: Match[];
  notifications: Notification[];
  findMatches: () => void;
  deleteMatch: (matchId: string) => void;
  sendMessage: (receiverId: string, content: string) => void;
  getConversation: (userId: string) => Message[];
  markNotificationAsRead: (notificationId: string) => void;
  setCurrentUser: (userId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  // Initial setup - for demo purposes we'll select a user
  useEffect(() => {
    // For testing, set user ID 1 (female) as the current user
    const initialUser = DataService.setCurrentUser("1");
    setCurrentUser(initialUser);
    
    if (initialUser) {
      // Load initial matches and notifications
      const userMatches = DataService.getUserMatches(initialUser.id);
      const userNotifications = DataService.getUserNotifications(initialUser.id);
      
      setMatches(userMatches);
      setNotifications(userNotifications);
    }
  }, []);

  // Find matches for the current user
  const findMatches = () => {
    if (!currentUser) return;
    
    if (currentUser.matchesRemaining <= 0) {
      toast({
        title: "No matches remaining today",
        description: "You've used all your matches for today. Try again tomorrow.",
        variant: "destructive",
      });
      return;
    }
    
    // Check for unhandled matches
    const unhandledMatches = matches.filter(m => !m.contacted);
    if (unhandledMatches.length > 0) {
      toast({
        title: "You have pending matches",
        description: "Please respond to your current matches before finding new ones.",
        variant: "destructive",
      });
      return;
    }
    
    const newMatches = AlgorithmService.findMatches(currentUser.id);
    
    if (newMatches.length > 0) {
      setMatches(newMatches);
      
      // Update the current user with new matchesRemaining count
      const updatedUser = DataService.getCurrentUser();
      setCurrentUser(updatedUser);
      
      toast({
        title: "New matches found!",
        description: `We found ${newMatches.length} potential matches for you.`,
      });
    } else {
      toast({
        title: "No new matches found",
        description: "We couldn't find any new matches. Try again later or adjust your preferences.",
      });
    }
  };
  
  // Delete a match from the user's list
  const deleteMatch = (matchId: string) => {
    const result = DataService.deleteMatch(matchId);
    if (result) {
      setMatches(matches.filter(m => m.id !== matchId));
      toast({
        title: "Match removed",
        description: "The match has been removed from your list.",
      });
    }
  };
  
  // Send a message to another user
  const sendMessage = (receiverId: string, content: string) => {
    if (!currentUser) return;
    
    const result = DataService.sendMessage(currentUser.id, receiverId, content);
    
    if (result) {
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
    } else {
      // If the message failed to send, show an error message
      toast({
        title: "Message not sent",
        description: currentUser.gender === 'male' 
          ? "Males cannot initiate contact. Wait for the other person to message you first."
          : "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Get conversation between current user and another user
  const getConversation = (userId: string): Message[] => {
    if (!currentUser) return [];
    return DataService.getConversation(currentUser.id, userId);
  };
  
  // Mark a notification as read
  const markNotificationAsRead = (notificationId: string) => {
    const result = DataService.markNotificationAsRead(notificationId);
    if (result) {
      setNotifications(prevNotifications => 
        prevNotifications.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    }
  };
  
  // Change the current user (for demo purposes)
  const switchUser = (userId: string) => {
    const user = DataService.setCurrentUser(userId);
    setCurrentUser(user);
    
    if (user) {
      // Update matches and notifications for the new user
      const userMatches = DataService.getUserMatches(user.id);
      const userNotifications = DataService.getUserNotifications(user.id);
      
      setMatches(userMatches);
      setNotifications(userNotifications);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        matches,
        notifications,
        findMatches,
        deleteMatch,
        sendMessage,
        getConversation,
        markNotificationAsRead,
        setCurrentUser: switchUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
