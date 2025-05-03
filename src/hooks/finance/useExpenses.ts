
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '@integrations/supabase';

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
  return useQuery<ExpenseDetail[], Error>({
    queryKey: ['expenses'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('expenses')
          .select('*, cats(name)')
          .order('expense_date', { ascending: false });
          
        if (error) {
          console.error("Error fetching expenses:", error);
          throw new Error(error.message);
        }
        
        // Transform the data to include formatted dates and map nested cat data
        const formattedData = (data || []).map(expense => ({
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
