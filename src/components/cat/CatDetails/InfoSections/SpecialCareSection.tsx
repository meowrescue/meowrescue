
import React from 'react';
import { Heart } from 'lucide-react';

interface SpecialCareSectionProps {
  medical_notes: string;
}

const SpecialCareSection = ({ medical_notes }: SpecialCareSectionProps) => {
  if (!medical_notes) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Heart className="mr-2 h-5 w-5 text-meow-primary" />
        Special Care Notes
      </h3>
      <p className="text-gray-600">{medical_notes}</p>
    </div>
  );
};

export default SpecialCareSection;
