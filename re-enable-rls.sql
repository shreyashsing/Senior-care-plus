-- Re-enable RLS policies now that we've fixed the real issue
-- The issue was the status constraint, not RLS

-- Re-enable RLS on both tables
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_reports ENABLE ROW LEVEL SECURITY;

-- Apply the proper RLS policies that work with patient authentication
-- Drop any existing policies first
DROP POLICY IF EXISTS "Allow all appointments operations" ON appointments;
DROP POLICY IF EXISTS "Allow all medical reports operations" ON medical_reports;

-- Appointments policies
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

-- Medical reports policies
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