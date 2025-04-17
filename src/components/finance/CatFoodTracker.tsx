
import React from 'react';

interface CatFoodTrackerProps {
  isAdmin?: boolean;
}

const CatFoodTracker: React.FC<CatFoodTrackerProps> = ({ isAdmin = false }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Cat Food Tracker</h2>
      <p>This feature is currently under development.</p>
      {isAdmin && (
        <p className="text-sm text-gray-500">
          Admin controls will be available here.
        </p>
      )}
    </div>
  );
};

export default CatFoodTracker;
