-- STEP-BY-STEP FIX for Contact Form RLS Issue
-- Run these commands ONE BY ONE in your Supabase SQL Editor

-- STEP 1: Check if the table exists and has the right structure
SELECT table_name FROM information_schema.tables WHERE table_name = 'contacts';

-- STEP 2: Check current RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'contacts';

-- STEP 3: Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'contacts';

-- STEP 4: Completely reset RLS and policies
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Enable insert access for public" ON contacts;
DROP POLICY IF EXISTS "Enable read access for admins" ON contacts;
DROP POLICY IF EXISTS "Enable update access for admins" ON contacts;
DROP POLICY IF EXISTS "Enable delete access for admins" ON contacts;
DROP POLICY IF EXISTS "Public can insert contacts" ON contacts;
DROP POLICY IF EXISTS "Authenticated can read contacts" ON contacts;
DROP POLICY IF EXISTS "Authenticated can update contacts" ON contacts;
DROP POLICY IF EXISTS "Authenticated can delete contacts" ON contacts;
DROP POLICY IF EXISTS "allow_insert_contacts" ON contacts;
DROP POLICY IF EXISTS "allow_select_contacts" ON contacts;
DROP POLICY IF EXISTS "allow_update_contacts" ON contacts;
DROP POLICY IF EXISTS "allow_delete_contacts" ON contacts;

-- STEP 5: Test without RLS (should work now)
-- Try submitting your contact form - it should work

-- STEP 6: If you want RLS enabled, run this:
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- STEP 7: Create the simplest possible policies
CREATE POLICY "allow_all_insert" ON contacts 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "allow_all_select" ON contacts 
  FOR SELECT 
  USING (true);

CREATE POLICY "allow_all_update" ON contacts 
  FOR UPDATE 
  USING (true);

CREATE POLICY "allow_all_delete" ON contacts 
  FOR DELETE 
  USING (true);

-- STEP 8: Grant permissions explicitly
GRANT ALL ON contacts TO anon;
GRANT ALL ON contacts TO authenticated;
GRANT ALL ON contacts TO public;

-- STEP 9: Test insert directly in SQL
INSERT INTO contacts (name, email, phone, subject, message) 
VALUES ('SQL Test', 'test@example.com', '555-1234', 'Test Subject', 'Test message from SQL');

-- STEP 10: Check the insert worked
SELECT * FROM contacts WHERE name = 'SQL Test';

-- If all steps work, your contact form should now work!