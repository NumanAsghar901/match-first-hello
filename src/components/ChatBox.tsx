
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Message, User } from '@/types';
import { Send } from 'lucide-react';
import { format } from 'date-fns';

interface ChatBoxProps {
  messages: Message[];
  currentUser: User;
  otherUser: User;
  onSendMessage: (content: string) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  messages,
  currentUser,
  otherUser,
  onSendMessage,
}) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-[70vh] border rounded-lg overflow-hidden">
      <div className="bg-primary/10 p-4 flex items-center gap-3 border-b">
        <Avatar className="h-10 w-10">
          <img src={otherUser.images[0] || '/placeholder.svg'} alt={otherUser.name} />
        </Avatar>
        <div>
          <h3 className="font-semibold">{otherUser.name}</h3>
          <p className="text-xs text-muted-foreground">{otherUser.age}, {otherUser.location.split(',')[0]}</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            {currentUser.gender === 'female' ? 
              "Send a message to start the conversation!" :
              "Wait for them to message you first."}
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.senderId === currentUser.id;
            return (
              <div 
                key={message.id} 
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  isCurrentUser ? 'bg-primary text-white' : 'bg-gray-100'
                }`}>
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    isCurrentUser ? 'text-white/70' : 'text-gray-500'
                  }`}>
                    {format(new Date(message.timestamp), 'p')}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2">
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={
            messages.length === 0 && currentUser.gender === 'male'
          }
        />
        <Button type="submit" size="icon" disabled={
          messages.length === 0 && currentUser.gender === 'male'
        }>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatBox;
