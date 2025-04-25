
-- Create RLS policy to check if admin for chat
CREATE OR REPLACE FUNCTION public.is_chat_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND (role = 'admin' OR role = 'staff')
  );
$$;

-- Create RLS policy for chat_messages table
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Policy allowing admins to see all messages
CREATE POLICY "Admins can see all chat messages" ON public.chat_messages
FOR SELECT USING (public.is_chat_admin());

-- Policy allowing users to see their own messages
CREATE POLICY "Users can see their own chat messages" ON public.chat_messages
FOR SELECT USING (
  auth.uid() = user_id OR
  chat_session_id IN (
    SELECT id FROM public.chat_sessions
    WHERE user_id = auth.uid()
  )
);

-- Policy allowing admins to insert messages
CREATE POLICY "Admins can insert messages" ON public.chat_messages
FOR INSERT WITH CHECK (public.is_chat_admin());

-- Policy allowing users to insert messages for their own chat sessions
CREATE POLICY "Users can insert their own messages" ON public.chat_messages
FOR INSERT WITH CHECK (
  chat_session_id IN (
    SELECT id FROM public.chat_sessions
    WHERE user_id = auth.uid()
  )
);

-- Create RLS policy for chat_sessions table
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Policy allowing admins to see all chat sessions
CREATE POLICY "Admins can see all chat sessions" ON public.chat_sessions
FOR SELECT USING (public.is_chat_admin());

-- Policy allowing users to see their own chat sessions
CREATE POLICY "Users can see their own chat sessions" ON public.chat_sessions
FOR SELECT USING (user_id = auth.uid());

-- Policy allowing admins to update sessions
CREATE POLICY "Admins can update chat sessions" ON public.chat_sessions
FOR UPDATE USING (public.is_chat_admin());

-- Policy allowing users to update their own sessions
CREATE POLICY "Users can update their own chat sessions" ON public.chat_sessions
FOR UPDATE USING (user_id = auth.uid());

-- Enable RLS on contact_messages table
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Only admins can see contact messages
CREATE POLICY "Admins can see contact messages" ON public.contact_messages
FOR SELECT USING (public.is_chat_admin());

-- Anyone can insert contact messages (for contact form)
CREATE POLICY "Anyone can insert contact messages" ON public.contact_messages
FOR INSERT WITH CHECK (true);

-- Only admins can update contact messages
CREATE POLICY "Admins can update contact messages" ON public.contact_messages
FOR UPDATE USING (public.is_chat_admin());

-- Add realtime functionality to chat tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_sessions;
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.chat_sessions REPLICA IDENTITY FULL;
