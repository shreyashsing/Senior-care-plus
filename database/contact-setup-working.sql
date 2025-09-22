-- Contact Form Database Setup (Working Version)
-- Run these commands in your Supabase SQL editor
-- This version is tested to work with public form submissions

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

-- Drop all existing policies first
DROP POLICY IF EXISTS "Enable insert access for public" ON contacts;
DROP POLICY IF EXISTS "Enable read access for admins" ON contacts;
DROP POLICY IF EXISTS "Enable update access for admins" ON contacts;
DROP POLICY IF EXISTS "Enable delete access for admins" ON contacts;
DROP POLICY IF EXISTS "Public can insert contacts" ON contacts;
DROP POLICY IF EXISTS "Authenticated can read contacts" ON contacts;
DROP POLICY IF EXISTS "Authenticated can update contacts" ON contacts;
DROP POLICY IF EXISTS "Authenticated can delete contacts" ON contacts;

-- Create simple, working RLS policies
-- 1. Allow anyone to insert (for contact form submissions)
CREATE POLICY "Public can insert contacts" ON contacts
  FOR INSERT 
  WITH CHECK (true);

-- 2. Allow authenticated users to read contacts (admin check in app)
CREATE POLICY "Authenticated can read contacts" ON contacts
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- 3. Allow authenticated users to update contacts (admin check in app)
CREATE POLICY "Authenticated can update contacts" ON contacts
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- 4. Allow authenticated users to delete contacts (admin check in app)
CREATE POLICY "Authenticated can delete contacts" ON contacts
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Grant proper permissions
GRANT INSERT ON contacts TO anon;
GRANT ALL ON contacts TO authenticated;

-- Insert some sample data for testing (optional)
INSERT INTO contacts (name, email, phone, subject, message, status) VALUES
('John Doe', 'john.doe@example.com', '+1-555-123-4567', 'General Inquiry', 'I would like to know more about your services for my elderly father.', 'new'),
('Mary Smith', 'mary.smith@example.com', '+1-555-987-6543', 'Service Information', 'Can you provide details about home care services and pricing?', 'in_progress'),
('Robert Johnson', 'robert.j@example.com', '+1-555-456-7890', 'Emergency Support', 'My mother needs immediate assistance. Please contact me urgently.', 'resolved');

-- Verify table creation and policies
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'contacts' 
ORDER BY ordinal_position;

-- Check policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'contacts';

-- Test insert as anonymous user (this should work)
-- You can test this by running: INSERT INTO contacts (name, email, phone, subject, message) VALUES ('Test User', 'test@example.com', '555-0123', 'Test', 'This is a test message.');