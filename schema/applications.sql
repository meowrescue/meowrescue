-- Create applications table to store all application types (adoption, foster, volunteer)
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  applicant_id UUID REFERENCES auth.users(id),
  application_type TEXT NOT NULL CHECK (application_type IN ('adoption', 'foster', 'volunteer')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'denied', 'on_hold')),
  form_data JSONB NOT NULL, -- Stores all form data in a flexible JSON format
  cat_id UUID REFERENCES public.cats(id), -- Optional reference to a specific cat for adoption applications
  reviewer_id UUID REFERENCES auth.users(id), -- Staff member who reviewed the application
  review_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  reviewed_at TIMESTAMPTZ
);

-- Create index for faster queries by application type
CREATE INDEX IF NOT EXISTS idx_applications_type ON public.applications(application_type);

-- Create index for faster queries by status
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);

-- Create index for faster queries by applicant
CREATE INDEX IF NOT EXISTS idx_applications_applicant ON public.applications(applicant_id);

-- Create index for faster queries by cat
CREATE INDEX IF NOT EXISTS idx_applications_cat ON public.applications(cat_id);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at timestamp
DROP TRIGGER IF EXISTS update_applications_timestamp ON public.applications;
CREATE TRIGGER update_applications_timestamp
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.update_applications_updated_at();

-- Create notifications table for application status updates
CREATE TABLE IF NOT EXISTS public.application_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create index for faster queries by application
CREATE INDEX IF NOT EXISTS idx_app_notifications_app ON public.application_notifications(application_id);

-- Create index for faster queries by user
CREATE INDEX IF NOT EXISTS idx_app_notifications_user ON public.application_notifications(user_id);

-- Create a view to get application statistics
CREATE OR REPLACE VIEW public.application_statistics AS
SELECT 
  application_type,
  status,
  COUNT(*) as count,
  date_trunc('month', created_at) as month
FROM public.applications
GROUP BY application_type, status, month
ORDER BY month DESC, application_type, status;

-- Secure the tables with Row Level Security (RLS)
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_notifications ENABLE ROW LEVEL SECURITY;

-- Define policies for applications table
-- Admin users can see and do everything
DROP POLICY IF EXISTS "Admins have full access to applications" ON public.applications;
CREATE POLICY "Admins have full access to applications" 
ON public.applications FOR ALL 
TO authenticated
USING (auth.uid() IN (SELECT user_id FROM public.staff_members WHERE role = 'admin'))
WITH CHECK (auth.uid() IN (SELECT user_id FROM public.staff_members WHERE role = 'admin'));

-- Users can view their own applications only
DROP POLICY IF EXISTS "Users can view their own applications" ON public.applications;
CREATE POLICY "Users can view their own applications" 
ON public.applications FOR SELECT 
TO authenticated
USING (applicant_id = auth.uid());

-- Users can insert their own applications
DROP POLICY IF EXISTS "Users can insert their own applications" ON public.applications;
CREATE POLICY "Users can insert their own applications" 
ON public.applications FOR INSERT 
TO authenticated
WITH CHECK (applicant_id = auth.uid());

-- Users cannot update or delete applications
DROP POLICY IF EXISTS "Staff can update applications" ON public.applications;
CREATE POLICY "Staff can update applications" 
ON public.applications FOR UPDATE 
TO authenticated
USING (auth.uid() IN (SELECT user_id FROM public.staff_members));

-- Define policies for application_notifications table
-- Users can only view their own notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.application_notifications;
CREATE POLICY "Users can view their own notifications" 
ON public.application_notifications FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Users can update their own notifications (e.g., mark as read)
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.application_notifications;
CREATE POLICY "Users can update their own notifications" 
ON public.application_notifications FOR UPDATE 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Staff members can insert notifications
DROP POLICY IF EXISTS "Staff can insert notifications" ON public.application_notifications;
CREATE POLICY "Staff can insert notifications" 
ON public.application_notifications FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IN (SELECT user_id FROM public.staff_members));

-- Create a function to notify users when their application status changes
CREATE OR REPLACE FUNCTION public.notify_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status != NEW.status THEN
    INSERT INTO public.application_notifications (application_id, user_id, message)
    VALUES (
      NEW.id, 
      NEW.applicant_id, 
      'Your ' || NEW.application_type || ' application status has been updated to: ' || NEW.status
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger for application status changes
DROP TRIGGER IF EXISTS application_status_change ON public.applications;
CREATE TRIGGER application_status_change
AFTER UPDATE OF status ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.notify_application_status_change();

-- Create a view for administrative dashboard
CREATE OR REPLACE VIEW public.admin_application_dashboard AS
SELECT 
  a.id,
  a.application_type,
  a.status,
  a.created_at,
  a.updated_at,
  a.reviewed_at,
  u.email as applicant_email,
  (a.form_data->>'firstName' || ' ' || a.form_data->>'lastName') as applicant_name,
  a.form_data->>'phone' as applicant_phone,
  CASE 
    WHEN a.application_type = 'adoption' AND a.cat_id IS NOT NULL THEN 
      (SELECT name FROM public.cats WHERE id = a.cat_id)
    ELSE 
      a.form_data->>'specificCat'
  END as cat_name,
  CASE 
    WHEN a.reviewer_id IS NOT NULL THEN 
      (SELECT email FROM auth.users WHERE id = a.reviewer_id)
    ELSE 
      NULL
  END as reviewer_email
FROM 
  public.applications a
JOIN 
  auth.users u ON a.applicant_id = u.id
ORDER BY 
  a.created_at DESC;

-- Grants
GRANT SELECT ON public.application_statistics TO authenticated;
GRANT SELECT ON public.admin_application_dashboard TO authenticated;
