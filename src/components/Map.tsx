
import React from 'react';

const Map = () => {
  return (
    <div className="relative w-full h-[400px] rounded-lg shadow-lg overflow-hidden">
      <div className="absolute inset-0 bg-meow-primary/10 flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1426604966848-d7adac402bff" 
          alt="Tampa Bay Area Map - Pasco County Location"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20">
          <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg shadow-lg">
            <p className="font-medium text-gray-900">Meow Rescue Location</p>
            <p className="text-sm text-gray-600">7726 US Highway 19, New Port Richey, FL 34652</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
