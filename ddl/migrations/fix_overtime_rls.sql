-- Policy for Overtime Requests

-- 1. Enable RLS (Ensure it's enabled)
ALTER TABLE overtime_requests ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid duplicates
DROP POLICY IF EXISTS "Employees can view their own requests" ON overtime_requests;
DROP POLICY IF EXISTS "Employees can create their own requests" ON overtime_requests;
DROP POLICY IF EXISTS "Admins and Managers can view all requests" ON overtime_requests;
DROP POLICY IF EXISTS "Admins and Managers can update requests" ON overtime_requests;
DROP POLICY IF EXISTS "Admins and Managers can insert requests" ON overtime_requests;

-- 3. Create Policies

-- VIEW: Employees can see their own requests. Admins/Managers see all.
CREATE POLICY "View Overtime Requests" ON overtime_requests
FOR SELECT
USING (
  (auth.uid() IN (SELECT user_id FROM employees WHERE id = overtime_requests.employee_id)) -- Own request
  OR
  (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'ADMIN', 'MANAGER'))) -- Admin/Manager
);

-- INSERT: Employees can create requests for THEMSELVES. 
-- Note: 'employee_id' in the row must match the employee record linked to the auth.uid()
CREATE POLICY "Insert Overtime Requests" ON overtime_requests
FOR INSERT
WITH CHECK (
  -- Check if the employee_id being inserted belongs to the current user
  (auth.uid() IN (SELECT user_id FROM employees WHERE id = overtime_requests.employee_id))
  OR
  -- Or if it's an Admin/Manager creating on behalf of someone (optional, but good to have)
  (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'ADMIN', 'MANAGER')))
);

-- UPDATE: Only Admins/Managers can update status (Approve/Reject)
-- Employees might be allowed to update their own ONLY IF status is Pending (Optional, kept simple for now)
CREATE POLICY "Update Overtime Requests" ON overtime_requests
FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'ADMIN', 'MANAGER'))
);

-- DELETE: Similar to Update, usually restricted to Admins
CREATE POLICY "Delete Overtime Requests" ON overtime_requests
FOR DELETE
USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'ADMIN', 'MANAGER'))
);
