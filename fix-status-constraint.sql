-- Fix the appointments status constraint to allow proper values
-- This will remove the existing constraint and add the correct one

-- First, find and drop the existing status check constraint
DO $$ 
DECLARE
    constraint_name text;
BEGIN
    -- Find the constraint name
    SELECT conname INTO constraint_name
    FROM pg_constraint 
    WHERE conrelid = 'appointments'::regclass 
    AND contype = 'c'
    AND pg_get_constraintdef(oid) LIKE '%status%';
    
    -- Drop the constraint if it exists
    IF constraint_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE appointments DROP CONSTRAINT ' || constraint_name;
        RAISE NOTICE 'Dropped constraint: %', constraint_name;
    END IF;
END $$;

-- Add the correct status constraint that matches our application needs
ALTER TABLE appointments 
ADD CONSTRAINT appointments_status_check 
CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'pending', 'in_progress', 'no_show'));

-- Verify the constraint was added
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint 
WHERE conrelid = 'appointments'::regclass 
AND contype = 'c'
AND conname = 'appointments_status_check';
