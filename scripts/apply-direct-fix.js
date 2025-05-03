import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const distDir = join(__dirname, '..', 'dist');

// Direct Fix Content
const CSP_META_TAG = '<meta http-equiv="Content-Security-Policy" content="default-src \'self\' https://sfrlnidbiviniuqhryyc.supabase.co; connect-src \'self\' https://sfrlnidbiviniuqhryyc.supabase.co; frame-src \'self\' https://sfrlnidbiviniuqhryyc.supabase.co; script-src \'self\' \'unsafe-inline\' \'unsafe-eval\'; style-src \'self\' \'unsafe-inline\' https://fonts.googleapis.com; font-src \'self\' data: https://fonts.gstatic.com; img-src \'self\' data: blob: https://sfrlnidbiviniuqhryyc.supabase.co;">';

const SUPABASE_SCRIPT = `<script>
  window.SUPABASE_URL = 'https://sfrlnidbiviniuqhryyc.supabase.co';
  window.SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmcmxuaWRiaXZpbml1cWhyeXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzU5MTE2MDAsImV4cCI6MTk5MTQ4NzYwMH0.C4YXI-X9YmNcEUei0g9K0D7Y5W568dpKKEkEdnH0_vE';
  
  // Patch fetch to fix Supabase API issues
  const originalFetch = window.fetch;
  window.fetch = function(url, options = {}) {
    // Check if this is a Supabase API call
    if (typeof url === 'string' && url.includes('sfrlnidbiviniuqhryyc.supabase.co')) {
      // Ensure options and headers exist
      options = options || {};
      options.headers = options.headers || {};
      
      // Add required headers for Supabase REST API
      options.headers = {
        ...options.headers,
        'apikey': window.SUPABASE_KEY,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Client-Info': 'meowrescue/1.0.0'
      };
      
      // Ensure credentials are included
      options.credentials = 'include';
    }
    
    // Call the original fetch
    return originalFetch(url, options);
  };
</script>`;

// Recursively find all HTML files in the dist directory
function findHtmlFiles(directory) {
  let results = [];
  const files = readdirSync(directory);
  
  for (const file of files) {
    const fullPath = join(directory, file);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Recursively search subdirectories
      results = results.concat(findHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  
  return results;
}

// Update HTML files to add the direct fixes
function updateHtmlFile(filePath) {
  try {
    console.log(`Processing ${filePath}...`);
    let content = readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Check if this HTML file already has a CSP meta tag
    if (!content.includes('Content-Security-Policy')) {
      // Insert CSP meta tag right after <head>
      content = content.replace(/<head>/i, '<head>\n    ' + CSP_META_TAG);
      modified = true;
    } else {
      // Replace existing CSP tag with our comprehensive one
      content = content.replace(/<meta[^>]*Content-Security-Policy[^>]*>/i, CSP_META_TAG);
      modified = true;
    }
    
    // Add the Supabase script if not already present
    if (!content.includes('window.SUPABASE_URL') && !content.includes('window.SUPABASE_KEY')) {
      // Insert after the CSP meta tag
      content = content.replace(CSP_META_TAG, CSP_META_TAG + '\n    ' + SUPABASE_SCRIPT);
      modified = true;
    }
    
    if (modified) {
      // Write the updated content back to the file
      writeFileSync(filePath, content, 'utf8');
      console.log(`  Updated ${filePath}`);
    } else {
      console.log(`  No changes needed for ${filePath}`);
    }
  } catch (error) {
    console.error(`  Error updating ${filePath}:`, error);
  }
}

// Main function
function main() {
  console.log('Starting direct fix application to all HTML files...');
  
  // Find all HTML files
  const htmlFiles = findHtmlFiles(distDir);
  console.log(`Found ${htmlFiles.length} HTML files to process`);
  
  // Update each HTML file
  for (const htmlFile of htmlFiles) {
    updateHtmlFile(htmlFile);
  }
  
  console.log('Complete! Applied direct fixes to all HTML files.');
}

// Run the script
main();
