
import React from 'react';
import { Link } from 'react-router-dom';
import SectionHeading from './ui/SectionHeading';
import CatCard from './CatCard';
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const FeaturedCatsSection: React.FC = () => {
  // Fetch available cats from the database
  const { data: featuredCats = [], isLoading, isError } = useQuery({
    queryKey: ['featured-cats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cats')
        .select('*')
        .eq('status', 'Available')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data || [];
    },
  });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Don't render anything if there are no available cats
  if (isLoading === false && featuredCats.length === 0) {
    // If we have no cats to display, don't render the section at all
    return null;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <SectionHeading 
          title="Meet Our Adoptable Cats" 
          subtitle="Find your new best friend"
          centered
        />
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-meow-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {featuredCats.map(cat => (
                <CatCard 
                  key={cat.id}
                  id={cat.id}
                  name={cat.name}
                  imageUrl={cat.photos_urls ? cat.photos_urls[0] : ''}
                  age={cat.age_estimate || 'Unknown'}
                  gender={cat.gender || 'Unknown'}
                  description={cat.description || ''}
                  status={'Available'} // They're all available since we filtered them
                />
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button 
                asChild
                variant="meow"
              >
                <Link to="/cats" onClick={scrollToTop}>See All Cats</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedCatsSection;
