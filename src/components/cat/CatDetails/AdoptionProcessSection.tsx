
import React from 'react';
import { Button } from '@/components/ui/button';
import SectionHeading from '@/components/ui/SectionHeading';

const AdoptionProcessSection: React.FC = () => {
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Adoption Process"
          subtitle="Here's what you need to know about adopting from us"
          centered
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-xl font-semibold mb-3">1. Application</div>
            <p className="text-gray-600">Fill out our adoption application form. We'll review your information and get back to you within 48 hours.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-xl font-semibold mb-3">2. Meet & Greet</div>
            <p className="text-gray-600">Schedule a time to meet your potential new family member. This helps ensure it's a perfect match.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-xl font-semibold mb-3">3. Welcome Home</div>
            <p className="text-gray-600">Complete the adoption fee and paperwork. We'll provide you with all necessary medical records and care instructions.</p>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Button asChild size="lg" className="bg-meow-primary hover:bg-meow-primary/90">
            <a href="/adopt">Start Adoption Process</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdoptionProcessSection;
