/**
 * Centralized security configuration for Content Security Policy
 * This ensures we maintain consistent CSP rules across all environments
 */

// Base CSP directives that all environments share
const baseCSP = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
  'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  'img-src': [
    "'self'", 
    "data:", 
    "https://meowrescue.windsurf.build", 
    "https://sfrlnidbiviniuqhryyc.supabase.co", 
    "https://images.unsplash.com"
  ],
  'connect-src': [
    "'self'", 
    "https://sfrlnidbiviniuqhryyc.supabase.co", 
    "wss://sfrlnidbiviniuqhryyc.supabase.co"
  ],
  'font-src': ["'self'", "https://fonts.gstatic.com", "data:"],
  'frame-src': ["'self'", "https://sfrlnidbiviniuqhryyc.supabase.co"],
  'media-src': ["'self'", "https:", "data:"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'self'"],
  'manifest-src': ["'self'"],
  'worker-src': ["'self'", "blob:"]
};

// Convert CSP object to string format for different use cases
export const generateCSPString = (format: 'header' | 'meta' = 'header') => {
  // Convert CSP object to string
  const cspString = Object.entries(baseCSP)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
  
  // Return appropriate format
  return format === 'meta' ? cspString : cspString + ';';
};

// Export CSP for Vite config
export const getViteCSP = () => {
  return generateCSPString('header');
};

// Export CSP for Netlify headers
export const getNetlifyCSP = () => {
  return generateCSPString('header');
};

// Export CSP for HTML meta tag
export const getMetaCSP = () => {
  return generateCSPString('meta');
};

/**
 * Generate a CSP with reporting functionality to detect violations
 * @param reportUri The endpoint to send CSP violation reports to
 * @returns A CSP object with reporting enabled
 */
export const getCSPWithReporting = (reportUri = '/api/csp-report'): Record<string, string[]> => {
  const policy = { ...baseCSP };
  policy['report-uri'] = [reportUri];
  return policy;
};

/**
 * Convert CSP with reporting to string format for use in headers
 * @param reportUri The endpoint to send CSP violation reports to
 * @returns CSP as a string with reporting enabled
 */
export const getNetlifyCSPWithReporting = (reportUri = '/api/csp-report'): string => {
  return Object.entries(getCSPWithReporting(reportUri))
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
};

export default {
  generateCSPString,
  getViteCSP,
  getNetlifyCSP,
  getMetaCSP,
  getCSPWithReporting,
  getNetlifyCSPWithReporting
};
