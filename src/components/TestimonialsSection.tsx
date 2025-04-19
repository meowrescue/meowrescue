import React from 'react';
import { Container } from './ui/Container.js';
import { SectionHeading } from './ui/SectionHeading.js';

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <Container>
        <SectionHeading
          title="What Our Community Says"
          subtitle="Kind words from our adopters and supporters"
          centered
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {/* Testimonial 1 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-700 italic mb-4">
              "Adopting Whiskers from Meow Rescue was the best decision we ever made. He's brought so much joy to our home!"
            </p>
            <div className="flex items-center">
              <div className="rounded-full h-12 w-12 bg-gray-200 mr-4">
                {/* You can add an image here if available */}
              </div>
              <div>
                <p className="font-semibold">Samantha J.</p>
                <p className="text-gray-500">Happy Adopter</p>
              </div>
            </div>
          </div>
          
          {/* Testimonial 2 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-700 italic mb-4">
              "The team at Meow Rescue is incredibly dedicated. Their passion for saving cats is truly inspiring."
            </p>
            <div className="flex items-center">
              <div className="rounded-full h-12 w-12 bg-gray-200 mr-4">
                {/* You can add an image here if available */}
              </div>
              <div>
                <p className="font-semibold">Michael K.</p>
                <p className="text-gray-500">Volunteer</p>
              </div>
            </div>
          </div>
          
          {/* Testimonial 3 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-700 italic mb-4">
              "We're so grateful to Meow Rescue for helping us find our perfect feline friend. They made the adoption process so easy."
            </p>
            <div className="flex items-center">
              <div className="rounded-full h-12 w-12 bg-gray-200 mr-4">
                {/* You can add an image here if available */}
              </div>
              <div>
                <p className="font-semibold">Jessica L.</p>
                <p className="text-gray-500">Adopter</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default TestimonialsSection;
