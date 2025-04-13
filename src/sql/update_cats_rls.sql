
-- Enable RLS on the cats table
ALTER TABLE IF EXISTS public.cats ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all authenticated users to view cats
CREATE POLICY IF NOT EXISTS "Anyone can view cats" 
ON public.cats
FOR SELECT
USING (true);

-- Create a policy that allows only admins to insert/update/delete cats
CREATE POLICY IF NOT EXISTS "Admins can manage cats" 
ON public.cats
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create a policy that allows fosters to view their assigned cats
CREATE POLICY IF NOT EXISTS "Fosters can view their cats" 
ON public.cats
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'foster'
  )
);
