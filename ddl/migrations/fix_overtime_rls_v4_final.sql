-- Final Fix for Overtime RLS using SECURITY DEFINER Function
-- This avoids "infinite recursion" or "permission denied" when querying the USERS table inside an RLS check.

-- 1. Create Helper Function (Bypass RLS on users table)
CREATE OR REPLACE FUNCTION is_admin_or_manager()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER -- Runs with owner permissions (Full Access)
SET search_path = public -- Secure search path
AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE email = (auth.jwt() ->> 'email')
    AND role IN ('admin', 'manager', 'ADMIN', 'MANAGER')
  );
$$;

-- 2. Enable RLS
ALTER TABLE overtime_requests ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies to clean up
DROP POLICY IF EXISTS "Employees can view their own requests" ON overtime_requests;
DROP POLICY IF EXISTS "Employees can create their own requests" ON overtime_requests;
DROP POLICY IF EXISTS "Admins and Managers can view all requests" ON overtime_requests;
DROP POLICY IF EXISTS "Admins and Managers can update requests" ON overtime_requests;
DROP POLICY IF EXISTS "Admins and Managers can insert requests" ON overtime_requests;
DROP POLICY IF EXISTS "View Overtime Requests" ON overtime_requests;
DROP POLICY IF EXISTS "Insert Overtime Requests" ON overtime_requests;
DROP POLICY IF EXISTS "Update Overtime Requests" ON overtime_requests;
DROP POLICY IF EXISTS "Delete Overtime Requests" ON overtime_requests;

-- 4. Create Final Policies

-- VIEW
CREATE POLICY "View Overtime Requests" ON overtime_requests
FOR SELECT
USING (
  (SELECT email FROM employees WHERE id = overtime_requests.employee_id) = (auth.jwt() ->> 'email')
  OR
  is_admin_or_manager() -- Use the secure function
);

-- INSERT
CREATE POLICY "Insert Overtime Requests" ON overtime_requests
FOR INSERT
WITH CHECK (
  (SELECT email FROM employees WHERE id = overtime_requests.employee_id) = (auth.jwt() ->> 'email')
  OR
  is_admin_or_manager()
);

-- UPDATE (Admin only)
CREATE POLICY "Update Overtime Requests" ON overtime_requests
FOR UPDATE
USING (
  is_admin_or_manager()
);

-- DELETE (Admin only)
CREATE POLICY "Delete Overtime Requests" ON overtime_requests
FOR DELETE
USING (
  is_admin_or_manager()
);
