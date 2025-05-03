import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import getSupabaseClient from '@/integrations/supabase/client';

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
        const supabase = getSupabaseClient();
        
        // Use the get_top_donors RPC function
        const { data, error } = await supabase
          .rpc('get_top_donors', { limit_count: limit });
          
        if (error) {
          console.error("Error fetching top donors:", error);
          
          // If RPC fails, try direct query as fallback
          console.log("Attempting fallback query for top donors...");
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('donations')
            .select('id, name, amount, donation_date, is_anonymous')
            .eq('status', 'completed')
            .order('amount', { ascending: false })
            .limit(limit);
            
          if (fallbackError) {
            console.error("Fallback query also failed:", fallbackError);
            throw new Error("Failed to fetch top donors: " + error.message);
          }
          
          if (!fallbackData || fallbackData.length === 0) {
            console.log("No top donors found in fallback query");
            return [];
          }
          
          console.log("Got top donors from fallback query:", fallbackData);
          
          // Format fallback data to match expected format
          const formattedData = fallbackData.map((donation, index) => ({
            name: donation.name,
            amount: donation.amount,
            is_anonymous: donation.is_anonymous,
            position: getOrdinalSuffix(index + 1)
          }));
          
          return formattedData;
        }
        
        if (!data || data.length === 0) {
          console.log("No top donors found from RPC");
          return [];
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
