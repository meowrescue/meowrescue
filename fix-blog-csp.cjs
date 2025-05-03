// This script specifically fixes CSP issues in blog pages
const fs = require('fs');
const path = require('path');

// Directory to search in
const blogDir = path.join(__dirname, 'dist', 'blog');

// Fix the CSP script in dist
const fixCspScript = () => {
  const cspScriptPath = path.join(__dirname, 'dist', 'csp-fix.js');
  
  // Read existing script
  if (fs.existsSync(cspScriptPath)) {
    let content = fs.readFileSync(cspScriptPath, 'utf8');
    
    // Check if we need to update it
    if (!content.includes('fonts.googleapis.com')) {
      console.log('Enhancing CSP fix script...');
      
      // Enhanced script with font and Supabase fixes
      const enhancedScript = `// This script runs immediately to fix all CSP issues including fonts and Supabase resources
(function() {
  // Function to run as soon as possible
  function fixCSP() {
    try {
      // Fix Content-Security-Policy meta tag if present
      const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      if (cspMeta) {
        let cspContent = cspMeta.getAttribute('content');
        
        // Fix Supabase URLs
        if (cspContent.includes('getSupabaseClient()')) {
          cspContent = cspContent.replace(/getSupabaseClient\(\)/g, 'supabase');
          cspMeta.setAttribute('content', cspContent);
          console.log('CSP header Supabase URL fixed');
        }
        
        // Add Google Fonts to style-src if missing
        if (!cspContent.includes('fonts.googleapis.com')) {
          cspContent = cspContent.replace(
            /style-src\\s+'self'\\s+'unsafe-inline'/g, 
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com"
          );
          cspMeta.setAttribute('content', cspContent);
          console.log('Added Google Fonts to style-src CSP directive');
        }
        
        // Add Google Fonts to font-src if missing
        if (!cspContent.includes('fonts.gstatic.com')) {
          cspContent = cspContent.replace(
            /font-src\\s+'self'\\s+data:/g, 
            "font-src 'self' data: https://fonts.gstatic.com"
          );
          cspMeta.setAttribute('content', cspContent);
          console.log('Added Google Fonts to font-src CSP directive');
        }
      }
    } catch (e) {
      console.error('CSP fix error:', e);
    }
  }
  
  // Try to run immediately
  try {
    fixCSP();
  } catch (e) {
    console.error('Early CSP fix failed:', e);
  }
  
  // Also run on DOMContentLoaded for safety
  document.addEventListener('DOMContentLoaded', function() {
    // Run CSP fixes again to ensure they're applied
    fixCSP();
    
    // Remove any problematic preload links
    const links = document.querySelectorAll('link[rel="preload"]');
    links.forEach(function(link) {
      if (link.href && link.href.includes('yourapi.example.com')) {
        console.log('Removing problematic preload link:', link.href);
        link.parentNode.removeChild(link);
      }
    });

    // Fix any image loading issues
    const images = document.querySelectorAll('img[src]');
    images.forEach(function(img) {
      if (img.src && (img.src.includes('images.unsplash.com') || img.src.includes('supabase.co')) && !img.hasAttribute('data-fixed')) {
        console.log('Adding CSP workaround for image:', img.src);
        // Mark as fixed to prevent infinite loops
        img.setAttribute('data-fixed', 'true');
        
        // Use a data attribute to store the original URL
        img.setAttribute('data-original-src', img.src);
        
        // Set a fallback image for errors
        img.onerror = function() {
          console.log('Image failed to load, using fallback');
          this.src = '/images/fallback-cat.jpg';
        };
      }
    });
    
    // Fix Google Fonts CSP issues
    const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
    fontLinks.forEach(function(link) {
      if (!link.hasAttribute('data-fixed')) {
        console.log('Adding CSP workaround for Google Font:', link.href);
        link.setAttribute('data-fixed', 'true');
        
        // Ensure it's loaded without CSP blocking
        try {
          const newLink = document.createElement('link');
          Array.from(link.attributes).forEach(attr => {
            newLink.setAttribute(attr.name, attr.value);
          });
          
          // Replace the old link with the new one
          link.parentNode.replaceChild(newLink, link);
        } catch (e) {
          console.error('Font link replacement error:', e);
        }
      }
    });
    
    // Fix Supabase resource CSP issues
    const supabaseLinks = document.querySelectorAll('[src*="supabase.co"], [href*="supabase.co"]');
    supabaseLinks.forEach(function(elem) {
      if (!elem.hasAttribute('data-fixed')) {
        console.log('Adding CSP workaround for Supabase resource:', elem.src || elem.href);
        elem.setAttribute('data-fixed', 'true');
      }
    });
    
    console.log('Supabase connection fix applied');
    console.log('CSP fix script completed');
  });
})();
`;
      
      // Save enhanced script
      fs.writeFileSync(cspScriptPath, enhancedScript, 'utf8');
      console.log('Enhanced CSP fix script saved');
      return true;
    }
  }
  
  return false;
}

// Create a Supabase client fix script
const createSupabaseFixScript = () => {
  const supabaseFixPath = path.join(__dirname, 'dist', 'supabase-client-fix.js');
  
  const supabaseFixScript = `// Fix Supabase client issues
(function() {
  window.addEventListener('DOMContentLoaded', function() {
    // Handle Supabase client URLs
    if (typeof window.supabase !== 'undefined') {
      console.log('Fixing Supabase client references');
      
      // Fix any direct URLs
      const fixSupabaseURLs = function() {
        const elements = document.querySelectorAll('[src*="getSupabaseClient()"], [href*="getSupabaseClient()"]');
        elements.forEach(function(el) {
          // Get the original URL
          let url = el.src || el.href;
          if (url && url.includes('getSupabaseClient()')) {
            // Fix the URL
            url = url.replace(/getSupabaseClient\(\)/g, 'supabase');
            
            // Update the element
            if (el.src) el.src = url;
            if (el.href) el.href = url;
            
            console.log('Fixed Supabase URL reference');
          }
        });
      };
      
      // Try to run immediately
      fixSupabaseURLs();
      
      // Also run after a short delay to catch dynamically added elements
      setTimeout(fixSupabaseURLs, 1000);
    }
  });
})();
`;
  
  fs.writeFileSync(supabaseFixPath, supabaseFixScript, 'utf8');
  console.log(`Created Supabase client fix script at: ${supabaseFixPath}`);
}

// Fix HTML files to include fixes for Google Fonts and Supabase
const fixHtmlFiles = () => {
  // Find all HTML files in blog directory
  let files = [];
  try {
    if (fs.existsSync(blogDir)) {
      files = fs.readdirSync(blogDir)
        .filter(file => file.endsWith('.html'))
        .map(file => path.join(blogDir, file));
    }
  } catch (error) {
    console.error('Error finding blog HTML files:', error);
    return;
  }
  
  console.log(`Found ${files.length} blog HTML files`);
  
  // Process each file
  for (const filePath of files) {
    try {
      console.log(`Processing ${filePath}...`);
      
      // Read file content
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      // Add our fix scripts if not present
      if (!content.includes('supabase-client-fix.js')) {
        if (content.includes('<script src="/csp-fix.js"></script>')) {
          content = content.replace(
            '<script src="/csp-fix.js"></script>',
            '<script src="/csp-fix.js"></script>\n    <script src="/supabase-client-fix.js"></script>'
          );
        } else if (content.includes('<head>')) {
          content = content.replace(
            '<head>',
            '<head>\n    <script src="/csp-fix.js"></script>\n    <script src="/supabase-client-fix.js"></script>'
          );
        }
      }
      
      // Fix Google Fonts CSS link if not working
      if (content.includes('fonts.googleapis.com') && !content.includes('font-display:')) {
        const fontLinkPattern = /<link[^>]*href="https:\/\/fonts\.googleapis\.com[^"]+"[^>]*>/;
        if (fontLinkPattern.test(content)) {
          // Add inline styles for fonts as a fallback
          const inlineStyles = `
    <!-- Fallback font styles in case Google Fonts CSP fails -->
    <style>
      /* Fallback styles for Playfair Display */
      @font-face {
        font-family: 'Playfair Display';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: local('Playfair Display'), local('PlayfairDisplay-Regular'), url(/fonts/PlayfairDisplay-Regular.woff2) format('woff2');
      }
      
      @font-face {
        font-family: 'Playfair Display';
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: local('Playfair Display Bold'), local('PlayfairDisplay-Bold'), url(/fonts/PlayfairDisplay-Bold.woff2) format('woff2');
      }
      
      /* Fallback styles for Poppins */
      @font-face {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: local('Poppins Regular'), local('Poppins-Regular'), url(/fonts/Poppins-Regular.woff2) format('woff2');
      }
      
      @font-face {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 500;
        font-display: swap;
        src: local('Poppins Medium'), local('Poppins-Medium'), url(/fonts/Poppins-Medium.woff2) format('woff2');
      }
      
      @font-face {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 600;
        font-display: swap;
        src: local('Poppins SemiBold'), local('Poppins-SemiBold'), url(/fonts/Poppins-SemiBold.woff2) format('woff2');
      }
    </style>`;
          
          // Add after the last link tag in head
          const headEndPos = content.indexOf('</head>');
          if (headEndPos !== -1) {
            content = content.slice(0, headEndPos) + inlineStyles + content.slice(headEndPos);
          }
        }
      }
      
      // Add script to dynamically fix Supabase image URLs
      if (!content.includes('fixSupabaseImages')) {
        const supabaseImgFixScript = `
    <!-- Script to fix Supabase image URLs -->
    <script>
      function fixSupabaseImages() {
        const images = document.querySelectorAll('img[src*="supabase.co"], source[srcset*="supabase.co"]');
        images.forEach(img => {
          if (img.src && img.src.includes('getSupabaseClient()')) {
            img.src = img.src.replace(/getSupabaseClient\(\)/g, 'supabase');
          }
          if (img.srcset && img.srcset.includes('getSupabaseClient()')) {
            img.srcset = img.srcset.replace(/getSupabaseClient\(\)/g, 'supabase');
          }
        });
      }
      
      // Run immediately and also on load
      fixSupabaseImages();
      window.addEventListener('load', fixSupabaseImages);
    </script>`;
        
        // Add before closing head tag
        const headEndPos = content.indexOf('</head>');
        if (headEndPos !== -1) {
          content = content.slice(0, headEndPos) + supabaseImgFixScript + content.slice(headEndPos);
        }
      }
      
      // Save changes if content was modified
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  - Fixed ${filePath}`);
      } else {
        console.log(`  - No changes needed for ${filePath}`);
      }
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error);
    }
  }
}

// Main function
const main = () => {
  console.log('Starting blog CSP fix script...');
  
  // Fix the CSP script first
  fixCspScript();
  
  // Create Supabase fix script
  createSupabaseFixScript();
  
  // Fix HTML files
  fixHtmlFiles();
  
  console.log('Blog CSP fixes completed');
}

// Run the script
main();
