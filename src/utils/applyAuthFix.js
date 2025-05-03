// applyAuthFix.js
// Utility to help apply the emergency auth fix from SQL to the Supabase database

import getSupabaseClient from '../integrations/supabase/client';

/**
 * Attempts to apply the emergency auth fix directly to the Supabase database
 * NOTE: This requires admin-level permissions, so it might not work in all environments
 */
export const applyAuthFix = async () => {
  console.log('Attempting to apply emergency auth fix...');
  
  try {
    const supabase = getSupabaseClient();
    
    // Check if we can execute SQL
    const { error: checkError } = await supabase.rpc('check_db_permissions');
    if (checkError) {
      console.error('Permission check failed:', checkError);
      return {
        success: false,
        error: 'Insufficient permissions to apply fix. Please use the SQL Editor in Supabase dashboard.',
        message: 'Please run the emergency_auth_fix.sql script in the Supabase SQL Editor.'
      };
    }

    // Apply emergency auth permissions fixes
    console.log('Attempting to fix permissions for auth-related tables...');
    
    // 1. Disable RLS on critical tables
    const { error: rlsError } = await supabase.rpc('disable_auth_rls');
    if (rlsError) {
      console.error('Error disabling RLS:', rlsError);
    } else {
      console.log('Successfully disabled RLS on auth-related tables');
    }

    // 2. Grant permissions to auth roles
    const { error: permissionsError } = await supabase.rpc('fix_auth_permissions');
    if (permissionsError) {
      console.error('Error fixing permissions:', permissionsError);
    } else {
      console.log('Successfully granted permissions to auth roles');
    }

    return {
      success: !rlsError && !permissionsError,
      message: 'Auth fix applied. Please try logging in again.'
    };
  } catch (err) {
    console.error('Error applying auth fix:', err);
    return {
      success: false,
      error: err.message || 'Unknown error applying auth fix',
      message: 'Please run the emergency_auth_fix.sql script in the Supabase SQL Editor.'
    };
  }
};

/**
 * Instructions for manually applying the auth fix
 * Returns instructions for fixing authentication issues manually
 */
export const getAuthFixInstructions = () => {
  return `
# Fix Authentication Issues

You're seeing a "Database error granting user" error because of missing permissions in the Supabase database.
To fix this, follow these steps:

## Option 1: Apply the fix from the Supabase Dashboard

1. Log in to your Supabase dashboard at https://app.supabase.io
2. Select your project (the one with URL containing "sfrlnidbiviniuqhryyc")
3. Go to the SQL Editor
4. Copy the contents of src/sql/emergency_auth_fix.sql
5. Paste it into the SQL Editor
6. Click "Run" to execute the query
7. Try logging in again to the application

## Option 2: Check Database Permissions

If Option 1 doesn't work, make sure the following permissions are set:

1. In the Supabase dashboard, go to Authentication > Policies
2. Check if the 'profiles' table has proper RLS policies for authenticated users
3. Add a policy that allows authenticated users to read their own profile data

## Need more help?

If you continue to experience issues, you may need to:
1. Check the Supabase logs for more specific error details
2. Reset the database schema (note: this will delete all data)
3. Contact Supabase support
`;
};

// Simple test function to check if auth is working
export const testAuthConnection = async () => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Auth connection test error:', error);
      return {
        success: false,
        error: error.message
      };
    }
    
    return {
      success: true,
      hasSession: !!data.session
    };
  } catch (err) {
    console.error('Exception testing auth connection:', err);
    return {
      success: false,
      error: err.message || 'Unknown error'
    };
  }
};

export default {
  applyAuthFix,
  getAuthFixInstructions,
  testAuthConnection
};
