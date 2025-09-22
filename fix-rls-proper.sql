-- Fix RLS Policies for Hospital Partners Management
-- This script properly configures authentication and RLS policies

-- First, ensure we have proper admin authentication setup
-- Create admin user authentication table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_auth_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    admin_user_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to handle admin user creation in auth.users when they sign up
CREATE OR REPLACE FUNCTION handle_admin_auth_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into our admin_auth_users table when a new auth user is created with admin role
    IF NEW.raw_user_meta_data->>'role' = 'admin' THEN
        INSERT INTO admin_auth_users (email, username, admin_user_id)
        VALUES (
            NEW.email,
            NEW.raw_user_meta_data->>'username',
            (NEW.raw_user_meta_data->>'admin_user_id')::UUID
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for admin user creation
DROP TRIGGER IF EXISTS on_admin_auth_user_created ON auth.users;
CREATE TRIGGER on_admin_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_admin_auth_user();

-- Now fix the hospital_partners RLS policies
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admin can manage hospital partners" ON hospital_partners;
DROP POLICY IF EXISTS "Authenticated users can view active partners" ON hospital_partners;
DROP POLICY IF EXISTS "Allow all operations for development" ON hospital_partners;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON hospital_partners;

-- Enable RLS
ALTER TABLE hospital_partners ENABLE ROW LEVEL SECURITY;

-- Create proper RLS policies

-- 1. Allow admins to perform all operations
CREATE POLICY "Admin full access to hospital partners" ON hospital_partners
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_auth_users 
            WHERE email = auth.jwt()->>'email'
        )
        OR
        -- Fallback: allow if user has admin role in metadata
        auth.jwt()->>'role' = 'admin'
        OR
        -- Another fallback: check if email follows admin pattern
        auth.jwt()->>'email' LIKE '%@admin.local'
    );

-- 2. Allow authenticated users to view active partners (for appointment booking, etc.)
CREATE POLICY "View active partners" ON hospital_partners
    FOR SELECT USING (
        status = 'active' 
        AND auth.role() = 'authenticated'
    );

-- Grant necessary permissions
GRANT ALL ON hospital_partners TO authenticated;
GRANT SELECT ON hospital_partners TO anon;

-- Grant permissions on admin_auth_users
GRANT SELECT ON admin_auth_users TO authenticated;

-- Function to check if current user is admin (helper function)
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_auth_users 
        WHERE email = auth.jwt()->>'email'
    ) OR auth.jwt()->>'role' = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Test the setup (optional - uncomment to test)
/*
-- Test if RLS is working correctly
SELECT 
    current_user as db_user,
    auth.uid() as auth_user_id,
    auth.jwt()->>'email' as auth_email,
    auth.jwt()->>'role' as auth_role,
    is_admin_user() as is_admin;
*/

-- Instructions for testing:
-- 1. Create an admin auth user: INSERT INTO auth.users (email, password, ...) with admin metadata
-- 2. Try inserting a hospital partner while authenticated as that user
-- 3. The RLS policies should now allow the operation

COMMENT ON TABLE hospital_partners IS 'Hospital partners with proper RLS policies for admin access';
COMMENT ON FUNCTION is_admin_user() IS 'Helper function to check if current user has admin privileges';
COMMENT ON TABLE admin_auth_users IS 'Maps Supabase auth users to admin users for RLS policies';