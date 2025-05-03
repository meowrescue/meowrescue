import { createClient } from '@supabase/supabase-js';

// Ensure we use a singleton pattern for the Supabase client
let supabaseInstance = null;

/**
 * Create and return the Supabase client instance.
 * Uses a singleton pattern to prevent multiple instances.
 * 
 * This client accesses environment variables injected by Netlify
 * during the build process for client-side use.
 */
const getSupabaseClient = () => {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  try {
    // Get environment variables injected by Netlify
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    // Check if credentials are available
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials missing. Please check Netlify environment variables.');
    }

    // Validate credentials format
    if (!supabaseUrl.startsWith('https://')) {
      throw new Error('Invalid Supabase URL format. Must start with https://');
    }
    if (!supabaseKey.startsWith('eyJ')) {
      throw new Error('Invalid Supabase key format. Must be a valid JWT token starting with eyJ');
    }

    // Test connection immediately
    const testClient = createClient(supabaseUrl, supabaseKey);
    const { error } = await testClient.auth.getSession();
    
    if (error) {
      throw new Error(`Supabase connection failed: ${error.message}`);
    }

    supabaseInstance = createClient(
      supabaseUrl,
      supabaseKey,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false
        },
        global: {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      }
    );
    
    return supabaseInstance;
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    
    // Return a dummy client in case of error
    return {
      from: () => ({
        select: () => ({
          limit: () => Promise.resolve({ data: [], error })
        }),
        insert: () => Promise.resolve({ data: null, error }),
        update: () => Promise.resolve({ data: null, error }),
        delete: () => Promise.resolve({ data: null, error }),
      }),
      channel: () => ({
        on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
      }),
      auth: {
        onAuthStateChange: () => ({ data: null, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signOut: () => Promise.resolve({ error: null })
      }
    };
  }
};

// Add a health check function to verify connection
export const checkSupabaseConnection = async () => {
  try {
    console.log('Checking Supabase connection...');
    // Simple query to test connection
    const supabase = await getSupabaseClient();
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
    const supabase = await getSupabaseClient();
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

// Create a lazy-initialized supabase instance for backward compatibility
// This maintains compatibility with existing code that imports { supabase }
export const supabase = getSupabaseClient();

// Default export for new code to use the getter function
export default getSupabaseClient;
