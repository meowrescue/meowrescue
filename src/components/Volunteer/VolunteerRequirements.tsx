
import React from 'react';
import { ShieldCheck } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';

const requirements = [
  "Be at least 18 years of age (youth volunteers 14-17 may participate with parental supervision)",
  "Complete a volunteer orientation and required training for your specific role",
  "Commit to at least 4 hours per month for a minimum of six months",
  "Follow all shelter protocols and guidelines for animal handling and safety",
  "Represent Meow Rescue professionally in the community",
];

const VolunteerRequirements = () => {
  return (
    <div className="mt-20">
      <SectionHeading
        title="Volunteer Requirements"
        subtitle="What we ask of our volunteers"
      />
      
      <div className="bg-white rounded-lg shadow-md p-8 mt-8 w-fit mx-auto">
        <ul className="space-y-4">
          {requirements.map((requirement, index) => (
            <li key={index} className="flex items-start">
              <ShieldCheck className="h-6 w-6 text-meow-primary mr-4 mt-1 flex-shrink-0" />
              <span className="text-gray-700">{requirement}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VolunteerRequirements;
