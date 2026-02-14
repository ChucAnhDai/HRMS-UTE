-- Policy for Overtime Requests (Fix UUID vs BigInt type mismatch)
-- Strategy: Use Email match instead of ID Match because auth.uid() is UUID but our DB uses BigInt.

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

-- VIEW: Use Email matching via JWT
CREATE POLICY "View Overtime Requests" ON overtime_requests
FOR SELECT
USING (
  -- Employee viewing their own data (Match Email)
  (SELECT email FROM employees WHERE id = overtime_requests.employee_id) = (auth.jwt() ->> 'email')
  OR
  -- Admin/Manager viewing all (Check if current user's email has admin role)
  EXISTS (
    SELECT 1 FROM users u
    JOIN employees e ON e.user_id = u.id
    WHERE e.email = (auth.jwt() ->> 'email')
    AND u.role IN ('admin', 'manager', 'ADMIN', 'MANAGER')
  )
);

-- INSERT: Use Email matching
CREATE POLICY "Insert Overtime Requests" ON overtime_requests
FOR INSERT
WITH CHECK (
  -- Employee creating for themselves
  (SELECT email FROM employees WHERE id = overtime_requests.employee_id) = (auth.jwt() ->> 'email')
  OR
  -- Admin/Manager creating
  EXISTS (
    SELECT 1 FROM users u
    JOIN employees e ON e.user_id = u.id
    WHERE e.email = (auth.jwt() ->> 'email')
    AND u.role IN ('admin', 'manager', 'ADMIN', 'MANAGER')
  )
);

-- UPDATE: Only Admins
CREATE POLICY "Update Overtime Requests" ON overtime_requests
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users u
    JOIN employees e ON e.user_id = u.id
    WHERE e.email = (auth.jwt() ->> 'email')
    AND u.role IN ('admin', 'manager', 'ADMIN', 'MANAGER')
  )
);

-- DELETE: Only Admins
CREATE POLICY "Delete Overtime Requests" ON overtime_requests
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users u
    JOIN employees e ON e.user_id = u.id
    WHERE e.email = (auth.jwt() ->> 'email')
    AND u.role IN ('admin', 'manager', 'ADMIN', 'MANAGER')
  )
);
