
import React from 'react';
import { Link } from 'react-router-dom';
import SectionHeading from './ui/SectionHeading';
import { Button } from "@/components/ui/button";
import { HelpingHand, Heart, DollarSign } from 'lucide-react';

const UrgentNeedsSection: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionHeading 
          title="Urgent Needs" 
          subtitle="We need your help to continue our mission"
          centered
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {/* Food Fund */}
          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow flex flex-col h-full">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-meow-primary/10 rounded-full">
                <DollarSign size={32} className="text-meow-primary" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center mb-6">Monthly Food Fund</h3>
            <p className="text-gray-700 mb-6 flex-grow">
              We currently spend nearly $1,000 per month just on quality cat food. Your contribution helps 
              ensure our 24 cats and kittens are well-fed and nourished.
            </p>
            <div className="bg-gray-100 p-5 rounded-lg mb-6">
              <p className="font-medium text-center">
                $15 feeds a cat for a week
              </p>
            </div>
            <Button asChild size="full" className="mt-auto">
              <Link to="/donate" onClick={scrollToTop}>Contribute to Food Fund</Link>
            </Button>
          </div>
          
          {/* Urgent Medical Care */}
          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow flex flex-col h-full">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-meow-primary/10 rounded-full">
                <Heart size={32} className="text-meow-primary" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center mb-6">Fluffy's Medical Care</h3>
            <p className="text-gray-700 mb-6 flex-grow">
              Fluffy was rescued after a suspected coyote attack with severe injuries. He needs veterinary assessment, treatment for a skin condition, neutering, and flea treatment.
            </p>
            <div className="bg-gray-100 p-5 rounded-lg mb-6">
              <p className="font-medium text-center">
                $250 will cover Fluffy's immediate medical needs
              </p>
            </div>
            <Button asChild size="full" variant="meowSecondary" className="mt-auto">
              <Link to="/donate?amount=250&cause=fluffys-care" onClick={scrollToTop}>Help Fluffy Heal</Link>
            </Button>
          </div>
          
          {/* Foster Homes */}
          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow flex flex-col h-full">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-meow-primary/10 rounded-full">
                <HelpingHand size={32} className="text-meow-primary" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center mb-6">Foster Homes Needed</h3>
            <p className="text-gray-700 mb-6 flex-grow">
              We urgently need foster homes to alleviate space constraints and allow us to help more cats in need. Currently, we have 5 kittens who will need homes in the coming weeks.
            </p>
            <div className="bg-gray-100 p-5 rounded-lg mb-6">
              <p className="font-medium text-center">
                Even a short-term foster makes a huge difference
              </p>
            </div>
            <Button asChild size="full" variant="meowSecondary" className="mt-auto">
              <Link to="/volunteer?type=foster" onClick={scrollToTop}>Become a Foster</Link>
            </Button>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <Button 
            asChild
            variant="meow"
            size="xl"
            className="px-10"
          >
            <Link to="/donate" onClick={scrollToTop}>Make a Donation</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default UrgentNeedsSection;
