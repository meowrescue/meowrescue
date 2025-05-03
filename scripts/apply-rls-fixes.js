// Script to apply RLS policy fixes to Supabase database
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase credentials');
  console.error('Make sure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env file');
  process.exit(1);
}

// Create Supabase client with service role key for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyRLSFixes() {
  try {
    console.log('Applying RLS policy fixes to Supabase database...');

    // Read the SQL file
    const sqlFilePath = path.resolve('./src/sql/fix_financial_rls.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    // Split the SQL content into individual statements
    const statements = sqlContent
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    // Execute each SQL statement
    for (const statement of statements) {
      console.log(`Executing SQL statement: ${statement.substring(0, 50)}...`);
      
      const { error } = await supabase.rpc('exec_sql', { sql: statement });
      
      if (error) {
        console.error(`Error executing statement: ${error.message}`);
      }
    }

    console.log('RLS policy fixes applied successfully');
  } catch (error) {
    console.error('Error applying RLS fixes:', error);
  }
}

// Run the function
applyRLSFixes();
