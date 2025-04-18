
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  // Read the package.json file
  const packageJsonPath = path.join(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Add "type": "module" if it doesn't exist
  if (!packageJson.type) {
    packageJson.type = "module";
    
    // Write the updated package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('Updated package.json to include "type": "module"');
  } else {
    console.log('Package.json already has a "type" field:', packageJson.type);
  }
} catch (error) {
  console.error('Error updating package.json:', error);
}
