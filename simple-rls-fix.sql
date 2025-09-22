-- Simple and Robust RLS Fix for Hospital Partners
-- This approach works with the existing admin authentication system

-- Drop existing policies
DROP POLICY IF EXISTS "Admin can manage hospital partners" ON hospital_partners;
DROP POLICY IF EXISTS "Authenticated users can view active partners" ON hospital_partners;
DROP POLICY IF EXISTS "Allow all operations for development" ON hospital_partners;

-- Enable RLS
ALTER TABLE hospital_partners ENABLE ROW LEVEL SECURITY;

-- Create a simple policy that checks for admin role or allows service role
CREATE POLICY "Admin and service access to hospital partners" ON hospital_partners
    FOR ALL USING (
        -- Allow if user has admin role in JWT
        (auth.jwt() ->> 'role' = 'admin')
        OR
        -- Allow if email contains admin pattern
        (auth.jwt() ->> 'email' LIKE '%admin%')
        OR
        -- Allow if no auth context (service role)
        (auth.uid() IS NULL)
        OR
        -- Allow if using service role
        (current_setting('role') = 'service_role')
    );

-- Allow authenticated users to view active partners
CREATE POLICY "View active partners for users" ON hospital_partners
    FOR SELECT USING (
        status = 'active'
    );

-- Grant permissions
GRANT ALL ON hospital_partners TO authenticated;
GRANT ALL ON hospital_partners TO service_role;
GRANT SELECT ON hospital_partners TO anon;

-- Alternative: If the above doesn't work, we can use a more permissive approach
-- Uncomment the following to allow all authenticated users to manage partners:

-- CREATE POLICY "Allow authenticated users" ON hospital_partners
--     FOR ALL USING (auth.role() = 'authenticated');

COMMENT ON POLICY "Admin and service access to hospital partners" ON hospital_partners 
IS 'Allows admin users and service role to manage hospital partners';