
import React, { useEffect } from 'react';

const MinimalIndex: React.FC = () => {
  useEffect(() => {
    console.log('MinimalIndex component mounted');
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">MeowRescue</h1>
      <p className="text-lg text-center mb-8">
        We're a home-based cat rescue in Pasco County, Florida, dedicated to rescuing, 
        rehabilitating, and rehoming cats in need.
      </p>
      <div className="bg-meow-primary text-white px-4 py-2 rounded">
        Temporary Minimal View
      </div>
    </div>
  );
};

export default MinimalIndex;
