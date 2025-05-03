import getSupabaseClient from '@/integrations/supabase/client';
import { format } from 'date-fns';

const supabase = getSupabaseClient();

/**
 * Unified function to fetch sum of donations for a given date range (YTD by default)
 */
export const getDonationsSum = async ({ startDate, endDate }: { startDate?: Date, endDate?: Date } = {}) => {
  try {
    // Default: YTD
    const now = new Date();
    const jan1 = new Date(now.getFullYear(), 0, 1);
    const start = startDate || jan1;
    const end = endDate || now;
    console.log('[Donations] Querying donations from', start.toISOString(), 'to', end.toISOString());
    
    // First try with status filter
    const { data: filteredData, error: filteredError } = await supabase
      .from('donations')
      .select('amount, donation_date, status, id')
      .eq('status', 'completed')
      .gte('donation_date', start.toISOString())
      .lte('donation_date', end.toISOString())
      .order('donation_date', { ascending: false });

    if (filteredError) {
      console.error('[Donations] Status filter error:', filteredError);
      // If status filter fails, try without it
      const { data: allData, error: allError } = await supabase
        .from('donations')
        .select('amount, donation_date, status, id')
        .gte('donation_date', start.toISOString())
        .lte('donation_date', end.toISOString())
        .order('donation_date', { ascending: false });

      if (allError) {
        console.error('[Donations] Error fetching donations:', allError);
        return 0;
      }
      
      console.log(`[Donations] Donations count: ${allData?.length}`);
      if (allData && allData.length > 0) {
        allData.forEach((item, idx) => {
          console.log(`[Donations] Row ${idx + 1}: id=${item.id}, amount=${item.amount}, date=${item.donation_date}, status=${item.status}`);
        });
      }
      
      return (allData || []).reduce((sum, item) => {
        const amount = typeof item.amount === 'string' ? parseFloat(item.amount) : item.amount;
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
    }

    console.log(`[Donations] Filtered donations count: ${filteredData?.length}`);
    if (filteredData && filteredData.length > 0) {
      filteredData.forEach((item, idx) => {
        console.log(`[Donations] Row ${idx + 1}: id=${item.id}, amount=${item.amount}, date=${item.donation_date}, status=${item.status}`);
      });
    }

    return (filteredData || []).reduce((sum, item) => {
      const amount = typeof item.amount === 'string' ? parseFloat(item.amount) : item.amount;
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
  } catch (err) {
    console.error('[Donations] Failed to fetch donations:', err);
    return 0;
  }
};

export const getMonthlyDonations = async () => {
  try {
    console.log('Fetching monthly donations...');
    // Get the first and last day of the month for the full month range
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    console.debug('[Donations] Querying monthly donations from', firstDayOfMonth.toISOString(), 'to', firstDayOfNextMonth.toISOString());

    const { data, error } = await supabase
      .from('donations')
      .select('amount')
      .eq('status', 'completed')
      .gte('donation_date', firstDayOfMonth.toISOString())
      .lt('donation_date', firstDayOfNextMonth.toISOString());
      
    if (error) {
      console.error('[Donations] Error fetching monthly donations:', error);
      throw error;
    }
    
    console.log('Monthly donations data received with status filter:', data);
    
    // If no results with status filter, try without it (debugging approach)
    if (!data || data.length === 0) {
      console.log('No completed donations found. Checking if any donations exist without status filter...');
      
      const { data: allData, error: allError } = await supabase
        .from('donations')
        .select('amount, donation_date, status')
        .gte('donation_date', firstDayOfMonth.toISOString())
        .lt('donation_date', firstDayOfNextMonth.toISOString());
        
      if (allError) {
        console.error('Error fetching all donations (no status filter):', allError);
      } else {
        console.log('All donations for current month (no status filter):', allData);
      }
      
      // Try direct sum query as a fallback
      const { data: directData, error: directError } = await supabase
        .from('donations')
        .select('sum(amount)')
        .eq('status', 'completed')
        .gte('donation_date', firstDayOfMonth.toISOString())
        .lt('donation_date', firstDayOfNextMonth.toISOString())
        .single();
      
      if (directError) {
        console.error('Error with direct sum query for current month:', directError);
      } else {
        console.log('Direct sum query result for current month:', directData);
        if (directData && directData.sum !== null) {
          console.log('Using direct sum for current month:', directData.sum);
          return directData.sum;
        }
      }
      
      return 0;
    }
    
    // Sum donation amounts
    const total = data.reduce((sum, item) => {
      const amount = typeof item.amount === 'string' ? parseFloat(item.amount) : item.amount;
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    
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
    console.log('Fetching previous month donations...');
    // Get the first day of the current month and previous month
    const now = new Date();
    const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    console.log('Date range:', format(firstDayOfPreviousMonth, 'yyyy-MM-dd'), 'to', format(firstDayOfCurrentMonth, 'yyyy-MM-dd'));
    
    // First try with status=completed filter
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
    
    // If no results with status filter, try a direct query
    if (!data || data.length === 0) {
      console.log('No completed donations found for previous month. Trying direct sum query...');
      
      const { data: directData, error: directError } = await supabase
        .from('donations')
        .select('sum(amount)')
        .eq('status', 'completed')
        .gte('donation_date', firstDayOfPreviousMonth.toISOString())
        .lt('donation_date', firstDayOfCurrentMonth.toISOString())
        .single();
      
      if (directError) {
        console.error('Error with direct sum query for previous month:', directError);
      } else {
        console.log('Direct sum query result for previous month:', directData);
        if (directData && directData.sum !== null) {
          console.log('Using direct sum for previous month:', directData.sum);
          return directData.sum;
        }
      }
      
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
    
    // First try with status=completed filter
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
    
    // If no results with status filter, try a direct query
    if (!data || data.length === 0) {
      console.log('No completed donations found for year. Trying direct sum query...');
      
      const { data: directData, error: directError } = await supabase
        .from('donations')
        .select('sum(amount)')
        .eq('status', 'completed')
        .gte('donation_date', firstDayOfYear.toISOString())
        .lte('donation_date', now.toISOString())
        .single();
      
      if (directError) {
        console.error('Error with direct sum query for total:', directError);
      } else {
        console.log('Direct sum query result for total:', directData);
        if (directData && directData.sum !== null) {
          console.log('Using direct sum for total donations:', directData.sum);
          return directData.sum;
        }
      }
      
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

// TEMP: Debug function to log latest 5 donations (for backend troubleshooting only)
export const debugLogLatestDonations = async () => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('id, amount, donation_date, status')
      .order('donation_date', { ascending: false })
      .limit(5);
    if (error) {
      console.error('[Debug] Error fetching latest donations:', error);
    } else {
      console.log('[Debug] Latest donations:', data);
    }
  } catch (err) {
    console.error('[Debug] Exception in debugLogLatestDonations:', err);
  }
};
