
import React from 'react';
import { User } from '@/types';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, X, MessageCircle } from 'lucide-react';

interface ProfileCardProps {
  user: User;
  isMatch?: boolean;
  onLike?: () => void;
  onSkip?: () => void;
  onMessage?: () => void;
  currentUserGender?: 'male' | 'female';
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  isMatch = false,
  onLike,
  onSkip,
  onMessage,
  currentUserGender,
}) => {
  // Determine if messaging is allowed (females can message, males can only respond)
  const canInitiateContact = currentUserGender === 'female';

  return (
    <Card className={`profile-card w-full max-w-md mx-auto ${isMatch ? 'match-animation' : ''}`}>
      <div className="relative h-80">
        <img
          src={user.images[0] || '/placeholder.svg'}
          alt={user.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white text-2xl font-bold">{user.name}, {user.age}</h3>
          <p className="text-white/80">{user.location}</p>
        </div>
      </div>

      <CardContent className="pt-4">
        <p className="text-gray-700 mb-4">{user.bio}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {user.interests.map((interest, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {interest}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between gap-2 border-t p-4">
        {onSkip && (
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full" 
            onClick={onSkip}
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        {onMessage && (
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            disabled={!canInitiateContact} 
            onClick={onMessage}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {canInitiateContact ? 'Message' : 'Waiting for message'}
          </Button>
        )}

        {onLike && (
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full" 
            onClick={onLike}
          >
            <Heart className="h-4 w-4 text-primary" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
