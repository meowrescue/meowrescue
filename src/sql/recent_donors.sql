-- Function to get recent donors with proper sorting by date and time
CREATE OR REPLACE FUNCTION public.get_recent_donors(limit_count INTEGER DEFAULT 10)
RETURNS SETOF public.donations
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT d.*
  FROM public.donations d
  WHERE d.status = 'completed'
  ORDER BY d.donation_date DESC
  LIMIT limit_count;
END;
$$;

-- Add comment to the function
COMMENT ON FUNCTION public.get_recent_donors IS 'Returns recent donors sorted by donation date and time in descending order';
