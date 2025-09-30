-- Add new fields for hospital admission and surgery details
-- This SQL adds columns to store text details when users select "Yes" for hospital admission or surgery

-- Add columns to the medical_info JSONB field structure
-- Note: Since medical_info is a JSONB column, these will be stored as additional properties
-- No ALTER TABLE is needed as JSONB is flexible

-- This is a documentation file showing the new structure
-- The actual data will be stored in the existing medical_info JSONB column with these additional fields:

/*
medical_info: {
  // Existing fields
  diet_preference: string
  tobacco_type: string
  tobacco_years: string
  alcohol_frequency: string
  medicine_allergy: string
  food_allergy: string
  other_allergy: string
  hospital_admission: string
  surgery: string
  past_conditions: string[]
  other_past_condition: string
  current_condition: string
  current_medication: string
  hospital_name: string
  doctor_name: string
  doctor_contact: string
  
  // NEW FIELDS ADDED:
  hospital_admission_details: string | null  -- Details when hospital_admission = 'yes'
  surgery_details: string | null             -- Details when surgery = 'yes'
  good_hospitals_nearby: string | null       -- List of good hospitals in patient's area
}
*/

-- Example query to check if data is being stored correctly:
SELECT 
    senior_care_id,
    name,
    medical_info->>'hospital_admission' as hospital_admission,
    medical_info->>'hospital_admission_details' as hospital_admission_details,
    medical_info->>'surgery' as surgery,
    medical_info->>'surgery_details' as surgery_details,
    medical_info->>'good_hospitals_nearby' as good_hospitals_nearby
FROM patients 
WHERE medical_info->>'hospital_admission' = 'yes' 
   OR medical_info->>'surgery' = 'yes'
   OR medical_info->>'good_hospitals_nearby' IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;