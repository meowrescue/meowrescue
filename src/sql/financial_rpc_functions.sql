
-- Create or replace function to get monthly donations
CREATE OR REPLACE FUNCTION public.get_monthly_donations()
 RETURNS numeric
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
DECLARE
  total_donations numeric;
BEGIN
  -- Get the first day of the current month
  WITH first_day_of_month AS (
    SELECT date_trunc('month', now()) as first_day
  )
  
  SELECT COALESCE(SUM(d.amount), 0) INTO total_donations
  FROM donations d, first_day_of_month fdm
  WHERE d.status = 'completed'
  AND d.donation_date >= fdm.first_day;
  
  RETURN total_donations;
END;
$$;

-- Create or replace function to get monthly expenses
CREATE OR REPLACE FUNCTION public.get_monthly_expenses()
 RETURNS numeric
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
DECLARE
  total_expenses numeric;
BEGIN
  -- Get the first day of the current month
  WITH first_day_of_month AS (
    SELECT date_trunc('month', now()) as first_day
  )
  
  SELECT COALESCE(SUM(e.amount), 0) INTO total_expenses
  FROM expenses e, first_day_of_month fdm
  WHERE e.expense_date >= fdm.first_day;
  
  RETURN total_expenses;
END;
$$;

-- Create or replace function to get total budget
CREATE OR REPLACE FUNCTION public.get_total_budget()
 RETURNS numeric
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
DECLARE
  total numeric;
BEGIN
  -- Get the current year
  WITH current_year AS (
    SELECT date_part('year', now()) as year
  )
  
  SELECT COALESCE(SUM(b.amount), 0) INTO total
  FROM budget_categories b, current_year cy
  WHERE b.year = cy.year;
  
  RETURN total;
END;
$$;

-- Create or replace function to get total donations
CREATE OR REPLACE FUNCTION public.get_total_donations()
 RETURNS numeric
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
DECLARE
  total_donations numeric;
BEGIN
  -- Get the current year
  WITH current_year AS (
    SELECT date_trunc('year', now()) as first_day
  )
  
  SELECT COALESCE(SUM(d.amount), 0) INTO total_donations
  FROM donations d, current_year cy
  WHERE d.status = 'completed'
  AND d.donation_date >= cy.first_day;
  
  RETURN total_donations;
END;
$$;
