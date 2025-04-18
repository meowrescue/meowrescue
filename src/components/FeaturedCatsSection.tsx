
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
      try {
        const { data, error } = await supabase
          .from('cats')
          .select('*')
          .eq('status', 'Available')
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (error) {
          console.error('Error fetching featured cats:', error);
          throw error;
        }
        
        console.log('Featured cats data:', data);
        return data || [];
      } catch (error) {
        console.error('Exception fetching featured cats:', error);
        return [];
      }
    },
    retry: 1,
    refetchOnWindowFocus: false
  });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // If loading is complete and there are no cats, don't render the section
  if (!isLoading && featuredCats.length === 0 && !isError) {
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
        ) : isError ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">
              We're having trouble loading our featured cats. Please try again later.
            </p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          </div>
        ) : featuredCats.length > 0 ? (
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
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-gray-500 text-center mb-6">
              We currently don't have any cats available for adoption.
              Please check back soon or contact us for more information.
            </p>
            <Button asChild variant="outline">
              <Link to="/contact" onClick={scrollToTop}>Contact Us</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCatsSection;
