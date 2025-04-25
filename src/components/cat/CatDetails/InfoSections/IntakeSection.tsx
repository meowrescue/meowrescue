
import React from 'react';
import { format } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';

interface IntakeSectionProps {
  intake_date: string;
}

const IntakeSection = ({ intake_date }: IntakeSectionProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Calendar className="mr-2 h-5 w-5 text-meow-primary" />
        Intake Information
      </h3>
      <div className="space-y-2 text-gray-600">
        <p className="flex items-center">
          <Clock className="mr-2 h-4 w-4" />
          Intake Date: {format(new Date(intake_date), 'MMMM d, yyyy')}
        </p>
      </div>
    </div>
  );
};

export default IntakeSection;
