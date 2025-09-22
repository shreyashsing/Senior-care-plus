-- Contact Form Database Setup
-- Run these commands in your Supabase SQL editor

-- First, create an admin_profiles table if it doesn't exist (for better role management)
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on admin_profiles
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for admin_profiles (admins can read their own profile)
CREATE POLICY "Admins can view own profile" ON admin_profiles
  FOR SELECT USING (auth.uid() = id);

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
DROP POLICY IF EXISTS "Enable read access for admins" ON contacts;
DROP POLICY IF EXISTS "Enable update access for admins" ON contacts;
DROP POLICY IF EXISTS "Enable delete access for admins" ON contacts;

-- Create RLS policies
-- 1. Allow public (anonymous) to insert (for contact form submissions)
CREATE POLICY "Enable insert access for public" ON contacts
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- 2. Allow admins to read all contacts
CREATE POLICY "Enable read access for admins" ON contacts
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE admin_profiles.id = auth.uid()
      AND admin_profiles.role = 'admin'
    )
  );

-- 3. Allow admins to update contact status
CREATE POLICY "Enable update access for admins" ON contacts
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE admin_profiles.id = auth.uid()
      AND admin_profiles.role = 'admin'
    )
  );

-- 4. Allow admins to delete contacts
CREATE POLICY "Enable delete access for admins" ON contacts
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE admin_profiles.id = auth.uid()
      AND admin_profiles.role = 'admin'
    )
  );

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

-- IMPORTANT: After running this script, you need to create an admin user
-- 1. Go to Supabase Auth > Users
-- 2. Create a new user with email and password
-- 3. Copy the user ID
-- 4. Run this command with the actual user ID and email:

-- INSERT INTO admin_profiles (id, email, role) VALUES 
-- ('YOUR_USER_ID_HERE', 'admin@example.com', 'admin');

-- Example:
-- INSERT INTO admin_profiles (id, email, role) VALUES 
-- ('12345678-1234-1234-1234-123456789abc', 'admin@yourcompany.com', 'admin');