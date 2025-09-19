-- Update the admin dashboard stats function to use proper patient terminology
DROP FUNCTION IF EXISTS get_admin_dashboard_stats();

CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS TABLE (
    "totalPatients" bigint,
    "paidPatients" bigint,
    "renewalsDue" bigint,
    "totalAppointments" bigint,
    "totalServices" bigint
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE((SELECT COUNT(*) FROM patients), 0)::bigint as "totalPatients",
        COALESCE((SELECT COUNT(*) FROM patients p 
                  LEFT JOIN care_plans cp ON p.care_plan_id = cp.id 
                  WHERE cp.status = 'active'), 0)::bigint as "paidPatients",
        COALESCE((SELECT COUNT(*) FROM care_plans 
                  WHERE end_date <= CURRENT_DATE + INTERVAL '30 days' 
                  AND status = 'active'), 0)::bigint as "renewalsDue",
        COALESCE((SELECT COUNT(*) FROM appointments 
                  WHERE appointment_date >= CURRENT_DATE - INTERVAL '30 days'), 0)::bigint as "totalAppointments",
        COALESCE((SELECT COUNT(*) FROM service_requests 
                  WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'), 0)::bigint as "totalServices";
END;
$$;