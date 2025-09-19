-- Admin Portal Database Fixes
-- This file fixes the column reference and RLS policy issues

-- First, let's check what columns exist in the care_plans table
-- and fix the dashboard stats function

-- Drop the existing function first
DROP FUNCTION IF EXISTS get_admin_dashboard_stats();

-- Recreate the function with correct column references
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
    
    -- Get paid customers (patients who have a plan_id - meaning they have purchased a plan)
    SELECT COUNT(*) INTO paid_customers 
    FROM patients 
    WHERE plan_id IS NOT NULL;
    
    -- For renewals due, we need to add logic for plan duration
    -- Since we don't have end_date in care_plans, we'll count all active plans for now
    -- This can be enhanced later when you add subscription tracking
    SELECT COUNT(*) INTO renewals_due
    FROM patients p
    JOIN care_plans cp ON p.plan_id = cp.id
    WHERE p.plan_id IS NOT NULL;
    
    -- Get total appointments (will be 0 if table is empty)
    SELECT COALESCE(COUNT(*), 0) INTO total_appointments FROM appointments;
    
    -- Get total services delivered (will be 0 if table is empty)
    SELECT COALESCE(COUNT(*), 0) INTO total_services 
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

-- Fix RLS policies to avoid infinite recursion
-- Drop all existing RLS policies for admin tables
DROP POLICY IF EXISTS "Admin users can read all admin users" ON admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can read all partners" ON partners;
DROP POLICY IF EXISTS "Admins can manage partners" ON partners;
DROP POLICY IF EXISTS "Admins can read all service requests" ON service_requests;
DROP POLICY IF EXISTS "Admins can manage service requests" ON service_requests;
DROP POLICY IF EXISTS "Admins can read all appointments" ON appointments;
DROP POLICY IF EXISTS "Admins can manage appointments" ON appointments;
DROP POLICY IF EXISTS "Admins can read activity logs" ON admin_activity_logs;
DROP POLICY IF EXISTS "System can insert activity logs" ON admin_activity_logs;

-- Disable RLS temporarily to avoid recursion issues
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE partners DISABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs DISABLE ROW LEVEL SECURITY;

-- Create simpler policies without recursion
-- For admin_users table - allow all operations for now
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow admin operations" ON admin_users FOR ALL USING (true);

-- For partners table - allow all operations for authenticated users
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow partner operations" ON partners FOR ALL USING (auth.role() = 'authenticated');

-- For service_requests table - allow all operations for authenticated users
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow service request operations" ON service_requests FOR ALL USING (auth.role() = 'authenticated');

-- For appointments table - allow all operations for authenticated users
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow appointment operations" ON appointments FOR ALL USING (auth.role() = 'authenticated');

-- For admin_activity_logs table - allow all operations for authenticated users
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow activity log operations" ON admin_activity_logs FOR ALL USING (auth.role() = 'authenticated');

-- Alternative: If the above policies are still too restrictive, we can temporarily disable RLS
-- Uncomment the following lines if you still have issues:

-- ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE partners DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE service_requests DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE admin_activity_logs DISABLE ROW LEVEL SECURITY;

-- Update the authenticate_admin function to be simpler
DROP FUNCTION IF EXISTS authenticate_admin(TEXT, TEXT);

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

    -- Check if user exists and password matches
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

-- Create a simple version of services per partner function
DROP FUNCTION IF EXISTS get_services_per_partner();

CREATE OR REPLACE FUNCTION get_services_per_partner()
RETURNS TABLE(partner_name TEXT, services_count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(p.name, 'Unassigned')::TEXT,
        COUNT(sr.id)
    FROM service_requests sr
    LEFT JOIN partners p ON p.id = sr.partner_id
    WHERE sr.status = 'completed'
    GROUP BY p.id, p.name
    ORDER BY COUNT(sr.id) DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;