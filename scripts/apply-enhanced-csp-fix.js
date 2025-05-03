import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const distDir = join(__dirname, '..', 'dist');
const scriptToAdd = '<script src="/enhanced-csp-fix.js"></script>';
const insertBefore = '<script src="/csp-fix.js"></script>';

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

// Update HTML files to add the script
function updateHtmlFile(filePath) {
  try {
    console.log(`Processing ${filePath}...`);
    let content = readFileSync(filePath, 'utf8');
    
    // Check if our script is already in the file
    if (content.includes(scriptToAdd)) {
      console.log(`  Script already present in ${filePath}`);
      return;
    }
    
    // Check if the target insertion point exists
    if (!content.includes(insertBefore)) {
      console.log(`  Warning: Could not find insertion point in ${filePath}`);
      return;
    }
    
    // Add our enhanced script before the original csp-fix.js script
    content = content.replace(
      insertBefore,
      `${scriptToAdd}\n    ${insertBefore}`
    );
    
    // Write the updated content back to the file
    writeFileSync(filePath, content, 'utf8');
    console.log(`  Updated ${filePath}`);
  } catch (error) {
    console.error(`  Error updating ${filePath}:`, error);
  }
}

// Main function
function main() {
  console.log('Starting Enhanced CSP fix application to all HTML files...');
  
  // Ensure the fix script exists
  const fixScriptPath = join(distDir, 'enhanced-csp-fix.js');
  if (!existsSync(fixScriptPath)) {
    console.error('Error: enhanced-csp-fix.js does not exist in the dist directory');
    return;
  }
  
  // Find all HTML files
  const htmlFiles = findHtmlFiles(distDir);
  console.log(`Found ${htmlFiles.length} HTML files to process`);
  
  // Update each HTML file
  for (const htmlFile of htmlFiles) {
    updateHtmlFile(htmlFile);
  }
  
  console.log('Complete! Applied Enhanced CSP fixes to all HTML files.');
}

// Run the script
main();
