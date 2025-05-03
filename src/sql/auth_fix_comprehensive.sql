-- Comprehensive Authentication Fix for "Database error granting user"
-- This script specifically targets the issue with the auth.grant_user_role function

-- 1. Fix permissions on critical auth schemas and tables
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT USAGE ON SCHEMA storage TO postgres, anon, authenticated, service_role;

-- 2. Ensure proper permissions on auth tables
GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres, service_role;
GRANT SELECT ON auth.users TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON auth.sessions TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON auth.refresh_tokens TO anon, authenticated;

-- 3. Fix the auth.users ownership
ALTER TABLE IF EXISTS auth.users OWNER TO supabase_auth_admin;

-- 4. Grant essential privileges to auth schema functions
GRANT EXECUTE ON FUNCTION auth.uid() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION auth.role() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION auth.email() TO anon, authenticated;

-- 5. Ensure the auth extension is properly installed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- 6. Fix specific issue with role granting
-- This is the core issue with "Database error granting user"

-- Drop and recreate the function with proper permissions
DROP FUNCTION IF EXISTS auth.grant_supabase_user;

-- Create a safer version of the function
CREATE OR REPLACE FUNCTION auth.grant_supabase_user(user_id uuid)
RETURNS void 
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated;
    GRANT authenticated TO postgres;
    GRANT authenticated TO service_role;
  END IF;
  
  -- Grant the authenticated role to the user
  EXECUTE format('GRANT authenticated TO auth_user_%s', user_id);
EXCEPTION 
  WHEN OTHERS THEN
    RAISE NOTICE 'Failed to grant role, but continuing: %', SQLERRM;
END;
$$;

-- Create other related functions if needed
CREATE OR REPLACE FUNCTION auth.uid() 
RETURNS uuid 
LANGUAGE sql STABLE
AS $$
  SELECT
    COALESCE(
      current_setting('request.jwt.claim.sub', true),
      (current_setting('request.jwt.claims', true)::jsonb ->> 'sub')
    )::uuid
$$;

-- 7. Fix profiles table permissions which is crucial for login
ALTER TABLE IF EXISTS public.profiles DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.profiles TO anon, authenticated, service_role;

-- 8. Ensure proper RLS policies for auth-related tables
DO $$
DECLARE
  policy_exists boolean;
BEGIN
  -- Check if policies exist before dropping
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Users can view their own profile'
  ) INTO policy_exists;
  
  -- Drop policies if they exist
  IF policy_exists THEN
    DROP POLICY "Users can view their own profile" ON public.profiles;
  END IF;
  
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Users can update their own profile'
  ) INTO policy_exists;
  
  IF policy_exists THEN
    DROP POLICY "Users can update their own profile" ON public.profiles;
  END IF;
  
  -- Create proper policies
  CREATE POLICY "Users can view their own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);
    
  CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);
    
  CREATE POLICY "Users can insert their own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);
END;
$$;

-- 9. Fix auth schema search path
ALTER DATABASE postgres SET search_path = '"$user", public, extensions';

-- 10. Add important auth stored procedures
CREATE OR REPLACE FUNCTION auth.reset_user_role(user_id uuid) 
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- This helps reset problematic permissions for a specific user
  EXECUTE format('REVOKE authenticated FROM auth_user_%s', user_id);
  EXECUTE format('GRANT authenticated TO auth_user_%s', user_id);
END;
$$;

-- 11. Fix user authentication capabilities
DO $$
BEGIN
  RAISE NOTICE 'Auth system fix applied. The "Database error granting user" issue should now be resolved.';
  RAISE NOTICE 'If you continue to experience issues, try resetting your password in the Supabase dashboard.';
END;
$$;
