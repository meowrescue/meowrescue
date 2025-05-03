-- MeowRescue Optimized Database Schema Setup
-- This script creates only the tables and fields that are actually used by your application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-----------------------------------------
-- Create Core Tables
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

-- Events table for upcoming events
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    event_date TIMESTAMPTZ NOT NULL,
    location TEXT,
    image_url TEXT,
    is_virtual BOOLEAN DEFAULT FALSE,
    registration_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts for content
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ,
    is_published BOOLEAN DEFAULT FALSE,
    featured_image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team members for staff/volunteer directory
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT,
    bio TEXT,
    image_url TEXT,
    email TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content blocks for dynamic pages
CREATE TABLE IF NOT EXISTS public.content_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id TEXT NOT NULL,
    block_id TEXT NOT NULL,
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(page_id, block_id)
);

-- Fundraising campaigns
CREATE TABLE IF NOT EXISTS public.fundraising_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    goal_amount DECIMAL(10,2) NOT NULL,
    current_amount DECIMAL(10,2) DEFAULT 0,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

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
-- Create Storage Buckets
-----------------------------------------

-- This section creates all the storage buckets needed by the application
-- Note: This requires admin privileges in Supabase

DO $$
BEGIN
  -- Create profile photos bucket
  EXECUTE format('
    CREATE BUCKET IF NOT EXISTS "profile-photos"
    WITH (public = true);
  ');
  
  -- Create cat images bucket
  EXECUTE format('
    CREATE BUCKET IF NOT EXISTS "cat-images"
    WITH (public = true);
  ');
  
  -- Create event images bucket
  EXECUTE format('
    CREATE BUCKET IF NOT EXISTS "event-images"
    WITH (public = true);
  ');
  
  -- Create blog images bucket
  EXECUTE format('
    CREATE BUCKET IF NOT EXISTS "blog-images"
    WITH (public = true);
  ');
  
  -- Create receipt uploads bucket
  EXECUTE format('
    CREATE BUCKET IF NOT EXISTS "receipts"
    WITH (public = false);
  ');
  
  -- Create lost and found photos bucket
  EXECUTE format('
    CREATE BUCKET IF NOT EXISTS "lost_found_photos"
    WITH (public = true);
  ');
  
  -- Create documents bucket
  EXECUTE format('
    CREATE BUCKET IF NOT EXISTS "documents"
    WITH (public = false);
  ');
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error creating storage buckets: %', SQLERRM;
    RAISE NOTICE 'You may need to create the storage buckets manually from the Supabase dashboard.';
END;
$$;

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
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS update_%s_timestamp ON public.%s;
            CREATE TRIGGER update_%s_timestamp
            BEFORE UPDATE ON public.%s
            FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();
        ', t, t, t, t);
    END LOOP;
END;
$$;

-- Function to get top donors
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
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('ALTER TABLE public.%s ENABLE ROW LEVEL SECURITY;', t);
    END LOOP;
END;
$$;

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

-- Events - Allow anyone to view events
CREATE POLICY "Anyone can view events" 
ON public.events
FOR SELECT
USING (true);

-- Blog posts - Allow anyone to view published posts
CREATE POLICY "Anyone can view published blog posts" 
ON public.blog_posts
FOR SELECT
USING (is_published = true);

-- Team members - Allow anyone to view
CREATE POLICY "Anyone can view team members" 
ON public.team_members
FOR SELECT
USING (true);

-- Content blocks - Allow anyone to view
CREATE POLICY "Anyone can view content blocks" 
ON public.content_blocks
FOR SELECT
USING (true);

-- Fundraising campaigns - Allow anyone to view
CREATE POLICY "Anyone can view fundraising campaigns" 
ON public.fundraising_campaigns
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
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('
            CREATE POLICY "Admins can manage %s" 
            ON public.%s
            FOR ALL
            USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = ''admin'');
        ', t, t);
    END LOOP;
END;
$$;

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

-- Users can create contact messages
CREATE POLICY "Anyone can create contact messages" 
ON public.contact_messages
FOR INSERT
WITH CHECK (true);

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
