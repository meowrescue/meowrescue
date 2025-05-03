
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting JS-based Supabase imports update...');

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
    let modified = false;
    
    // Replace incorrect syntax with proper function calls
    const incorrectSyntaxPattern = /const\s+getSupabaseClient\(\)\s*=\s*getSupabaseClient\(\);/g;
    if (incorrectSyntaxPattern.test(newContent)) {
      newContent = newContent.replace(incorrectSyntaxPattern, '');
      modified = true;
      console.log(`Fixed incorrect function declaration in: ${filePath}`);
    }
    
    // Replace direct imports
    const importPattern = /import\s+{\s*supabase\s*}\s+from\s+['"]@\/integrations\/supabase\/client['"];?/g;
    if (importPattern.test(newContent)) {
      newContent = newContent.replace(
        importPattern,
        `import getSupabaseClient from '@/integrations/supabase/client';`
      );
      modified = true;
    }
    
    // Replace imports with other items
    const importWithOthersPattern = /import\s+{\s*supabase,\s*(.+?)\s*}\s+from\s+['"]@\/integrations\/supabase\/client['"];?/g;
    if (importWithOthersPattern.test(newContent)) {
      newContent = newContent.replace(
        importWithOthersPattern,
        `import getSupabaseClient, { $1 } from '@/integrations/supabase/client';`
      );
      modified = true;
    }
    
    // Replace direct usage of supabase with getSupabaseClient()
    const usagePattern = /(?<![a-zA-Z0-9_])supabase\./g;
    if (usagePattern.test(newContent)) {
      newContent = newContent.replace(
        usagePattern,
        `getSupabaseClient().`
      );
      modified = true;
    }
    
    // Replace supabase when used alone (like in conditionals or assignments)
    const standalonePattern = /(?<![a-zA-Z0-9_])supabase(?![a-zA-Z0-9_\.])/g;
    if (standalonePattern.test(newContent)) {
      newContent = newContent.replace(
        standalonePattern,
        `getSupabaseClient()`
      );
      modified = true;
    }
    
    // Write updated content back to file if changes were made
    if (modified) {
      await fs.promises.writeFile(filePath, newContent, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
};

// Main execution
const main = async () => {
  try {
    const srcDir = path.join(process.cwd(), 'src');
    
    console.log(`Searching for files in: ${srcDir}`);
    
    // Process all files in src directory
    const processedFiles = [];
    walkDir(srcDir, (filePath) => {
      processedFiles.push(updateFile(filePath));
    });
    
    await Promise.all(processedFiles);
    console.log('Update complete!');
  } catch (err) {
    console.error('Error during update process:', err);
  }
};

main().catch(console.error);
