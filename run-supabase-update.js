
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Starting Supabase imports update...');

// Make script executable
try {
  fs.chmodSync('./update-supabase-imports.sh', '755');
} catch (error) {
  console.error('Error making script executable:', error);
}

// Execute the script
exec('./update-supabase-imports.sh', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing script: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Script stderr: ${stderr}`);
  }
  console.log(`Script output: ${stdout}`);
  console.log('Supabase update completed successfully!');
});
