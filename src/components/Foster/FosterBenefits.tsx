
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, PawPrint, Home } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';

const FosterBenefits = () => {
  return (
    <div className="mt-16">
      <SectionHeading
        title="Why Foster?"
        subtitle="Make a difference in a cat's life"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <Card className="hover-card-effect bg-white">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-meow-primary/10 flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-meow-primary" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Save Lives</h3>
            <p className="text-gray-600">
              By fostering, you're directly helping to save cats' lives by giving them a safe place to stay until adoption.
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover-card-effect bg-white">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-meow-primary/10 flex items-center justify-center mx-auto mb-4">
              <Home className="h-8 w-8 text-meow-primary" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Temporary Commitment</h3>
            <p className="text-gray-600">
              Fostering allows you to help cats without the long-term commitment of adoption, perfect for those who travel or have busy schedules.
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover-card-effect bg-white">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-meow-primary/10 flex items-center justify-center mx-auto mb-4">
              <PawPrint className="h-8 w-8 text-meow-primary" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Rewarding Experience</h3>
            <p className="text-gray-600">
              Experience the joy of watching shy or injured cats blossom into confident, healthy companions ready for their forever homes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FosterBenefits;
