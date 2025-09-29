-- Fix care_plans table to support family plan type
-- This SQL fixes the check constraint error for multi-member registration

-- Drop the existing check constraint
ALTER TABLE care_plans 
DROP CONSTRAINT IF EXISTS care_plans_plan_type_check;

-- Add the new check constraint that includes 'multi-member'
ALTER TABLE care_plans 
ADD CONSTRAINT care_plans_plan_type_check 
CHECK (plan_type IN ('single', 'couple', 'multi-member'));

-- Verify the constraint was added
SELECT conname, consrc 
FROM pg_constraint 
WHERE conrelid = 'care_plans'::regclass 
AND conname = 'care_plans_plan_type_check';