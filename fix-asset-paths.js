/**
 * This script fixes asset paths in all HTML files in the dist directory
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to recursively find all HTML files
function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to fix asset paths in an HTML file
function fixAssetPaths(filePath) {
  console.log(`Fixing asset paths in ${filePath}`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Get the relative path depth
    const distDir = path.join(__dirname, 'dist');
    const relativePath = path.relative(distDir, path.dirname(filePath));
    const depth = relativePath.split(path.sep).filter(Boolean).length;
    
    // Calculate the correct relative path prefix
    const assetsPrefix = depth === 0 ? './' : '../'.repeat(depth);
    
    // Fix asset paths based on directory depth
    let fixedContent = content;
    
    // Fix incorrect asset paths
    fixedContent = fixedContent
      .replace(/src="\.\/ssets\//g, `src="${assetsPrefix}assets/`)
      .replace(/href="\.\/ssets\//g, `href="${assetsPrefix}assets/`);
    
    // Fix correct but relative asset paths
    fixedContent = fixedContent
      .replace(/src="\.\/assets\//g, `src="${assetsPrefix}assets/`)
      .replace(/href="\.\/assets\//g, `href="${assetsPrefix}assets/`);
    
    // Fix duplicate script tags
    fixedContent = fixedContent.replace(/<script.*?><\/script><\/script>/g, '</script>');
    
    // Only write if changes were made
    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent);
      console.log(`  Fixed asset paths in ${filePath} (depth: ${depth}, prefix: ${assetsPrefix})`);
      return true;
    } else {
      console.log(`  No changes needed in ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`  Error fixing asset paths in ${filePath}:`, error);
    return false;
  }
}

// Main function
function main() {
  const distDir = path.join(__dirname, 'dist');
  
  if (!fs.existsSync(distDir)) {
    console.error(`Dist directory not found at ${distDir}`);
    process.exit(1);
  }
  
  console.log('Finding all HTML files in dist directory...');
  const htmlFiles = findHtmlFiles(distDir);
  console.log(`Found ${htmlFiles.length} HTML files`);
  
  let fixedCount = 0;
  
  htmlFiles.forEach(file => {
    if (fixAssetPaths(file)) {
      fixedCount++;
    }
  });
  
  console.log(`\nFixed asset paths in ${fixedCount} out of ${htmlFiles.length} HTML files`);
}

main();
