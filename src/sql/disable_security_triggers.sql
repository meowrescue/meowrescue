-- Disable Security Triggers Temporarily
-- This script will disable the security triggers to help diagnose login issues

-- First, drop the triggers if they exist
DO $$
DECLARE
  sensitive_table TEXT;
  sensitive_tables TEXT[] := ARRAY['profiles', 'cats', 'applications', 'donations', 'expenses'];
BEGIN
  FOREACH sensitive_table IN ARRAY sensitive_tables LOOP
    -- Check if table exists
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = sensitive_table) THEN
      -- Drop trigger if it exists
      EXECUTE format('DROP TRIGGER IF EXISTS security_monitor ON public.%I', sensitive_table);
      RAISE NOTICE 'Dropped security trigger for table: %', sensitive_table;
    ELSE
      RAISE NOTICE 'Table % does not exist, skipping security trigger removal', sensitive_table;
    END IF;
  END LOOP;
END;
$$;

-- Drop the suspicious activity logging function
DROP FUNCTION IF EXISTS public.log_suspicious_activity();

-- Disable RLS on the audit_logs table temporarily to ensure it's not causing issues
ALTER TABLE IF EXISTS public.audit_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.activity_logs DISABLE ROW LEVEL SECURITY;

-- Check if there are any issues with the auth schema
DO $$
BEGIN
  -- Verify the auth.users table is accessible
  EXECUTE 'SELECT COUNT(*) FROM auth.users';
  RAISE NOTICE 'Successfully verified access to auth.users table';
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error accessing auth.users table: %', SQLERRM;
END;
$$;
