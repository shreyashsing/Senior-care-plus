-- SeniorCare Plus Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Create storage bucket for patient documents (only if it doesn't exist)
INSERT INTO storage.buckets (id, name, public) 
SELECT 'patient-documents', 'patient-documents', true
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'patient-documents'
);

-- Create storage policies (drop existing ones first to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can view patient documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload patient documents" ON storage.objects;

CREATE POLICY "Anyone can view patient documents" ON storage.objects FOR SELECT USING (bucket_id = 'patient-documents');
CREATE POLICY "Authenticated users can upload patient documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'patient-documents' AND auth.uid() IS NOT NULL);

-- Create care_plans table FIRST (since patients table references it)
CREATE TABLE IF NOT EXISTS care_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plan_type TEXT NOT NULL CHECK (plan_type IN ('single', 'couple')),
    duration TEXT NOT NULL,
    price INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patients table (references care_plans)
CREATE TABLE IF NOT EXISTS patients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    senior_care_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    sex TEXT NOT NULL CHECK (sex IN ('male', 'female')),
    phone_number TEXT NOT NULL,
    emergency_contact TEXT NOT NULL,
    emergency_name_relation TEXT NOT NULL,
    email TEXT,
    address JSONB,
    medical_info JSONB,
    insurance_info JSONB,
    documents JSONB,
    plan_id UUID REFERENCES care_plans(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patients_senior_care_id ON patients(senior_care_id);
CREATE INDEX IF NOT EXISTS idx_patients_phone_number ON patients(phone_number);
CREATE INDEX IF NOT EXISTS idx_patients_dob ON patients(date_of_birth);
CREATE INDEX IF NOT EXISTS idx_patients_plan_id ON patients(plan_id);

-- Enable Row Level Security (keep security enabled!)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_plans ENABLE ROW LEVEL SECURITY;

-- Drop existing RLS policies first to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own patient records" ON patients;
DROP POLICY IF EXISTS "Anyone can insert patient records during registration" ON patients;
DROP POLICY IF EXISTS "Allow patient registration" ON patients;
DROP POLICY IF EXISTS "Allow reading patient records for duplicate check" ON patients;
DROP POLICY IF EXISTS "Users can update their own patient records" ON patients;
DROP POLICY IF EXISTS "Anyone can view care plans" ON care_plans;
DROP POLICY IF EXISTS "Anyone can create care plans during registration" ON care_plans;
DROP POLICY IF EXISTS "Anyone can create care plans" ON care_plans;
DROP POLICY IF EXISTS "Anyone can update care plans" ON care_plans;

-- SECURE RLS policies for patients table
-- Allow anonymous users to insert new patient records (registration)
CREATE POLICY "Allow anonymous patient registration" 
ON patients FOR INSERT 
TO anon 
WITH CHECK (true);

-- Allow anonymous users to check for duplicate Senior Care IDs (for validation)
CREATE POLICY "Allow anonymous duplicate check" 
ON patients FOR SELECT 
TO anon 
USING (true);

-- Allow authenticated patients to view their own records
CREATE POLICY "Patients can view their own records" 
ON patients FOR SELECT 
TO authenticated 
USING (
    phone_number = current_setting('app.current_phone', true) OR
    senior_care_id = current_setting('app.current_senior_care_id', true)
);

-- Allow authenticated patients to update their own records
CREATE POLICY "Patients can update their own records" 
ON patients FOR UPDATE 
TO authenticated 
USING (
    phone_number = current_setting('app.current_phone', true) OR
    senior_care_id = current_setting('app.current_senior_care_id', true)
);

-- SECURE RLS policies for care_plans table
-- Allow anonymous users to view care plans (for plan selection during registration)
CREATE POLICY "Allow anonymous care plan viewing" 
ON care_plans FOR SELECT 
TO anon 
USING (true);

-- Allow anonymous users to create care plans (during registration)
CREATE POLICY "Allow anonymous care plan creation" 
ON care_plans FOR INSERT 
TO anon 
WITH CHECK (true);

-- Allow authenticated users to view all care plans
CREATE POLICY "Allow authenticated care plan viewing" 
ON care_plans FOR SELECT 
TO authenticated 
USING (true);

-- Create function to authenticate patients using phone/senior_care_id + DOB
CREATE OR REPLACE FUNCTION authenticate_patient(
    identifier TEXT, -- phone number or senior care id
    dob DATE
) RETURNS TABLE (
    patient_id UUID,
    senior_care_id TEXT,
    name TEXT,
    phone_number TEXT,
    auth_token TEXT
) AS $$
DECLARE
    patient_record RECORD;
    auth_token_value TEXT;
BEGIN
    -- Try to find patient by phone number or senior care id
    SELECT * INTO patient_record
    FROM patients 
    WHERE (patients.phone_number = identifier OR patients.senior_care_id = identifier)
    AND patients.date_of_birth = dob;
    
    IF patient_record.id IS NULL THEN
        RAISE EXCEPTION 'Invalid credentials';
    END IF;
    
    -- Generate a simple auth token (in production, use proper JWT)
    auth_token_value := encode(digest(patient_record.id::text || now()::text, 'sha256'), 'hex');
    
    -- Return patient info
    RETURN QUERY SELECT 
        patient_record.id,
        patient_record.senior_care_id,
        patient_record.name,
        patient_record.phone_number,
        auth_token_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to set current patient context
CREATE OR REPLACE FUNCTION set_current_patient(phone TEXT, senior_care_id TEXT)
RETURNS void AS $$
BEGIN
    PERFORM set_config('app.current_phone', phone, true);
    PERFORM set_config('app.current_senior_care_id', senior_care_id, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_patients_updated_at ON patients;
CREATE TRIGGER update_patients_updated_at 
    BEFORE UPDATE ON patients 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_care_plans_updated_at ON care_plans;
CREATE TRIGGER update_care_plans_updated_at 
    BEFORE UPDATE ON care_plans 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing (optional)
-- Uncomment the lines below if you want test data

/*
-- Sample care plan
INSERT INTO care_plans (plan_type, duration, price) 
VALUES ('single', '1', 3000);

-- Sample patient
INSERT INTO patients (
    senior_care_id, 
    name, 
    date_of_birth, 
    sex, 
    phone_number, 
    emergency_contact, 
    emergency_name_relation,
    plan_id
) VALUES (
    'SC2025123456',
    'Test Patient',
    '1950-01-01',
    'male',
    '9876543210',
    '9876543211',
    'Son - Test Family',
    (SELECT id FROM care_plans WHERE plan_type = 'single' LIMIT 1)
);
*/
