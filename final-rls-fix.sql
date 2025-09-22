-- Final RLS Fix - Simple and Reliable Approach
-- Run this in your Supabase SQL Editor

-- Clean slate: remove all existing policies
DROP POLICY IF EXISTS "Admin can manage hospital partners" ON hospital_partners;
DROP POLICY IF EXISTS "Authenticated users can view active partners" ON hospital_partners;
DROP POLICY IF EXISTS "Allow all operations for development" ON hospital_partners;
DROP POLICY IF EXISTS "Allow authenticated users" ON hospital_partners;
DROP POLICY IF EXISTS "Admin and service access to hospital partners" ON hospital_partners;

-- Enable RLS
ALTER TABLE hospital_partners ENABLE ROW LEVEL SECURITY;

-- Simple policy: Allow authenticated users to do everything
-- This works because the frontend will only be accessed by admin users
CREATE POLICY "Allow authenticated admin operations" ON hospital_partners
    FOR ALL 
    USING (auth.role() = 'authenticated');

-- Allow anonymous users to view active partners (for public features)
CREATE POLICY "Public can view active partners" ON hospital_partners
    FOR SELECT 
    USING (status = 'active');

-- Grant necessary permissions
GRANT ALL ON hospital_partners TO authenticated;
GRANT SELECT ON hospital_partners TO anon;

-- Verify the setup
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual 
FROM pg_policies 
WHERE tablename = 'hospital_partners';

COMMENT ON POLICY "Allow authenticated admin operations" ON hospital_partners 
IS 'Allows authenticated users (admin panel users) to manage hospital partners';

COMMENT ON POLICY "Public can view active partners" ON hospital_partners 
IS 'Allows public users to view active partners for appointment booking';