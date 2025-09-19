-- Admin Portal Database Schema
-- This extends the existing healthcare database with admin-specific tables

-- Admin Users table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin', 'manager')),
    permissions TEXT[] DEFAULT ARRAY['read'],
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hospital Partners table
CREATE TABLE IF NOT EXISTS partners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(100) NOT NULL, -- 'Multi-specialty Hospital', 'Healthcare Network', etc.
    location TEXT NOT NULL,
    contact_phone VARCHAR(15),
    contact_email VARCHAR(255),
    services TEXT[] DEFAULT ARRAY[]::TEXT[], -- Array of services offered
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    joined_date DATE DEFAULT CURRENT_DATE,
    address JSONB, -- Store full address as JSON
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service Requests table (extends existing functionality)
CREATE TABLE IF NOT EXISTS service_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    partner_id UUID REFERENCES partners(id) ON DELETE SET NULL,
    service_type VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'in_progress', 'completed', 'cancelled')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    description TEXT,
    scheduled_date TIMESTAMPTZ,
    completed_date TIMESTAMPTZ,
    notes TEXT,
    cost DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    partner_id UUID REFERENCES partners(id) ON DELETE SET NULL,
    service_type VARCHAR(100) NOT NULL,
    doctor_name VARCHAR(100),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin Activity Logs table
CREATE TABLE IF NOT EXISTS admin_activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL, -- 'patient', 'service_request', 'appointment', etc.
    resource_id UUID,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_service_requests_patient_id ON service_requests(patient_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_partner_id ON service_requests(partner_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_created_at ON service_requests(created_at);

CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_partner_id ON appointments(partner_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

CREATE INDEX IF NOT EXISTS idx_partners_status ON partners(status);
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_admin_id ON admin_activity_logs(admin_id);

-- RLS Policies for Admin Tables

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Admin Users policies
CREATE POLICY "Admin users can read all admin users" ON admin_users
    FOR SELECT USING (auth.jwt() ->> 'role' = 'authenticated');

CREATE POLICY "Super admins can manage admin users" ON admin_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = (auth.jwt() ->> 'sub')::uuid 
            AND role = 'super_admin'
        )
    );

-- Partners policies
CREATE POLICY "Admins can read all partners" ON partners
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = (auth.jwt() ->> 'sub')::uuid 
            AND is_active = true
        )
    );

CREATE POLICY "Admins can manage partners" ON partners
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = (auth.jwt() ->> 'sub')::uuid 
            AND is_active = true
            AND 'write' = ANY(permissions)
        )
    );

-- Service Requests policies
CREATE POLICY "Admins can read all service requests" ON service_requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = (auth.jwt() ->> 'sub')::uuid 
            AND is_active = true
        )
    );

CREATE POLICY "Admins can manage service requests" ON service_requests
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = (auth.jwt() ->> 'sub')::uuid 
            AND is_active = true
            AND 'write' = ANY(permissions)
        )
    );

-- Appointments policies
CREATE POLICY "Admins can read all appointments" ON appointments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = (auth.jwt() ->> 'sub')::uuid 
            AND is_active = true
        )
    );

CREATE POLICY "Admins can manage appointments" ON appointments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = (auth.jwt() ->> 'sub')::uuid 
            AND is_active = true
            AND 'write' = ANY(permissions)
        )
    );

-- Admin Activity Logs policies
CREATE POLICY "Admins can read activity logs" ON admin_activity_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = (auth.jwt() ->> 'sub')::uuid 
            AND is_active = true
        )
    );

CREATE POLICY "System can insert activity logs" ON admin_activity_logs
    FOR INSERT WITH CHECK (true);

-- Functions for admin authentication
CREATE OR REPLACE FUNCTION authenticate_admin(username_input TEXT, password_input TEXT)
RETURNS JSONB AS $$
DECLARE
    admin_record admin_users%ROWTYPE;
    result JSONB;
BEGIN
    -- Find admin user by username
    SELECT * INTO admin_record
    FROM admin_users
    WHERE username = username_input
    AND is_active = true;

    -- Check if user exists and password matches (you should use proper password hashing)
    IF admin_record.id IS NOT NULL AND 
       crypt(password_input, admin_record.password_hash) = admin_record.password_hash THEN
        
        -- Update last login
        UPDATE admin_users 
        SET last_login = NOW(), updated_at = NOW()
        WHERE id = admin_record.id;

        -- Return admin data (excluding password)
        result := jsonb_build_object(
            'id', admin_record.id,
            'username', admin_record.username,
            'email', admin_record.email,
            'name', admin_record.name,
            'role', admin_record.role,
            'permissions', admin_record.permissions,
            'last_login', admin_record.last_login
        );
        
        RETURN result;
    ELSE
        RETURN NULL;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get dashboard statistics
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS JSONB AS $$
DECLARE
    stats JSONB;
    total_customers INTEGER;
    paid_customers INTEGER;
    renewals_due INTEGER;
    total_appointments INTEGER;
    total_services INTEGER;
BEGIN
    -- Get total customers
    SELECT COUNT(*) INTO total_customers FROM patients;
    
    -- Get paid customers (those with active care plans)
    SELECT COUNT(DISTINCT patient_id) INTO paid_customers 
    FROM care_plans 
    WHERE status = 'active';
    
    -- Get renewals due in next 30 days
    SELECT COUNT(*) INTO renewals_due
    FROM care_plans
    WHERE status = 'active'
    AND end_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '30 days');
    
    -- Get total appointments
    SELECT COUNT(*) INTO total_appointments FROM appointments;
    
    -- Get total services delivered
    SELECT COUNT(*) INTO total_services 
    FROM service_requests 
    WHERE status = 'completed';
    
    stats := jsonb_build_object(
        'totalCustomers', total_customers,
        'paidCustomers', paid_customers,
        'renewalsDue', renewals_due,
        'totalAppointments', total_appointments,
        'totalServices', total_services
    );
    
    RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get services per partner
CREATE OR REPLACE FUNCTION get_services_per_partner()
RETURNS TABLE(partner_name TEXT, services_count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.name::TEXT,
        COUNT(sr.id)
    FROM partners p
    LEFT JOIN service_requests sr ON p.id = sr.partner_id
    WHERE sr.status = 'completed'
    GROUP BY p.id, p.name
    ORDER BY COUNT(sr.id) DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (username, email, password_hash, name, role, permissions)
VALUES (
    'admin',
    'admin@seniorcare.com',
    crypt('admin123', gen_salt('bf')),
    'System Administrator',
    'super_admin',
    ARRAY['read', 'write', 'delete', 'manage_users', 'view_reports']
) ON CONFLICT (username) DO NOTHING;

-- Insert some sample partners
INSERT INTO partners (name, type, location, contact_phone, contact_email, services, status) VALUES
('Apollo Hospital', 'Multi-specialty Hospital', 'Delhi, Mumbai, Chennai', '+91-9876543210', 'contact@apollo.com', 
 ARRAY['Emergency Care', 'Cardiology', 'Neurology', 'Orthopedics'], 'active'),
('Fortis Healthcare', 'Healthcare Network', 'Gurgaon, Noida, Bangalore', '+91-9876543211', 'info@fortis.com',
 ARRAY['Oncology', 'Kidney Care', 'Heart Care', 'Neurology'], 'active'),
('Max Healthcare', 'Super Specialty Hospital', 'Delhi NCR, Punjab', '+91-9876543212', 'contact@maxhealthcare.com',
 ARRAY['Cancer Care', 'Heart Care', 'Neurosciences', 'Orthopedics'], 'active')
ON CONFLICT DO NOTHING;