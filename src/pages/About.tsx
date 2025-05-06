
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">About Our Matching Algorithm</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Learn how our advanced matching system creates meaningful connections between users.
          </p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <section className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6">How Our Algorithm Works</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Profile Creation</h3>
                <p className="text-gray-700">
                  Users create detailed profiles with their personal information, preferences, and what they're looking for in a match.
                  Our system analyzes these preferences to find compatible matches.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Match Generation</h3>
                <p className="text-gray-700">
                  When a user requests matches, our algorithm searches for potential matches based on their criteria:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
                  <li>
                    <strong>Female Users:</strong> The algorithm finds the best 50 matches based on her criteria and saves them in her match folder. She can view 5 matches at a time.
                  </li>
                  <li>
                    <strong>Male Users:</strong> The algorithm finds the best 5 matches based on his criteria and saves them in his match folder.
                  </li>
                  <li>
                    Both genders receive notifications when they've been selected as a potential match.
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Contact Rules</h3>
                <p className="text-gray-700">
                  We've implemented specific contact rules to create a more comfortable experience:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
                  <li>
                    <strong>Females:</strong> Can initiate contact with their potential matches by sending a "hello" message.
                  </li>
                  <li>
                    <strong>Males:</strong> Can only respond after receiving a message from a female match. They cannot initiate contact.
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Match Management</h3>
                <p className="text-gray-700">
                  To ensure thoughtful interactions:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
                  <li>Users see a maximum of 5 matches at a time.</li>
                  <li>Users can only request matches twice per day.</li>
                  <li>The algorithm never shows a matched profile more than once to the same user.</li>
                  <li>Users must either delete or contact previous matches before requesting new ones.</li>
                </ul>
              </div>
            </div>
          </section>
          
          <section className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6">Compatibility Factors</h2>
            <p className="text-gray-700 mb-4">
              Our algorithm considers multiple factors when calculating compatibility between users:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Age Preferences</h3>
                <p className="text-gray-700">
                  Matches users whose age falls within each other's specified age range preferences.
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Gender Selection</h3>
                <p className="text-gray-700">
                  Ensures matches align with users' gender preferences.
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Shared Interests</h3>
                <p className="text-gray-700">
                  Calculates compatibility based on the number of shared interests between users.
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Location Proximity</h3>
                <p className="text-gray-700">
                  Considers the distance between users based on their location preferences.
                </p>
              </div>
            </div>
          </section>
        </div>
        
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold mb-6">Ready to Find Your Match?</h2>
          <Link to="/dashboard">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Start Matching Now
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default About;
