-- Add guest_name and guest_reason columns to chat_sessions table
ALTER TABLE IF EXISTS public.chat_sessions 
ADD COLUMN IF NOT EXISTS guest_name TEXT,
ADD COLUMN IF NOT EXISTS guest_reason TEXT;

-- Make user_id nullable for guest chats
ALTER TABLE IF EXISTS public.chat_sessions 
ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS policies to allow anonymous access
ALTER TABLE IF EXISTS public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can create chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Users can view their own chat sessions" ON public.chat_sessions;

-- Policy for inserting chat sessions (allow anonymous)
CREATE POLICY "Anyone can create chat sessions" 
ON public.chat_sessions 
FOR INSERT 
TO authenticated, anon
WITH CHECK (true);

-- Policy for selecting chat sessions (users see their own, admins see all)
-- Using direct role check to avoid infinite recursion
CREATE POLICY "Users can view their own chat sessions"
ON public.chat_sessions
FOR SELECT 
TO authenticated, anon
USING (
  auth.uid() = user_id OR 
  user_id IS NULL OR
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Policy for updating chat sessions
DROP POLICY IF EXISTS "Users can update their own chat sessions" ON public.chat_sessions;
CREATE POLICY "Users can update their own chat sessions"
ON public.chat_sessions
FOR UPDATE
USING (
  auth.uid() = user_id OR
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Policy for deleting chat sessions (admin only)
DROP POLICY IF EXISTS "Admins can delete chat sessions" ON public.chat_sessions;
CREATE POLICY "Admins can delete chat sessions"
ON public.chat_sessions
FOR DELETE
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
