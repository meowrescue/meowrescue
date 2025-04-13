
import React from "react";

const LoadingState: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
        <div className="md:flex gap-8">
          <div className="w-full md:w-1/2 h-[400px] bg-gray-200 rounded mb-6 md:mb-0"></div>
          <div className="w-full md:w-1/2">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-20 bg-gray-200 rounded mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
