import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import getSupabaseClient from '@/integrations/getSupabaseClient()/client';

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
        
        
        // Use the get_recent_donors RPC function
        const { data, error } = await getSupabaseClient()
          .rpc('get_recent_donors', { limit_count: limit });
          
        if (error) {
          console.error("Error fetching recent donors with RPC:", error);
          
          // If RPC fails, try direct query as fallback
          console.log("Attempting fallback query for recent donors...");
          const { data: fallbackData, error: fallbackError } = await getSupabaseClient()
            .from('donations')
            .select('id, name, amount, donation_date, is_anonymous')
            .eq('status', 'completed')
            .order('donation_date', { ascending: false })
            .limit(limit);
            
          if (fallbackError) {
            console.error("Fallback query also failed:", fallbackError);
            throw new Error("Failed to fetch recent donors: " + error.message);
          }
          
          if (!fallbackData || fallbackData.length === 0) {
            console.log("No recent donors found in fallback query");
            return [];
          }
          
          console.log("Got recent donors from fallback query:", fallbackData);
          
          // Format fallback data to match RPC expected format
          const formattedData = fallbackData.map(donation => ({
            name: donation.name,
            amount: donation.amount,
            date: donation.donation_date,
            is_anonymous: donation.is_anonymous,
          }));
          
          // Continue with the formatted fallback data
          return processRecentDonors(formattedData);
        }
        
        if (!data || data.length === 0) {
          console.log("No recent donors found from RPC");
          return [];
        }
        
        console.log("Recent donors data received from RPC:", data);
        return processRecentDonors(data);
      } catch (error) {
        console.error("Error in useRecentDonors:", error);
        throw error;
      }
    },
    ...options
  });
};

// Helper function to process donor data consistently
const processRecentDonors = (data: any[]): Donor[] => {
  // Sort by full datetime descending (most recent first)
  const sortedData = [...data].sort((a, b) => {
    // Accepts ISO, YYYY-MM-DD, MM-DD-YYYY, or with time
    const parseDateTime = (dateStr: string) => {
      // Try ISO or YYYY-MM-DDTHH:mm:ss
      let dt = Date.parse(dateStr);
      if (!isNaN(dt)) return dt;
      // Try MM-DD-YYYY or MM-DD-YYYY HH:mm:ss
      const match = dateStr.match(/(\d{1,2})-(\d{1,2})-(\d{4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
      if (match) {
        const [_, mm, dd, yyyy, h, m, s] = match;
        return Date.UTC(
          Number(yyyy),
          Number(mm) - 1,
          Number(dd),
          h ? Number(h) : 0,
          m ? Number(m) : 0,
          s ? Number(s) : 0
        );
      }
      return 0;
    };
    return parseDateTime(b.date) - parseDateTime(a.date);
  });
  
  // Format the data and ensure consistency between is_anonymous and isAnonymous properties
  return sortedData.map(donor => {
    // Parse the date from MM-DD-YYYY or ISO to M/D/YYYY H:mm if possible
    let formattedDate = donor.date;
    // Try to parse full datetime for display
    const tryDate = new Date(donor.date);
    if (!isNaN(tryDate.getTime())) {
      formattedDate = `${tryDate.getMonth() + 1}/${tryDate.getDate()}/${tryDate.getFullYear()}${tryDate.getHours() || tryDate.getMinutes() ? ` ${tryDate.getHours()}:${String(tryDate.getMinutes()).padStart(2, '0')}` : ''}`;
    } else {
      const dateParts = donor.date.split('-');
      if (dateParts.length === 3) {
        const month = parseInt(dateParts[0]);
        const day = parseInt(dateParts[1]);
        const year = parseInt(dateParts[2]);
        formattedDate = `${month}/${day}/${year}`;
      }
    }
    
    return {
      ...donor,
      date: formattedDate,
      // Ensure both property names work for compatibility
      isAnonymous: donor.is_anonymous
    };
  });
};
