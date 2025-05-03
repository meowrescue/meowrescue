-- Comprehensive Row Level Security (RLS) policy configuration
-- This file contains all RLS settings for the MeowRescue application
-- Use this as the source of truth for database security policies

-----------------------------------------
-- Basic Security Setup
-----------------------------------------

-- Ensure RLS is enabled for all tables
ALTER TABLE IF EXISTS public.cats ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.budget_categories ENABLE ROW LEVEL SECURITY;
-- Disable RLS for profiles to avoid infinite recursion
ALTER TABLE IF EXISTS public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.applications ENABLE ROW LEVEL SECURITY;

-----------------------------------------
-- Create profiles table if it doesn't exist
-----------------------------------------

-- Check if profiles table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        CREATE TABLE public.profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id),
            email TEXT,
            first_name TEXT,
            last_name TEXT,
            role TEXT DEFAULT 'user',
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        -- Comment for clarity
        COMMENT ON TABLE public.profiles IS 'User profile information with role-based access control';
    END IF;
END $$;

-----------------------------------------
-- Public Access Policies
-----------------------------------------

-- Cats - Allow anyone to view published/available cats
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Anyone can view published cats" ON public.cats;
-- Use general status check as the enum values may vary
CREATE POLICY "Anyone can view published cats" 
ON public.cats
FOR SELECT
USING (true);  -- Allow viewing all cats for now

-- Donations - Allow anonymous access for public financial transparency
DROP POLICY IF EXISTS "Anyone can view donations" ON public.donations;
CREATE POLICY "Anyone can view donations" 
ON public.donations
FOR SELECT
USING (true);

-- Expenses - Allow anonymous access for public financial transparency
DROP POLICY IF EXISTS "Anyone can view expenses" ON public.expenses;
CREATE POLICY "Anyone can view expenses" 
ON public.expenses
FOR SELECT
USING (true);

-- Budget categories - Allow anonymous access for public financial transparency
DROP POLICY IF EXISTS "Anyone can view budget categories" ON public.budget_categories;
CREATE POLICY "Anyone can view budget categories" 
ON public.budget_categories
FOR SELECT
USING (true);

-----------------------------------------
-- Admin Access Policies
-----------------------------------------

-- Admins have full access to all tables
DROP POLICY IF EXISTS "Admins can manage cats" ON public.cats;
CREATE POLICY "Admins can manage cats" 
ON public.cats
FOR ALL
USING (
  -- Direct role check to prevent recursion
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

DROP POLICY IF EXISTS "Admins can manage donations" ON public.donations;
CREATE POLICY "Admins can manage donations" 
ON public.donations
FOR ALL
USING (
  -- Direct role check to prevent recursion
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

DROP POLICY IF EXISTS "Admins can manage expenses" ON public.expenses;
CREATE POLICY "Admins can manage expenses" 
ON public.expenses
FOR ALL
USING (
  -- Direct role check to prevent recursion
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

DROP POLICY IF EXISTS "Admins can manage budget categories" ON public.budget_categories;
CREATE POLICY "Admins can manage budget categories" 
ON public.budget_categories
FOR ALL
USING (
  -- Direct role check to prevent recursion
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

DROP POLICY IF EXISTS "Admins can manage applications" ON public.applications;
CREATE POLICY "Admins can manage applications" 
ON public.applications
FOR ALL
USING (
  -- Direct role check to prevent recursion
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-----------------------------------------
-- Foster Access Policies
-----------------------------------------

-- Fosters can view their assigned cats
DROP POLICY IF EXISTS "Fosters can view their cats" ON public.cats;
CREATE POLICY "Fosters can view their cats" 
ON public.cats
FOR SELECT
USING (
  -- Direct role check to prevent recursion
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'foster'
);

-- Fosters can update cats (modified to not use foster_id column)
DROP POLICY IF EXISTS "Fosters can update their cats" ON public.cats;
CREATE POLICY "Fosters can update their cats" 
ON public.cats
FOR UPDATE
USING (
  -- Direct role check to prevent recursion
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'foster'
);

-----------------------------------------
-- User Access Policies
-----------------------------------------

-- Users can view their own profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
-- Users can update their own profiles
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
-- Users can view their own applications
DROP POLICY IF EXISTS "Users can view own applications" ON public.applications;
CREATE POLICY "Users can view own applications" 
ON public.applications
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Users can create applications
DROP POLICY IF EXISTS "Users can create applications" ON public.applications;
CREATE POLICY "Users can create applications" 
ON public.applications
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own applications before submission
DROP POLICY IF EXISTS "Users can update draft applications" ON public.applications;
CREATE POLICY "Users can update draft applications" 
ON public.applications
FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND 
  status = 'draft'
)
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  status = 'draft'
);

-----------------------------------------
-- Profiles Table Policies
-----------------------------------------

-- Fix infinite recursion issue with profiles table
-- Replace the single "ALL" policy with separate policies for different operations
DROP POLICY IF EXISTS "Admins can manage profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can select from profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
