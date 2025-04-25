
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Donor {
  name: string;
  amount: number;
  date: string;
  is_anonymous: boolean;
  isAnonymous?: boolean; // For compatibility with existing code
}

interface UseRecentDonorsOptions extends Omit<UseQueryOptions<Donor[], Error>, 'queryKey' | 'queryFn'> {
  limit?: number;
}

export const useRecentDonors = (options?: UseRecentDonorsOptions) => {
  const limit = options?.limit || 10;
  
  return useQuery<Donor[], Error>({
    queryKey: ['recent-donors', limit],
    queryFn: async () => {
      try {
        console.log("Fetching recent donors...");
        const { data, error } = await supabase
          .rpc('get_recent_donors', { limit_count: limit });
          
        if (error) {
          console.error("Error fetching recent donors:", error);
          throw new Error(error.message);
        }
        
        console.log("Recent donors data received:", data);
        
        // Format the data and ensure consistency between is_anonymous and isAnonymous properties
        return (data || []).map(donor => {
          // Parse the date from MM-DD-YYYY format to M/D/YYYY for consistency
          let formattedDate = donor.date;
          const dateParts = donor.date.split('-');
          if (dateParts.length === 3) {
            const month = parseInt(dateParts[0]);
            const day = parseInt(dateParts[1]);
            const year = parseInt(dateParts[2]);
            formattedDate = `${month}/${day}/${year}`;
          }
          
          return {
            ...donor,
            date: formattedDate,
            // Ensure both property names work for compatibility
            isAnonymous: donor.is_anonymous
          };
        });
      } catch (error) {
        console.error("Error in useRecentDonors:", error);
        throw error;
      }
    },
    ...options
  });
};
