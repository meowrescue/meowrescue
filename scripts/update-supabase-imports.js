
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to walk through directory recursively
const walkDir = (dir, callback) => {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : 
      callback(path.join(dir, f));
  });
};

// Function to update imports in a file
const updateFile = async (filePath) => {
  // Only process TypeScript and JavaScript files
  if (!filePath.match(/\.(ts|tsx|js|jsx)$/)) return;
  
  try {
    // Read file content
    const content = await fs.promises.readFile(filePath, 'utf8');
    
    // Replace import statements
    let newContent = content;
    
    // Replace imports from '@supabase' with '@/integrations/supabase'
    newContent = newContent.replace(
      /import\s+{\s*(.+?)\s*}\s+from\s+['"]@supabase['"];?/g,
      `import { $1 } from '@/integrations/supabase';`
    );
    
    // Replace any remaining direct supabase references
    newContent = newContent.replace(
      /getSupabaseClient\(\)/g,
      'supabase'
    );
    newContent = newContent.replace(
      /(?<![a-zA-Z0-9_])supabase(?![a-zA-Z0-9_\.])/g,
      `getSupabaseClient()`
    );
    
    // Write updated content back to file if changes were made
    if (newContent !== content) {
      await fs.promises.writeFile(filePath, newContent, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
};

// Main execution
const main = async () => {
  const srcDir = path.join(__dirname, '..', 'src');
  
  console.log(`Searching for files in: ${srcDir}`);
  
  // Process all files in src directory
  const promises = [];
  walkDir(srcDir, (filePath) => {
    promises.push(updateFile(filePath));
  });
  
  await Promise.all(promises);
  console.log('Update complete!');
};

main().catch(console.error);
