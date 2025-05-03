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
  console.warn('Supabase credentials not available. Schema check will be skipped.');
  process.exit(0); // Exit gracefully
}

// List of tables to check - let's check the most likely candidates for financial data
const TABLES_TO_CHECK = [
  'finances',
  'financial_summary',
  'financial_data',
  'financial_transactions',
  'transparency',
  'budget',
  'income_expenses'
];

// Function to check a table's schema
async function checkTable(tableName) {
  try {
    // Use the Supabase client instead of direct API calls with headers
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      console.log(`Table ${tableName} not found or not accessible (${error.message})`);
      return null;
    }
    
    if (data && data.length > 0) {
      console.log(`\nTable ${tableName} exists with columns:`);
      const columns = Object.keys(data[0]);
      columns.forEach(col => console.log(` - ${col}`));
      return { tableName, columns, example: data[0] };
    } else {
      console.log(`Table ${tableName} exists but is empty`);
      return { tableName, columns: [], example: null };
    }
  } catch (error) {
    console.error(`Error checking table ${tableName}:`, error.message);
    return null;
  }
}

// Main function to check all tables
async function checkAllTables() {
  console.log('Checking financial tables in Supabase...\n');
  
  const results = [];
  
  for (const table of TABLES_TO_CHECK) {
    const result = await checkTable(table);
    if (result) {
      results.push(result);
    }
  }
  
  if (results.length === 0) {
    console.log('\nNo financial tables found. Check the database structure or create the necessary tables.');
  } else {
    console.log('\nFinancial tables summary:');
    results.forEach(r => console.log(` - ${r.tableName}: ${r.columns.length} columns`));
    
    // Display examples of found tables
    console.log('\nExamples of financial data:');
    results.forEach(r => {
      if (r.example) {
        console.log(`\n${r.tableName} example:`);
        console.log(r.example);
      }
    });
  }
}

// Run the function
checkAllTables()
  .then(() => console.log('\nDone!'))
  .catch(err => console.error('Unexpected error:', err));
