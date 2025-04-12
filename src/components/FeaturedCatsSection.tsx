
import React from 'react';
import SectionHeading from './ui/SectionHeading';
import CatCard from './CatCard';
import { Button } from "@/components/ui/button";
import { cats } from '../data/cats';

const FeaturedCatsSection: React.FC = () => {
  // Display only available cats, limited to 3
  const featuredCats = cats
    .filter(cat => cat.status === 'Available')
    .slice(0, 3);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <SectionHeading 
          title="Meet Our Adoptable Cats" 
          subtitle="Find your new best friend"
          centered
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {featuredCats.map(cat => (
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
        
        <div className="mt-12 text-center">
          <Button 
            className="bg-meow-primary hover:bg-meow-primary/90 px-8"
            asChild
          >
            <a href="/cats">See All Cats</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCatsSection;
