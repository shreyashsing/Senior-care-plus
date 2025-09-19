-- Comprehensive RLS Policy Fix for Custom Patient Authentication
-- This fixes both medical_reports and appointments tables to work with the custom patient auth system

-- Fix Medical Reports RLS Policies
ALTER TABLE medical_reports ENABLE ROW LEVEL SECURITY;

-- Drop existing medical reports policies
DROP POLICY IF EXISTS "Allow authenticated users to view medical reports" ON medical_reports;
DROP POLICY IF EXISTS "Allow authenticated users to insert medical reports" ON medical_reports;
DROP POLICY IF EXISTS "Allow authenticated users to update medical reports" ON medical_reports;

-- Create proper RLS policies for medical reports
CREATE POLICY "Allow patients to view their own medical reports" ON medical_reports
  FOR SELECT USING (
    patient_id IN (
      SELECT id FROM patients 
      WHERE phone_number = current_setting('app.current_phone', true) 
      OR senior_care_id = current_setting('app.current_senior_care_id', true)
    )
  );

CREATE POLICY "Allow patients to insert their own medical reports" ON medical_reports
  FOR INSERT WITH CHECK (
    patient_id IN (
      SELECT id FROM patients 
      WHERE phone_number = current_setting('app.current_phone', true) 
      OR senior_care_id = current_setting('app.current_senior_care_id', true)
    )
  );

CREATE POLICY "Allow patients to update their own medical reports" ON medical_reports
  FOR UPDATE USING (
    patient_id IN (
      SELECT id FROM patients 
      WHERE phone_number = current_setting('app.current_phone', true) 
      OR senior_care_id = current_setting('app.current_senior_care_id', true)
    )
  );

CREATE POLICY "Allow patients to delete their own medical reports" ON medical_reports
  FOR DELETE USING (
    patient_id IN (
      SELECT id FROM patients 
      WHERE phone_number = current_setting('app.current_phone', true) 
      OR senior_care_id = current_setting('app.current_senior_care_id', true)
    )
  );

-- Fix Appointments RLS Policies (in case they're not fixed yet)
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Drop existing appointments policies
DROP POLICY IF EXISTS "Allow authenticated users to view appointments" ON appointments;
DROP POLICY IF EXISTS "Allow authenticated users to insert appointments" ON appointments;
DROP POLICY IF EXISTS "Allow authenticated users to update appointments" ON appointments;

-- Create proper RLS policies for appointments
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

-- Helper function to get current patient ID (useful for debugging)
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

-- Helper function to debug current session
CREATE OR REPLACE FUNCTION debug_current_session()
RETURNS TEXT AS $$
BEGIN
    RETURN 'Phone: ' || current_setting('app.current_phone', true) || 
           ', Senior Care ID: ' || current_setting('app.current_senior_care_id', true) ||
           ', Patient ID: ' || COALESCE(get_current_patient_id()::TEXT, 'NULL');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;