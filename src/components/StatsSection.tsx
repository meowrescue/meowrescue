
import React from 'react';
import { Cat, Heart, Home, Award } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import CountUp from './CountUp';

const StatsSection: React.FC = () => {
  // Fetch cats in care
  const { data: catsInCare = 0, isError: isCatsInCareError, error: catsInCareError } = useQuery({
    queryKey: ['cats-in-care-count'],
    queryFn: async () => {
      try {
        console.log('Fetching cats in care count...');
        const { count, error } = await supabase
          .from('cats')
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.error('Error fetching cats in care:', error);
          throw error;
        }
        
        console.log('Cats in care count result:', count);
        return count || 0;
      } catch (err) {
        console.error('Exception fetching cats in care:', err);
        throw err;
      }
    },
    retry: 1,
    retryDelay: 1000,
  });

  // Fetch total cats rescued (based on all cats ever entered in the system)
  const { data: totalRescued = 0, isError: isTotalRescuedError, error: totalRescuedError } = useQuery({
    queryKey: ['cats-rescued-count'],
    queryFn: async () => {
      try {
        console.log('Fetching total rescued cats count...');
        const { count, error } = await supabase
          .from('cats')
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.error('Error fetching total rescued cats:', error);
          throw error;
        }
        
        console.log('Total rescued cats result:', count);
        return count || 0;
      } catch (err) {
        console.error('Exception fetching total rescued cats:', err);
        throw err;
      }
    },
    retry: 1,
    retryDelay: 1000,
  });

  // Fetch total adoptions
  const { data: totalAdoptions = 0, isError: isTotalAdoptionsError, error: totalAdoptionsError } = useQuery({
    queryKey: ['adoptions-count'],
    queryFn: async () => {
      try {
        console.log('Fetching total adoptions count...');
        const { count, error } = await supabase
          .from('cats')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'Adopted');
        
        if (error) {
          console.error('Error fetching total adoptions:', error);
          throw error;
        }
        
        console.log('Total adoptions result:', count);
        return count || 0;
      } catch (err) {
        console.error('Exception fetching total adoptions:', err);
        throw err;
      }
    },
    retry: 1,
    retryDelay: 1000,
  });

  // Calculate years of service (from current date to when rescue was founded)
  const calculateYearsOfService = () => {
    const foundingDate = new Date('2022-01-01'); // Set to actual founding date
    const currentDate = new Date();
    const yearDiff = currentDate.getFullYear() - foundingDate.getFullYear();
    return yearDiff;
  };

  // Log any errors for debugging
  React.useEffect(() => {
    if (isCatsInCareError) console.error('Cats in care error:', catsInCareError);
    if (isTotalRescuedError) console.error('Total rescued error:', totalRescuedError);
    if (isTotalAdoptionsError) console.error('Total adoptions error:', totalAdoptionsError);
  }, [isCatsInCareError, isTotalRescuedError, isTotalAdoptionsError]);

  return (
    <section className="py-16 bg-meow-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stat 1 */}
            <div className="text-center">
              <div className="bg-meow-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Cat className="w-8 h-8 text-meow-primary" />
              </div>
              <div className="text-4xl font-bold text-meow-primary mb-2">
                {isCatsInCareError ? '?' : `${catsInCare}+`}
              </div>
              <p className="text-gray-600">Cats in Care</p>
            </div>
            
            {/* Stat 2 */}
            <div className="text-center">
              <div className="bg-meow-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-meow-primary" />
              </div>
              <div className="text-4xl font-bold text-meow-primary mb-2">
                {isTotalRescuedError ? '?' : totalRescued}
              </div>
              <p className="text-gray-600">Cats Rescued</p>
            </div>
            
            {/* Stat 3 */}
            <div className="text-center">
              <div className="bg-meow-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-meow-primary" />
              </div>
              <div className="text-4xl font-bold text-meow-primary mb-2">
                {isTotalAdoptionsError ? '?' : totalAdoptions}
              </div>
              <p className="text-gray-600">Adoptions</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
