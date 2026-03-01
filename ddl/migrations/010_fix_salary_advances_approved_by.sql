-- Drop the existing foreign key constraint if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE table_name = 'salary_advances' 
    AND constraint_name = 'salary_advances_approved_by_fkey'
  ) THEN
    ALTER TABLE salary_advances DROP CONSTRAINT salary_advances_approved_by_fkey;
  END IF;
END $$;

-- Add the new foreign key constraint referencing employees(id)
ALTER TABLE salary_advances
  ADD CONSTRAINT salary_advances_approved_by_fkey 
  FOREIGN KEY (approved_by) 
  REFERENCES employees(id) 
  ON DELETE SET NULL;
