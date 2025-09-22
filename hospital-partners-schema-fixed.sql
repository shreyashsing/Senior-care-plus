-- Hospital Partners Management Database Schema
-- This creates the comprehensive hospital partners table with services and individual discounts

-- First, let's drop the existing table and policies if they exist
DROP POLICY IF EXISTS "Admin can manage hospital partners" ON hospital_partners;
DROP POLICY IF EXISTS "Authenticated users can view active partners" ON hospital_partners;
DROP TABLE IF EXISTS hospital_partners;

-- Hospital Partners table with all required fields
CREATE TABLE hospital_partners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL CHECK (category IN (
        'Hospital', 'Eye', 'Dental', 'Physiotherapy', 'Yoga', 'Meditation', 
        'Nurse at home', 'Ambulance', 'Air Ambulance', 'Clinic', 
        'Medicine Delivery', 'ICU @ Home', 'Diagnostics'
    )),
    
    -- Services with individual discounts (stored as JSONB for flexibility)
    services JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of objects: [{"service": "OPD", "discount": 10}, {"service": "IPD", "discount": 15}]
    
    -- General fields
    free_services BOOLEAN DEFAULT false,
    
    -- Address information
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    pincodes_served TEXT[] DEFAULT ARRAY[]::TEXT[], -- Array of pincodes they serve
    
    -- Contact information
    contact_person_name VARCHAR(255) NOT NULL,
    contact_person_phone VARCHAR(20) NOT NULL,
    contact_person_email VARCHAR(255) NOT NULL,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    
    -- System fields
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hospital_partners_category ON hospital_partners(category);
CREATE INDEX IF NOT EXISTS idx_hospital_partners_city ON hospital_partners(city);
CREATE INDEX IF NOT EXISTS idx_hospital_partners_pincode ON hospital_partners(pincode);
CREATE INDEX IF NOT EXISTS idx_hospital_partners_status ON hospital_partners(status);
CREATE INDEX IF NOT EXISTS idx_hospital_partners_services ON hospital_partners USING GIN(services);
CREATE INDEX IF NOT EXISTS idx_hospital_partners_pincodes_served ON hospital_partners USING GIN(pincodes_served);

-- For development/testing, we'll disable RLS temporarily
-- In production, you should implement proper RLS policies based on your auth system
ALTER TABLE hospital_partners DISABLE ROW LEVEL SECURITY;

-- Alternative: Enable RLS with permissive policies for development
-- ALTER TABLE hospital_partners ENABLE ROW LEVEL SECURITY;
-- 
-- -- Allow all operations for authenticated users (you can restrict this later)
-- CREATE POLICY "Allow all for authenticated users" ON hospital_partners
--     FOR ALL USING (auth.role() = 'authenticated');
-- 
-- -- Or allow all operations without restrictions (for development only)
-- CREATE POLICY "Allow all operations" ON hospital_partners
--     FOR ALL USING (true);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_hospital_partners_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER hospital_partners_update_trigger
    BEFORE UPDATE ON hospital_partners
    FOR EACH ROW
    EXECUTE FUNCTION update_hospital_partners_updated_at();

-- Insert sample data for testing
INSERT INTO hospital_partners (
    name, category, services, free_services, address, city, pincode, 
    pincodes_served, contact_person_name, contact_person_phone, 
    contact_person_email, emergency_contact_name, emergency_contact_phone
) VALUES 
(
    'Apollo Hospital Surat',
    'Hospital',
    '[
        {"service": "OPD", "discount": 15},
        {"service": "IPD", "discount": 20},
        {"service": "2nd consultation", "discount": 10},
        {"service": "Online", "discount": 5}
    ]'::jsonb,
    false,
    '123 Ring Road, Surat',
    'Surat',
    '395007',
    ARRAY['395007', '395008', '395009', '395010'],
    'Dr. Rajesh Patel',
    '+91-9876543210',
    'rajesh.patel@apollo.com',
    'Nurse Station',
    '+91-9876543211'
),
(
    'Sterling Hospital',
    'Hospital',
    '[
        {"service": "OPD", "discount": 12},
        {"service": "IPD", "discount": 18},
        {"service": "Home Service", "discount": 8}
    ]'::jsonb,
    true,
    '456 City Road, Surat',
    'Surat',
    '395001',
    ARRAY['395001', '395002', '395003'],
    'Dr. Priya Shah',
    '+91-8765432109',
    'priya.shah@sterling.com',
    'Emergency Desk',
    '+91-8765432108'
),
(
    'Vision Care Eye Clinic',
    'Eye',
    '[
        {"service": "OPD", "discount": 20},
        {"service": "Online", "discount": 15}
    ]'::jsonb,
    false,
    '789 Mall Road, Surat',
    'Surat',
    '395006',
    ARRAY['395006', '395007'],
    'Dr. Amit Joshi',
    '+91-7654321098',
    'amit.joshi@visioncare.com',
    null,
    null
),
(
    'Smile Dental Care',
    'Dental',
    '[
        {"service": "OPD", "discount": 25},
        {"service": "Home Service", "discount": 20}
    ]'::jsonb,
    false,
    '321 Park Street, Surat',
    'Surat',
    '395004',
    ARRAY['395004', '395005'],
    'Dr. Kavita Mehta',
    '+91-6543210987',
    'kavita.mehta@smilecare.com',
    'Reception',
    '+91-6543210986'
),
(
    'Life Line Ambulance',
    'Ambulance',
    '[
        {"service": "Ambulance", "discount": 10}
    ]'::jsonb,
    false,
    '654 Emergency Lane, Surat',
    'Surat',
    '395002',
    ARRAY['395001', '395002', '395003', '395004', '395005', '395006', '395007', '395008', '395009', '395010'],
    'Rajesh Kumar',
    '+91-5432109876',
    'rajesh.kumar@lifeline.com',
    'Control Room',
    '+91-5432109875'
);

-- Grant necessary permissions (adjust based on your setup)
-- GRANT ALL ON hospital_partners TO authenticated;
-- GRANT ALL ON hospital_partners TO anon;

-- Verification query to check the data
-- SELECT name, category, services, free_services, city, status FROM hospital_partners ORDER BY created_at;