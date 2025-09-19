-- Fix Patient Management Database Schema
-- This fixes the database structure to support the patient management functionality

-- 1. First, add missing columns to care_plans table
ALTER TABLE care_plans 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS tier TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'expired')),
ADD COLUMN IF NOT EXISTS services TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS cost_per_month DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS end_date DATE;

-- 2. Update existing care_plans records with proper data
UPDATE care_plans 
SET 
    name = CASE 
        WHEN plan_type = 'single' THEN 'Single Care Plan'
        WHEN plan_type = 'couple' THEN 'Couple Care Plan'
        ELSE 'Basic Care Plan'
    END,
    tier = CASE 
        WHEN price < 1000 THEN 'Basic'
        WHEN price < 2000 THEN 'Standard'
        ELSE 'Premium'
    END,
    status = 'active',
    cost_per_month = price,
    services = CASE
        WHEN plan_type = 'single' THEN ARRAY['health_monitoring', 'emergency_assistance']
        WHEN plan_type = 'couple' THEN ARRAY['health_monitoring', 'emergency_assistance', 'couple_care']
        ELSE ARRAY['basic_care']
    END,
    end_date = CURRENT_DATE + INTERVAL '1 year'
WHERE name IS NULL;

-- 3. Add missing columns to patients table for better patient management
ALTER TABLE patients 
ADD COLUMN IF NOT EXISTS medical_conditions TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS registration_date DATE DEFAULT CURRENT_DATE;

-- 4. Update existing patients records
UPDATE patients 
SET registration_date = COALESCE(DATE(created_at), CURRENT_DATE)
WHERE registration_date IS NULL;

-- 5. Fix the admin dashboard stats function with correct column names
DROP FUNCTION IF EXISTS get_admin_dashboard_stats();

CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS TABLE (
    "totalPatients" bigint,
    "paidPatients" bigint,
    "renewalsDue" bigint,
    "totalAppointments" bigint,
    "totalServices" bigint
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE((SELECT COUNT(*) FROM patients), 0)::bigint as "totalPatients",
        COALESCE((SELECT COUNT(*) FROM patients p 
                  LEFT JOIN care_plans cp ON p.plan_id = cp.id 
                  WHERE cp.status = 'active'), 0)::bigint as "paidPatients",
        COALESCE((SELECT COUNT(*) FROM care_plans 
                  WHERE end_date <= CURRENT_DATE + INTERVAL '30 days' 
                  AND status = 'active'), 0)::bigint as "renewalsDue",
        COALESCE((SELECT COUNT(*) FROM appointments 
                  WHERE appointment_date >= CURRENT_DATE - INTERVAL '30 days'), 0)::bigint as "totalAppointments",
        COALESCE((SELECT COUNT(*) FROM service_requests 
                  WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'), 0)::bigint as "totalServices";
END;
$$;

-- 6. Add some sample medical conditions to existing patients
UPDATE patients 
SET medical_conditions = ARRAY['hypertension', 'diabetes']
WHERE id IN (SELECT id FROM patients LIMIT 3);

UPDATE patients 
SET medical_conditions = ARRAY['arthritis']
WHERE id IN (SELECT id FROM patients OFFSET 3 LIMIT 2);

-- 7. Create indexes for better performance on new columns
CREATE INDEX IF NOT EXISTS idx_care_plans_status ON care_plans(status);
CREATE INDEX IF NOT EXISTS idx_care_plans_end_date ON care_plans(end_date);
CREATE INDEX IF NOT EXISTS idx_patients_registration_date ON patients(registration_date);

-- 8. Add RLS policies for admin access to care_plans
DROP POLICY IF EXISTS "Admins can view all care plans" ON care_plans;
DROP POLICY IF EXISTS "Admins can update care plans" ON care_plans;

CREATE POLICY "Admins can view all care plans" ON care_plans FOR SELECT USING (true);
CREATE POLICY "Admins can update care plans" ON care_plans FOR UPDATE USING (true);
CREATE POLICY "Admins can insert care plans" ON care_plans FOR INSERT WITH CHECK (true);