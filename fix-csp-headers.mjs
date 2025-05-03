// This script fixes Content Security Policy headers in HTML files
// where 'supabase' was incorrectly replaced with 'getSupabaseClient()'

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Fix CSP headers in a file
function fixCspInFile(filePath) {
  console.log(`Checking: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Fix CSP headers with incorrect getSupabaseClient() references
  if (content.includes('getSupabaseClient()')) {
    console.log(`  - Found issues in: ${filePath}`);
    
    // Replace in meta tags
    content = content.replace(
      /https:\/\/sfrlnidbiviniuqhryyc\.getSupabaseClient\(\)\.co/g, 
      'https://sfrlnidbiviniuqhryyc.supabase.co'
    );
    
    content = content.replace(
      /wss:\/\/sfrlnidbiviniuqhryyc\.getSupabaseClient\(\)\.co/g, 
      'wss://sfrlnidbiviniuqhryyc.supabase.co'
    );
    
    content = content.replace(
      /wss:\/\/\*\.getSupabaseClient\(\)\.co/g, 
      'wss://*.supabase.co'
    );
    
    // Write the fixed content back to the file if changes were made
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  - Fixed CSP in: ${filePath}`);
      return true;
    }
  }
  
  return false;
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
  
  console.log(`\nFixed CSP headers in ${fixedCount} files.`);
}

// Run the script
main();
