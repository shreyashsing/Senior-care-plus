-- DASHBOARD FUNCTION TEST
-- Run this to test if the get_admin_dashboard_stats function works

-- 1. Check if the function exists
SELECT proname, pronargs 
FROM pg_proc 
WHERE proname = 'get_admin_dashboard_stats';

-- 2. Test calling the function directly
SELECT 'Testing function call:' as test;
SELECT * FROM get_admin_dashboard_stats();

-- 3. Test the individual queries that should be inside the function
SELECT 'Individual query tests:' as test;

SELECT 'Total patients:' as query, COUNT(*) as result FROM patients;

SELECT 'Patients with active care plans:' as query, COUNT(*) as result
FROM patients p 
LEFT JOIN care_plans cp ON p.plan_id = cp.id 
WHERE cp.status = 'active';

SELECT 'Active care plans:' as query, COUNT(*) as result 
FROM care_plans 
WHERE status = 'active';

-- 4. Check if there are any RLS issues
SELECT 'Checking current user and policies:' as info;
SELECT current_user, current_setting('role');

-- 5. Show the actual data
SELECT 'Raw patient data:' as info;
SELECT id, name, senior_care_id, plan_id FROM patients LIMIT 5;

SELECT 'Raw care plan data:' as info;
SELECT id, name, status, plan_type FROM care_plans LIMIT 5;