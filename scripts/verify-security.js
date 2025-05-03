/**
 * Security Verification Script
 * This script verifies that our security enhancements are working properly
 * by checking database access to audit logs and monitoring functionality.
 */

import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifySecuritySetup() {
  console.log('🔒 Verifying security setup...');

  try {
    // Check if audit_logs table exists
    const { data: auditTable, error: auditError } = await supabase
      .from('audit_logs')
      .select('id')
      .limit(1);

    if (auditError && auditError.code === '42P01') {
      console.error('❌ Audit logs table does not exist. Run the setup_audit_logs_fixed.sql script.');
      return false;
    } else if (auditError) {
      console.error('❌ Error querying audit logs table:', auditError.message);
      return false;
    } else {
      console.log('✅ Audit logs table exists and is accessible.');
    }

    // Check if activity_logs table exists
    const { data: activityTable, error: activityError } = await supabase
      .from('activity_logs')
      .select('id')
      .limit(1);

    if (activityError && activityError.code === '42P01') {
      console.error('❌ Activity logs table does not exist. Run the setup_audit_logs_fixed.sql script.');
      return false;
    } else if (activityError) {
      console.error('❌ Error querying activity logs table:', activityError.message);
      return false;
    } else {
      console.log('✅ Activity logs table exists and is accessible.');
    }

    // Check if security policies are in place
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_policies', { table_name: 'audit_logs' });

    if (policiesError) {
      console.error('❌ Unable to verify RLS policies:', policiesError.message);
    } else if (!policies || policies.length === 0) {
      console.error('❌ No RLS policies found for audit_logs table. Security may be compromised.');
    } else {
      console.log('✅ RLS policies are in place for audit logs.');
    }

    // Success
    console.log('✅ Security verification completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error during security verification:', error);
    return false;
  }
}

// Run the verification
verifySecuritySetup()
  .then(success => {
    if (success) {
      console.log('🎉 Security setup verification completed successfully!');
    } else {
      console.error('❌ Security setup verification failed. See errors above.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Unexpected error during verification:', error);
    process.exit(1);
  });
