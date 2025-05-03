import { supabase } from './index';

/**
 * Diagnostic function to check Supabase schema and data
 * This can be called from the browser console using:
 * window.checkSupabaseSchema()
 */
export const checkSupabaseSchema = async () => {
  console.log('=== CHECKING SUPABASE SCHEMA ===');
  
  
  // 1. Check connection
  try {
    console.log('Checking Supabase connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('donations')
      .select('count(*)', { count: 'exact', head: true });
      
    if (connectionError) {
      console.error('❌ Connection error:', connectionError.message);
    } else {
      console.log('✅ Supabase connection successful');
    }
  } catch (err) {
    console.error('Error checking connection:', err);
  }

  // 2. Check donations table
  try {
    console.log('\nChecking donations table...');
    const { data: donationsInfo, error: donationsInfoError } = await supabase
      .from('donations')
      .select('*')
      .limit(1);

    if (donationsInfoError) {
      console.error('❌ Error accessing donations table:', donationsInfoError.message);
    } else {
      console.log('✅ donations table exists');
      
      if (donationsInfo && donationsInfo.length > 0) {
        console.log('Sample donation record columns:', Object.keys(donationsInfo[0]));
        
        // Check for required columns
        const requiredColumns = ['amount', 'status', 'donation_date'];
        const missingColumns = requiredColumns.filter(col => !Object.keys(donationsInfo[0]).includes(col));
        
        if (missingColumns.length > 0) {
          console.error('❌ Missing required columns in donations table:', missingColumns);
        } else {
          console.log('✅ All required columns exist in donations table');
        }
      } else {
        console.log('⚠️ No records found in donations table');
      }
    }
  } catch (err) {
    console.error('Error checking donations table:', err);
  }

  // 3. Check expenses table
  try {
    console.log('\nChecking expenses table...');
    const { data: expensesInfo, error: expensesInfoError } = await supabase
      .from('expenses')
      .select('*')
      .limit(1);

    if (expensesInfoError) {
      console.error('❌ Error accessing expenses table:', expensesInfoError.message);
    } else {
      console.log('✅ expenses table exists');
      
      if (expensesInfo && expensesInfo.length > 0) {
        console.log('Sample expense record columns:', Object.keys(expensesInfo[0]));
        
        // Check for required columns
        const requiredColumns = ['amount', 'expense_date'];
        const missingColumns = requiredColumns.filter(col => !Object.keys(expensesInfo[0]).includes(col));
        
        if (missingColumns.length > 0) {
          console.error('❌ Missing required columns in expenses table:', missingColumns);
        } else {
          console.log('✅ All required columns exist in expenses table');
        }
      } else {
        console.log('⚠️ No records found in expenses table');
      }
    }
  } catch (err) {
    console.error('Error checking expenses table:', err);
  }

  // 4. Check get_recent_donors RPC function
  try {
    console.log('\nChecking get_recent_donors RPC function...');
    const { data: recentDonors, error: recentDonorsError } = await supabase
      .rpc('get_recent_donors', { limit_count: 5 });

    if (recentDonorsError) {
      console.error('❌ Error calling get_recent_donors function:', recentDonorsError.message);
    } else {
      console.log('✅ get_recent_donors RPC function exists');
      
      if (recentDonors && recentDonors.length > 0) {
        console.log('Sample recent donor columns:', Object.keys(recentDonors[0]));
        
        // Check for required columns
        const requiredColumns = ['name', 'amount', 'date', 'is_anonymous'];
        const missingColumns = requiredColumns.filter(col => !Object.keys(recentDonors[0]).includes(col));
        
        if (missingColumns.length > 0) {
          console.error('❌ Missing required columns in get_recent_donors result:', missingColumns);
        } else {
          console.log('✅ All required columns exist in get_recent_donors result');
        }
      } else {
        console.log('⚠️ No records returned from get_recent_donors function');
      }
    }
  } catch (err) {
    console.error('Error checking get_recent_donors function:', err);
  }

  // 5. Check data counts
  try {
    console.log('\n=== CHECKING DATA COUNTS ===');
    
    // Count completed donations
    const { count: donationsCount, error: donationsCountError } = await supabase
      .from('donations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    if (donationsCountError) {
      console.error('❌ Error counting donations:', donationsCountError.message);
    } else {
      console.log(`Total completed donations: ${donationsCount}`);
    }
    
    // Count all donations
    const { count: allDonationsCount, error: allDonationsCountError } = await supabase
      .from('donations')
      .select('*', { count: 'exact', head: true });

    if (allDonationsCountError) {
      console.error('❌ Error counting all donations:', allDonationsCountError.message);
    } else {
      console.log(`Total donations (all statuses): ${allDonationsCount}`);
    }
    
    // Count expenses
    const { count: expensesCount, error: expensesCountError } = await supabase
      .from('expenses')
      .select('*', { count: 'exact', head: true });

    if (expensesCountError) {
      console.error('❌ Error counting expenses:', expensesCountError.message);
    } else {
      console.log(`Total expenses: ${expensesCount}`);
    }
  } catch (err) {
    console.error('Error checking data counts:', err);
  }

  // 6. Check monthly donations query
  try {
    console.log('\nChecking monthly donations query...');
    // Get the first day of the current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const { data: monthlyDonations, error: monthlyDonationsError } = await supabase
      .from('donations')
      .select('amount')
      .eq('status', 'completed')
      .gte('donation_date', firstDayOfMonth.toISOString())
      .lte('donation_date', now.toISOString());
      
    if (monthlyDonationsError) {
      console.error('❌ Error running monthly donations query:', monthlyDonationsError.message);
    } else {
      console.log(`Monthly donations query returned ${monthlyDonations?.length || 0} records`);
      if (monthlyDonations && monthlyDonations.length > 0) {
        const total = monthlyDonations.reduce((sum, item) => {
          const amount = typeof item.amount === 'string' ? parseFloat(item.amount) : item.amount;
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0);
        console.log(`Total monthly donations amount: ${total}`);
      }
    }
  } catch (err) {
    console.error('Error checking monthly donations:', err);
  }

  console.log('\n=== SCHEMA CHECK COMPLETE ===');
  return 'Schema check completed. See console for details.';
};

/**
 * Diagnostic function to fetch all donations and expenses for May 2025
 * Logs the results to the console for backend-only review
 * Usage: window.checkMay2025FinancialData()
 */
export const checkMay2025FinancialData = async () => {
  
  const start = '2025-05-01T00:00:00Z';
  const end = '2025-05-31T23:59:59Z';

  // Donations in May 2025
  try {
    console.log('\n=== Donations for May 2025 ===');
    const { data: donations, error: donationsError } = await supabase
      .from('donations')
      .select('id, amount, donation_date, status')
      .gte('donation_date', start)
      .lte('donation_date', end);
    if (donationsError) {
      console.error('❌ Error fetching May 2025 donations:', donationsError.message);
    } else {
      console.log(`Found ${donations.length} donation(s) in May 2025:`);
      donations.forEach(d => console.log(d));
      const total = donations.reduce((sum, d) => {
        const amount = typeof d.amount === 'string' ? parseFloat(d.amount) : d.amount;
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
      console.log(`Total donation amount for May 2025: $${total}`);
    }
  } catch (err) {
    console.error('Error fetching May 2025 donations:', err);
  }

  // Expenses in May 2025
  try {
    console.log('\n=== Expenses for May 2025 ===');
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('id, amount, expense_date')
      .gte('expense_date', start)
      .lte('expense_date', end);
    if (expensesError) {
      console.error('❌ Error fetching May 2025 expenses:', expensesError.message);
    } else {
      console.log(`Found ${expenses.length} expense(s) in May 2025:`);
      expenses.forEach(e => console.log(e));
      const total = expenses.reduce((sum, e) => {
        const amount = typeof e.amount === 'string' ? parseFloat(e.amount) : e.amount;
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
      console.log(`Total expense amount for May 2025: $${total}`);
    }
  } catch (err) {
    console.error('Error fetching May 2025 expenses:', err);
  }

  console.log('\n=== May 2025 Financial Data Check Complete ===');
  return 'May 2025 data check completed. See console for details.';
};

// Expose the functions to the window object for browser console access
if (typeof window !== 'undefined') {
  (window as any).checkSupabaseSchema = checkSupabaseSchema;
  (window as any).checkMay2025FinancialData = checkMay2025FinancialData;
}

export default checkSupabaseSchema;
