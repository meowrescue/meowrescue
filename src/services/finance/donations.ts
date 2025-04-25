
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export const getMonthlyDonations = async () => {
  try {
    console.log('Fetching monthly donations...');
    
    // Get the first day of the current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    console.log('Date range:', format(firstDayOfMonth, 'yyyy-MM-dd'), 'to', format(now, 'yyyy-MM-dd'));
    
    const { data, error } = await supabase
      .from('donations')
      .select('amount')
      .eq('status', 'completed')
      .gte('donation_date', firstDayOfMonth.toISOString())
      .lte('donation_date', now.toISOString());
      
    if (error) {
      console.error('Error fetching monthly donations:', error);
      throw error;
    }
    
    console.log('Monthly donations data received:', data);
    
    if (!data || data.length === 0) {
      return 0;
    }
    
    // Sum donation amounts
    const total = data.reduce((sum, item) => {
      const amount = typeof item.amount === 'string' ? parseFloat(item.amount) : item.amount;
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    
    console.log('Total monthly donations:', total);
    return total;
  } catch (err) {
    console.error('Failed to fetch monthly donations:', err);
    return 0;
  }
};

/**
 * Fetches the total amount of donations in the previous month
 */
export const getPreviousMonthDonations = async () => {
  try {
    // Get the first day of the previous month
    const now = new Date();
    const firstDayOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    console.log('Fetching previous month donations...');
    console.log('Date range:', format(firstDayOfPreviousMonth, 'yyyy-MM-dd'), 'to', format(firstDayOfCurrentMonth, 'yyyy-MM-dd'));
    
    const { data, error } = await supabase
      .from('donations')
      .select('amount')
      .eq('status', 'completed')
      .gte('donation_date', firstDayOfPreviousMonth.toISOString())
      .lt('donation_date', firstDayOfCurrentMonth.toISOString());
      
    if (error) {
      console.error('Error fetching previous month donations:', error);
      throw error;
    }
    
    console.log('Previous month donations data received:', data);
    
    if (!data || data.length === 0) {
      return 0;
    }
    
    // Sum donation amounts
    const total = data.reduce((sum, item) => {
      const amount = typeof item.amount === 'string' ? parseFloat(item.amount) : item.amount;
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    
    return total;
  } catch (err) {
    console.error('Failed to fetch previous month donations:', err);
    return 0;
  }
};

/**
 * Fetches the total amount of all donations for the current year
 */
export const getTotalDonations = async () => {
  try {
    console.log('Fetching total donations...');
    
    // Get the first day of the current year
    const now = new Date();
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
    
    console.log('Date range:', format(firstDayOfYear, 'yyyy-MM-dd'), 'to', format(now, 'yyyy-MM-dd'));
    
    const { data, error } = await supabase
      .from('donations')
      .select('amount')
      .eq('status', 'completed')
      .gte('donation_date', firstDayOfYear.toISOString())
      .lte('donation_date', now.toISOString());
      
    if (error) {
      console.error('Error fetching total donations:', error);
      throw error;
    }
    
    console.log('Total donations data received:', data);
    
    if (!data || data.length === 0) {
      return 0;
    }
    
    // Sum donation amounts
    const total = data.reduce((sum, item) => {
      const amount = typeof item.amount === 'string' ? parseFloat(item.amount) : item.amount;
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    
    return total;
  } catch (err) {
    console.error('Failed to fetch total donations:', err);
    return 0;
  }
};
