
import { createClient } from '@supabase/supabase-js';

// Use the actual values directly instead of environment variables
const supabaseUrl = 'https://sfrlnidbiviniuqhryyc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmcmxuaWRiaXZpbml1cWhyeXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MDMxNTEsImV4cCI6MjA2MDA3OTE1MX0.vHK31AKqwD0a6GKGUQWMEFWo3zOb37LAEMXAmOATawI';

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);
