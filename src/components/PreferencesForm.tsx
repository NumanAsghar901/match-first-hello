
import React, { useState } from 'react';
import { UserPreference } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface PreferencesFormProps {
  preferences: UserPreference;
  onSave: (preferences: UserPreference) => void;
}

const PreferencesForm: React.FC<PreferencesFormProps> = ({
  preferences,
  onSave,
}) => {
  const [formData, setFormData] = useState<UserPreference>(preferences);
  const [newInterest, setNewInterest] = useState('');

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest.trim()],
      });
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(i => i !== interest),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Age Range</Label>
        <div className="flex items-center gap-4">
          <Input
            type="number"
            min="18"
            max="99"
            value={formData.minAge}
            onChange={(e) => setFormData({
              ...formData,
              minAge: Number(e.target.value),
            })}
            className="w-20"
          />
          <span>to</span>
          <Input
            type="number"
            min="18"
            max="99"
            value={formData.maxAge}
            onChange={(e) => setFormData({
              ...formData,
              maxAge: Number(e.target.value),
            })}
            className="w-20"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Looking for</Label>
        <RadioGroup
          value={formData.gender}
          onValueChange={(value) => setFormData({
            ...formData,
            gender: value as 'male' | 'female',
          })}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="male" />
            <Label htmlFor="male">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="female" />
            <Label htmlFor="female">Female</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>Location</Label>
        <Input
          value={formData.location}
          onChange={(e) => setFormData({
            ...formData,
            location: e.target.value,
          })}
          placeholder="City, State"
        />
      </div>

      <div className="space-y-2">
        <Label>Maximum Distance (miles)</Label>
        <div className="flex items-center gap-4">
          <Slider
            value={[formData.maxDistance]}
            min={1}
            max={100}
            step={1}
            onValueChange={(values) => setFormData({
              ...formData,
              maxDistance: values[0],
            })}
            className="flex-1"
          />
          <span className="w-8 text-center">{formData.maxDistance}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Interests</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.interests.map((interest) => (
            <Badge key={interest} className="pl-2">
              {interest}
              <button
                type="button"
                className="ml-1"
                onClick={() => handleRemoveInterest(interest)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            placeholder="Add an interest"
            className="flex-1"
          />
          <Button type="button" onClick={handleAddInterest} variant="outline">
            Add
          </Button>
        </div>
      </div>

      <Button type="submit" className="w-full">Save Preferences</Button>
    </form>
  );
};

export default PreferencesForm;
