-- QUICK FIX: Run this to fix the current RLS policy issue
-- This will allow public contact form submissions to work immediately

-- Drop the problematic policies
DROP POLICY IF EXISTS "Enable insert access for public" ON contacts;
DROP POLICY IF EXISTS "Enable read access for admins" ON contacts;
DROP POLICY IF EXISTS "Enable update access for admins" ON contacts;
DROP POLICY IF EXISTS "Enable delete access for admins" ON contacts;

-- Create working policies
CREATE POLICY "Public can insert contacts" ON contacts
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Authenticated can read contacts" ON contacts
  FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update contacts" ON contacts
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete contacts" ON contacts
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Ensure proper permissions
GRANT INSERT ON contacts TO anon;
GRANT ALL ON contacts TO authenticated;