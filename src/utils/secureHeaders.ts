/**
 * Secure Headers Utility
 * 
 * This utility provides functions to generate secure headers for HTTP responses.
 * These headers help protect against common web vulnerabilities.
 */

import { getCspDirectives } from '../config/security';

/**
 * Generate security headers for API routes
 * These headers help protect against various attacks without affecting visual appearance
 */
export function getSecurityHeaders() {
  return {
    // Prevent browsers from incorrectly detecting non-scripts as scripts
    'X-Content-Type-Options': 'nosniff',
    
    // Disable loading the page in an iframe to prevent clickjacking
    'X-Frame-Options': 'DENY',
    
    // Enable browser protection against XSS attacks
    'X-XSS-Protection': '1; mode=block',
    
    // Enforce HTTPS in future connections
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    
    // Control what features and APIs can be used in the browser
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
    
    // Help prevent cross-site scripting using Content-Security-Policy
    'Content-Security-Policy': getCspDirectives().join('; '),
    
    // Prevent browsers from sending referrer information to other websites
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
}

/**
 * Get security headers adjusted for APIs
 * Modified version that doesn't include CSP which can interfere with API responses
 */
export function getApiSecurityHeaders() {
  const headers = getSecurityHeaders();
  
  // Remove CSP for API routes as it can interfere with API responses
  delete headers['Content-Security-Policy'];
  
  return headers;
}

/**
 * Generate security headers for Netlify serverless functions
 */
export function getNetlifyFunctionHeaders() {
  return {
    ...getSecurityHeaders(),
    // Allow CORS from your main domain only
    'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
      ? 'https://meowrescue.org' 
      : 'http://localhost:3000',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

/**
 * Check if a URL is safe to redirect to
 * Prevents open redirect vulnerabilities
 */
export function isSafeRedirectUrl(url: string): boolean {
  try {
    // Allow relative URLs
    if (url.startsWith('/') && !url.startsWith('//')) {
      return true;
    }
    
    // For absolute URLs, check that they are on allowed domains
    const parsedUrl = new URL(url);
    const allowedDomains = [
      'meowrescue.org',
      'www.meowrescue.org',
      'localhost',
      '127.0.0.1'
    ];
    
    return allowedDomains.some(domain => 
      parsedUrl.hostname === domain || 
      parsedUrl.hostname.endsWith(`.${domain}`)
    );
  } catch (error) {
    // If URL parsing fails, assume it's not safe
    return false;
  }
}

export default {
  getSecurityHeaders,
  getApiSecurityHeaders,
  getNetlifyFunctionHeaders,
  isSafeRedirectUrl
};
