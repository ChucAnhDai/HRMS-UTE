-- FIX V6: BEST PRACTICE & CLEAN CODE
-- Implement helper functions to securely retrieve User Role and Employee ID.
-- Use these functions in RLS policies for clear, readable, and consistent security.

-- 1. Create Helper Functions (SECURITY DEFINER to bypass RLS restrictions)

-- Function to get current user's role from USERS table
CREATE OR REPLACE FUNCTION auth_get_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text FROM users 
  WHERE email = (auth.jwt() ->> 'email')
  LIMIT 1;
$$;

-- Function to get current user's employee ID from EMPLOYEES table
CREATE OR REPLACE FUNCTION auth_get_employee_id()
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT e.id 
  FROM employees e
  JOIN users u ON u.id = e.user_id
  WHERE u.email = (auth.jwt() ->> 'email')
  LIMIT 1;
$$;

-- 2. Enable RLS
ALTER TABLE overtime_requests ENABLE ROW LEVEL SECURITY;

-- 3. Drop old policies
DROP POLICY IF EXISTS "Employees can view their own requests" ON overtime_requests;
DROP POLICY IF EXISTS "Employees can create their own requests" ON overtime_requests;
DROP POLICY IF EXISTS "Admins and Managers can view all requests" ON overtime_requests;
DROP POLICY IF EXISTS "Admins and Managers can update requests" ON overtime_requests;
DROP POLICY IF EXISTS "Admins and Managers can insert requests" ON overtime_requests;
DROP POLICY IF EXISTS "View Overtime Requests" ON overtime_requests;
DROP POLICY IF EXISTS "Insert Overtime Requests" ON overtime_requests;
DROP POLICY IF EXISTS "Update Overtime Requests" ON overtime_requests;
DROP POLICY IF EXISTS "Delete Overtime Requests" ON overtime_requests;

-- 4. Create CLEAN Policies using Helper Functions

-- CASE 1: Role-based Access (Admin/Manager can do everything)
-- We check if the role is valid using ILIKE for case-insensitive comparison

-- VIEW: Admin/Manager sees ALL OR Employee sees OWN
CREATE POLICY "View Overtime Requests" ON overtime_requests
FOR SELECT
USING (
  (auth_get_role() ILIKE ANY (ARRAY['admin', 'manager']))
  OR
  (employee_id = auth_get_employee_id())
);

-- INSERT: Admin/Manager creates ANY OR Employee creates OWN
CREATE POLICY "Insert Overtime Requests" ON overtime_requests
FOR INSERT
WITH CHECK (
  (auth_get_role() ILIKE ANY (ARRAY['admin', 'manager']))
  OR
  (employee_id = auth_get_employee_id())
);

-- UPDATE: Only Admin/Manager
CREATE POLICY "Update Overtime Requests" ON overtime_requests
FOR UPDATE
USING (
  auth_get_role() ILIKE ANY (ARRAY['admin', 'manager'])
);

-- DELETE: Only Admin/Manager
CREATE POLICY "Delete Overtime Requests" ON overtime_requests
FOR DELETE
USING (
  auth_get_role() ILIKE ANY (ARRAY['admin', 'manager'])
);
