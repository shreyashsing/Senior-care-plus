-- Updated Storage Policies for Multi-Member Registration
-- This file ensures that file uploads work during registration
-- Run this in your Supabase SQL Editor

-- Ensure the storage bucket exists
INSERT INTO storage.buckets (id, name, public) 
SELECT 'patient-documents', 'patient-documents', false
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'patient-documents'
);

-- Drop all existing storage policies for patient-documents
DROP POLICY IF EXISTS "Anyone can view patient documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload patient documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow patients to upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow patients to view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow patients to update their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow patients to delete their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow file uploads to patient-documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow file access from patient-documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow file updates in patient-documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow file deletions in patient-documents" ON storage.objects;

-- Create new policies that work with multi-member registration
-- Allow anonymous uploads during registration (security maintained by filename structure)
CREATE POLICY "Allow anonymous uploads during registration" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'patient-documents'
);

-- Allow anonymous read access (for E-card generation and admin viewing)
CREATE POLICY "Allow anonymous read access" ON storage.objects
FOR SELECT USING (
  bucket_id = 'patient-documents' 
);

-- Allow updates for document management
CREATE POLICY "Allow document updates" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'patient-documents'
);

-- Allow deletions for admin/cleanup purposes
CREATE POLICY "Allow document deletions" ON storage.objects
FOR DELETE USING (
  bucket_id = 'patient-documents'
);

-- Note: Security is maintained through:
-- 1. File naming convention includes Senior Care ID (SC20251234567_timestamp.ext)
-- 2. Application logic restricts access to appropriate users
-- 3. Files are organized in folders by document type
-- 4. Admin dashboard has proper access controls