-- Fix Schema Permissions for Authentication
-- This script focuses on fixing the "Database error querying schema" issue

-- Grant permissions on all necessary schemas
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT USAGE ON SCHEMA storage TO postgres, anon, authenticated, service_role;
GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;

-- Grant permissions on all tables in each schema
GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA storage TO postgres, service_role;

-- Grant read permission on auth tables to anon and authenticated roles
GRANT SELECT ON auth.users TO anon, authenticated;
GRANT SELECT ON auth.schema_migrations TO anon, authenticated;
GRANT SELECT ON auth.refresh_tokens TO anon, authenticated;
GRANT SELECT ON auth.instances TO anon, authenticated;
GRANT SELECT ON auth.sessions TO anon, authenticated;

-- Grant specific permissions to auth needed for login
GRANT EXECUTE ON FUNCTION auth.uid() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION auth.role() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION auth.email() TO anon, authenticated;

-- Set proper search path
ALTER DATABASE postgres SET search_path TO "$user", public, extensions;

-- Ensure all schemas and tables have proper owners
ALTER SCHEMA auth OWNER TO supabase_auth_admin;
ALTER SCHEMA storage OWNER TO supabase_storage_admin;

-- Ensure necessary extension schemas are available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Try resetting auth-related tables and functions
DO $$
DECLARE
  schema_setting text;
BEGIN
  -- Check schema accessibility
  SELECT current_setting('search_path') INTO schema_setting;
  RAISE NOTICE 'Current search_path: %', schema_setting;
  
  -- Ensure auth functions can access the right schemas
  PERFORM set_config('search_path', 'auth, public, extensions', false);
END $$;
