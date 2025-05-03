// Script to check Supabase schema and data
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Get environment variables
const supabaseUrl = 'https://sfrlnidbiviniuqhryyc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmcmxuaWRiaXZpbml1cWhyeXljIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDUwMzE1MSwiZXhwIjoyMDYwMDc5MTUxfQ.n954lNEqQLPbqd7YwIp-6h4EcPr9Z31ujyfyfsq6gyI';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
  process.exit(1);
}

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key (first 5 chars):', supabaseKey.substring(0, 5) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log('\n=== CHECKING SUPABASE SCHEMA ===\n');

  // 1. Check donations table
  try {
    console.log('Checking donations table...');
    const { data: donationsInfo, error: donationsInfoError } = await supabase
      .from('donations')
      .select('*')
      .limit(1);

    if (donationsInfoError) {
      console.error('Error accessing donations table:', donationsInfoError.message);
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

  // 2. Check expenses table
  try {
    console.log('\nChecking expenses table...');
    const { data: expensesInfo, error: expensesInfoError } = await supabase
      .from('expenses')
      .select('*')
      .limit(1);

    if (expensesInfoError) {
      console.error('Error accessing expenses table:', expensesInfoError.message);
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

  // 3. Check get_recent_donors RPC function
  try {
    console.log('\nChecking get_recent_donors RPC function...');
    const { data: recentDonors, error: recentDonorsError } = await supabase
      .rpc('get_recent_donors', { limit_count: 5 });

    if (recentDonorsError) {
      console.error('Error calling get_recent_donors function:', recentDonorsError.message);
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

  // 4. Check data counts
  try {
    console.log('\n=== CHECKING DATA COUNTS ===\n');
    
    // Count completed donations
    const { count: donationsCount, error: donationsCountError } = await supabase
      .from('donations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    if (donationsCountError) {
      console.error('Error counting donations:', donationsCountError.message);
    } else {
      console.log(`Total completed donations: ${donationsCount}`);
    }
    
    // Count all donations
    const { count: allDonationsCount, error: allDonationsCountError } = await supabase
      .from('donations')
      .select('*', { count: 'exact', head: true });

    if (allDonationsCountError) {
      console.error('Error counting all donations:', allDonationsCountError.message);
    } else {
      console.log(`Total donations (all statuses): ${allDonationsCount}`);
    }
    
    // Count expenses
    const { count: expensesCount, error: expensesCountError } = await supabase
      .from('expenses')
      .select('*', { count: 'exact', head: true });

    if (expensesCountError) {
      console.error('Error counting expenses:', expensesCountError.message);
    } else {
      console.log(`Total expenses: ${expensesCount}`);
    }
  } catch (err) {
    console.error('Error checking data counts:', err);
  }

  console.log('\n=== SCHEMA CHECK COMPLETE ===\n');
}

checkSchema()
  .then(() => {
    console.log('Schema check completed');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error during schema check:', err);
    process.exit(1);
  });
