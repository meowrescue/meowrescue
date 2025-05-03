import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import getSupabaseClient from '@/integrations/supabase/client';

export interface ExpenseDetail {
  id: string;
  amount: number;
  description: string;
  expense_date: string;
  category: string;
  receipt_url?: string;
  vendor: string;
  payment_method: string;
  cat_id?: string;
  cat_name?: string;
  date: string; // Formatted date for display
  created_at: string;
  updated_at: string;
}

interface UseExpensesOptions extends Omit<UseQueryOptions<ExpenseDetail[], Error>, 'queryKey' | 'queryFn'> {
  limit?: number;
  year?: number; // Optional year filter
}

/**
 * Format a date string to MM/DD/YYYY format
 * @param dateStr The date string to format
 * @returns Formatted date string in MM/DD/YYYY format
 */
const formatDateToMMDDYYYY = (dateStr: string): string => {
  // Default to original string if parsing fails
  let result = dateStr;
  
  try {
    // Try to parse as ISO date first
    let date: Date | null = new Date(dateStr);
    
    // Check if we got a valid date
    if (!isNaN(date.getTime())) {
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      
      result = `${month}/${day}/${year}`;
    }
  } catch (error) {
    console.error("Error formatting date:", error);
  }
  
  return result;
};

export const useExpenses = (options?: UseExpensesOptions) => {
  const limit = options?.limit || 1000; // Set a high default limit to get all records
  const year = options?.year || new Date().getFullYear(); // Default to current year
  
  return useQuery<ExpenseDetail[], Error>({
    queryKey: ['expenses', limit, year],
    queryFn: async () => {
      try {
        console.log("Fetching expenses...");
        const supabase = getSupabaseClient();
        
        // Create a query that gets all expenses
        let query = supabase
          .from('expenses')
          .select('*, cats(name)')
          .order('expense_date', { ascending: false });
          
        // Apply limit if specified
        if (limit) {
          query = query.limit(limit);
        }
        
        const { data, error } = await query;
          
        if (error) {
          console.error("Error fetching expenses:", error);
          throw new Error(error.message);
        }
        
        console.log(`Retrieved ${data?.length || 0} expense records`);
        
        // Transform the data to include formatted dates and map nested cat data
        const formattedData = (data || []).map(expense => ({
          ...expense,
          date: formatDateToMMDDYYYY(expense.expense_date),
          cat_name: expense.cats?.name,
        }));
        
        return formattedData;
      } catch (error) {
        console.error("Error in useExpenses:", error);
        throw error;
      }
    },
    // Refresh data frequently
    refetchInterval: 15000, // Refresh every 15 seconds
    // Consider data stale immediately
    staleTime: 0,
    // Always refetch when component mounts
    refetchOnMount: true,
    // Refetch when window regains focus
    refetchOnWindowFocus: true,
    ...options
  });
};
