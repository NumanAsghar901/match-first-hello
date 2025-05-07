
class MatchingAlgorithm:
    """
    Dating site matching algorithm implementation in Python.
    This class contains methods to calculate compatibility between users and find matches.
    """
    
    @staticmethod
    def calculate_compatibility(user1, user2):
        """
        Calculate compatibility score between two users
        
        Args:
            user1 (dict): First user profile with preferences
            user2 (dict): Second user profile with preferences
            
        Returns:
            int: Compatibility score between 0-100
        """
        score = 0
        
        # Age preference match
        user1_age_pref = user1['preferences']
        user2_age_pref = user2['preferences']
        
        user1_age_match = user2['age'] >= user1_age_pref['min_age'] and user2['age'] <= user1_age_pref['max_age']
        user2_age_match = user1['age'] >= user2_age_pref['min_age'] and user1['age'] <= user2_age_pref['max_age']
        
        if user1_age_match:
            score += 15
        if user2_age_match:
            score += 15
        
        # Gender preference match
        gender_match = user1['preferences']['gender'] == user2['gender'] and user2['preferences']['gender'] == user1['gender']
        if gender_match:
            score += 20
        
        # Interest overlap
        user1_interests = set(user1['interests'])
        user2_interests = set(user2['interests'])
        
        shared_interests = len(user1_interests.intersection(user2_interests))
        
        # Score based on percentage of shared interests
        interest_score = min(30, int((shared_interests / max(len(user1_interests), len(user2_interests))) * 30))
        score += interest_score
        
        # Location preference
        same_location = user1['location'].split(',')[0] == user2['location'].split(',')[0]
        if same_location:
            score += 20
        
        return min(100, score)
    
    @staticmethod
    def find_matches(user_id, users, existing_matches):
        """
        Find matches for a user based on preferences and compatibility
        
        Args:
            user_id (str): User ID to find matches for
            users (list): List of all users in the system
            existing_matches (list): List of user's existing matches
            
        Returns:
            list: Generated matches sorted by compatibility
        """
        # Find the user
        user = next((u for u in users if u['id'] == user_id), None)
        if not user:
            return []
        
        # Check daily match limit
        if user.get('matches_remaining', 0) <= 0:
            return []
        
        # Check if user has unhandled matches
        unhandled_matches = [m for m in existing_matches if m['user_id'] == user_id and not m.get('contacted', False)]
        if unhandled_matches:
            return unhandled_matches
        
        # Get all users that match basic criteria
        potential_matches = []
        for potential_match in users:
            # Skip self
            if potential_match['id'] == user_id:
                continue
                
            # Basic filtering
            if potential_match['gender'] != user['preferences']['gender']:
                continue
                
            if potential_match['age'] < user['preferences']['min_age'] or potential_match['age'] > user['preferences']['max_age']:
                continue
                
            # Check if already matched before
            already_matched = any(m['user_id'] == user_id and m['matched_user_id'] == potential_match['id'] for m in existing_matches)
            if already_matched:
                continue
                
            potential_matches.append(potential_match)
        
        # Calculate compatibility scores
        scored_matches = [
            {
                'user': match,
                'score': MatchingAlgorithm.calculate_compatibility(user, match)
            }
            for match in potential_matches
        ]
        
        # Sort by compatibility score
        scored_matches.sort(key=lambda x: x['score'], reverse=True)
        
        # Get top matches based on gender
        match_limit = 50 if user['gender'] == 'female' else 5
        top_matches = scored_matches[:match_limit]
        
        # Return the top 5 matches to show to the user
        return [match for match in top_matches][:5]


# Example of how to use the algorithm with proper user data structure:
"""
# Example user data structure
users = [
    {
        "id": "user1",
        "name": "John Doe",
        "age": 28,
        "gender": "male",
        "location": "New York, USA",
        "interests": ["hiking", "movies", "cooking"],
        "preferences": {
            "min_age": 25,
            "max_age": 35,
            "gender": "female",
            "interests": ["hiking", "movies"],
            "location": "New York, USA",
            "max_distance": 50
        },
        "matches_remaining": 5,
        "last_match_request": "2023-05-06T14:30:00Z"
    }
]

# Example existing matches
matches = [
    {
        "id": "match1",
        "user_id": "user1",
        "matched_user_id": "user2",
        "timestamp": "2023-05-06T14:30:00Z",
        "viewed": True,
        "contacted": False
    }
]

# Get matches for user1
matching_algo = MatchingAlgorithm()
new_matches = matching_algo.find_matches("user1", users, matches)
"""
