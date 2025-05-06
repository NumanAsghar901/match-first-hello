
import React from 'react';
import { Notification, User } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { DataService } from '@/services/dataService';
import { formatDistanceToNow } from 'date-fns';

interface NotificationItemProps {
  notification: Notification;
  onRead: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onRead,
}) => {
  const relatedUser = DataService.getUserById(notification.relatedUserId) as User;
  
  return (
    <Card 
      className={`cursor-pointer transition-colors hover:bg-accent ${notification.read ? 'bg-muted/50' : 'bg-white'}`}
      onClick={onRead}
    >
      <CardContent className="p-4 flex items-start gap-3">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <img src={relatedUser?.images[0] || '/placeholder.svg'} alt={relatedUser?.name} />
        </Avatar>
        
        <div className="flex-1">
          <p className="text-sm">
            <span className="font-semibold">{relatedUser?.name}</span>
            {' '}
            {notification.content}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
          </p>
        </div>
        
        {!notification.read && (
          <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationItem;
