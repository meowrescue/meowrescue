
import React from 'react';
import SectionHeading from './ui/SectionHeading';
import { Button } from "@/components/ui/button";
import { HelpingHand, Heart, DollarSign } from 'lucide-react';

const UrgentNeedsSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionHeading 
          title="Urgent Needs" 
          subtitle="We need your help to continue our mission"
          centered
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Food Fund */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-meow-primary/10 rounded-full">
                <DollarSign size={32} className="text-meow-primary" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center mb-4">Monthly Food Fund</h3>
            <p className="text-gray-700 mb-6">
              We currently spend nearly $1,000 per month just on quality cat food. Your contribution helps 
              ensure our 24 cats and kittens are well-fed and nourished.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <p className="font-medium text-center">
                $15 feeds a cat for a week
              </p>
            </div>
            <Button className="w-full bg-meow-secondary hover:bg-meow-secondary/90">
              Contribute to Food Fund
            </Button>
          </div>
          
          {/* Urgent Medical Care */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-meow-primary/10 rounded-full">
                <Heart size={32} className="text-meow-primary" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center mb-4">Fluffy's Medical Care</h3>
            <p className="text-gray-700 mb-6">
              Fluffy was rescued after a suspected coyote attack with severe injuries. He needs veterinary assessment, treatment for a skin condition, neutering, and flea treatment.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <p className="font-medium text-center">
                $250 will cover Fluffy's immediate medical needs
              </p>
            </div>
            <Button className="w-full bg-meow-secondary hover:bg-meow-secondary/90">
              Help Fluffy Heal
            </Button>
          </div>
          
          {/* Foster Homes */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-meow-primary/10 rounded-full">
                <HelpingHand size={32} className="text-meow-primary" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center mb-4">Foster Homes Needed</h3>
            <p className="text-gray-700 mb-6">
              We urgently need foster homes to alleviate space constraints and allow us to help more cats in need. Currently, we have 5 kittens who will need homes in the coming weeks.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <p className="font-medium text-center">
                Even a short-term foster makes a huge difference
              </p>
            </div>
            <Button className="w-full bg-meow-secondary hover:bg-meow-secondary/90">
              Become a Foster
            </Button>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            className="bg-meow-primary hover:bg-meow-primary/90 px-8 py-6 text-lg"
            asChild
          >
            <a href="/donate">Make a Donation</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default UrgentNeedsSection;
