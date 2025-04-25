
import React from 'react';
import SectionHeading from './ui/SectionHeading';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const MissionSection: React.FC = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <SectionHeading 
          title="Our Mission" 
          subtitle="Saving one cat at a time" 
          centered
        />
        
        <div className="max-w-4xl mx-auto mb-10 text-center">
          <p className="text-lg text-gray-700 mb-6">
            Meow Rescue is a home-based cat rescue dedicated to saving cats and kittens in need throughout Pasco County, Florida. Our mission is to rescue, rehabilitate, and rehome cats while promoting responsible pet ownership.
          </p>
          <p className="text-lg text-gray-700">
            As a personal rescue effort, we operate from our home to provide temporary care and find loving forever homes for abandoned, stray, and surrendered cats. We're making a difference one cat at a time.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild variant="meow" size="lg">
            <Link to="/cats">Meet Our Cats</Link>
          </Button>
          
          <Button asChild variant="meowOutline" size="lg">
            <Link to="/donate">Support Our Efforts</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
