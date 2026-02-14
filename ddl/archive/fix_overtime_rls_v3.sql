-- Policy for Overtime Requests (Fix V3: Direct User Role Check)
-- Strategy: Use Email match on USERS table directly for Admin check. Avoid joining employees table for Admins.

-- 1. Enable RLS
ALTER TABLE overtime_requests ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies
DROP POLICY IF EXISTS "Employees can view their own requests" ON overtime_requests;
DROP POLICY IF EXISTS "Employees can create their own requests" ON overtime_requests;
DROP POLICY IF EXISTS "Admins and Managers can view all requests" ON overtime_requests;
DROP POLICY IF EXISTS "Admins and Managers can update requests" ON overtime_requests;
DROP POLICY IF EXISTS "Admins and Managers can insert requests" ON overtime_requests;
DROP POLICY IF EXISTS "View Overtime Requests" ON overtime_requests;
DROP POLICY IF EXISTS "Insert Overtime Requests" ON overtime_requests;
DROP POLICY IF EXISTS "Update Overtime Requests" ON overtime_requests;
DROP POLICY IF EXISTS "Delete Overtime Requests" ON overtime_requests;

-- 3. Create Policies

-- VIEW
CREATE POLICY "View Overtime Requests" ON overtime_requests
FOR SELECT
USING (
  -- Case 1: Employee viewing their own data (Match Email in Employees table)
  (SELECT email FROM employees WHERE id = overtime_requests.employee_id) = (auth.jwt() ->> 'email')
  OR
  -- Case 2: Admin/Manager viewing all (Check Email in Users table)
  EXISTS (
    SELECT 1 FROM users
    WHERE email = (auth.jwt() ->> 'email')
    AND role IN ('admin', 'manager', 'ADMIN', 'MANAGER')
  )
);

-- INSERT
CREATE POLICY "Insert Overtime Requests" ON overtime_requests
FOR INSERT
WITH CHECK (
  -- Case 1: Employee creating for themselves
  (SELECT email FROM employees WHERE id = overtime_requests.employee_id) = (auth.jwt() ->> 'email')
  OR
  -- Case 2: Admin/Manager creating for ANYONE
  EXISTS (
    SELECT 1 FROM users
    WHERE email = (auth.jwt() ->> 'email')
    AND role IN ('admin', 'manager', 'ADMIN', 'MANAGER')
  )
);

-- UPDATE
CREATE POLICY "Update Overtime Requests" ON overtime_requests
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE email = (auth.jwt() ->> 'email')
    AND role IN ('admin', 'manager', 'ADMIN', 'MANAGER')
  )
);

-- DELETE
CREATE POLICY "Delete Overtime Requests" ON overtime_requests
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE email = (auth.jwt() ->> 'email')
    AND role IN ('admin', 'manager', 'ADMIN', 'MANAGER')
  )
);
