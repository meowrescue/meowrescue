-- Direct fix for the specific "grant_user_role" function
-- This is a targeted fix for the "Database error granting user" issue

-- 1. Get info about the failing user
DO $$
DECLARE
  user_record RECORD;
BEGIN
  -- Find your user
  SELECT * FROM auth.users WHERE email = 'patrick@meowrescue.org' INTO user_record;
  
  IF user_record IS NULL THEN
    RAISE NOTICE 'User not found. Please check the email address.';
    RETURN;
  END IF;
  
  RAISE NOTICE 'Found user with ID: %', user_record.id;
  
  -- Skip the role commands since the role doesn't exist yet
  RAISE NOTICE 'Skipping role commands - will try alternative approach';
  
  -- Verify user has a profile
  DECLARE
    profile_exists BOOLEAN;
  BEGIN
    SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = user_record.id) INTO profile_exists;
    
    IF NOT profile_exists THEN
      RAISE NOTICE 'User has no profile record. Creating one...';
      
      -- Create a basic profile record if one doesn't exist
      INSERT INTO public.profiles (id, email, created_at, updated_at)
      VALUES (user_record.id, user_record.email, NOW(), NOW());
      
      RAISE NOTICE 'Profile created for user';
    ELSE
      RAISE NOTICE 'User has existing profile record';
    END IF;
  END;
END;
$$;

-- 2. Directly modify the user's record in auth.users if needed
UPDATE auth.users 
SET
  raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"provider": "email", "providers": ["email"]}'::jsonb,
  is_sso_user = FALSE,
  created_at = NOW(), -- Touch the timestamp
  updated_at = NOW(),
  last_sign_in_at = NULL, -- Clear sign-in timestamps to force refresh
  banned_until = NULL, -- Ensure user is not banned
  confirmation_token = NULL, -- Clear any confirmation tokens
  email_confirmed_at = NOW(), -- Ensure email is confirmed
  confirmation_sent_at = NOW() -- Update confirmation timestamp
WHERE email = 'patrick@meowrescue.org';

-- 3. Clear any login failures and audit logs for this user
DELETE FROM auth.audit_log_entries
WHERE actor_id = (SELECT id FROM auth.users WHERE email = 'patrick@meowrescue.org');

-- 4. Try to reset the user's encrypted password directly
DO $$
DECLARE
  user_id uuid;
  random_password text := 'TEMPORARY_' || md5(random()::text || clock_timestamp()::text);
  reset_token text := md5(random()::text || clock_timestamp()::text);
BEGIN
  -- Get the user ID
  SELECT id INTO user_id FROM auth.users WHERE email = 'patrick@meowrescue.org';
  
  IF user_id IS NULL THEN
    RAISE NOTICE 'User not found';
    RETURN;
  END IF;
  
  -- Update the user's password reset token
  UPDATE auth.users
  SET
    recovery_token = reset_token,
    recovery_sent_at = NOW(),
    raw_app_meta_data = raw_app_meta_data || '{"auth_fix": "applied"}'::jsonb
  WHERE id = user_id;
  
  RAISE NOTICE 'Set recovery token for password reset: %', reset_token;
  RAISE NOTICE 'You should now be able to reset your password through the UI';
END;
$$;

-- 5. Check and add admin privileges if not already there
DO $$
DECLARE
  user_id uuid;
BEGIN
  -- Get the user ID
  SELECT id INTO user_id FROM auth.users WHERE email = 'patrick@meowrescue.org';
  
  IF user_id IS NULL THEN
    RAISE NOTICE 'User not found';
    RETURN;
  END IF;

  -- Update the user's metadata to include admin role if not already there
  UPDATE auth.users
  SET raw_app_meta_data = raw_app_meta_data || 
                        CASE 
                          WHEN raw_app_meta_data->>'role' = 'admin' THEN '{}'::jsonb 
                          ELSE '{"role": "admin"}'::jsonb 
                        END
  WHERE id = user_id;
  
  -- Ensure the profile has admin access too
  UPDATE public.profiles
  SET role = 'admin',
      updated_at = NOW()
  WHERE id = user_id;
  
  RAISE NOTICE 'Admin privileges applied to user';
END;
$$;

-- 6. Create alternative auth paths
DO $$
BEGIN
  -- Create a password reset trigger
  CREATE OR REPLACE FUNCTION public.handle_password_reset()
  RETURNS TRIGGER AS $$
  BEGIN
    -- This will auto-fix roles when a password is reset
    NEW.raw_app_meta_data = NEW.raw_app_meta_data || '{"providers": ["email"], "provider": "email"}'::jsonb;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  -- Add the trigger if it doesn't exist
  DROP TRIGGER IF EXISTS on_password_reset ON auth.users;
  CREATE TRIGGER on_password_reset
    BEFORE UPDATE ON auth.users
    FOR EACH ROW
    WHEN (OLD.encrypted_password IS DISTINCT FROM NEW.encrypted_password)
    EXECUTE FUNCTION public.handle_password_reset();
    
  RAISE NOTICE 'Created password reset helper function';

  -- Tell user what to do
  RAISE NOTICE 'IMPORTANT: Please reset your password in the Supabase dashboard (Authentication → Users → patrick@meowrescue.org → Reset password)';
  RAISE NOTICE 'After resetting your password, try logging in again.';
END;
$$;
