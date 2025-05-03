/**
 * Script to apply security headers to Netlify configuration
 * This ensures consistent CSP policies across all environments
 */
import fs from 'fs';
import path from 'path';
import { getNetlifyCSP } from '../src/config/security.js';

// Path to the generated Netlify headers file
const HEADERS_FILE = path.join('dist', '_headers');

/**
 * Apply security headers to the Netlify _headers file
 */
function applySecurityHeaders() {
  console.log('Applying security headers to Netlify configuration...');
  
  // Generate CSP header
  const cspHeader = getNetlifyCSP();
  
  // Define headers content
  const headersContent = `
# Security headers for all paths
/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: ${cspHeader}

# Cache control for static assets
/assets/*
  Cache-Control: public, max-age=31536000, immutable

# Font files
*.woff
  Content-Type: font/woff
*.woff2
  Content-Type: font/woff2

# JavaScript files
*.js
  Content-Type: application/javascript

# CSS files
*.css
  Content-Type: text/css

# SVG files
*.svg
  Content-Type: image/svg+xml
`;

  // Ensure dist directory exists
  const distDir = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Write to headers file
  const headersPath = path.join(process.cwd(), HEADERS_FILE);
  fs.writeFileSync(headersPath, headersContent);
  
  console.log(`Security headers written to ${headersPath}`);
}

// Run the script
applySecurityHeaders();
