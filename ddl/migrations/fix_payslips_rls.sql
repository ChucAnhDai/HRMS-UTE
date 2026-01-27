-- Fix RLS for Payslips
-- Restriction: 
-- 1. Employees can ONLY see their own payslips
-- 2. Admins/Managers can see all
-- 3. Only Admins/Managers can modify

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON payslips;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON payslips;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON payslips;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON payslips;

-- Create helper function to check role (Optional but cleaner, inline is fine for now)

-- 1. SELECT Policy
CREATE POLICY "Payslips View Policy" ON "public"."payslips"
AS PERMISSIVE FOR SELECT
TO authenticated
USING (
  -- Own payslips
  employee_id IN (
    SELECT id FROM employees WHERE auth_user_id = auth.uid()
  )
  OR
  -- Admin/Manager access
  EXISTS (
    SELECT 1 FROM employees 
    WHERE auth_user_id = auth.uid() 
    AND role IN ('ADMIN', 'MANAGER')
  )
);

-- 2. INSERT Policy (Admin/Manager only)
CREATE POLICY "Payslips Insert Policy" ON "public"."payslips"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM employees 
    WHERE auth_user_id = auth.uid() 
    AND role IN ('ADMIN', 'MANAGER')
  )
);

-- 3. UPDATE Policy (Admin/Manager only)
CREATE POLICY "Payslips Update Policy" ON "public"."payslips"
AS PERMISSIVE FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM employees 
    WHERE auth_user_id = auth.uid() 
    AND role IN ('ADMIN', 'MANAGER')
  )
);

-- 4. DELETE Policy (Admin/Manager only)
CREATE POLICY "Payslips Delete Policy" ON "public"."payslips"
AS PERMISSIVE FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM employees 
    WHERE auth_user_id = auth.uid() 
    AND role IN ('ADMIN', 'MANAGER')
  )
);
