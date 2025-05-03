import fs from 'fs';
import path from 'path';

// Get the Supabase URL from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://sfrlnidbiviniuqhryyc.supabase.co';
const supabaseDomain = new URL(supabaseUrl).hostname;

// Function to recursively find all HTML files in a directory
async function findHtmlFiles(directory) {
  const files = [];
  
  // Read all files in the directory
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    
    if (entry.isDirectory()) {
      // Recursively search subdirectories
      const subDirFiles = await findHtmlFiles(fullPath);
      files.push(...subDirFiles);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      // Add HTML files to the result
      files.push(fullPath);
    }
  }
  
  return files;
}

// Function to fix CSP headers in an HTML file
async function fixCspHeaders(filePath) {
  try {
    console.log(`Processing ${filePath}...`);
    
    // Read the file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Define the correct CSP directives
    const correctImgSrc = `img-src 'self' data: blob: https://meowrescue.windsurf.build https://${supabaseDomain} https://images.unsplash.com`;
    const correctConnectSrc = `connect-src 'self' https://${supabaseDomain} wss://${supabaseDomain} https:`;
    const correctScriptSrc = `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://${supabaseDomain}`;
    
    // Find and replace all CSP directives in the content
    // First, try to find the entire CSP header
    const cspHeaderRegex = /Content-Security-Policy[^;]*;/g;
    if (cspHeaderRegex.test(content)) {
      // Extract the CSP header
      content = content.replace(cspHeaderRegex, (match) => {
        // Replace img-src directive
        let newMatch = match.replace(/img-src[^;]*;/g, `${correctImgSrc};`);
        // Replace connect-src directive
        newMatch = newMatch.replace(/connect-src[^;]*;/g, `${correctConnectSrc};`);
        // Replace script-src directive
        newMatch = newMatch.replace(/script-src[^;]*;/g, `${correctScriptSrc};`);
        return newMatch;
      });
    }
    
    // Fix individual CSP directives
    // Fix img-src CSP directive - handle all variations
    content = content.replace(/img-src[^;]*;/g, `${correctImgSrc};`);
    
    // Fix connect-src CSP directive - handle all variations
    content = content.replace(/connect-src[^;]*;/g, `${correctConnectSrc};`);
    
    // Fix script-src CSP directive - handle all variations
    content = content.replace(/script-src[^;]*;/g, `${correctScriptSrc};`);
    
    // Fix any meta tags with CSP
    const metaTagRegex = /<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]+)"/g;
    content = content.replace(metaTagRegex, (match, cspContent) => {
      // Replace img-src directive in meta tag
      let newCspContent = cspContent.replace(/img-src[^;]*;/g, `${correctImgSrc};`);
      // Replace connect-src directive in meta tag
      newCspContent = newCspContent.replace(/connect-src[^;]*;/g, `${correctConnectSrc};`);
      // Replace script-src directive in meta tag
      newCspContent = newCspContent.replace(/script-src[^;]*;/g, `${correctScriptSrc};`);
      
      return `<meta http-equiv="Content-Security-Policy" content="${newCspContent}"`;
    });
    
    // Fix inline style CSP directives
    const styleTagRegex = /<style[^>]*>([^<]+)<\/style>/g;
    content = content.replace(styleTagRegex, (match, styleContent) => {
      // Check if the style contains CSP directives
      if (styleContent.includes('Content-Security-Policy')) {
        // Replace img-src directive in style
        let newStyleContent = styleContent.replace(/img-src[^;]*;/g, `${correctImgSrc};`);
        // Replace connect-src directive in style
        newStyleContent = newStyleContent.replace(/connect-src[^;]*;/g, `${correctConnectSrc};`);
        // Replace script-src directive in style
        newStyleContent = newStyleContent.replace(/script-src[^;]*;/g, `${correctScriptSrc};`);
        
        return `<style>${newStyleContent}</style>`;
      }
      return match;
    });
    
    // Fix any remaining instances of getSupabaseClient().co
    content = content.replace(/https:\/\/[^\/]*getSupabaseClient\(\)\.co/g, `https://${supabaseDomain}`);
    content = content.replace(/wss:\/\/[^\/]*getSupabaseClient\(\)\.co/g, `wss://${supabaseDomain}`);
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    
    console.log(`Fixed CSP headers in ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Main function
async function main() {
  try {
    console.log('Starting CSP header fix script...');
    
    // Path to the dist directory
    const distDir = path.resolve(process.cwd(), 'dist');
    
    // Find all HTML files
    const htmlFiles = await findHtmlFiles(distDir);
    console.log(`Found ${htmlFiles.length} HTML files to process`);
    
    // Process each HTML file
    for (const file of htmlFiles) {
      await fixCspHeaders(file);
    }
    
    console.log('CSP header fix completed successfully');
  } catch (error) {
    console.error('Error in CSP header fix script:', error);
    process.exit(1);
  }
}

// Run the script
main();
