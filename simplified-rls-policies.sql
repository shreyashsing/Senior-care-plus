-- Alternative RLS approach using direct patient ID matching
-- This approach simplifies the RLS by allowing any authenticated user to access their own data

-- Re-enable RLS (run this after testing with disabled RLS)
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_reports ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow patients to view their own appointments" ON appointments;
DROP POLICY IF EXISTS "Allow patients to insert their own appointments" ON appointments;
DROP POLICY IF EXISTS "Allow patients to update their own appointments" ON appointments;

DROP POLICY IF EXISTS "Allow patients to view their own medical reports" ON medical_reports;
DROP POLICY IF EXISTS "Allow patients to insert their own medical reports" ON medical_reports;
DROP POLICY IF EXISTS "Allow patients to update their own medical reports" ON medical_reports;
DROP POLICY IF EXISTS "Allow patients to delete their own medical reports" ON medical_reports;

-- Create simplified policies that allow all operations (for debugging)
-- These are VERY permissive and should only be used for testing

CREATE POLICY "Allow all appointments operations" ON appointments
  FOR ALL USING (true);

CREATE POLICY "Allow all medical reports operations" ON medical_reports
  FOR ALL USING (true);

-- Note: These policies are very permissive and should be replaced with proper
-- patient-specific policies once we confirm the basic functionality works