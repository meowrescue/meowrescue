
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BackButton = () => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200 rounded-full shadow-sm"
      onClick={handleBack}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back
    </Button>
  );
};

export default BackButton;
