-- Step 3: Fix user authentication data
-- Reset the user's metadata
UPDATE auth.users 
SET
  raw_app_meta_data = '{"provider": "email", "providers": ["email"]}'::jsonb,
  is_sso_user = FALSE,
  updated_at = NOW(),
  email_confirmed_at = NOW()
WHERE email = 'patrick@meowrescue.org';

-- Skip audit log cleanup since the column doesn't exist
-- Instead, let's directly update the user's authentication status

-- Mark email as confirmed
UPDATE auth.users
SET 
  email_confirmed_at = NOW(),
  confirmation_token = NULL,
  confirmation_sent_at = NOW(),
  last_sign_in_at = NULL,  -- Reset sign-in timestamp
  banned_until = NULL      -- Ensure user is not banned
WHERE email = 'patrick@meowrescue.org';

-- Create profile if missing
INSERT INTO public.profiles (id, email, created_at, updated_at)
SELECT id, email, NOW(), NOW() FROM auth.users WHERE email = 'patrick@meowrescue.org'
ON CONFLICT (id) DO NOTHING;
