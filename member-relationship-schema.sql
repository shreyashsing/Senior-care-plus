-- Database Schema Update for Primary + Co-Member System
-- This SQL file updates the database to support the new pricing structure where:
-- Each plan (Basic/Advance/Premium) includes 1 primary member + 2 co-members
-- All members get individual IDs and E-cards but are linked under one plan
-- Run this in your Supabase SQL Editor

-- 1. Add new columns to patients table for member relationships
ALTER TABLE patients 
ADD COLUMN IF NOT EXISTS member_type TEXT DEFAULT 'primary' CHECK (member_type IN ('primary', 'co-member')),
ADD COLUMN IF NOT EXISTS primary_member_id UUID REFERENCES patients(id),
ADD COLUMN IF NOT EXISTS family_group_id UUID DEFAULT gen_random_uuid();

-- 2. Update care_plans table to support new plan types
ALTER TABLE care_plans 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS tier TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS cost_per_month INTEGER,
ADD COLUMN IF NOT EXISTS services TEXT[],
ADD COLUMN IF NOT EXISTS end_date DATE;

-- 3. Update existing care_plans to match new pricing structure
UPDATE care_plans 
SET name = CASE 
        WHEN plan_type = 'single' THEN 'Basic Care Plan'
        WHEN plan_type = 'couple' THEN 'Advance Care Plan'  
        ELSE 'Premium Care Plan'
    END,
    tier = CASE 
        WHEN price <= 5000 THEN 'Basic'
        WHEN price <= 10000 THEN 'Advance'
        ELSE 'Premium'
    END,
    status = 'active',
    cost_per_month = price,
    services = CASE
        WHEN plan_type = 'single' THEN ARRAY['health_monitoring', 'emergency_assistance']
        WHEN plan_type = 'couple' THEN ARRAY['health_monitoring', 'emergency_assistance', 'family_care']
        ELSE ARRAY['premium_care', 'health_monitoring', 'emergency_assistance']
    END,
    end_date = CURRENT_DATE + INTERVAL '1 year'
WHERE name IS NULL;

-- 4. Create indexes for better performance on new columns
CREATE INDEX IF NOT EXISTS idx_patients_member_type ON patients(member_type);
CREATE INDEX IF NOT EXISTS idx_patients_primary_member_id ON patients(primary_member_id);
CREATE INDEX IF NOT EXISTS idx_patients_family_group_id ON patients(family_group_id);

-- 5. Create function to link co-members to primary member
CREATE OR REPLACE FUNCTION link_co_members_to_primary(
    primary_patient_id UUID,
    co_member_ids UUID[]
) RETURNS void AS $$
DECLARE
    co_member_id UUID;
    primary_family_group UUID;
BEGIN
    -- Get the primary member's family group ID
    SELECT family_group_id INTO primary_family_group 
    FROM patients 
    WHERE id = primary_patient_id;
    
    -- Update each co-member to link to primary member
    FOREACH co_member_id IN ARRAY co_member_ids
    LOOP
        UPDATE patients 
        SET 
            member_type = 'co-member',
            primary_member_id = primary_patient_id,
            family_group_id = primary_family_group,
            plan_id = (SELECT plan_id FROM patients WHERE id = primary_patient_id)
        WHERE id = co_member_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create function to get family members
CREATE OR REPLACE FUNCTION get_family_members(patient_id UUID)
RETURNS TABLE (
    id UUID,
    name TEXT,
    senior_care_id TEXT,
    member_type TEXT,
    date_of_birth DATE,
    phone_number TEXT,
    is_current_user BOOLEAN
) AS $$
DECLARE
    target_family_group UUID;
    target_primary_id UUID;
BEGIN
    -- Get family group and primary member info for the given patient
    SELECT family_group_id, 
           CASE WHEN member_type = 'primary' THEN patients.id ELSE primary_member_id END
    INTO target_family_group, target_primary_id
    FROM patients 
    WHERE patients.id = patient_id;
    
    -- Return all family members (primary + co-members)
    RETURN QUERY 
    SELECT 
        p.id,
        p.name,
        p.senior_care_id,
        p.member_type,
        p.date_of_birth,
        p.phone_number,
        p.id = patient_id as is_current_user
    FROM patients p
    WHERE p.family_group_id = target_family_group
    ORDER BY 
        CASE WHEN p.member_type = 'primary' THEN 0 ELSE 1 END,
        p.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Update RLS policies to handle family relationships
DROP POLICY IF EXISTS "Patients can view their own records" ON patients;
DROP POLICY IF EXISTS "Patients can update their own records" ON patients;

-- Allow patients to view their own records AND their family members' records
CREATE POLICY "Patients can view family records" 
ON patients FOR SELECT 
TO authenticated 
USING (
    phone_number = current_setting('app.current_phone', true) OR
    senior_care_id = current_setting('app.current_senior_care_id', true) OR
    family_group_id IN (
        SELECT family_group_id FROM patients 
        WHERE phone_number = current_setting('app.current_phone', true) 
           OR senior_care_id = current_setting('app.current_senior_care_id', true)
    )
);

-- Allow patients to update their own records (not family members')
CREATE POLICY "Patients can update own records only" 
ON patients FOR UPDATE 
TO authenticated 
USING (
    phone_number = current_setting('app.current_phone', true) OR
    senior_care_id = current_setting('app.current_senior_care_id', true)
);

-- 8. Update the authentication function to handle family relationships
CREATE OR REPLACE FUNCTION authenticate_patient_with_family(
    identifier TEXT, -- phone number or senior care id
    dob DATE
) RETURNS TABLE (
    patient_id UUID,
    senior_care_id TEXT,
    name TEXT,
    phone_number TEXT,
    member_type TEXT,
    primary_member_name TEXT,
    family_members_count INTEGER,
    auth_token TEXT
) AS $$
DECLARE
    patient_record RECORD;
    auth_token_value TEXT;
    primary_name TEXT;
    family_count INTEGER;
BEGIN
    -- Try to find patient by phone number or senior care id
    SELECT * INTO patient_record
    FROM patients 
    WHERE (patients.phone_number = identifier OR patients.senior_care_id = identifier)
    AND patients.date_of_birth = dob;
    
    IF patient_record.id IS NULL THEN
        RAISE EXCEPTION 'Invalid credentials';
    END IF;
    
    -- Get primary member name if this is a co-member
    IF patient_record.member_type = 'co-member' THEN
        SELECT name INTO primary_name
        FROM patients 
        WHERE id = patient_record.primary_member_id;
    ELSE
        primary_name := patient_record.name;
    END IF;
    
    -- Count family members
    SELECT COUNT(*) INTO family_count
    FROM patients 
    WHERE family_group_id = patient_record.family_group_id;
    
    -- Generate auth token
    auth_token_value := encode(digest(patient_record.id::text || now()::text, 'sha256'), 'hex');
    
    -- Return patient info with family context
    RETURN QUERY SELECT 
        patient_record.id,
        patient_record.senior_care_id,
        patient_record.name,
        patient_record.phone_number,
        patient_record.member_type,
        primary_name,
        family_count,
        auth_token_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Create function to get dashboard info with family context
CREATE OR REPLACE FUNCTION get_patient_dashboard_info(patient_id UUID)
RETURNS TABLE (
    patient_info JSONB,
    family_members JSONB,
    care_plan_info JSONB
) AS $$
DECLARE
    patient_data JSONB;
    family_data JSONB;
    plan_data JSONB;
BEGIN
    -- Get patient basic info
    SELECT to_jsonb(p.*) INTO patient_data
    FROM patients p
    WHERE p.id = patient_id;
    
    -- Get family members
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', fm.id,
            'name', fm.name,
            'senior_care_id', fm.senior_care_id,
            'member_type', fm.member_type,
            'is_current_user', fm.is_current_user
        )
    ) INTO family_data
    FROM get_family_members(patient_id) fm;
    
    -- Get care plan info
    SELECT to_jsonb(cp.*) INTO plan_data
    FROM care_plans cp
    JOIN patients p ON p.plan_id = cp.id
    WHERE p.id = patient_id;
    
    RETURN QUERY SELECT patient_data, family_data, plan_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Add sample data for testing the new structure (optional)
/*
-- Sample new care plan for Basic tier
INSERT INTO care_plans (plan_type, name, tier, duration, price, cost_per_month, status, services, end_date) 
VALUES (
    'family', 
    'Basic Care Plan', 
    'Basic', 
    '12', 
    5000, 
    5000, 
    'active',
    ARRAY['health_monitoring', 'emergency_assistance', 'family_care'],
    CURRENT_DATE + INTERVAL '1 year'
);
*/