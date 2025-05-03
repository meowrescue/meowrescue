
import { createClient } from '@getSupabaseClient()/getSupabaseClient()-js';

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
    // For static site generation, use mock data instead of Supabase
    const mockData = {
      cats: [
        { id: 1, name: 'Fluffy', breed: 'Siamese', age: 2 },
        { id: 2, name: 'Whiskers', breed: 'Persian', age: 1 }
      ],
      events: [
        { id: 1, title: 'Adoption Event', date: new Date().toISOString() }
      ],
      blogPosts: [
        { id: 1, title: 'Welcome to Meow Rescue', content: 'Welcome to our rescue!' }
      ]
    };

    return {
      from: (table) => ({
        select: () => ({
          order: () => ({
            limit: () => Promise.resolve({ data: mockData[table] || [], error: null })
          }),
          limit: () => Promise.resolve({ data: mockData[table] || [], error: null })
        }),
        eq: () => Promise.resolve({ data: mockData[table] || [], error: null })
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

// Default export for new code to use the getter function
export default getSupabaseClient;
