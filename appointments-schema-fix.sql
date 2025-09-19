-- Fix appointments table to match the service implementation
-- Remove columns that don't exist in the actual database

-- Appointments table for booking system (minimal required columns)
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES partners(id) ON DELETE SET NULL,
  service_type VARCHAR(100) NOT NULL, -- 'general_consultation', 'home_visit', 'physiotherapy', 'nursing_care'
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'confirmed', 'completed', 'cancelled'
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Remove columns that don't exist in actual schema (this will not error if columns don't exist)
DO $$ 
BEGIN
    -- Remove address column if it exists
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'appointments' 
        AND column_name = 'address'
    ) THEN
        ALTER TABLE appointments DROP COLUMN address;
    END IF;
    
    -- Remove emergency_contact column if it exists
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'appointments' 
        AND column_name = 'emergency_contact'
    ) THEN
        ALTER TABLE appointments DROP COLUMN emergency_contact;
    END IF;
    
    -- Remove patient_notes column if it exists
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'appointments' 
        AND column_name = 'patient_notes'
    ) THEN
        ALTER TABLE appointments DROP COLUMN patient_notes;
    END IF;
END $$;

-- Ensure RLS is enabled
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to view appointments" ON appointments;
DROP POLICY IF EXISTS "Allow authenticated users to insert appointments" ON appointments;
DROP POLICY IF EXISTS "Allow authenticated users to update appointments" ON appointments;

-- Create proper RLS policies that work with the custom patient authentication system
-- These policies use the session variables set by set_current_patient() function

CREATE POLICY "Allow patients to view their own appointments" ON appointments
  FOR SELECT USING (
    patient_id IN (
      SELECT id FROM patients 
      WHERE phone_number = current_setting('app.current_phone', true) 
      OR senior_care_id = current_setting('app.current_senior_care_id', true)
    )
  );

CREATE POLICY "Allow patients to insert their own appointments" ON appointments
  FOR INSERT WITH CHECK (
    patient_id IN (
      SELECT id FROM patients 
      WHERE phone_number = current_setting('app.current_phone', true) 
      OR senior_care_id = current_setting('app.current_senior_care_id', true)
    )
  );

CREATE POLICY "Allow patients to update their own appointments" ON appointments
  FOR UPDATE USING (
    patient_id IN (
      SELECT id FROM patients 
      WHERE phone_number = current_setting('app.current_phone', true) 
      OR senior_care_id = current_setting('app.current_senior_care_id', true)
    )
  );

-- Also create a function to get current patient ID for easier use
CREATE OR REPLACE FUNCTION get_current_patient_id()
RETURNS UUID AS $$
DECLARE
    patient_uuid UUID;
BEGIN
    SELECT id INTO patient_uuid 
    FROM patients 
    WHERE phone_number = current_setting('app.current_phone', true) 
    OR senior_care_id = current_setting('app.current_senior_care_id', true)
    LIMIT 1;
    
    RETURN patient_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;