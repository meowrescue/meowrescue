
import React from 'react';
import { Button } from "@/components/ui/button";
import SectionHeading from './ui/SectionHeading';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const UrgentNeedsSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionHeading 
          title="Urgent Needs" 
          subtitle="Critical items we need now" 
          centered
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col">
            <div className="p-4 bg-meow-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Heart className="h-8 w-8 text-meow-primary" />
            </div>
            <h3 className="text-xl font-bold text-meow-primary mb-2">Kitten Formula</h3>
            <p className="text-gray-700 mb-auto">
              We urgently need KMR kitten formula for our orphaned bottle babies. We currently have 12 kittens under 4 weeks old.
            </p>
            <div className="mt-4 flex justify-center">
              <Button 
                variant="meow" 
                className="w-full"
                asChild
              >
                <a href="https://www.amazon.com/hz/wishlist/ls/example" target="_blank" rel="noopener noreferrer">
                  Donate KMR
                </a>
              </Button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col">
            <div className="p-4 bg-meow-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Heart className="h-8 w-8 text-meow-primary" />
            </div>
            <h3 className="text-xl font-bold text-meow-primary mb-2">Foster Homes</h3>
            <p className="text-gray-700 mb-auto">
              We need temporary foster homes for 6 adult cats who were recently rescued from a hoarding situation. Can you help?
            </p>
            <div className="mt-4 flex justify-center">
              <Button 
                variant="meow" 
                className="w-full"
                asChild
              >
                <Link to="/volunteer#volunteer-form">
                  Apply to Foster
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col">
            <div className="p-4 bg-meow-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Heart className="h-8 w-8 text-meow-primary" />
            </div>
            <h3 className="text-xl font-bold text-meow-primary mb-2">Medical Funds</h3>
            <p className="text-gray-700 mb-auto">
              Fluffy needs dental surgery that will cost $450. Your donation of any amount helps cover his medical care.
            </p>
            <div className="mt-4 flex justify-center">
              <Button 
                variant="meow" 
                className="w-full"
                asChild
              >
                <Link to="/donate">
                  Donate Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UrgentNeedsSection;
