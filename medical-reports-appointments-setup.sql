-- Medical Reports table for storing patient documents
CREATE TABLE IF NOT EXISTS medical_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- RLS policies for medical reports
ALTER TABLE medical_reports ENABLE ROW LEVEL SECURITY;

-- Patients can only see their own reports
CREATE POLICY "Patients can view own medical reports" ON medical_reports
  FOR SELECT USING (auth.uid()::text = patient_id::text);

-- Patients can insert their own reports
CREATE POLICY "Patients can upload own medical reports" ON medical_reports
  FOR INSERT WITH CHECK (auth.uid()::text = patient_id::text);

-- Patients can update their own reports
CREATE POLICY "Patients can update own medical reports" ON medical_reports
  FOR UPDATE USING (auth.uid()::text = patient_id::text);

-- Patients can delete their own reports
CREATE POLICY "Patients can delete own medical reports" ON medical_reports
  FOR DELETE USING (auth.uid()::text = patient_id::text);

-- Admin access to all medical reports
CREATE POLICY "Admins can manage all medical reports" ON medical_reports
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Appointments table for booking system
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- RLS policies for appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Patients can view their own appointments
CREATE POLICY "Patients can view own appointments" ON appointments
  FOR SELECT USING (auth.uid()::text = patient_id::text);

-- Patients can create their own appointments
CREATE POLICY "Patients can create own appointments" ON appointments
  FOR INSERT WITH CHECK (auth.uid()::text = patient_id::text);

-- Patients can update their own appointments
CREATE POLICY "Patients can update own appointments" ON appointments
  FOR UPDATE USING (auth.uid()::text = patient_id::text);

-- Admin access to all appointments
CREATE POLICY "Admins can manage all appointments" ON appointments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Partners can view and update their assigned appointments
CREATE POLICY "Partners can manage assigned appointments" ON appointments
  FOR ALL USING (
    partner_id IN (
      SELECT id FROM partners 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

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
    p.phone as partner_phone
  FROM appointments a
  LEFT JOIN partners p ON a.partner_id = p.id
  WHERE a.patient_id = p_patient_id
  ORDER BY a.appointment_date DESC, a.appointment_time DESC;
END;
$$;