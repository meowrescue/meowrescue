-- Fix RLS policies for financial data tables to allow anonymous access for reading

-- Enable RLS on donations table
ALTER TABLE IF EXISTS public.donations ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous users to view donations
CREATE POLICY IF NOT EXISTS "Anyone can view donations" 
ON public.donations
FOR SELECT
USING (true);

-- Enable RLS on expenses table
ALTER TABLE IF EXISTS public.expenses ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous users to view expenses
CREATE POLICY IF NOT EXISTS "Anyone can view expenses" 
ON public.expenses
FOR SELECT
USING (true);

-- Enable RLS on budget_categories table
ALTER TABLE IF EXISTS public.budget_categories ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous users to view budget categories
CREATE POLICY IF NOT EXISTS "Anyone can view budget categories" 
ON public.budget_categories
FOR SELECT
USING (true);

-- Add policies for admin users to manage financial data
CREATE POLICY IF NOT EXISTS "Admins can manage donations" 
ON public.donations
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY IF NOT EXISTS "Admins can manage expenses" 
ON public.expenses
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY IF NOT EXISTS "Admins can manage budget categories" 
ON public.budget_categories
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
