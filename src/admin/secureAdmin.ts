/**
 * Secure Admin Utilities
 * 
 * This module provides secure, server-side only functions for admin tasks
 * that require the service role key. These functions should NEVER be exposed
 * to client-side code.
 */

import { createClient } from '@supabase/supabase-js';
import { logSecurityIssue } from '@/services/errorLogging';

// This module should only be imported in server-side code
if (typeof window !== 'undefined') {
  throw new Error(
    'SECURITY ERROR: secureAdmin module must never be imported in client-side code!'
  );
}

/**
 * Get a Supabase client with the service role key
 * This should ONLY be used server-side in admin functions
 */
export async function getServiceRoleClient() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase service role credentials');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
}

/**
 * Apply RLS policies to the database
 * This should only be used in administrative scripts, never client-side
 */
export async function applyRLSPolicies(sqlContent: string): Promise<{ success: boolean, message: string }> {
  try {
    // Get a client with the service role key
    const supabase = await getServiceRoleClient();
    
    // Log this admin action for security auditing
    console.log('Applying RLS policies via service role key');
    
    // Apply the SQL
    const { error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      logSecurityIssue('Error applying RLS policies', {
        component: 'secureAdmin',
        additionalData: { error: error.message }
      });
      return { success: false, message: error.message };
    }
    
    return { success: true, message: 'RLS policies successfully applied' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logSecurityIssue('Exception applying RLS policies', {
      component: 'secureAdmin',
      additionalData: { error: errorMessage }
    });
    return { success: false, message: errorMessage };
  }
}

/**
 * Execute administrative functions with proper validation
 * This should only be used server-side with appropriate authentication
 */
export async function executeAdminFunction(
  functionName: string,
  params: Record<string, any>,
  adminUserId: string
): Promise<{ success: boolean, data?: any, error?: string }> {
  try {
    // Get a client with the service role key
    const supabase = await getServiceRoleClient();
    
    // Verify that the user is actually an admin
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', adminUserId)
      .single();
    
    if (profileError || !profileData || profileData.role !== 'admin') {
      logSecurityIssue('Unauthorized admin function access attempt', {
        component: 'secureAdmin',
        additionalData: { 
          userId: adminUserId,
          functionName,
          params
        }
      });
      return { 
        success: false, 
        error: 'Unauthorized access to admin function' 
      };
    }
    
    // Log this admin action for security auditing
    console.log(`Admin ${adminUserId} executing function: ${functionName}`);
    
    // Execute the function
    const { data, error } = await supabase.rpc(functionName, params);
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMessage };
  }
}

export default {
  // Only export functions that should be available to server-side admin scripts
  applyRLSPolicies,
  executeAdminFunction
};
