
import React from 'react';
import SectionHeading from './ui/SectionHeading';
import { Button } from "@/components/ui/button";

const MissionSection: React.FC = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeading 
              title="Our Mission" 
              subtitle="Saving local lives, one paw at a time"
            />
            <p className="text-gray-700 mb-6">
              Meow Rescue is a home-based cat rescue founded and operated by Patrick in the New Port Richey / Pasco County area of Florida. Our mission is to rescue, rehabilitate, and rehome cats and kittens in need from our local community.
            </p>
            <p className="text-gray-700 mb-6">
              What started as helping a few stray cats has grown into a dedicated rescue operation caring for approximately 24 cats and kittens at any given time. We're committed to providing each cat with the medical care, nutrition, and love they need until they find their forever homes.
            </p>
            <p className="text-gray-700 mb-6">
              As a small, home-based rescue, we face significant challenges in terms of space and resources. We rely entirely on the support of our community through donations, volunteer help, and foster homes to continue our lifesaving work.
            </p>
            <div className="mt-8">
              <Button 
                className="bg-meow-primary hover:bg-meow-primary/90 mr-4"
                asChild
              >
                <a href="/about">Learn More</a>
              </Button>
              <Button 
                variant="outline" 
                className="border-meow-primary text-meow-primary hover:bg-meow-primary/10"
                asChild
              >
                <a href="/volunteer">Get Involved</a>
              </Button>
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1511044568932-338cba0ad803?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
              alt="Person holding rescued kitten" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
