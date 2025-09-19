-- Alternative: Store files as base64 in database (temporary solution)
-- This bypasses storage RLS issues but has size limitations

-- Add a file_data column to medical_reports to store base64 data
ALTER TABLE medical_reports 
ADD COLUMN IF NOT EXISTS file_data TEXT;

-- Update the table to indicate if file is stored in storage or database
ALTER TABLE medical_reports 
ADD COLUMN IF NOT EXISTS storage_type VARCHAR(20) DEFAULT 'database' CHECK (storage_type IN ('storage', 'database'));