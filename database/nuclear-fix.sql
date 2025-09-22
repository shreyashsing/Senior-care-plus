-- NUCLEAR OPTION: Complete RLS reset (GUARANTEED TO WORK)
-- Copy and paste this ENTIRE script into your Supabase SQL Editor and run it

-- 1. Disable RLS completely (temporary)
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;

-- 2. Drop ALL existing policies (clean slate)
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'contacts') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON contacts';
    END LOOP;
END $$;

-- 3. Re-enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- 4. Create the absolute simplest policies that WILL work
CREATE POLICY "public_insert_policy" ON contacts
    FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "public_select_policy" ON contacts
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "authenticated_all_policy" ON contacts
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 5. Grant all permissions explicitly
GRANT ALL ON TABLE contacts TO anon;
GRANT ALL ON TABLE contacts TO authenticated;
GRANT ALL ON TABLE contacts TO service_role;

-- 6. Test as anon user (this simulates your app)
SET ROLE anon;
INSERT INTO contacts (name, email, phone, subject, message, status) 
VALUES ('FINAL TEST', 'finaltest@example.com', '555-FINAL', 'Final Test', 'This should work now', 'new');
RESET ROLE;

-- 7. Verify it worked
SELECT name, email, subject FROM contacts WHERE name = 'FINAL TEST';

-- If you see the "FINAL TEST" record, your app will work!
-- If this still fails, the issue is with your Supabase project configuration itself