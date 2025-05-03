-- Enhanced Emergency Authentication Fix
-- This script specifically targets the "Database error querying schema" issue
-- Run this in the Supabase SQL Editor

-- 1. Fix schema permissions - critical for auth queries
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT USAGE ON SCHEMA storage TO postgres, anon, authenticated, service_role;

-- 2. Reset search_path to include auth schema
ALTER ROLE authenticated SET search_path TO public, auth, extensions;
ALTER ROLE anon SET search_path TO public, auth, extensions;

-- 3. Ensure auth tables have correct permissions
GRANT SELECT ON ALL TABLES IN SCHEMA auth TO authenticated, anon, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA auth TO authenticated, anon, service_role;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA auth TO authenticated, anon, service_role;

-- 4. Disable RLS on critical auth tables (only if you have permission)
DO $$
BEGIN
  BEGIN
    ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'Successfully disabled RLS on auth.users';
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'Could not disable RLS on auth.users: %', SQLERRM;
  END;
END;
$$;

-- 5. Fix permissions on public schema tables that might affect auth
ALTER TABLE IF EXISTS public.profiles DISABLE ROW LEVEL SECURITY;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- 6. Ensure specific auth functions have correct permissions
DO $$
BEGIN
  -- Try to grant execute on critical auth functions
  BEGIN
    EXECUTE 'GRANT EXECUTE ON FUNCTION auth.uid() TO authenticated, anon, service_role';
    RAISE NOTICE 'Successfully granted execute on auth.uid()';
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'Could not grant execute on auth.uid(): %', SQLERRM;
  END;
  
  BEGIN
    EXECUTE 'GRANT EXECUTE ON FUNCTION auth.role() TO authenticated, anon, service_role';
    RAISE NOTICE 'Successfully granted execute on auth.role()';
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'Could not grant execute on auth.role(): %', SQLERRM;
  END;
END;
$$;

-- 7. Diagnostic check
DO $$
BEGIN
  RAISE NOTICE 'Auth schema fix script completed';
  RAISE NOTICE 'If you still encounter issues, please submit a support ticket to Supabase';
  RAISE NOTICE 'Include the error message "Database error querying schema" in your ticket';
END;
$$;
