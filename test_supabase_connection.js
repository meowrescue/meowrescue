import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

// Check if credentials are available
if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials not available. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection
async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Try to get the current user session (this will work even without an active session)
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Connection test failed:', error.message);
      return false;
    }
    
    console.log('Connection successful!');
    console.log('Session data:', data);
    
    return true;
  } catch (err) {
    console.error('Unexpected error:', err);
    return false;
  }
}

// Run the test
testConnection()
  .then(success => {
    if (success) {
      console.log(' Supabase connection test passed');
      process.exit(0);
    } else {
      console.error(' Supabase connection test failed');
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Error during test:', err);
    process.exit(1);
  });
