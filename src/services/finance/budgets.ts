import { supabase } from '@integrations/supabase';

export const getTotalBudget = async (): Promise<number> => {
  try {
    console.log('Fetching total budget...');
    
    // Get the current year
    const currentYear = new Date().getFullYear();
    
    // Query budget categories for the current year and sum their amounts
    const { data, error } = await supabase
      .from('budget_categories')
      .select('amount')
      .eq('year', currentYear);
    
    if (error) {
      console.error("Error getting total budget:", error);
      throw error;
    }
    
    console.log('Budget categories data received:', data);
    
    if (!data || data.length === 0) {
      console.log('No budget categories found for the current year, returning 0');
      return 0;
    }
    
    // Sum all budget category amounts
    const total = data.reduce((sum, category) => {
      const amount = typeof category.amount === 'string' ? 
        parseFloat(category.amount) : 
        category.amount;
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    
    console.log('Calculated total budget for current year:', total);
    return total;
  } catch (err) {
    console.error("Error calculating total budget:", err);
    return 0;
  }
};
