import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const srcDir = path.join(rootDir, 'src');

// Function to update imports in a file
const updateImports = async (filePath) => {
  const content = await fs.promises.readFile(filePath, 'utf-8');
  
  // Update Supabase client import
  const updatedContent = content
    .replace(/from ['"]@\/integrations\/getSupabaseClient\(\)\/client['"]/g, "from '@supabase'")
    .replace(/from ['"]@\/types\/getSupabaseClient\(\)['"]/g, "from '@supabase/types'")
    .replace(/from ['"]@\/types\/getSupabaseClient\(\)\/client['"]/g, "from '@supabase/types'");

  if (content !== updatedContent) {
    await fs.promises.writeFile(filePath, updatedContent, 'utf-8');
    console.log(`Updated imports in: ${path.relative(rootDir, filePath)}`);
  }
};

// Function to process all files in a directory
const processDirectory = async (dir) => {
  const files = await fs.promises.readdir(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.promises.stat(filePath);
    
    if (stat.isDirectory()) {
      await processDirectory(filePath);
    } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.tsx'))) {
      await updateImports(filePath);
    }
  }
};

// Start processing from src directory
(async () => {
  console.log('Starting to update imports...');
  await processDirectory(srcDir);
  console.log('Import updates completed!');
})();
