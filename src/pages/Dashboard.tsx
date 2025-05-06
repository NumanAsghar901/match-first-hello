
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Heart, Search, MessageCircle, Bell, Settings } from 'lucide-react';
import ProfileCard from '@/components/ProfileCard';
import NotificationItem from '@/components/NotificationItem';
import ChatBox from '@/components/ChatBox';
import { useApp } from '@/contexts/AppContext';
import { DataService } from '@/services/dataService';
import { User } from '@/types';

const Dashboard = () => {
  const { 
    currentUser, 
    matches, 
    notifications, 
    findMatches, 
    deleteMatch, 
    sendMessage,
    getConversation,
    markNotificationAsRead,
  } = useApp();

  const [activeChat, setActiveChat] = useState<User | null>(null);
  const [showUserSelector, setShowUserSelector] = useState(false);

  // For demo purposes, let's show user selection
  const userOptions = DataService.getAllUsers().map(user => ({
    id: user.id,
    name: user.name,
    gender: user.gender,
  }));

  const handleDeleteMatch = (matchId: string) => {
    deleteMatch(matchId);
    if (activeChat && matches.some(m => m.id === matchId && m.matchedUserId === activeChat.id)) {
      setActiveChat(null);
    }
  };

  const handleStartChat = (user: User) => {
    setActiveChat(user);
  };

  const handleSendMessage = (content: string) => {
    if (activeChat) {
      sendMessage(activeChat.id, content);
    }
  };

  const handleNotificationClick = (notification: any) => {
    markNotificationAsRead(notification.id);
    
    if (notification.type === 'match') {
      // Find the match and set as active
      const matchedUser = DataService.getUserById(notification.relatedUserId);
      if (matchedUser) {
        setActiveChat(matchedUser);
      }
    } else if (notification.type === 'message') {
      // Open the chat with this user
      const messageSender = DataService.getUserById(notification.relatedUserId);
      if (messageSender) {
        setActiveChat(messageSender);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">MatchFirst</h1>
          
          {/* For demo: User selector */}
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowUserSelector(!showUserSelector)}
            >
              {currentUser?.name} ({currentUser?.gender})
            </Button>
            
            {showUserSelector && (
              <div className="absolute top-16 right-4 bg-white shadow-lg rounded-lg p-2 z-10 border">
                {userOptions.map(user => (
                  <Button 
                    key={user.id}
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => {
                      useApp().setCurrentUser(user.id);
                      setShowUserSelector(false);
                      setActiveChat(null);
                    }}
                  >
                    {user.name} ({user.gender})
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="matches">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="matches" className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Matches</span>
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Chat</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-1">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Alerts</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-1">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Settings</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="matches" className="mt-0">
                <div className="bg-white rounded-lg shadow p-4 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Your Matches</h2>
                    <Button 
                      onClick={findMatches}
                      disabled={!currentUser || currentUser.matchesRemaining <= 0}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Find Matches
                    </Button>
                  </div>
                  
                  {currentUser && (
                    <p className="text-sm text-muted-foreground mb-4">
                      You have {currentUser.matchesRemaining} match requests remaining today.
                    </p>
                  )}
                  
                  <div className="space-y-4">
                    {matches.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No matches yet. Click "Find Matches" to discover new people!
                      </div>
                    ) : (
                      matches.map(match => {
                        const matchedUser = DataService.getUserById(match.matchedUserId);
                        if (!matchedUser) return null;
                        
                        return (
                          <div key={match.id} className="border rounded-lg p-3">
                            <div className="flex items-center gap-3">
                              <img 
                                src={matchedUser.images[0] || '/placeholder.svg'} 
                                alt={matchedUser.name} 
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <h3 className="font-semibold">{matchedUser.name}, {matchedUser.age}</h3>
                                <p className="text-xs text-muted-foreground">{matchedUser.location}</p>
                              </div>
                            </div>
                            
                            <div className="flex gap-2 mt-3">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex-1"
                                onClick={() => handleDeleteMatch(match.id)}
                              >
                                Skip
                              </Button>
                              <Button 
                                size="sm" 
                                className="flex-1"
                                onClick={() => handleStartChat(matchedUser)}
                                disabled={currentUser?.gender === 'male'}
                              >
                                {currentUser?.gender === 'female' ? 'Message' : 'Wait for message'}
                              </Button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="chat" className="mt-0">
                <div className="bg-white rounded-lg shadow p-4">
                  <h2 className="text-lg font-semibold mb-4">Messages</h2>
                  
                  <div className="space-y-2">
                    {matches.filter(match => match.contacted).length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No active conversations yet.
                      </div>
                    ) : (
                      matches.filter(match => match.contacted).map(match => {
                        const matchedUser = DataService.getUserById(match.matchedUserId);
                        if (!matchedUser) return null;
                        
                        const conversation = getConversation(matchedUser.id);
                        const lastMessage = conversation[conversation.length - 1];
                        
                        return (
                          <div 
                            key={match.id} 
                            className={`border rounded-lg p-3 cursor-pointer hover:bg-gray-50 ${
                              activeChat?.id === matchedUser.id ? 'bg-primary/10 border-primary' : ''
                            }`}
                            onClick={() => handleStartChat(matchedUser)}
                          >
                            <div className="flex items-center gap-3">
                              <img 
                                src={matchedUser.images[0] || '/placeholder.svg'} 
                                alt={matchedUser.name} 
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <h3 className="font-semibold">{matchedUser.name}, {matchedUser.age}</h3>
                                {lastMessage ? (
                                  <p className="text-xs text-muted-foreground truncate">
                                    {lastMessage.senderId === currentUser?.id ? 'You: ' : ''}
                                    {lastMessage.content}
                                  </p>
                                ) : (
                                  <p className="text-xs text-muted-foreground italic">
                                    No messages yet
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="notifications" className="mt-0">
                <div className="bg-white rounded-lg shadow p-4">
                  <h2 className="text-lg font-semibold mb-4">Notifications</h2>
                  
                  <div className="space-y-2">
                    {notifications.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No notifications at this time.
                      </div>
                    ) : (
                      notifications.map(notification => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onRead={() => handleNotificationClick(notification)}
                        />
                      ))
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="mt-0">
                <div className="bg-white rounded-lg shadow p-4">
                  <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Your Information</h3>
                      {currentUser && (
                        <div className="text-sm">
                          <p><span className="font-medium">Name:</span> {currentUser.name}</p>
                          <p><span className="font-medium">Age:</span> {currentUser.age}</p>
                          <p><span className="font-medium">Location:</span> {currentUser.location}</p>
                          <p><span className="font-medium">Bio:</span> {currentUser.bio}</p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Preferences</h3>
                      {currentUser && (
                        <div className="text-sm">
                          <p><span className="font-medium">Age Range:</span> {currentUser.preferences.minAge} - {currentUser.preferences.maxAge}</p>
                          <p><span className="font-medium">Looking for:</span> {currentUser.preferences.gender === 'male' ? 'Men' : 'Women'}</p>
                          <p><span className="font-medium">Location:</span> {currentUser.preferences.location}</p>
                          <p><span className="font-medium">Max Distance:</span> {currentUser.preferences.maxDistance} miles</p>
                        </div>
                      )}
                    </div>
                    
                    <Button>Edit Profile</Button>
                  </div>
                </div>
              </TabsContent>
            </div>
            
            <div className="md:w-2/3">
              {activeChat ? (
                <ChatBox
                  currentUser={currentUser!}
                  otherUser={activeChat}
                  messages={getConversation(activeChat.id)}
                  onSendMessage={handleSendMessage}
                />
              ) : (
                <div className="h-[70vh] flex items-center justify-center border rounded-lg bg-white">
                  <div className="text-center p-6">
                    <MessageCircle className="h-12 w-12 text-muted-foreground opacity-20 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Chat Selected</h3>
                    <p className="text-muted-foreground">
                      Select a match to start chatting
                      {currentUser?.gender === 'male' && (
                        <> (Remember: females must message first)</>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
