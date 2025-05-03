-- Simple Auth Fix for the login issue
-- This script focuses on just what's needed to fix user authentication

-- 1. Reset the user's metadata
UPDATE auth.users 
SET
  raw_app_meta_data = '{"provider": "email", "providers": ["email"]}'::jsonb,
  is_sso_user = FALSE,
  updated_at = NOW(),
  email_confirmed_at = NOW()
WHERE email = 'patrick@meowrescue.org';

-- 2. Clear any login failures
DELETE FROM auth.audit_log_entries
WHERE actor_id = (SELECT id FROM auth.users WHERE email = 'patrick@meowrescue.org')
AND activity = 'login';

-- 3. Update the user's password reset token
UPDATE auth.users
SET
  recovery_token = md5(random()::text || clock_timestamp()::text),
  recovery_sent_at = NOW()
WHERE email = 'patrick@meowrescue.org'
RETURNING recovery_token as reset_token;

-- 4. Make sure profile exists
INSERT INTO public.profiles (id, email, created_at, updated_at)
SELECT id, email, NOW(), NOW() FROM auth.users WHERE email = 'patrick@meowrescue.org'
ON CONFLICT (id) DO NOTHING;

-- 5. Run this first and if it works, you don't need to reset password
SELECT auth.uid(), auth.role(), auth.email();
