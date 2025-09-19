-- Ensure patient-documents storage bucket exists and is properly configured
-- Run this in Supabase SQL Editor

-- Create the storage bucket if it doesn't exist
-- Note: This may need to be done through the Supabase Dashboard Storage section
-- as bucket creation via SQL might not be available in all Supabase versions

INSERT INTO storage.buckets (id, name, public)
VALUES ('patient-documents', 'patient-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Verify the bucket was created
SELECT * FROM storage.buckets WHERE id = 'patient-documents';

-- If the above INSERT doesn't work, you need to:
-- 1. Go to Supabase Dashboard > Storage
-- 2. Create a new bucket named: patient-documents
-- 3. Set it as Private (public = false)
-- 4. Then run the fix-storage-rls.sql file
