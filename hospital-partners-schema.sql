-- Hospital Partners Management Database Schema
-- This creates the comprehensive hospital partners table with services and individual discounts

-- Hospital Partners table with all required fields
CREATE TABLE IF NOT EXISTS hospital_partners (
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

-- Enable Row Level Security (commented out for development)
-- ALTER TABLE hospital_partners ENABLE ROW LEVEL SECURITY;

-- For development/testing, disable RLS to avoid authentication issues
ALTER TABLE hospital_partners DISABLE ROW LEVEL SECURITY;

-- RLS Policies (commented out - uncomment and modify for production)
-- Admin users can manage all hospital partners
-- CREATE POLICY "Admin can manage hospital partners" ON hospital_partners
--     FOR ALL USING (
--         EXISTS (
--             SELECT 1 FROM admin_users 
--             WHERE id = auth.uid()::uuid 
--             AND is_active = true
--         )
--     );

-- Read access for authenticated users (for selecting partners during appointments)
-- CREATE POLICY "Authenticated users can view active partners" ON hospital_partners
--     FOR SELECT USING (
--         status = 'active' AND auth.role() = 'authenticated'
--     );

-- Alternative simple policy for development (uncomment if needed)
-- CREATE POLICY "Allow all operations for development" ON hospital_partners
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
    ARRAY['395001', '395002', '395003', '395004', '395005', '395006', '395007', '395008'],
    'Dr. Rajesh Patel',
    '+91 9876543210',
    'rajesh.patel@apollo.com',
    'Dr. Priya Shah',
    '+91 9876543211'
),
(
    'Vision Care Eye Clinic',
    'Eye',
    '[
        {"service": "OPD", "discount": 25},
        {"service": "Home Service", "discount": 30},
        {"service": "Online", "discount": 15}
    ]'::jsonb,
    true,
    '456 Medical Street, Surat',
    'Surat',
    '395008',
    ARRAY['395007', '395008', '395009', '395010'],
    'Dr. Anjali Mehta',
    '+91 9876543212',
    'anjali@visioncare.com',
    'Dr. Vikram Joshi',
    '+91 9876543213'
),
(
    'PhysioFit Rehabilitation Center',
    'Physiotherapy',
    '[
        {"service": "OPD", "discount": 20},
        {"service": "Home Service", "discount": 25},
        {"service": "Offline", "discount": 18}
    ]'::jsonb,
    false,
    '789 Health Plaza, Surat',
    'Surat',
    '395009',
    ARRAY['395009', '395010', '395011', '395012'],
    'Physio. Kiran Sharma',
    '+91 9876543214',
    'kiran@physiofit.com',
    'Physio. Amit Kumar',
    '+91 9876543215'
) ON CONFLICT DO NOTHING;

-- Verify the table creation
SELECT 'Hospital partners table created successfully' as status;