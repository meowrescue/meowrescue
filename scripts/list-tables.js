// Script to list all tables in the Supabase database
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client only if credentials are available
let supabase = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('Supabase client initialized successfully');
} else {
  console.warn('Supabase credentials not available. Table listing will be skipped.');
  process.exit(0); // Exit gracefully
}

async function listTables() {
  try {
    console.log('Fetching tables from Supabase...');
    const { data, error } = await supabase.rpc('get_tables');
    
    if (error) {
      console.error('Error fetching tables:', error.message);
      return;
    }
    
    console.log('Available tables:');
    data.forEach((table, index) => console.log(` - ${table}`));
    
    // Look specifically for tables related to finances
    const financeTables = data.filter(table => 
      table.toLowerCase().includes('financ') || 
      table.toLowerCase().includes('budget') ||
      table.toLowerCase().includes('expense') ||
      table.toLowerCase().includes('income')
    );
    
    console.log('\nFinance-related tables:');
    if (financeTables.length === 0) {
      console.log('  No finance-related tables found');
    } else {
      financeTables.forEach(table => console.log(` - ${table}`));
      
      // For each finance table, check its structure
      for (const table of financeTables) {
        const { data: columns, error: columnsError } = await supabase
          .from(table)
          .select('*')
          .limit(1);
          
        if (!columnsError && columns && columns.length > 0) {
          console.log(`\nSchema for ${table}:`);
          const columnNames = Object.keys(columns[0]);
          columnNames.forEach(column => console.log(` - ${column}`));
        } else {
          console.log(`\nCouldn't fetch schema for ${table}: ${columnsError?.message || 'No data'}`);
        }
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Run the function
listTables()
  .then(() => {
    console.log('Done!');
  })
  .catch(err => {
    console.error('Error in table listing:', err);
    process.exit(1);
  });
