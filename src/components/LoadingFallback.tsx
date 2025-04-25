
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingFallbackProps {
  type?: 'card' | 'profile' | 'text' | 'full';
}

const LoadingFallback: React.FC<LoadingFallbackProps> = ({ type = 'full' }) => {
  if (type === 'card') {
    return (
      <div className="w-full rounded-lg border border-gray-200 p-4">
        <Skeleton className="h-48 w-full mb-4" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-4/5" />
        <div className="flex justify-end mt-4">
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    );
  }

  if (type === 'profile') {
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-3 w-[100px]" />
        </div>
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[70%]" />
      </div>
    );
  }

  // Full page skeleton
  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-8">
      {/* Header */}
      <Skeleton className="h-16 w-full max-w-lg mx-auto mb-8" />
      
      {/* Hero */}
      <Skeleton className="h-80 w-full rounded-lg" />
      
      {/* Content sections */}
      <div className="space-y-8 mt-12">
        <Skeleton className="h-8 w-1/3 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="h-32 rounded-md" />
          <Skeleton className="h-32 rounded-md" />
          <Skeleton className="h-32 rounded-md" />
        </div>
      </div>
      
      {/* More content */}
      <div className="space-y-4 mt-8">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
};

export default LoadingFallback;
