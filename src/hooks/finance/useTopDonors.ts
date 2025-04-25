
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TopDonor {
  name: string;
  amount: number;
  position: string; // Changed from date to position
  is_anonymous: boolean;
  isAnonymous?: boolean;
}

interface UseTopDonorsOptions extends Omit<UseQueryOptions<TopDonor[], Error>, 'queryKey' | 'queryFn'> {
  limit?: number;
}

export const useTopDonors = (options?: UseTopDonorsOptions) => {
  const limit = options?.limit || 10;
  
  return useQuery<TopDonor[], Error>({
    queryKey: ['top-donors', limit],
    queryFn: async () => {
      try {
        console.log("Fetching top donors...");
        const { data, error } = await supabase
          .rpc('get_top_donors', { limit_count: limit });
          
        if (error) {
          console.error("Error fetching top donors:", error);
          throw new Error(error.message);
        }
        
        console.log("Top donors data received:", data);
        
        // Transform the data to include position instead of date
        return (data || []).map((donor, index) => {
          const position = getOrdinalSuffix(index + 1);
          return {
            ...donor,
            position,
            // Ensure both property names work for compatibility
            isAnonymous: donor.is_anonymous
          };
        });
      } catch (error) {
        console.error("Error in useTopDonors:", error);
        throw error;
      }
    },
    ...options
  });
};

// Helper function to generate ordinal suffixes (1st, 2nd, 3rd, etc.)
const getOrdinalSuffix = (num: number): string => {
  const j = num % 10;
  const k = num % 100;
  if (j == 1 && k != 11) {
    return num + "st";
  }
  if (j == 2 && k != 12) {
    return num + "nd";
  }
  if (j == 3 && k != 13) {
    return num + "rd";
  }
  return num + "th";
};
