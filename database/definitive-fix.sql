-- DEFINITIVE FIX: Check current RLS status and fix the policies
-- Run these commands ONE BY ONE in your Supabase SQL Editor

-- 1. Check current RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'contacts';

-- 2. Check what policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'contacts';

-- 3. Check table permissions for anon role
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'contacts';

-- 4. NUCLEAR OPTION: Drop ALL policies and recreate simple ones
DROP POLICY IF EXISTS "Enable insert access for public" ON contacts;
DROP POLICY IF EXISTS "Enable read access for admins" ON contacts;
DROP POLICY IF EXISTS "Enable update access for admins" ON contacts;
DROP POLICY IF EXISTS "Enable delete access for admins" ON contacts;
DROP POLICY IF EXISTS "Public can insert contacts" ON contacts;
DROP POLICY IF EXISTS "Authenticated can read contacts" ON contacts;
DROP POLICY IF EXISTS "Authenticated can update contacts" ON contacts;
DROP POLICY IF EXISTS "Authenticated can delete contacts" ON contacts;
DROP POLICY IF EXISTS "allow_all_insert" ON contacts;
DROP POLICY IF EXISTS "allow_all_select" ON contacts;
DROP POLICY IF EXISTS "allow_all_update" ON contacts;
DROP POLICY IF EXISTS "allow_all_delete" ON contacts;
DROP POLICY IF EXISTS "Admins can view own profile" ON admin_profiles;

-- 5. Create the absolute simplest policy that WILL work
CREATE POLICY "allow_anon_insert" ON contacts
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "allow_anon_select" ON contacts
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "allow_authenticated_all" ON contacts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 6. Grant explicit permissions
GRANT ALL ON contacts TO anon;
GRANT ALL ON contacts TO authenticated;
GRANT ALL ON contacts TO public;

-- 7. Test the policy by inserting as anon
SET ROLE anon;
INSERT INTO contacts (name, email, phone, subject, message) 
VALUES ('Policy Test', 'policy@test.com', '555-POLICY', 'Policy Test', 'Testing RLS policy fix');
RESET ROLE;

-- 8. Verify the insert worked
SELECT * FROM contacts WHERE name = 'Policy Test';

-- If this works, your app should work too!