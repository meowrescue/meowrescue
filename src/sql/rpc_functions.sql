
-- Function to get user status
CREATE OR REPLACE FUNCTION public.get_user_status(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  is_active BOOLEAN;
BEGIN
  SELECT us.is_active INTO is_active
  FROM public.user_status us
  WHERE us.user_id = get_user_status.user_id;
  
  -- Return true (active) if no record found
  RETURN COALESCE(is_active, true);
END;
$$;

-- Function to update user status
CREATE OR REPLACE FUNCTION public.update_user_status(p_user_id UUID, p_is_active BOOLEAN)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert or update the user status
  INSERT INTO public.user_status (user_id, is_active)
  VALUES (p_user_id, p_is_active)
  ON CONFLICT (user_id)
  DO UPDATE SET 
    is_active = p_is_active,
    created_at = NOW();
END;
$$;

-- Function to create an application
CREATE OR REPLACE FUNCTION public.create_application(
  p_applicant_id UUID,
  p_application_type TEXT,
  p_status TEXT,
  p_form_data JSONB
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.applications (
    applicant_id,
    application_type,
    status,
    form_data,
    created_at,
    updated_at
  ) VALUES (
    p_applicant_id,
    p_application_type,
    p_status,
    p_form_data,
    NOW(),
    NOW()
  ) RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;

-- Function to get applications with optional filters
CREATE OR REPLACE FUNCTION public.get_applications(
  p_status TEXT DEFAULT NULL,
  p_type TEXT DEFAULT NULL
)
RETURNS SETOF public.applications
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT a.*
  FROM public.applications a
  LEFT JOIN public.profiles p ON a.applicant_id = p.id
  WHERE 
    (p_status IS NULL OR a.status = p_status) AND
    (p_type IS NULL OR a.application_type = p_type)
  ORDER BY a.created_at DESC;
END;
$$;

-- Function to update application status
CREATE OR REPLACE FUNCTION public.update_application_status(
  p_application_id UUID,
  p_status TEXT,
  p_feedback TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.applications
  SET 
    status = p_status,
    feedback = p_feedback,
    reviewed_at = NOW(),
    reviewer_id = auth.uid(),
    updated_at = NOW()
  WHERE id = p_application_id;
END;
$$;

-- Functions for cat food API
CREATE OR REPLACE FUNCTION public.get_cat_food()
RETURNS SETOF public.cat_food
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.cat_food
  ORDER BY purchase_date DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.add_cat_food(
  p_brand TEXT,
  p_type TEXT,
  p_quantity INTEGER,
  p_units TEXT,
  p_cost_per_unit NUMERIC,
  p_purchase_date TIMESTAMP WITH TIME ZONE
)
RETURNS public.cat_food
LANGUAGE plpgsql
AS $$
DECLARE
  new_food public.cat_food;
BEGIN
  INSERT INTO public.cat_food (
    brand,
    type,
    quantity,
    units,
    cost_per_unit,
    purchase_date,
    created_at
  ) VALUES (
    p_brand,
    p_type,
    p_quantity,
    p_units,
    p_cost_per_unit,
    p_purchase_date,
    NOW()
  ) RETURNING * INTO new_food;
  
  RETURN new_food;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_cat_feeding_records()
RETURNS TABLE(
  id UUID,
  cat_id UUID,
  cat_food_id UUID,
  amount NUMERIC,
  feeding_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  cat_name TEXT,
  food_brand TEXT,
  food_type TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cfr.id,
    cfr.cat_id,
    cfr.cat_food_id,
    cfr.amount,
    cfr.feeding_date,
    cfr.created_at,
    c.name AS cat_name,
    cf.brand AS food_brand,
    cf.type AS food_type
  FROM public.cat_feeding_records cfr
  JOIN public.cats c ON cfr.cat_id = c.id
  JOIN public.cat_food cf ON cfr.cat_food_id = cf.id
  ORDER BY cfr.feeding_date DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.add_cat_feeding_record(
  p_cat_id UUID,
  p_cat_food_id UUID,
  p_amount NUMERIC,
  p_feeding_date TIMESTAMP WITH TIME ZONE
)
RETURNS public.cat_feeding_records
LANGUAGE plpgsql
AS $$
DECLARE
  new_record public.cat_feeding_records;
BEGIN
  INSERT INTO public.cat_feeding_records (
    cat_id,
    cat_food_id,
    amount,
    feeding_date,
    created_at
  ) VALUES (
    p_cat_id,
    p_cat_food_id,
    p_amount,
    p_feeding_date,
    NOW()
  ) RETURNING * INTO new_record;
  
  RETURN new_record;
END;
$$;
