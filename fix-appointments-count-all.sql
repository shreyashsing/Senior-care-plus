-- Alternative: Count ALL appointments instead of just last 30 days
-- This version counts all appointments ever created, which might be more appropriate for a "Total Appointments" metric

DROP FUNCTION IF EXISTS get_admin_dashboard_stats();

CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS TABLE (
    "totalPatients" bigint,
    "paidPatients" bigint,
    "renewalsDue" bigint,
    "totalAppointments" bigint,
    "totalServices" bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE((SELECT COUNT(*) FROM patients), 0)::bigint as "totalPatients",
        COALESCE((SELECT COUNT(*) FROM patients p 
                  LEFT JOIN care_plans cp ON p.plan_id = cp.id 
                  WHERE cp.status = 'active'), 0)::bigint as "paidPatients",
        COALESCE((SELECT COUNT(*) FROM care_plans 
                  WHERE end_date <= CURRENT_DATE + INTERVAL '30 days' 
                  AND status = 'active'), 0)::bigint as "renewalsDue",
        COALESCE((SELECT COUNT(*) FROM appointments), 0)::bigint as "totalAppointments",
        COALESCE((SELECT COUNT(*) FROM service_requests), 0)::bigint as "totalServices";
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_admin_dashboard_stats() TO anon;
GRANT EXECUTE ON FUNCTION get_admin_dashboard_stats() TO authenticated;

-- Test the function
SELECT * FROM get_admin_dashboard_stats();

-- Debug: Check if appointments table has data
SELECT COUNT(*) as total_appointments_in_db FROM appointments;
SELECT * FROM appointments LIMIT 5;