
-- Function to get top donors with their total contributions
CREATE OR REPLACE FUNCTION public.get_top_donors(limit_count INT DEFAULT 10)
RETURNS TABLE (
  donor_name TEXT,
  total_amount NUMERIC
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE 
      WHEN p.first_name IS NULL OR p.first_name = '' THEN 'Anonymous'
      ELSE CONCAT(p.first_name, ' ', COALESCE(p.last_name, ''))
    END AS donor_name,
    SUM(
      CASE 
        WHEN d.amount IS NULL THEN 0
        WHEN d.amount::text ~ '^[0-9]+(\.[0-9]+)?$' THEN d.amount::numeric
        ELSE 0
      END
    ) AS total_amount
  FROM 
    donations d
  LEFT JOIN 
    profiles p ON d.donor_profile_id = p.id
  WHERE 
    d.status = 'completed'
    AND d.donation_date >= date_trunc('year', CURRENT_DATE)
  GROUP BY 
    donor_name
  ORDER BY 
    total_amount DESC
  LIMIT limit_count;
END;
$$;

-- Add comment to the function
COMMENT ON FUNCTION public.get_top_donors IS 'Returns top donors with their total donation amounts for the current year';
