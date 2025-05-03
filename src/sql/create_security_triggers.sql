-- Security Triggers SQL
-- This script adds database triggers to monitor and protect sensitive tables
-- without changing the visual appearance of the application

-- Create a function to detect and log suspicious activity
CREATE OR REPLACE FUNCTION public.log_suspicious_activity()
RETURNS TRIGGER AS $$
DECLARE
  suspicious BOOLEAN := FALSE;
  reason TEXT := '';
  admin_check BOOLEAN;
BEGIN
  -- Skip audit for actual admin users
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ) INTO admin_check;
  
  -- Don't check actual admins
  IF admin_check THEN
    RETURN NEW;
  END IF;
  
  -- Check for rapid delete operations
  -- Note: This relies on the audit_logs table we set up earlier
  IF (TG_OP = 'DELETE') THEN
    -- Check if user has deleted multiple rows in the last minute
    WITH recent_deletes AS (
      SELECT COUNT(*) as delete_count
      FROM public.audit_logs
      WHERE 
        user_id = auth.uid() AND
        action = 'DELETE' AND
        resource = TG_TABLE_NAME AND
        created_at > (now() - interval '1 minute')
    )
    SELECT 
      CASE WHEN delete_count > 5 THEN TRUE ELSE FALSE END,
      'Multiple deletions in short time period'
    INTO suspicious, reason
    FROM recent_deletes;
  END IF;
  
  -- If suspicious activity detected, log it
  IF suspicious THEN
    INSERT INTO public.audit_logs(
      user_id, 
      action, 
      resource, 
      impact, 
      details,
      ip_address
    ) VALUES (
      auth.uid(),
      'SUSPICIOUS_ACTIVITY',
      TG_TABLE_NAME,
      'high',
      jsonb_build_object(
        'operation', TG_OP,
        'reason', reason,
        'table', TG_TABLE_NAME,
        'schema', TG_TABLE_SCHEMA,
        'timestamp', now()
      ),
      current_setting('request.headers', true)::json->>'x-forwarded-for'
    );
    
    -- Log to server log as well
    RAISE WARNING 'SECURITY ALERT: Suspicious activity detected: % on table % by user %', 
      reason, TG_TABLE_NAME, auth.uid();
  END IF;
  
  -- Always allow the operation to proceed (logging only)
  -- In a stricter system, you could RETURN NULL to block suspicious operations
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add triggers to sensitive tables
DO $$
DECLARE
  sensitive_table TEXT;
  sensitive_tables TEXT[] := ARRAY['profiles', 'cats', 'applications', 'donations', 'expenses'];
BEGIN
  FOREACH sensitive_table IN ARRAY sensitive_tables LOOP
    -- Check if table exists
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = sensitive_table) THEN
      -- Drop trigger if it exists
      EXECUTE format('DROP TRIGGER IF EXISTS security_monitor ON public.%I', sensitive_table);
      
      -- Create the trigger
      EXECUTE format('
        CREATE TRIGGER security_monitor
        BEFORE DELETE OR UPDATE ON public.%I
        FOR EACH ROW
        EXECUTE FUNCTION public.log_suspicious_activity()
      ', sensitive_table);
      
      RAISE NOTICE 'Created security trigger for table: %', sensitive_table;
    ELSE
      RAISE NOTICE 'Table % does not exist, skipping security trigger', sensitive_table;
    END IF;
  END LOOP;
END;
$$;
