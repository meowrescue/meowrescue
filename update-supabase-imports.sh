
#!/bin/bash

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
    sed 's/import { supabase } from "@\/integrations\/supabase\/client";/import getSupabaseClient from "@\/integrations\/supabase\/client";/g' "$file" > "$temp_file"
    
    # Replace import statements with other items
    sed -i 's/import { supabase, \(.*\) } from "@\/integrations\/supabase\/client";/import getSupabaseClient, { \1 } from "@\/integrations\/supabase\/client";/g' "$temp_file"
    
    # Replace direct usage of supabase
    sed -i 's/\([^a-zA-Z0-9_]\)supabase\([^a-zA-Z0-9_]\)/\1getSupabaseClient()\2/g' "$temp_file"
    sed -i 's/\([^a-zA-Z0-9_]\)supabase$/\1getSupabaseClient()/g' "$temp_file"
    sed -i 's/^supabase\./getSupabaseClient()./g' "$temp_file"
    
    # Overwrite the original file
    mv "$temp_file" "$file"
  fi
}

# Process files
echo "Updating all TypeScript and JavaScript files in src/"

# Find all TypeScript and JavaScript files
find src -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | while read file
do
  update_file "$file"
done

echo "Supabase imports update complete!"
