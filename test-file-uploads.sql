-- Test script to verify file uploads are working
-- Run this query in Supabase SQL Editor to check uploaded files

-- Check if the patient-documents bucket exists
SELECT 
    id,
    name,
    public,
    created_at
FROM storage.buckets 
WHERE id = 'patient-documents';

-- Check storage policies for patient-documents
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects' 
AND policyname LIKE '%patient%'
ORDER BY policyname;

-- Check recent uploads to patient-documents bucket (last 24 hours)
SELECT 
    id,
    name,
    bucket_id,
    created_at,
    updated_at,
    metadata->>'size' as file_size_bytes,
    metadata->>'mimetype' as content_type,
    CASE 
        WHEN name LIKE '%photo%' THEN 'Photo'
        WHEN name LIKE '%discharge%' THEN 'Discharge Card'
        WHEN name LIKE '%prescription%' THEN 'Prescription'
        WHEN name LIKE '%surgery%' THEN 'Surgery Document'
        WHEN name LIKE '%policy%' THEN 'Policy Card'
        ELSE 'Other'
    END as document_type
FROM storage.objects 
WHERE bucket_id = 'patient-documents' 
AND created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- Count files by document type
SELECT 
    CASE 
        WHEN name LIKE '%photo%' THEN 'Photo'
        WHEN name LIKE '%discharge%' THEN 'Discharge Card'
        WHEN name LIKE '%prescription%' THEN 'Prescription'
        WHEN name LIKE '%surgery%' THEN 'Surgery Document'
        WHEN name LIKE '%policy%' THEN 'Policy Card'
        ELSE 'Other'
    END as document_type,
    COUNT(*) as count,
    SUM((metadata->>'size')::bigint) as total_size_bytes
FROM storage.objects 
WHERE bucket_id = 'patient-documents'
GROUP BY document_type
ORDER BY count DESC;

-- Check recent patient registrations with their file counts
WITH patient_files AS (
    SELECT 
        SUBSTRING(name FROM '^SC\d{11}') as senior_care_id,
        COUNT(*) as file_count,
        MAX(created_at) as last_upload
    FROM storage.objects 
    WHERE bucket_id = 'patient-documents' 
    AND created_at >= NOW() - INTERVAL '24 hours'
    GROUP BY SUBSTRING(name FROM '^SC\d{11}')
)
SELECT 
    p.senior_care_id,
    p.name as patient_name,
    p.member_type,
    p.created_at as registration_time,
    COALESCE(pf.file_count, 0) as uploaded_files,
    pf.last_upload
FROM patients p
LEFT JOIN patient_files pf ON p.senior_care_id = pf.senior_care_id
WHERE p.created_at >= NOW() - INTERVAL '24 hours'
ORDER BY p.created_at DESC;