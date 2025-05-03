-- Setup Audit Logs Table
-- Run this script in the Supabase SQL Editor to set up the audit logging infrastructure

-- First, drop the existing function if it exists to avoid errors
DROP FUNCTION IF EXISTS public.record_security_event(TEXT, JSONB);

-- Create the audit_logs table for comprehensive security event tracking
DROP TABLE IF EXISTS public.audit_logs;
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource TEXT,
  resource_id TEXT,
  impact TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON public.audit_logs(resource);
CREATE INDEX IF NOT EXISTS idx_audit_logs_impact ON public.audit_logs(impact);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Add RLS policy to control access to audit logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can read audit logs
CREATE POLICY audit_logs_select_policy 
  ON public.audit_logs 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Any authenticated user can insert their own audit logs
CREATE POLICY audit_logs_insert_policy 
  ON public.audit_logs 
  FOR INSERT 
  WITH CHECK (
    auth.uid() IS NOT NULL AND 
    (user_id = auth.uid() OR user_id IS NULL)
  );

-- Only admins can update or delete audit logs (for data retention purposes)
CREATE POLICY audit_logs_update_policy 
  ON public.audit_logs 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY audit_logs_delete_policy 
  ON public.audit_logs 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Add activity_logs table for tracking database operations
DROP TABLE IF EXISTS public.activity_logs;
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_ids TEXT[],
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON public.activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at);

-- Add RLS policy to control access to activity logs
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can read activity logs
CREATE POLICY activity_logs_select_policy 
  ON public.activity_logs 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Any authenticated user can insert their own activity logs
CREATE POLICY activity_logs_insert_policy 
  ON public.activity_logs 
  FOR INSERT 
  WITH CHECK (
    auth.uid() IS NOT NULL AND 
    (user_id = auth.uid() OR user_id IS NULL)
  );

-- Function to record security events for admins
CREATE OR REPLACE FUNCTION public.record_security_event(
  event_type TEXT,
  event_details JSONB
) RETURNS VOID AS $$
BEGIN
  -- Insert with explicit column names to avoid order issues
  INSERT INTO public.audit_logs (
    user_id,
    action,
    resource,
    resource_id,
    impact,
    details,
    ip_address,
    created_at
  ) VALUES (
    auth.uid(),
    event_type,
    'security',
    NULL,
    'high',
    event_details,
    current_setting('request.headers', true)::json->>'cf-connecting-ip',
    now()
  );
EXCEPTION
  WHEN undefined_column THEN
    RAISE WARNING 'Column error in record_security_event. Check audit_logs table structure: %', SQLERRM;
  WHEN OTHERS THEN
    RAISE WARNING 'Error in record_security_event: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
