/**
 * Script to apply RLS policies to Supabase database
 * This ensures consistent security policies across all environments
 */
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

/**
 * Execute RLS SQL statements against Supabase
 */
async function applyDatabasePolicies() {
  try {
    console.log('Applying RLS policies to Supabase database...');
    
    // Path to the SQL file with RLS policies
    const sqlFilePath = path.resolve('./src/sql/complete_rls_setup.sql');
    
    // Read and parse SQL file
    console.log(`Reading SQL file: ${sqlFilePath}`);
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split SQL content into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`);
      
      try {
        // Some Supabase instances have an RPC function for executing SQL
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.warn(`Warning executing statement: ${error.message}`);
          
          // Try direct SQL execution if RPC fails (depends on database privileges)
          try {
            const { error: directError } = await supabase.auth.admin.executeSql(statement);
            if (directError) {
              console.error(`Error executing SQL directly: ${directError.message}`);
            }
          } catch (directExecError) {
            console.error('Error with direct SQL execution:', directExecError);
          }
        }
      } catch (stmtError) {
        console.error(`Error executing statement: ${stmtError}`);
      }
    }
    
    // Verify policies were applied
    try {
      console.log('Verifying policies were applied...');
      const { data, error } = await supabase.rpc('list_policies');
      
      if (error) {
        console.error('Error checking policies:', error.message);
      } else {
        console.log(`Successfully verified ${data.length} policies in database`);
        console.log(data.map(p => p.policyname).join('\n'));
      }
    } catch (verifyError) {
      console.error('Error verifying policies:', verifyError);
    }
    
    console.log('RLS policy application complete');
  } catch (error) {
    console.error('Error applying RLS policies:', error);
    process.exit(1);
  }
}

// Run the function
applyDatabasePolicies();
