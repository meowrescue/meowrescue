
import React from 'react';
import { Utensils, Pill, Clipboard, Calendar } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';

const FosterProvisions = () => {
  return (
    <div className="mt-20 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-8">
        <SectionHeading
          title="What We Provide"
          subtitle="We support our foster families every step of the way"
          centered={true}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div className="flex items-start space-x-4">
            <div className="bg-meow-primary/10 p-3 rounded-full">
              <Utensils className="h-6 w-6 text-meow-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Food and Supplies</h3>
              <p className="text-gray-600">We provide all necessary food, litter, beds, toys, and enrichment items your foster cats will need.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="bg-meow-primary/10 p-3 rounded-full">
              <Pill className="h-6 w-6 text-meow-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Medical Care</h3>
              <p className="text-gray-600">All veterinary care is covered by our rescue. We ensure your foster cats get the medical attention they need.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="bg-meow-primary/10 p-3 rounded-full">
              <Clipboard className="h-6 w-6 text-meow-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Training and Support</h3>
              <p className="text-gray-600">Our experienced team provides guidance on cat care, behavior, and health concerns.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="bg-meow-primary/10 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-meow-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600">Going on vacation? We can arrange temporary care for your foster cats while you're away.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FosterProvisions;
