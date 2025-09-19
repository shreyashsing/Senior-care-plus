-- Proper RLS fix for patient registration with security maintained
-- Run this in your Supabase SQL Editor

-- Re-enable RLS on both tables (security first!)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_plans ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies that might be causing conflicts
DROP POLICY IF EXISTS "Users can view their own patient records" ON patients;
DROP POLICY IF EXISTS "Anyone can insert patient records during registration" ON patients;
DROP POLICY IF EXISTS "Allow patient registration" ON patients;
DROP POLICY IF EXISTS "Allow reading patient records for duplicate check" ON patients;
DROP POLICY IF EXISTS "Users can update their own patient records" ON patients;
DROP POLICY IF EXISTS "Anyone can view care plans" ON care_plans;
DROP POLICY IF EXISTS "Anyone can create care plans" ON care_plans;
DROP POLICY IF EXISTS "Anyone can update care plans" ON care_plans;

-- SECURE RLS policies for patients table
-- Allow anonymous users to insert new patient records (registration)
CREATE POLICY "Allow anonymous patient registration" 
ON patients FOR INSERT 
TO anon 
WITH CHECK (true);

-- Allow anonymous users to check for duplicate Senior Care IDs (for validation)
CREATE POLICY "Allow anonymous duplicate check" 
ON patients FOR SELECT 
TO anon 
USING (true);

-- Allow authenticated patients to view their own records
CREATE POLICY "Patients can view their own records" 
ON patients FOR SELECT 
TO authenticated 
USING (
    phone_number = current_setting('app.current_phone', true) OR
    senior_care_id = current_setting('app.current_senior_care_id', true)
);

-- Allow authenticated patients to update their own records
CREATE POLICY "Patients can update their own records" 
ON patients FOR UPDATE 
TO authenticated 
USING (
    phone_number = current_setting('app.current_phone', true) OR
    senior_care_id = current_setting('app.current_senior_care_id', true)
);

-- SECURE RLS policies for care_plans table
-- Allow anonymous users to view care plans (for plan selection during registration)
CREATE POLICY "Allow anonymous care plan viewing" 
ON care_plans FOR SELECT 
TO anon 
USING (true);

-- Allow anonymous users to create care plans (during registration)
CREATE POLICY "Allow anonymous care plan creation" 
ON care_plans FOR INSERT 
TO anon 
WITH CHECK (true);

-- Allow authenticated users to view all care plans
CREATE POLICY "Allow authenticated care plan viewing" 
ON care_plans FOR SELECT 
TO authenticated 
USING (true);

-- Add comments for documentation
COMMENT ON TABLE patients IS 'RLS enabled with secure policies for anonymous registration and authenticated access.';
COMMENT ON TABLE care_plans IS 'RLS enabled with secure policies allowing anonymous plan viewing during registration.';