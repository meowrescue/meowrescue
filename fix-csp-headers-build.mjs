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
    
    // Fix img-src CSP directive
    content = content.replace(
      /img-src\s+'self'\s+data:[^;]*(getSupabaseClient\(\)\.co)[^;]*/g,
      `img-src 'self' data: blob: https://meowrescue.windsurf.build https://${supabaseDomain} https://images.unsplash.com`
    );
    
    // Fix connect-src CSP directive
    content = content.replace(
      /connect-src\s+'self'[^;]*(getSupabaseClient\(\)\.co)[^;]*/g,
      `connect-src 'self' https://${supabaseDomain} wss://${supabaseDomain} https:`
    );
    
    // Fix script-src CSP directive to remove GPT Engineer reference
    content = content.replace(
      /script-src\s+'self'\s+'unsafe-inline'\s+'unsafe-eval'[^;]*/g,
      `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://${supabaseDomain}`
    );
    
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
