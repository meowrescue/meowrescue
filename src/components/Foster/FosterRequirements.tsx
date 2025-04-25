
import React from 'react';
import { ShieldCheck } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';

const FosterRequirements = () => {
  return (
    <div className="mt-20">
      <SectionHeading
        title="Foster Requirements"
        subtitle="What we look for in potential foster homes"
      />
      
      <div className="bg-white rounded-lg shadow-md p-8 mt-8 w-fit mx-auto">
        <ul className="space-y-4">
          <li className="flex items-start">
            <ShieldCheck className="h-6 w-6 text-meow-primary mr-4 mt-1 flex-shrink-0" />
            <span className="text-gray-700">Be at least 21 years of age and provide valid identification</span>
          </li>
          <li className="flex items-start">
            <ShieldCheck className="h-6 w-6 text-meow-primary mr-4 mt-1 flex-shrink-0" />
            <span className="text-gray-700">Have reliable transportation for vet appointments and adoption events</span>
          </li>
          <li className="flex items-start">
            <ShieldCheck className="h-6 w-6 text-meow-primary mr-4 mt-1 flex-shrink-0" />
            <span className="text-gray-700">Have a safe, secure indoor space for foster cats</span>
          </li>
          <li className="flex items-start">
            <ShieldCheck className="h-6 w-6 text-meow-primary mr-4 mt-1 flex-shrink-0" />
            <span className="text-gray-700">If renting, provide landlord approval for having foster cats</span>
          </li>
          <li className="flex items-start">
            <ShieldCheck className="h-6 w-6 text-meow-primary mr-4 mt-1 flex-shrink-0" />
            <span className="text-gray-700">Be willing to keep foster cats separate from resident pets, at least initially</span>
          </li>
          <li className="flex items-start">
            <ShieldCheck className="h-6 w-6 text-meow-primary mr-4 mt-1 flex-shrink-0" />
            <span className="text-gray-700">Provide regular updates and photos of foster cats for adoption promotion</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FosterRequirements;
