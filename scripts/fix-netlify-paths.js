/**
 * This script fixes paths in the built HTML files to ensure JavaScript works on Netlify
 * It converts absolute paths to relative paths and ensures the script tag is present
 */

const fs = require('fs');
const path = require('path');

// Recursive function to process all HTML files in the dist directory
function processHtmlFiles(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recursively process subdirectories
      processHtmlFiles(filePath);
    } else if (file.endsWith('.html')) {
      // Process HTML files
      console.log(`Processing ${filePath}`);
      
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Fix paths to be relative instead of absolute
      content = content
        .replace(/src="\/assets\//g, 'src="../assets/')
        .replace(/href="\/assets\//g, 'href="../assets/')
        .replace(/src="\/src\//g, 'src="../src/');
      
      // Ensure script tag exists for JavaScript
      if (!content.includes('src="../assets/main.js"')) {
        content = content.replace('</body>', '  <script type="module" src="../assets/main.js"></script>\n  </body>');
      }
      
      // Fix path depths for nested directories
      // Count directory depth
      const relativePath = path.relative(path.resolve('dist'), directory);
      const depth = relativePath.split(path.sep).filter(Boolean).length;
      
      // Root directory needs different handling
      if (depth === 0) {
        // For root (dist/index.html), use ./assets instead of ../assets
        content = content
          .replace(/src="\.\.\/assets\//g, 'src="./assets/')
          .replace(/href="\.\.\/assets\//g, 'href="./assets/');
      } else if (depth > 1) {
        // For deeper nested directories, add more ../ as needed
        let prefix = '../';
        for (let i = 1; i < depth; i++) {
          prefix += '../';
        }
        
        content = content
          .replace(/src="\.\.\/assets\//g, `src="${prefix}assets/`)
          .replace(/href="\.\.\/assets\//g, `href="${prefix}assets/`);
      }
      
      fs.writeFileSync(filePath, content);
    }
  });
}

// Start processing from the dist directory
console.log('Fixing paths for Netlify compatibility...');
processHtmlFiles(path.resolve('dist'));
console.log('Path fixing complete!');
