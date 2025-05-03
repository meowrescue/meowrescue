import { getSupabaseClient } from '@/integrations/supabase';
import { startOfMonth, endOfMonth, addMonths, format } from 'date-fns';

/**
 * Unified function to fetch sum of expenses for a given date range (YTD by default)
 */
export const getExpensesSum = async ({ startDate, endDate }: { startDate?: Date, endDate?: Date } = {}) => {
  try {
    
    // Default: YTD
    const now = new Date();
    const jan1 = new Date(now.getFullYear(), 0, 1);
    const start = startDate || jan1;
    const end = endDate || now;
    const { data, error } = await getSupabaseClient()
      .from('expenses')
      .select('amount')
      .gte('expense_date', start.toISOString())
      .lte('expense_date', end.toISOString());
    if (error) {
      console.error('[Expenses] Error fetching YTD sum:', error);
      return 0;
    }
    const total = (data || []).reduce((sum, item) => {
      const amount = typeof item.amount === 'string' ? parseFloat(item.amount) : item.amount;
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    return total;
  } catch (err) {
    console.error('[Expenses] Failed unified sum:', err);
    return 0;
  }
};

export const getMonthlyExpenses = async (): Promise<number> => {
  try {
    console.log('Fetching monthly expenses...');
    
    // Get the first and last day of the month for the full month range
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    console.debug('[Expenses] Querying monthly expenses from', firstDayOfMonth.toISOString(), 'to', firstDayOfNextMonth.toISOString());

    const { data, error } = await getSupabaseClient()
      .from('expenses')
      .select('amount')
      .gte('expense_date', firstDayOfMonth.toISOString())
      .lt('expense_date', firstDayOfNextMonth.toISOString());
    
    if (error) {
      console.error('[Expenses] Error fetching monthly expenses:', error);
      throw error;
    }
    
    console.log('Monthly expenses data received:', data);
    
    // If no results with regular query, try a direct sum query
    if (!data || data.length === 0) {
      console.log('No expenses found for current month. Trying direct sum query...');
      
      const { data: directData, error: directError } = await getSupabaseClient()
        .from('expenses')
        .select('sum(amount)')
        .gte('expense_date', firstDayOfMonth.toISOString())
        .lt('expense_date', firstDayOfNextMonth.toISOString())
        .single();
      
      if (directError) {
        console.error('Error with direct sum query for monthly expenses:', directError);
      } else {
        console.log('Direct sum query result for monthly expenses:', directData);
        if (directData && directData.sum !== null) {
          console.log('Using direct sum for monthly expenses:', directData.sum);
          return directData.sum;
        }
      }
      
      // Also try without date filters to see if we have any expenses at all
      const { data: allData, error: allError } = await getSupabaseClient()
        .from('expenses')
        .select('amount, expense_date')
        .limit(5)
        .order('expense_date', { ascending: false });
        
      if (allError) {
        console.error('Error fetching sample expenses:', allError);
      } else {
        console.log('Sample expenses (most recent):', allData);
      }
      
      return 0;
    }
    
    // Sum expense amounts
    const total = data.reduce((sum, expense) => {
      const amount = typeof expense.amount === 'string' ? parseFloat(expense.amount) : expense.amount;
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    
    return total;
  } catch (err) {
    console.error("Error getting monthly expenses:", err);
    return 0;
  }
};

export const getPreviousMonthExpenses = async (): Promise<number> => {
  try {
    
    const firstDayOfPrevMonth = startOfMonth(addMonths(new Date(), -1));
    const lastDayOfPrevMonth = endOfMonth(addMonths(new Date(), -1));
    
    console.log('Fetching previous month expenses...');
    console.log('Date range:', format(firstDayOfPrevMonth, 'yyyy-MM-dd'), 'to', format(lastDayOfPrevMonth, 'yyyy-MM-dd'));
    
    // Standard query approach
    const { data, error } = await getSupabaseClient()
      .from('expenses')
      .select('amount')
      .gte('expense_date', firstDayOfPrevMonth.toISOString())
      .lte('expense_date', lastDayOfPrevMonth.toISOString());
      
    if (error) {
      console.error('Error fetching previous month expenses:', error);
      throw error;
    }
    
    console.log('Previous month expenses data received:', data);
    
    // If no results with regular query, try a direct sum query
    if (!data || data.length === 0) {
      console.log('No expenses found for previous month. Trying direct sum query...');
      
      const { data: directData, error: directError } = await getSupabaseClient()
        .from('expenses')
        .select('sum(amount)')
        .gte('expense_date', firstDayOfPrevMonth.toISOString())
        .lte('expense_date', lastDayOfPrevMonth.toISOString())
        .single();
      
      if (directError) {
        console.error('Error with direct sum query for previous month expenses:', directError);
      } else {
        console.log('Direct sum query result for previous month expenses:', directData);
        if (directData && directData.sum !== null) {
          console.log('Using direct sum for previous month expenses:', directData.sum);
          return directData.sum;
        }
      }
      
      return 0;
    }
    
    const total = data.reduce((sum, expense) => {
      const amount = typeof expense.amount === 'string' ? parseFloat(expense.amount) : expense.amount;
      // Ensure exact calculations without rounding
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    
    return total;
  } catch (err) {
    console.error('Error fetching previous month expenses:', err);
    return 0;
  }
};

// TEMP: Debug function to log latest 5 expenses (for backend troubleshooting only)
export const debugLogLatestExpenses = async () => {
  try {
    
    const { data, error } = await getSupabaseClient()
      .from('expenses')
      .select('id, amount, expense_date')
      .order('expense_date', { ascending: false })
      .limit(5);
    if (error) {
      console.error('[Debug] Error fetching latest expenses:', error);
    } else {
      console.log('[Debug] Latest expenses:', data);
    }
  } catch (err) {
    console.error('[Debug] Exception in debugLogLatestExpenses:', err);
  }
};
