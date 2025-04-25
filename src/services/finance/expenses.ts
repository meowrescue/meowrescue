
import { supabase } from '@/integrations/supabase/client';
import { startOfMonth, endOfMonth, addMonths, format } from 'date-fns';

export const getMonthlyExpenses = async (): Promise<number> => {
  try {
    console.log('Fetching monthly expenses...');
    
    // Get the first day of the current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    console.log('Date range:', format(firstDayOfMonth, 'yyyy-MM-dd'), 'to', format(now, 'yyyy-MM-dd'));
    
    const { data, error } = await supabase
      .from('expenses')
      .select('amount')
      .gte('expense_date', firstDayOfMonth.toISOString())
      .lte('expense_date', now.toISOString());
    
    if (error) {
      console.error("Error getting monthly expenses:", error);
      throw error;
    }
    
    console.log('Monthly expenses data received:', data);
    
    if (!data || data.length === 0) {
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
    
    const { data, error } = await supabase
      .from('expenses')
      .select('amount')
      .gte('expense_date', firstDayOfPrevMonth.toISOString())
      .lte('expense_date', lastDayOfPrevMonth.toISOString());
      
    if (error) {
      console.error('Error fetching previous month expenses:', error);
      throw error;
    }
    
    console.log('Previous month expenses data received:', data);
    
    if (!data || data.length === 0) {
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
