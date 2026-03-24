-- Migration script to fix the "Probation123" employment status typo
-- This script should be run in the Supabase SQL Editor.

-- 1. Update any existing employees with the typo
UPDATE public.employees 
SET employment_status = 'Probation' 
WHERE employment_status = 'Probation123';

-- 2. Verify the update
SELECT id, first_name, last_name, employment_status 
FROM public.employees 
WHERE employment_status IN ('Probation', 'Probation123');

-- 3. (Optional) If you have a check constraint or enum in the DB, 
-- you might want to update it as well, but standard TEXT column is fine.
