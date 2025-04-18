import React from 'react';
import { Cat, Heart, Home, Award } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import CountUp from './CountUp';

const StatsSection: React.FC = () => {
  // Fetch cats in care
  const { data: catsInCare = 0 } = useQuery({
    queryKey: ['cats-in-care-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('cats')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch total cats rescued (based on all cats ever entered in the system)
  const { data: totalRescued = 0 } = useQuery({
    queryKey: ['cats-rescued-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('cats')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch total adoptions
  const { data: totalAdoptions = 0 } = useQuery({
    queryKey: ['adoptions-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('cats')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Adopted');
      
      if (error) throw error;
      return count || 0;
    },
  });

  // Calculate years of service (from current date to when rescue was founded)
  const calculateYearsOfService = () => {
    const foundingDate = new Date('2022-01-01'); // Set to actual founding date
    const currentDate = new Date();
    const yearDiff = currentDate.getFullYear() - foundingDate.getFullYear();
    return yearDiff;
  };

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
                {catsInCare}+
              </div>
              <p className="text-gray-600">Cats in Care</p>
            </div>
            
            {/* Stat 2 */}
            <div className="text-center">
              <div className="bg-meow-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-meow-primary" />
              </div>
              <div className="text-4xl font-bold text-meow-primary mb-2">
                {totalRescued}
              </div>
              <p className="text-gray-600">Cats Rescued</p>
            </div>
            
            {/* Stat 3 */}
            <div className="text-center">
              <div className="bg-meow-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-meow-primary" />
              </div>
              <div className="text-4xl font-bold text-meow-primary mb-2">
                {totalAdoptions}
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
