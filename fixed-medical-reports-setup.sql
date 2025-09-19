-- Fixed Medical Reports and Appointments Setup
-- This version fixes the user_id column error

-- Medical Reports table for storing patient documents
CREATE TABLE IF NOT EXISTS medical_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL, -- Supabase storage path
  file_size BIGINT NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  report_type VARCHAR(100) NOT NULL, -- 'lab_report', 'prescription', 'xray', 'mri', 'general'
  upload_date TIMESTAMP DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Appointments table for booking system
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES partners(id) ON DELETE SET NULL,
  service_type VARCHAR(100) NOT NULL, -- 'general_consultation', 'home_visit', 'physiotherapy', 'nursing_care'
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'confirmed', 'completed', 'cancelled'
  notes TEXT,
  patient_notes TEXT,
  emergency_contact VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on both tables
ALTER TABLE medical_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Simple RLS policies - allow all authenticated users for now
-- You can make these more restrictive later based on your auth setup

-- Medical Reports policies
CREATE POLICY "Allow authenticated users to view medical reports" ON medical_reports
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert medical reports" ON medical_reports
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update medical reports" ON medical_reports
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete medical reports" ON medical_reports
  FOR DELETE USING (auth.role() = 'authenticated');

-- Appointments policies
CREATE POLICY "Allow authenticated users to view appointments" ON appointments
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert appointments" ON appointments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update appointments" ON appointments
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete appointments" ON appointments
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_medical_reports_patient_id ON medical_reports(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_reports_upload_date ON medical_reports(upload_date DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_partner_id ON appointments(partner_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Function to get patient's medical reports
CREATE OR REPLACE FUNCTION get_patient_medical_reports(p_patient_id UUID)
RETURNS TABLE (
  id UUID,
  file_name VARCHAR,
  file_path VARCHAR,
  file_size BIGINT,
  file_type VARCHAR,
  report_type VARCHAR,
  upload_date TIMESTAMP,
  notes TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mr.id,
    mr.file_name,
    mr.file_path,
    mr.file_size,
    mr.file_type,
    mr.report_type,
    mr.upload_date,
    mr.notes
  FROM medical_reports mr
  WHERE mr.patient_id = p_patient_id
  ORDER BY mr.upload_date DESC;
END;
$$;

-- Function to get patient's appointments
CREATE OR REPLACE FUNCTION get_patient_appointments(p_patient_id UUID)
RETURNS TABLE (
  id UUID,
  service_type VARCHAR,
  appointment_date DATE,
  appointment_time TIME,
  status VARCHAR,
  notes TEXT,
  partner_name VARCHAR,
  partner_phone VARCHAR
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.service_type,
    a.appointment_date,
    a.appointment_time,
    a.status,
    a.notes,
    p.name as partner_name,
    p.contact_phone as partner_phone
  FROM appointments a
  LEFT JOIN partners p ON a.partner_id = p.id
  WHERE a.patient_id = p_patient_id
  ORDER BY a.appointment_date DESC, a.appointment_time DESC;
END;
$$;

-- Create storage bucket for medical reports (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public) 
SELECT 'medical-reports', 'medical-reports', false
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'medical-reports'
);

-- Storage policies for medical reports
DROP POLICY IF EXISTS "Authenticated users can view medical reports" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload medical reports" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete medical reports" ON storage.objects;

CREATE POLICY "Authenticated users can view medical reports" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'medical-reports' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can upload medical reports" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'medical-reports' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete medical reports" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'medical-reports' AND auth.role() = 'authenticated');

-- Test data insertion (optional)
SELECT 'Database setup completed successfully!' as status;
