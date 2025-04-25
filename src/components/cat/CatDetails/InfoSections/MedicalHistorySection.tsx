
import React from 'react';
import { format } from 'date-fns';
import { Medal } from 'lucide-react';
import { MedicalRecord } from '@/types/cat';

interface MedicalHistorySectionProps {
  medicalRecords: MedicalRecord[];
}

const MedicalHistorySection = ({ medicalRecords }: MedicalHistorySectionProps) => {
  if (!medicalRecords.length) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Medal className="mr-2 h-5 w-5 text-meow-primary" />
        Medical History
      </h3>
      <div className="space-y-4">
        {medicalRecords.map((record) => (
          <div key={record.id} className="border-b last:border-b-0 pb-4 last:pb-0">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">{record.procedure_type}</h4>
              <span className="text-sm text-gray-500">
                {format(new Date(record.record_date), 'MMM d, yyyy')}
              </span>
            </div>
            <p className="text-gray-600 mb-2">{record.description}</p>
            {record.veterinarian && (
              <p className="text-sm text-gray-500">Veterinarian: {record.veterinarian}</p>
            )}
            {record.notes && (
              <p className="text-sm text-gray-500 mt-1">Notes: {record.notes}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicalHistorySection;
