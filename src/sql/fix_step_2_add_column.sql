-- Step 2: Add the missing column to activity_logs
ALTER TABLE public.activity_logs ADD COLUMN IF NOT EXISTS activity_type TEXT;
