import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to recursively get all files in a directory
function getFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      files.push(...getFiles(fullPath));
    } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  return files;
}

// Function to update a single file
function updateFile(filePath) {
  try {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Update imports
      let newContent = content;
      newContent = newContent.replace(/import\s*{\s*getSupabaseClient\(\)\s*}\s*from\s*['"]@\/integrations\/getSupabaseClient\(\)['"];?/g, 
        'import { supabase } from \'@integrations/supabase\';');
      
      // Update function calls
      newContent = newContent.replace(/getSupabaseClient\(\)/g, 'supabase');
      
      if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated: ${filePath}`);
      }
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Main execution
const main = () => {
  const srcDir = path.join(__dirname, '..', 'src');
  
  console.log(`Searching for files in: ${srcDir}`);
  
  const files = getFiles(srcDir);
  
  for (const file of files) {
    updateFile(file);
  }
  
  console.log('Update complete!');
};

main();
