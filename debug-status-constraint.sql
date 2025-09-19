-- Check what constraints exist on the appointments table
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint 
WHERE conrelid = 'appointments'::regclass 
AND contype = 'c';

-- Check what the actual status column definition is
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'appointments' 
AND column_name = 'status';

-- Show a sample of existing data to see what status values are used
SELECT DISTINCT status FROM appointments LIMIT 10;