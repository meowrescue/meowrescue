
import React from 'react';
import { Info } from 'lucide-react';

interface AboutCatSectionProps {
  name: string;
  description: string;
  age_estimate: string;
  gender: string;
  breed: string;
  weight: string | null;
  color: string | null;
  pattern: string | null;
  eye_color: string | null;
  coat_type: string | null;
}

const AboutCatSection = ({ 
  name,
  description,
  age_estimate,
  gender,
  breed,
  weight,
  color,
  pattern,
  eye_color,
  coat_type
}: AboutCatSectionProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Info className="mr-2 h-5 w-5 text-meow-primary" />
        About {name}
      </h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <div className="grid grid-cols-2 gap-4 text-gray-600">
        <div className="space-y-2">
          <p><strong>Age:</strong> {age_estimate}</p>
          <p><strong>Gender:</strong> {gender}</p>
          <p><strong>Breed:</strong> {breed || 'Unknown'}</p>
          <p><strong>Weight:</strong> {weight ? `${weight} lbs` : 'Unknown'}</p>
        </div>
        <div className="space-y-2">
          <p><strong>Color:</strong> {color || 'Unknown'}</p>
          <p><strong>Pattern:</strong> {pattern || 'Unknown'}</p>
          <p><strong>Eye Color:</strong> {eye_color || 'Unknown'}</p>
          <p><strong>Coat Type:</strong> {coat_type || 'Unknown'}</p>
        </div>
      </div>
    </div>
  );
};

export default AboutCatSection;
