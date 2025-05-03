
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
      console.error('Supabase credentials missing. Please check Netlify environment variables.');
      
      // In development, show more helpful error
      if (import.meta.env.DEV) {
        console.warn('In development, make sure you have a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
        console.warn('In production, ensure these are set as environment variables in your Netlify dashboard');
      }
      
      // Return a dummy client that logs errors instead of failing silently
      return {
        from: () => ({
          select: () => ({
            order: () => ({
              limit: () => Promise.resolve({ data: [], error: new Error('Supabase credentials missing') })
            }),
            limit: () => Promise.resolve({ data: [], error: new Error('Supabase credentials missing') }),
            eq: () => Promise.resolve({ data: [], error: new Error('Supabase credentials missing') })
          }),
          insert: () => Promise.resolve({ data: null, error: new Error('Supabase credentials missing') }),
          update: () => Promise.resolve({ data: null, error: new Error('Supabase credentials missing') }),
          delete: () => Promise.resolve({ data: null, error: new Error('Supabase credentials missing') }),
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

    supabaseInstance = createClient(
      supabaseUrl,
      supabaseKey,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true
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
    const getSupabaseClient() = getSupabaseClient();
    const { data, error } = await getSupabaseClient().from('donations').select('id').limit(1);
    
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
    const getSupabaseClient() = getSupabaseClient();
    const { data: donations, error: donationsError } = await getSupabaseClient()
      .from('donations')
      .select('id, amount, donation_date')
      .limit(5);
      
    if (donationsError) {
      console.error('Error checking donations:', donationsError);
    } else {
      console.log('Sample donations:', donations);
    }
    
    // Check expenses
    const { data: expenses, error: expensesError } = await getSupabaseClient()
      .from('expenses')
      .select('id, amount, expense_date, category')
      .limit(5);
      
    if (expensesError) {
      console.error('Error checking expenses:', expensesError);
    } else {
      console.log('Sample expenses:', expenses);
    }
    
    // Check budget categories
    const { data: budgets, error: budgetsError } = await getSupabaseClient()
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

// Create a lazy-initialized getSupabaseClient() instance for backward compatibility
// This maintains compatibility with existing code that imports { getSupabaseClient() }
export const getSupabaseClient() = getSupabaseClient();

// Default export for new code to use the getter function
export default getSupabaseClient;
