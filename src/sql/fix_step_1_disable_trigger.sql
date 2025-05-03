-- Step 1: Disable problematic trigger
DROP TRIGGER IF EXISTS user_activity_trigger ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
