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
  // IMPORTANT: Return the existing instance if it exists
  // This prevents the "Multiple GoTrueClient instances" warning
  if (supabaseInstance) {
    return supabaseInstance;
  }

  try {
    // Get environment variables injected by Netlify
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    // Check if credentials are available
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase credentials missing. Please check Netlify environment variables.');
      
      // In development, show more helpful error
      if (import.meta.env.DEV) {
        console.warn('In development, make sure you have a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
        console.warn('In production, ensure these are set as environment variables in your Netlify dashboard');
      }
      
      // Return a dummy client that logs errors instead of failing silently
      return createDummyClient('Supabase credentials missing');
    }

    // Create the Supabase client with robust error handling
    supabaseInstance = createClient(
      supabaseUrl,
      supabaseKey,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          // Add debug to help catch authentication issues
          debug: import.meta.env.DEV,
          // Increase timeout for potentially slow auth operations
          storageKey: 'meowrescue-auth-token',
          detectSessionInUrl: false,
        },
        global: {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      }
    );
    
    // Add listeners for auth events in debug mode
    if (import.meta.env.DEV) {
      supabaseInstance.auth.onAuthStateChange((event, session) => {
        console.log(`Auth event: ${event}`, session ? 'Session exists' : 'No session');
      });
    }
    
    return supabaseInstance;
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    
    // Return a dummy client in case of error
    return createDummyClient(error);
  }
};

// Create a dummy client for error handling
const createDummyClient = (error) => {
  return {
    from: () => ({
      select: () => ({
        order: () => ({
          limit: () => Promise.resolve({ data: [], error: new Error('Supabase client initialization failed') })
        }),
        limit: () => Promise.resolve({ data: [], error: new Error('Supabase client initialization failed') }),
        eq: () => Promise.resolve({ data: [], error: new Error('Supabase client initialization failed') }),
        single: () => Promise.resolve({ data: null, error: new Error('Supabase client initialization failed') })
      }),
      insert: () => Promise.resolve({ data: null, error: new Error('Supabase client initialization failed') }),
      update: () => Promise.resolve({ data: null, error: new Error('Supabase client initialization failed') }),
      delete: () => Promise.resolve({ data: null, error: new Error('Supabase client initialization failed') }),
    }),
    channel: () => ({
      on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
    }),
    auth: {
      onAuthStateChange: (callback) => {
        console.error('Auth service not available:', error);
        // Return dummy unsubscribe function
        return { data: { subscription: { unsubscribe: () => {} } }, error: null };
      },
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: new Error('Auth service not available') }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: new Error('Auth service not available') }),
      resetPasswordForEmail: () => Promise.resolve({ data: {}, error: new Error('Auth service not available') })
    }
  };
};

// Add a health check function to verify connection
export const checkSupabaseConnection = async () => {
  try {
    console.log('Checking Supabase connection...');
    // Simple query to test connection
    const supabase = getSupabaseClient();
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
    const supabase = getSupabaseClient();
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

// For backward compatibility, but make sure to use the function ONCE
// IMPORTANT: Do not export a direct instance, only the getter function
// This fixes the "Multiple GoTrueClient instances" warning
console.log('Setting up global supabase instance for backward compatibility');

// Default export for new code to use the getter function
export default getSupabaseClient;

// For backward compatibility with existing code
// Instead of creating a new instance, this re-exports the getter function
export const supabase = getSupabaseClient;
