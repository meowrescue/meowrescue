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
}

export const useExpenses = (options?: UseExpensesOptions) => {
  const supabase = getSupabaseClient();
  const limit = options?.limit || 50; // Increased limit to show more expenses
  
  return useQuery<ExpenseDetail[], Error>({
    queryKey: ['expenses'],
    queryFn: async () => {
      try {
        console.log("Fetching expenses...");
        
        // Use the expenses table directly
        const { data, error } = await supabase
          .from('expenses')
          .select('*, cats(name)')
          .order('expense_date', { ascending: false })
          .limit(limit);
          
        if (error) {
          console.error("Error fetching expenses:", error);
          throw new Error(error.message);
        }
        
        if (!data || data.length === 0) {
          console.log("No expenses found");
          
          // Try a fallback query without joins to see if we can get any data
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('expenses')
            .select('*')
            .order('expense_date', { ascending: false })
            .limit(limit);
            
          if (fallbackError) {
            console.error("Fallback query also failed:", fallbackError);
            return [];
          }
          
          if (!fallbackData || fallbackData.length === 0) {
            console.log("No expenses found in fallback query");
            return [];
          }
          
          console.log(`Found ${fallbackData.length} expenses in fallback query`);
          
          // Transform the data to include formatted dates
          const formattedData = fallbackData.map(expense => ({
            ...expense,
            date: new Date(expense.expense_date).toLocaleDateString(),
            cat_name: null,
          }));
          
          return formattedData;
        }
        
        console.log(`Found ${data.length} expenses`);
        
        // Transform the data to include formatted dates and map nested cat data
        const formattedData = data.map(expense => ({
          ...expense,
          date: new Date(expense.expense_date).toLocaleDateString(),
          cat_name: expense.cats?.name,
        }));
        
        return formattedData;
      } catch (error) {
        console.error("Error in useExpenses:", error);
        throw error;
      }
    },
    ...options
  });
};
