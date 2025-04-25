
import { createClient } from '@supabase/supabase-js';

// Use the actual values directly instead of environment variables
const supabaseUrl = 'https://sfrlnidbiviniuqhryyc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmcmxuaWRiaXZpbml1cWhyeXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MDMxNTEsImV4cCI6MjA2MDA3OTE1MX0.vHK31AKqwD0a6GKGUQWMEFWo3zOb37LAEMXAmOATawI';

// Ensure we use a singleton pattern for the Supabase client
let supabaseInstance = null;

/**
 * Create and return the Supabase client instance.
 * Uses a singleton pattern to prevent multiple instances.
 */
const getSupabaseClient = () => {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  supabaseInstance = createClient(
    supabaseUrl,
    supabaseKey,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined
      },
      global: {
        headers: {
          'X-Client-Info': 'meow-rescue-financial-transparency'
        },
      },
      // Increase timeouts to prevent query timeout issues
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    }
  );

  return supabaseInstance;
};

// Export the singleton instance
export const supabase = getSupabaseClient();

// Add a health check function to verify connection
export const checkSupabaseConnection = async () => {
  try {
    console.log('Checking Supabase connection...');
    // Simple query to test connection
    const { data, error } = await supabase.from('donations').select('id').limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error.message);
      return { connected: false, error: error.message, details: error };
    }
    
    console.log('Supabase connection successful, test data:', data);
    return { connected: true, data };
  } catch (err) {
    console.error('Exception checking Supabase connection:', err);
    return { 
      connected: false, 
      error: err instanceof Error ? err.message : 'Unknown error',
      details: err
    };
  }
};

// Helper function to diagnose financial data
export const checkFinancialData = async () => {
  try {
    console.log('Checking financial data availability...');
    
    // Check donations
    const { data: donations, error: donationsError } = await supabase
      .from('donations')
      .select('id, amount, donation_date')
      .limit(5);
      
    if (donationsError) {
      console.error('Error checking donations:', donationsError);
    } else {
      console.log('Sample donations:', donations);
    }
    
    // Check expenses
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('id, amount, expense_date, category')
      .limit(5);
      
    if (expensesError) {
      console.error('Error checking expenses:', expensesError);
    } else {
      console.log('Sample expenses:', expenses);
    }
    
    // Check budget categories
    const { data: budgets, error: budgetsError } = await supabase
      .from('budget_categories')
      .select('id, name, amount, year')
      .limit(5);
      
    if (budgetsError) {
      console.error('Error checking budgets:', budgetsError);
    } else {
      console.log('Sample budgets:', budgets);
    }
    
    return {
      donations: donations || [],
      expenses: expenses || [],
      budgets: budgets || []
    };
  } catch (err) {
    console.error('Error checking financial data:', err);
    return {
      donations: [],
      expenses: [],
      budgets: []
    };
  }
};
