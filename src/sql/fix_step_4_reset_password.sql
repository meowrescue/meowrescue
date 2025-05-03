-- Step 4: Set up password reset
-- This will generate a recovery token that can be used to reset the password

-- Update user with recovery token
UPDATE auth.users
SET
  recovery_token = md5(random()::text || clock_timestamp()::text),
  recovery_sent_at = NOW()
WHERE email = 'patrick@meowrescue.org'
RETURNING id, email, recovery_token;
