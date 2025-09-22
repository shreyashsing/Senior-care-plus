-- Quick fix for existing hospital_partners table RLS issue
-- Run this in your Supabase SQL Editor to fix the authentication problem

-- Drop existing policies that are causing the issue
DROP POLICY IF EXISTS "Admin can manage hospital partners" ON hospital_partners;
DROP POLICY IF EXISTS "Authenticated users can view active partners" ON hospital_partners;

-- Disable RLS for development (you can enable it later with proper policies)
ALTER TABLE hospital_partners DISABLE ROW LEVEL SECURITY;

-- Alternative: If you want to keep RLS enabled, use this permissive policy instead
-- ALTER TABLE hospital_partners ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all operations for development" ON hospital_partners FOR ALL USING (true);

-- Verify the fix by checking if you can now insert data
-- You can test with this sample insert:
/*
INSERT INTO hospital_partners (
    name, category, services, free_services, address, city, pincode, 
    pincodes_served, contact_person_name, contact_person_phone, 
    contact_person_email
) VALUES (
    'Test Hospital',
    'Hospital',
    '[{"service": "OPD", "discount": 10}]'::jsonb,
    false,
    'Test Address',
    'Test City',
    '123456',
    ARRAY['123456'],
    'Test Contact',
    '1234567890',
    'test@test.com'
);
*/