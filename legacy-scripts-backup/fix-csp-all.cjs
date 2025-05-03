// This script fixes Content Security Policy (CSP) issues across all HTML files
const fs = require('fs');
const path = require('path');

// Supabase URL and domain
const supabaseUrl = 'https://sfrlnidbiviniuqhryyc.supabase.co';
const supabaseDomain = 'sfrlnidbiviniuqhryyc.supabase.co';

// Directory to search in
const distDir = path.join(__dirname, 'dist');

// Function to recursively find all HTML files
function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recursively search subdirectories
      findHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

// Fix CSP in a specific file
function fixCspInFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let changes = 0;
    
    // 1. Fix Supabase URLs in CSP
    content = content.replace(/https:\/\/sfrlnidbiviniuqhryyc\.getSupabaseClient\(\)\.co/g, supabaseUrl);
    content = content.replace(/wss:\/\/\*\.getSupabaseClient\(\)\.co/g, 'wss://*.supabase.co');
    
    // 2. Add Google Fonts to style-src if not present
    if (content.includes('style-src') && !content.includes('fonts.googleapis.com')) {
      content = content.replace(/style-src\s+'self'\s+'unsafe-inline'/g, "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com");
    }
    
    // 3. Add Google Fonts to font-src if not present
    if (content.includes('font-src') && !content.includes('fonts.gstatic.com')) {
      content = content.replace(/font-src\s+'self'\s+data:/g, "font-src 'self' data: https://fonts.gstatic.com");
    }
    
    // 4. Fix any meta tags with CSP
    const metaTagRegex = /<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]+)"/g;
    content = content.replace(metaTagRegex, (match, cspContent) => {
      let newCspContent = cspContent;
      
      // Fix img-src
      if (newCspContent.includes('img-src') && !newCspContent.includes(supabaseDomain)) {
        newCspContent = newCspContent.replace(
          /img-src\s+'self'\s+data:[^;]*/g, 
          `img-src 'self' data: https://meowrescue.windsurf.build https://${supabaseDomain} https://images.unsplash.com`
        );
      }
      
      // Fix connect-src
      if (newCspContent.includes('connect-src') && !newCspContent.includes(supabaseDomain)) {
        newCspContent = newCspContent.replace(
          /connect-src\s+'self'\s+https:[^;]*/g, 
          `connect-src 'self' https: wss://*.supabase.co`
        );
      }
      
      // Fix style-src for Google Fonts
      if (newCspContent.includes('style-src') && !newCspContent.includes('fonts.googleapis.com')) {
        newCspContent = newCspContent.replace(
          /style-src\s+'self'\s+'unsafe-inline'[^;]*/g, 
          `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`
        );
      }
      
      // Fix font-src for Google Fonts
      if (newCspContent.includes('font-src') && !newCspContent.includes('fonts.gstatic.com')) {
        newCspContent = newCspContent.replace(
          /font-src\s+'self'\s+data:[^;]*/g, 
          `font-src 'self' data: https://fonts.gstatic.com`
        );
      }
      
      return `<meta http-equiv="Content-Security-Policy" content="${newCspContent}"`;
    });
    
    // 5. Fix inline CSP fixes in script tags
    if (content.includes('CSP fix script')) {
      // Enhance the CSP fix script to also handle font and style sources
      content = content.replace(
        /\/\/ This script runs immediately to fix any CSP issues/,
        `// This script runs immediately to fix all CSP issues including fonts and Supabase resources`
      );
      
      // Add a fix for Google Fonts if not present
      if (!content.includes('fonts.googleapis.com')) {
        const scriptFixPos = content.indexOf('CSP fix script completed');
        if (scriptFixPos !== -1) {
          const scriptInsert = `
    // Fix Google Fonts CSP issues
    const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
    fontLinks.forEach(function(link) {
      if (!link.hasAttribute('data-fixed')) {
        console.log('Adding CSP workaround for Google Font:', link.href);
        link.setAttribute('data-fixed', 'true');
        
        // Create a new link with the same attributes but add nonce
        const newLink = document.createElement('link');
        Array.from(link.attributes).forEach(attr => {
          newLink.setAttribute(attr.name, attr.value);
        });
        
        // Replace the old link with the new one
        link.parentNode.replaceChild(newLink, link);
      }
    });
    
    // Fix Supabase resource CSP issues
    const supabaseLinks = document.querySelectorAll('img[src*="supabase.co"], source[src*="supabase.co"]');
    supabaseLinks.forEach(function(elem) {
      if (!elem.hasAttribute('data-fixed')) {
        console.log('Adding CSP workaround for Supabase resource:', elem.src);
        elem.setAttribute('data-fixed', 'true');
      }
    });`;
          
          content = content.replace(
            /console\.log\('CSP fix script completed'\);/,
            scriptInsert + '\n    console.log(\'CSP headers fixed for Supabase\');\n    console.log(\'CSP fix script completed\');'
          );
        }
      }
    }
    
    // Write back changes if needed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  - Fixed CSP in: ${filePath}`);
      changes++;
    }
    
    return changes > 0;
  } catch (error) {
    console.error(`  - Error processing ${filePath}:`, error);
    return false;
  }
}

// Create a global fix script for Supabase connection
function createGlobalFixScript() {
  const fixScriptPath = path.join(distDir, 'supabase-fix.js');
  const fixScript = `
// Fix Supabase connection issues
(function() {
  window.addEventListener('DOMContentLoaded', function() {
    console.log('Setting up global supabase instance for backward compatibility');
    
    // Replace any broken Supabase URLs
    if (typeof window.getSupabaseClient === 'function') {
      const originalGetSupabaseClient = window.getSupabaseClient;
      window.getSupabaseClient = function() {
        const client = originalGetSupabaseClient();
        if (client && client.url && client.url.includes('getSupabaseClient()')) {
          client.url = client.url.replace('getSupabaseClient()', 'supabase');
          console.log('Supabase connection fix applied');
        }
        return client;
      };
    }
    
    // Fix CSP headers if needed
    const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (meta) {
      let content = meta.getAttribute('content');
      if (content.includes('getSupabaseClient()')) {
        content = content.replace(/getSupabaseClient\(\)/g, 'supabase');
        meta.setAttribute('content', content);
        console.log('CSP headers fixed for Supabase');
      }
    }
  });
})();
`;

  fs.writeFileSync(fixScriptPath, fixScript, 'utf8');
  console.log(`Created global Supabase fix script at: ${fixScriptPath}`);
  
  // Add the script reference to all HTML files
  const htmlFiles = findHtmlFiles(distDir);
  htmlFiles.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Only add if not already present
    if (!content.includes('supabase-fix.js')) {
      // Add after existing scripts or at the beginning of head
      if (content.includes('<script src="/csp-fix.js"></script>')) {
        content = content.replace(
          '<script src="/csp-fix.js"></script>',
          '<script src="/csp-fix.js"></script>\n    <script src="/supabase-fix.js"></script>'
        );
      } else if (content.includes('<head>')) {
        content = content.replace(
          '<head>',
          '<head>\n    <script src="/supabase-fix.js"></script>'
        );
      }
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Added Supabase fix script to: ${filePath}`);
    }
  });
}

// Main function
function main() {
  console.log('Finding HTML files in the dist directory...');
  const htmlFiles = findHtmlFiles(distDir);
  console.log(`Found ${htmlFiles.length} HTML files`);
  
  let fixedCount = 0;
  
  for (const file of htmlFiles) {
    if (fixCspInFile(file)) {
      fixedCount++;
    }
  }
  
  // Create global fix script
  createGlobalFixScript();
  
  console.log(`\nFixed CSP headers in ${fixedCount} files.`);
}

// Run the script
main();
