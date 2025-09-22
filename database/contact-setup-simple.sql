-- Simple Contact Form Database Setup (Alternative)
-- Run these commands in your Supabase SQL editor
-- This version uses simpler RLS policies

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS contacts_updated_at_trigger ON contacts;
CREATE TRIGGER contacts_updated_at_trigger
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_contacts_updated_at();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);

-- Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable insert access for public" ON contacts;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON contacts;

-- Create simple RLS policies
-- 1. Allow public to insert (for contact form submissions)
CREATE POLICY "Enable insert access for public" ON contacts
  FOR INSERT WITH CHECK (true);

-- 2. Allow authenticated users full access (admin check will be done in application code)
CREATE POLICY "Enable all access for authenticated users" ON contacts
  FOR ALL USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT ALL ON contacts TO anon;
GRANT ALL ON contacts TO authenticated;

-- Insert some sample data for testing (optional)
INSERT INTO contacts (name, email, phone, subject, message, status) VALUES
('John Doe', 'john.doe@example.com', '+1-555-123-4567', 'General Inquiry', 'I would like to know more about your services for my elderly father.', 'new'),
('Mary Smith', 'mary.smith@example.com', '+1-555-987-6543', 'Service Information', 'Can you provide details about home care services and pricing?', 'in_progress'),
('Robert Johnson', 'robert.j@example.com', '+1-555-456-7890', 'Emergency Support', 'My mother needs immediate assistance. Please contact me urgently.', 'resolved');

-- Verify table creation
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'contacts' 
ORDER BY ordinal_position;

-- INSTRUCTIONS:
-- 1. This setup allows public users to submit contact forms
-- 2. Authenticated users can read/update/delete contacts
-- 3. Admin role checking is handled in the application code
-- 4. Make sure your admin users are properly authenticated in your app