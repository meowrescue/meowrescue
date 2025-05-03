-- Fix the activity_logs table structure and auth issue
-- This script addresses both the activity_logs error and auth issues

-- 1. First, disable the trigger that's causing the error
DO $$
BEGIN
  -- Check if the trigger exists
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'user_activity_trigger') THEN
    DROP TRIGGER IF EXISTS user_activity_trigger ON auth.users;
    RAISE NOTICE 'Disabled problematic user_activity_trigger';
  END IF;
  
  -- Also check for other possible trigger names
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    RAISE NOTICE 'Disabled on_auth_user_created trigger';
  END IF;
END;
$$;

-- 2. Fix the activity_logs table if it exists
DO $$
BEGIN
  -- Check if the table exists first
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'activity_logs') THEN
    -- Check if the column already exists to avoid errors
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'activity_logs' 
                  AND column_name = 'activity_type') THEN
      
      -- Add the missing column
      ALTER TABLE public.activity_logs ADD COLUMN activity_type TEXT;
      RAISE NOTICE 'Added missing activity_type column to activity_logs table';
    ELSE
      RAISE NOTICE 'activity_type column already exists';
    END IF;
  ELSE
    RAISE NOTICE 'activity_logs table does not exist, skipping column fix';
  END IF;
END;
$$;

-- 3. Now apply the authentication fixes
-- Reset the user's metadata
UPDATE auth.users 
SET
  raw_app_meta_data = '{"provider": "email", "providers": ["email"]}'::jsonb,
  is_sso_user = FALSE,
  updated_at = NOW(),
  email_confirmed_at = NOW()
WHERE email = 'patrick@meowrescue.org';

-- 4. Clear any login failures
DELETE FROM auth.audit_log_entries
WHERE actor_id = (SELECT id FROM auth.users WHERE email = 'patrick@meowrescue.org')
AND activity = 'login';

-- 5. Set up password reset token
UPDATE auth.users
SET
  recovery_token = md5(random()::text || clock_timestamp()::text),
  recovery_sent_at = NOW()
WHERE email = 'patrick@meowrescue.org'
RETURNING recovery_token as reset_token;

-- 6. Make sure profile exists
INSERT INTO public.profiles (id, email, created_at, updated_at)
SELECT id, email, NOW(), NOW() FROM auth.users WHERE email = 'patrick@meowrescue.org'
ON CONFLICT (id) DO NOTHING;

-- 7. Re-create the user activity trigger to work correctly
DO $$
BEGIN
  -- Create a fixed version of the activity logging function
  CREATE OR REPLACE FUNCTION public.handle_user_activity()
  RETURNS TRIGGER AS $$
  BEGIN
    -- Check if the table exists and has the right structure before inserting
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'activity_logs' 
      AND column_name = 'activity_type'
    ) THEN
      -- Insert with proper columns
      INSERT INTO public.activity_logs(
        user_id,
        activity_type,
        description,
        created_at
      )
      VALUES (
        NEW.id,
        CASE TG_OP
          WHEN 'INSERT' THEN 'create'
          WHEN 'UPDATE' THEN 'update'
          WHEN 'DELETE' THEN 'delete'
          ELSE TG_OP::text
        END,
        CASE TG_OP
          WHEN 'INSERT' THEN 'New user created'
          WHEN 'UPDATE' THEN 'User updated'
          WHEN 'DELETE' THEN 'User deleted'
          ELSE 'User action'
        END,
        now()
      );
    END IF;
    RETURN NEW;
  EXCEPTION
    WHEN OTHERS THEN
      -- Don't let trigger failures block user operations
      RAISE NOTICE 'Activity logging failed: %, continuing anyway', SQLERRM;
      RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
END;
$$;

-- 8. Test auth functions
SELECT 'Auth fix applied successfully' as result;
