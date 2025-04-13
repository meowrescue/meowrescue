
-- Update the stored procedure to properly insert applications
CREATE OR REPLACE FUNCTION public.insert_application(
  p_applicant_id UUID,
  p_application_type TEXT,
  p_form_data JSONB,
  p_status TEXT DEFAULT 'pending'
) RETURNS UUID AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.applications (
    applicant_id,
    application_type,
    form_data,
    status
  ) VALUES (
    p_applicant_id,
    p_application_type,
    p_form_data,
    p_status
  ) RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
