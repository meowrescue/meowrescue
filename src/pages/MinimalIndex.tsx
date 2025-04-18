
import React, { useEffect } from 'react';

const MinimalIndex: React.FC = () => {
  useEffect(() => {
    console.log('MinimalIndex component mounted');
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
      <h1 className="text-3xl font-bold mb-4 text-meow-primary">MeowRescue</h1>
      <p className="text-lg text-center mb-8 max-w-md">
        We're a home-based cat rescue in Pasco County, Florida, dedicated to rescuing, 
        rehabilitating, and rehoming cats in need.
      </p>
      <div className="bg-meow-secondary text-white px-6 py-3 rounded-md shadow-md">
        Emergency Minimal View - Site Under Maintenance
      </div>
    </div>
  );
};

export default MinimalIndex;
