import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const srcDir = path.join(rootDir, 'src');

// Function to update Supabase client usage in a file
const updateSupabaseUsage = async (filePath) => {
  const content = await fs.promises.readFile(filePath, 'utf-8');
  
  // Update import statement
  const updatedContent = content
    .replace(/import getSupabaseClient from ['"]@supabase['"]/g, "import { supabase } from '@supabase'")
    // Update function calls
    .replace(/getSupabaseClient\(\)/g, "supabase");

  if (content !== updatedContent) {
    await fs.promises.writeFile(filePath, updatedContent, 'utf-8');
    console.log(`Updated Supabase usage in: ${path.relative(rootDir, filePath)}`);
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
      await updateSupabaseUsage(filePath);
    }
  }
};

// Start processing from src directory
(async () => {
  console.log('Starting to update Supabase usage...');
  await processDirectory(srcDir);
  console.log('Supabase usage updates completed!');
})();
