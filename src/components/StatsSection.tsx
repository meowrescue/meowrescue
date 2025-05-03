import React, { useEffect } from 'react';
import { Cat, Heart, Home } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import getSupabaseClient, { checkSupabaseConnection } from '@/integrations/supabase/client';
import CountUp from './CountUp';
import { useToast } from '@/hooks/use-toast';

const StatsSection: React.FC = () => {
  const { toast } = useToast();
  
  // First check if Supabase connection is working
  const { data: connectionStatus, isLoading: connectionChecking } = useQuery({
    queryKey: ['supabase-connection-check'],
    queryFn: async () => {
      console.log('Checking Supabase connection from StatsSection...');
      return await checkSupabaseConnection();
    },
    retry: 2,
    retryDelay: 1000,
  });
  
  // Show toast if connection failed
  useEffect(() => {
    if (connectionStatus && !connectionStatus.connected) {
      console.error('Supabase connection failed in StatsSection:', connectionStatus.error);
      toast({
        title: "Connection Issue",
        description: "Unable to load statistics. Please try refreshing the page.",
        variant: "destructive",
      });
    }
  }, [connectionStatus, toast]);

  // Fetch cats in care
  const { data: catsInCare = 0, isError: isCatsInCareError, error: catsInCareError } = useQuery({
    queryKey: ['cats-in-care-count'],
    queryFn: async () => {
      try {
        console.log('Fetching cats in care count...');
        if (!connectionStatus?.connected) {
          throw new Error('Supabase connection is not available');
        }
        
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
    enabled: !!connectionStatus?.connected,
    retry: 2,
    retryDelay: 1000,
  });

  // Fetch total cats rescued (based on all cats ever entered in the system)
  const { data: totalRescued = 0, isError: isTotalRescuedError, error: totalRescuedError } = useQuery({
    queryKey: ['cats-rescued-count'],
    queryFn: async () => {
      try {
        console.log('Fetching total rescued cats count...');
        if (!connectionStatus?.connected) {
          throw new Error('Supabase connection is not available');
        }
        
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
    enabled: !!connectionStatus?.connected,
    retry: 2,
    retryDelay: 1000,
  });

  // Fetch total adoptions
  const { data: totalAdoptions = 0, isError: isTotalAdoptionsError, error: totalAdoptionsError } = useQuery({
    queryKey: ['adoptions-count'],
    queryFn: async () => {
      try {
        console.log('Fetching total adoptions count...');
        if (!connectionStatus?.connected) {
          throw new Error('Supabase connection is not available');
        }
        
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
    enabled: !!connectionStatus?.connected,
    retry: 2,
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
  useEffect(() => {
    if (isCatsInCareError) console.error('Cats in care error:', catsInCareError);
    if (isTotalRescuedError) console.error('Total rescued error:', totalRescuedError);
    if (isTotalAdoptionsError) console.error('Total adoptions error:', totalAdoptionsError);
  }, [isCatsInCareError, isTotalRescuedError, isTotalAdoptionsError, catsInCareError, totalRescuedError, totalAdoptionsError]);

  const isLoading = connectionChecking || !connectionStatus;
  const hasConnectionError = connectionStatus && !connectionStatus.connected;

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
                {isLoading ? (
                  <div className="inline-block w-8 h-8 animate-spin rounded-full border-4 border-meow-primary/20 border-t-meow-primary"></div>
                ) : hasConnectionError || isCatsInCareError ? (
                  '?'
                ) : (
                  `${catsInCare}+`
                )}
              </div>
              <p className="text-gray-600">Cats in Care</p>
            </div>
            
            {/* Stat 2 */}
            <div className="text-center">
              <div className="bg-meow-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-meow-primary" />
              </div>
              <div className="text-4xl font-bold text-meow-primary mb-2">
                {isLoading ? (
                  <div className="inline-block w-8 h-8 animate-spin rounded-full border-4 border-meow-primary/20 border-t-meow-primary"></div>
                ) : hasConnectionError || isTotalRescuedError ? (
                  '?'
                ) : (
                  totalRescued
                )}
              </div>
              <p className="text-gray-600">Cats Rescued</p>
            </div>
            
            {/* Stat 3 */}
            <div className="text-center">
              <div className="bg-meow-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-meow-primary" />
              </div>
              <div className="text-4xl font-bold text-meow-primary mb-2">
                {isLoading ? (
                  <div className="inline-block w-8 h-8 animate-spin rounded-full border-4 border-meow-primary/20 border-t-meow-primary"></div>
                ) : hasConnectionError || isTotalAdoptionsError ? (
                  '?'
                ) : (
                  totalAdoptions
                )}
              </div>
              <p className="text-gray-600">Adoptions</p>
            </div>
          </div>
          
          {hasConnectionError && (
            <div className="mt-6 text-center text-sm text-red-500">
              <p>Unable to load current statistics. Please try refreshing the page.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
