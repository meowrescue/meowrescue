/**
 * This script fixes syntax errors in the prerender.js file
 */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the prerender.js file
const prerenderPath = join(__dirname, 'prerender.js');
let content = readFileSync(prerenderPath, 'utf-8');

// Find the location of the generateStaticFiles function
const functionStart = content.indexOf('async function generateStaticFiles()');
if (functionStart === -1) {
  console.error('Could not find the generateStaticFiles function');
  process.exit(1);
}

// Find the try statement within the function
const tryStart = content.indexOf('try {', functionStart);
if (tryStart === -1) {
  console.error('Could not find the try block in generateStaticFiles');
  process.exit(1);
}

// Find unmatched catch statement
const unmatchedCatch = content.indexOf('} catch (err) {', tryStart + 10);
if (unmatchedCatch === -1) {
  console.error('Could not find the unmatched catch block');
  process.exit(1);
}

// Fix the unmatched catch block
const fixedContent = 
  content.substring(0, unmatchedCatch) + 
  // Replace unmatched catch with just a closing brace for the function
  '  }\n}\n\n// Run the function\ntry {\n  generateStaticFiles();\n} catch (error) {\n  console.error(\'Fatal error during prerendering:\', error);\n  process.exit(1);\n}';

// Write the fixed content
writeFileSync(prerenderPath, fixedContent);
console.log('Fixed syntax errors in prerender.js');
