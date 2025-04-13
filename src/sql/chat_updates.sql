
-- Add guest_name and guest_reason columns to chat_sessions table
ALTER TABLE IF EXISTS public.chat_sessions 
ADD COLUMN IF NOT EXISTS guest_name TEXT,
ADD COLUMN IF NOT EXISTS guest_reason TEXT;

-- Make user_id nullable for guest chats
ALTER TABLE IF EXISTS public.chat_sessions 
ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS policies to allow anonymous access
ALTER TABLE IF EXISTS public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Policy for inserting chat sessions (allow anonymous)
CREATE POLICY IF NOT EXISTS "Anyone can create chat sessions" 
ON public.chat_sessions 
FOR INSERT 
TO authenticated, anon
WITH CHECK (true);

-- Policy for selecting chat sessions (users see their own, admins see all)
CREATE POLICY IF NOT EXISTS "Users can view their own chat sessions"
ON public.chat_sessions
FOR SELECT 
TO authenticated, anon
USING (
  auth.uid() = user_id OR 
  user_id IS NULL OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Policy for updating chat sessions
CREATE POLICY IF NOT EXISTS "Users can update their own chat sessions"
ON public.chat_sessions
FOR UPDATE
TO authenticated, anon
USING (
  auth.uid() = user_id OR 
  user_id IS NULL OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Update chat_messages policies to allow anonymous access
ALTER TABLE IF EXISTS public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Policy for inserting messages (allow anonymous)
CREATE POLICY IF NOT EXISTS "Anyone can create chat messages" 
ON public.chat_messages 
FOR INSERT 
TO authenticated, anon
WITH CHECK (true);

-- Policy for selecting messages (users see their chat's messages, admins see all)
CREATE POLICY IF NOT EXISTS "Users can view their own chat messages"
ON public.chat_messages
FOR SELECT 
TO authenticated, anon
USING (
  EXISTS (
    SELECT 1 FROM public.chat_sessions 
    WHERE id = chat_messages.chat_session_id AND (
      user_id = auth.uid() OR 
      user_id IS NULL OR
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    )
  )
);
