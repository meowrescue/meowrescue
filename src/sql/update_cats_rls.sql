
-- Enable RLS on the cats table
ALTER TABLE IF EXISTS public.cats ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all authenticated users to view cats
DROP POLICY IF EXISTS "Anyone can view cats" ON public.cats;
CREATE POLICY "Anyone can view cats" 
ON public.cats
FOR SELECT
USING (true);

-- Create a policy that allows only admins to insert/update/delete cats
DROP POLICY IF EXISTS "Admins can manage cats" ON public.cats;
CREATE POLICY "Admins can manage cats" 
ON public.cats
FOR ALL
USING (
  auth.uid() IN (
    SELECT id FROM public.profiles
    WHERE role = 'admin'
  )
);

-- Create a policy that allows fosters to view their assigned cats
DROP POLICY IF EXISTS "Fosters can view their cats" ON public.cats;
CREATE POLICY "Fosters can view their cats" 
ON public.cats
FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM public.profiles
    WHERE role = 'foster'
  )
);
