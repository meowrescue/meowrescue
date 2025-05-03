-- MeowRescue Database Schema Setup
-- This script will recreate all tables, functions, and security policies for the new Supabase project

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-----------------------------------------
-- Create Tables
-----------------------------------------

-- Profiles table linked to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cats table for animal listings
CREATE TABLE IF NOT EXISTS public.cats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    age INTEGER,
    breed TEXT,
    description TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'available',
    special_needs BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications table for adoption applications
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    cat_id UUID REFERENCES public.cats(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'draft',
    application_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Donations table for financial contributions
CREATE TABLE IF NOT EXISTS public.donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method TEXT,
    transaction_id TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expenses table for financial tracking
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category_id UUID,
    description TEXT,
    receipt_url TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Budget categories for expense categorization
CREATE TABLE IF NOT EXISTS public.budget_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key after both tables exist
ALTER TABLE public.expenses 
    ADD CONSTRAINT fk_expenses_category 
    FOREIGN KEY (category_id) 
    REFERENCES public.budget_categories(id) 
    ON DELETE SET NULL;

-- Audit logs for security tracking
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    action TEXT NOT NULL,
    table_name TEXT,
    record_id TEXT,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity logs for user actions
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id TEXT,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-----------------------------------------
-- Create Functions and Triggers
-----------------------------------------

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update timestamp triggers to all tables with updated_at
DROP TRIGGER IF EXISTS update_profiles_timestamp ON public.profiles;
CREATE TRIGGER update_profiles_timestamp
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

DROP TRIGGER IF EXISTS update_cats_timestamp ON public.cats;
CREATE TRIGGER update_cats_timestamp
  BEFORE UPDATE ON public.cats
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

DROP TRIGGER IF EXISTS update_applications_timestamp ON public.applications;
CREATE TRIGGER update_applications_timestamp
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

DROP TRIGGER IF EXISTS update_budget_categories_timestamp ON public.budget_categories;
CREATE TRIGGER update_budget_categories_timestamp
  BEFORE UPDATE ON public.budget_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

-- Function to get top donors (simplified version)
CREATE OR REPLACE FUNCTION public.get_top_donors(limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
  user_id UUID,
  first_name TEXT,
  last_name TEXT,
  total_amount DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.user_id,
    p.first_name,
    p.last_name,
    SUM(d.amount) as total_amount
  FROM 
    public.donations d
  LEFT JOIN 
    public.profiles p ON d.user_id = p.id
  WHERE 
    d.is_anonymous = false
  GROUP BY 
    d.user_id, p.first_name, p.last_name
  ORDER BY 
    total_amount DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-----------------------------------------
-- Set up Row Level Security (RLS)
-----------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-----------------------------------------
-- Public Access Policies
-----------------------------------------

-- Cats - Allow anyone to view all cats
CREATE POLICY "Anyone can view cats" 
ON public.cats
FOR SELECT
USING (true);

-- Donations - Allow anonymous access for public financial transparency
CREATE POLICY "Anyone can view donations" 
ON public.donations
FOR SELECT
USING (true);

-- Expenses - Allow anonymous access for public financial transparency
CREATE POLICY "Anyone can view expenses" 
ON public.expenses
FOR SELECT
USING (true);

-- Budget categories - Allow anonymous access for public financial transparency
CREATE POLICY "Anyone can view budget categories" 
ON public.budget_categories
FOR SELECT
USING (true);

-- Profiles - Allow viewing basic profile info
CREATE POLICY "Anyone can view basic profile info" 
ON public.profiles
FOR SELECT
USING (true);

-----------------------------------------
-- Admin Access Policies
-----------------------------------------

-- Admins have full access to all tables
CREATE POLICY "Admins can manage cats" 
ON public.cats
FOR ALL
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Admins can manage applications" 
ON public.applications
FOR ALL
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Admins can manage donations" 
ON public.donations
FOR ALL
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Admins can manage expenses" 
ON public.expenses
FOR ALL
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Admins can manage budget categories" 
ON public.budget_categories
FOR ALL
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Admins can manage profiles" 
ON public.profiles
FOR ALL
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Admins can view audit logs" 
ON public.audit_logs
FOR SELECT
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Admins can view activity logs" 
ON public.activity_logs
FOR SELECT
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-----------------------------------------
-- User Access Policies
-----------------------------------------

-- Users can update their own profiles
CREATE POLICY "Users can update own profile" 
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users can view their own applications
CREATE POLICY "Users can view own applications" 
ON public.applications
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create applications
CREATE POLICY "Users can create applications" 
ON public.applications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own applications before submission
CREATE POLICY "Users can update draft applications" 
ON public.applications
FOR UPDATE
USING (
  auth.uid() = user_id AND 
  status = 'draft'
)
WITH CHECK (
  auth.uid() = user_id AND 
  status = 'draft'
);

-- Users can create donations
CREATE POLICY "Users can create donations" 
ON public.donations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-----------------------------------------
-- Volunteer/Foster Access Policies
-----------------------------------------

-- Volunteers can update cats
CREATE POLICY "Volunteers can update cats" 
ON public.cats
FOR UPDATE
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('volunteer', 'foster')
);

-- Volunteers can view applications
CREATE POLICY "Volunteers can view applications" 
ON public.applications
FOR SELECT
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('volunteer', 'foster')
);

-----------------------------------------
-- Initial Data Setup
-----------------------------------------

-- Insert initial budget categories
INSERT INTO public.budget_categories (name, description)
VALUES 
  ('Food', 'Cat food and treats'),
  ('Medical', 'Veterinary care and medications'),
  ('Supplies', 'Litter, toys, and other supplies'),
  ('Facilities', 'Shelter maintenance and utilities'),
  ('Administrative', 'Office supplies and administrative costs')
ON CONFLICT (id) DO NOTHING;

-- Grant appropriate permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
