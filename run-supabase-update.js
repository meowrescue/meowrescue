
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Starting Supabase imports update...');

// Make script executable
try {
  fs.chmodSync('./update-supabase-imports.sh', '755');
  console.log('Made update-supabase-imports.sh executable');
} catch (error) {
  console.error('Error making script executable:', error);
  
  // Try to create the script if it doesn't exist
  try {
    const scriptContent = `#!/bin/bash

echo "Starting Supabase imports update script..."

# Make the script fail on any error
set -e

# Function to replace supabase with getSupabaseClient() in a file
update_file() {
  local file=$1
  
  # Check if file exists and is a regular file
  if [ -f "$file" ]; then
    echo "Processing $file"
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Replace import statements
    sed 's/import { supabase } from "@\\/integrations\\/supabase\\/client";/import getSupabaseClient from "@\\/integrations\\/supabase\\/client";/g' "$file" > "$temp_file"
    
    # Replace import statements with other items
    sed -i 's/import { supabase, \\(.*\\) } from "@\\/integrations\\/supabase\\/client";/import getSupabaseClient, { \\1 } from "@\\/integrations\\/supabase\\/client";/g' "$temp_file"
    
    # Replace direct usage of supabase
    sed -i 's/\\([^a-zA-Z0-9_]\\)supabase\\./\\1getSupabaseClient()\\./g' "$temp_file"
    sed -i 's/^supabase\\./getSupabaseClient()./g' "$temp_file"
    
    # Replace supabase variable when it's used by itself (like in conditions or assignments)
    sed -i 's/\\([^a-zA-Z0-9_]\\)supabase\\([^a-zA-Z0-9_\\.]\\)/\\1getSupabaseClient()\\2/g' "$temp_file"
    sed -i 's/\\([^a-zA-Z0-9_]\\)supabase$/\\1getSupabaseClient()/g' "$temp_file"
    sed -i 's/^supabase$/getSupabaseClient()/g' "$temp_file"
    
    # Overwrite the original file
    mv "$temp_file" "$file"
  fi
}

# Process files
echo "Updating all TypeScript and JavaScript files in src/"

# Find all TypeScript and JavaScript files
find src -type f \\( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \\) | while read file
do
  update_file "$file"
done

echo "Supabase imports update complete!"
`;
    fs.writeFileSync('./update-supabase-imports.sh', scriptContent);
    fs.chmodSync('./update-supabase-imports.sh', '755');
    console.log('Created and made executable update-supabase-imports.sh');
  } catch (createError) {
    console.error('Error creating script:', createError);
  }
}

// Execute the script directly with Node.js
console.log('Running JavaScript update script first...');

// Define the update function
const updateFiles = () => {
  // Regular expressions for matching
  const importRegex = /import\s+{\s*supabase\s*}\s+from\s+['"]@\/integrations\/supabase\/client['"];?/g;
  const importWithOthersRegex = /import\s+{\s*supabase,\s*(.+?)\s*}\s+from\s+['"]@\/integrations\/supabase\/client['"];?/g;
  const usageRegex = /(?<![a-zA-Z0-9_])supabase\./g;
  const standaloneRegex = /(?<![a-zA-Z0-9_])supabase(?![a-zA-Z0-9_\.])/g;
  
  // Find all .ts, .tsx, .js, .jsx files in src
  const findFiles = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    
    list.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        results = results.concat(findFiles(filePath));
      } else if (/\.(tsx?|jsx?)$/.test(file)) {
        results.push(filePath);
      }
    });
    
    return results;
  };
  
  try {
    const files = findFiles('src');
    console.log(`Found ${files.length} files to process`);
    
    // Process each file
    files.forEach(filePath => {
      try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // Replace direct imports
        if (importRegex.test(content)) {
          content = content.replace(importRegex, `import getSupabaseClient from '@/integrations/supabase/client';`);
          modified = true;
          // Reset regex lastIndex
          importRegex.lastIndex = 0;
        }
        
        // Replace imports with other items
        if (importWithOthersRegex.test(content)) {
          content = content.replace(
            importWithOthersRegex, 
            `import getSupabaseClient, { $1 } from '@/integrations/supabase/client';`
          );
          modified = true;
          // Reset regex lastIndex
          importWithOthersRegex.lastIndex = 0;
        }
        
        // Replace direct usage of supabase with getSupabaseClient()
        if (usageRegex.test(content)) {
          content = content.replace(usageRegex, `getSupabaseClient().`);
          modified = true;
        }
        
        // Replace supabase when used alone (like in conditionals or assignments)
        if (standaloneRegex.test(content)) {
          content = content.replace(standaloneRegex, `getSupabaseClient()`);
          modified = true;
        }
        
        // Write updated content back if changed
        if (modified) {
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`Updated: ${filePath}`);
        }
      } catch (fileError) {
        console.error(`Error processing file ${filePath}:`, fileError);
      }
    });
  } catch (error) {
    console.error('Error finding or processing files:', error);
  }
};

// Run the JavaScript update
updateFiles();

// Now execute the bash script as backup
exec('./update-supabase-imports.sh', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing bash script: ${error.message}`);
  }
  if (stderr) {
    console.error(`Bash script stderr: ${stderr}`);
  }
  console.log(`Bash script output: ${stdout}`);
  console.log('Supabase update completed! Double-check your code for any remaining issues.');
});
