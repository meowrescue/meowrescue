
import React from 'react';
import Layout from '../components/Layout';
import SectionHeading from '../components/ui/SectionHeading';
import CatCard from '../components/CatCard';
import { cats } from '../data/cats';
import CtaSection from '../components/CtaSection';

const Cats: React.FC = () => {
  // Filter cats that are available for adoption
  const availableCats = cats.filter(cat => cat.status === 'Available');
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <SectionHeading 
          title="Adoptable Cats" 
          subtitle="Find your perfect feline companion"
          centered
        />
        
        <div className="mb-8 text-center">
          <p className="text-gray-700 max-w-4xl mx-auto">
            Each of our cats has been rescued, given medical care, and showered with love. They're now ready to find their forever homes. Get to know our adoptable cats below, and when you're ready, submit an adoption application.
          </p>
        </div>
        
        {availableCats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {availableCats.map(cat => (
              <CatCard 
                key={cat.id}
                id={cat.id}
                name={cat.name}
                imageUrl={cat.imageUrl}
                age={cat.age}
                gender={cat.gender}
                description={cat.description}
                status={cat.status}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-700">
              All of our cats have found homes! Check back soon as we rescue and rehabilitate more cats in need.
            </p>
          </div>
        )}
        
        <div className="mt-16 bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-meow-primary mb-4 text-center">Adoption Process</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-meow-primary/10 rounded-full flex items-center justify-center text-meow-primary font-bold text-2xl mb-4 mx-auto">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2 text-center">Submit Application</h3>
              <p className="text-gray-700 text-center">
                Complete our online adoption application. We'll review it and contact you within 2-3 days.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-meow-primary/10 rounded-full flex items-center justify-center text-meow-primary font-bold text-2xl mb-4 mx-auto">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2 text-center">Meet & Greet</h3>
              <p className="text-gray-700 text-center">
                Schedule a time to meet the cat(s) you're interested in. Spend time getting to know each other.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-meow-primary/10 rounded-full flex items-center justify-center text-meow-primary font-bold text-2xl mb-4 mx-auto">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2 text-center">Finalize Adoption</h3>
              <p className="text-gray-700 text-center">
                Complete the adoption contract, pay the adoption fee, and welcome your new family member home!
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <a href="/adopt" className="text-meow-primary font-medium hover:underline">
              Learn more about our adoption process →
            </a>
          </div>
        </div>
      </div>
      
      <CtaSection 
        title="Can't Adopt Right Now?"
        description="You can still make a difference in the lives of our cats by fostering, volunteering, or donating."
        buttonText="Other Ways to Help"
        buttonLink="/volunteer"
        bgColor="bg-meow-secondary"
      />
    </Layout>
  );
};

export default Cats;
