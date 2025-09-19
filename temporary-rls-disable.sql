-- Temporary RLS bypass for debugging
-- This will temporarily disable RLS to test if the core functionality works

-- Temporarily disable RLS on appointments table for testing
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;

-- Temporarily disable RLS on medical_reports table for testing  
ALTER TABLE medical_reports DISABLE ROW LEVEL SECURITY;

-- Note: This is ONLY for debugging. Re-enable RLS after confirming functionality works:
-- ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE medical_reports ENABLE ROW LEVEL SECURITY;