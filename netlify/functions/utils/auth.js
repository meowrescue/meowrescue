/**
 * Netlify Functions Authentication Helper
 * 
 * This utility provides secure authentication checks for Netlify functions.
 * It provides multiple levels of verification to ensure only authorized users
 * can access protected endpoints.
 */

const { createClient } = require('@supabase/supabase-js');

/**
 * Get Supabase client
 * Uses anon key for verification only - never use service role key in functions
 */
function getSupabaseClient() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase credentials in environment variables');
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Extract JWT token from authorization header
 */
function extractToken(event) {
  const authHeader = event.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('No authorization token provided');
  }
  
  return token;
}

/**
 * Verify if a user is authorized for a function
 * @param {object} event - Netlify function event object
 * @param {object} options - Authorization options
 * @param {boolean} options.requireAuth - Whether auth is required
 * @param {string[]} options.allowedRoles - Array of roles allowed (e.g., ['admin', 'foster'])
 * @returns {Promise<object>} - User data if authorized
 */
async function verifyAuth(event, options = { requireAuth: true, allowedRoles: [] }) {
  const { requireAuth, allowedRoles } = options;
  
  try {
    // Extract token
    const token = extractToken(event);
    
    // Verify token with Supabase
    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      throw new Error(error?.message || 'Invalid user token');
    }
    
    // If specific roles are required, check them
    if (allowedRoles && allowedRoles.length > 0) {
      // Get user's profile to check role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (profileError || !profile) {
        throw new Error('User profile not found');
      }
      
      if (!allowedRoles.includes(profile.role)) {
        throw new Error(`Access denied: User role '${profile.role}' not allowed`);
      }
    }
    
    return { user };
  } catch (error) {
    if (requireAuth) {
      // Log the unauthorized attempt
      console.error('Unauthorized access attempt:', {
        ip: event.headers['x-forwarded-for'] || event.headers['client-ip'],
        path: event.path,
        timestamp: new Date().toISOString(),
        error: error.message
      });
      
      throw new Error('Unauthorized: ' + error.message);
    } else {
      // Auth was optional, continue as anonymous
      return { user: null };
    }
  }
}

/**
 * Generate a standard error response
 */
function errorResponse(statusCode, message) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      error: true, 
      message,
      timestamp: new Date().toISOString()
    })
  };
}

module.exports = {
  verifyAuth,
  errorResponse,
  getSupabaseClient
};
