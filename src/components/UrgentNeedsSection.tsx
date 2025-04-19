import React from 'react';
import { Container } from './ui/Container';
import { Button } from '@/components/ui/button';
import SectionHeading from './ui/SectionHeading';

const UrgentNeedsSection: React.FC = () => {
  return (
    <section className="py-12 bg-gray-50">
      <Container>
        <SectionHeading
          title="Urgent Needs"
          subtitle="Help us provide immediate care"
          centered
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {/* Example Urgent Need Item */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-meow-primary mb-2">Medical Supplies</h3>
            <p className="text-gray-700 mb-4">
              We urgently need medical supplies to treat sick and injured cats.
            </p>
            <Button variant="meowOutline">Donate Now</Button>
          </div>

          {/* Example Urgent Need Item */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-meow-primary mb-2">Foster Homes</h3>
            <p className="text-gray-700 mb-4">
              We need more foster homes to provide temporary care for cats awaiting adoption.
            </p>
            <Button variant="meowOutline">Become a Foster</Button>
          </div>

          {/* Example Urgent Need Item */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-meow-primary mb-2">Food & Nutrition</h3>
            <p className="text-gray-700 mb-4">
              We require cat food and nutritional supplements to keep our cats healthy.
            </p>
            <Button variant="meowOutline">Donate Food</Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default UrgentNeedsSection;
